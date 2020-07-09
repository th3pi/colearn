<template>
  <div>
    <notifications group="sessionUsers" class="open-sans notif neumorphic" position="bottom right" />
    <notifications group="error" :max="1" class="open-sans neumorphic" position="bottom right" />
    <vue-topprogress ref="topProgress" :height="5"></vue-topprogress>

    <div v-if="verified" key="loaded">
      <div
        class="sql font"
        id="sqlBody"
        :style="{ 'margin-top': results.length == 0 ? '25vh' : 0 }"
      >
        <div id="inputSection" :style="getWidth(showBar, '50%', '60%', '70')">
          <!-- Page title for SQL view -->
          <!-- Display only the language title if on a mobile device or something with a very small display -->
          <sql-page-title :showBar="showBar" :showTable="showTable" />
          <!-- SQL command input box -->
          <sql-input
            class="sqlInput"
            :sessionInfo="sessionInfo"
            :socket="socket"
            @send-sql="fetchSqlLocal"
            @reset-sql="updateResultTable"
            @focus-sql="showTipOnFocus"
            @typing="shareCommand = $event == '' ? 'This sync box is shared by everyone in the session for realtime collaboration' : $event"
          />
        </div>
        <div>
          <h2 class="header" style="color: var(--sql-lighter-dark)">
            Sync box
            <i v-popover:syncBox class="fas fa-info-circle" style="transform: scale(.75)"></i>
            <p>Click on the box at anytime to copy its contents to your input field</p>
            <popover
              name="syncBox"
              transition="fade"
              class="neumorphic"
              style="font-size: .95rem; font-weight: 300; text-align: left; padding: .5rem 1rem; width: 15rem"
            >
              <strong
                style="font-size: 1.1rem; border-bottom: 2px solid rgba(var(--sql-lighter-dark-v), 0.8);"
              >More about Sync Box</strong>
              <br />
              <br />

              <li>
                Sync box is
                <strong>instantly synchronized</strong> between all colearners in a session
              </li>
              <br />
              <li>Click on the box at any time to copy it into your command box</li>
            </popover>
          </h2>
          <div
            id="shareBox"
            class="neumorphic hover n-active border-not-type"
            :class="{'border-type': typedBy != null ? true : false}"
            :style="{
            height: height + 'rem',
          }"
            @click="copyToCommandBox"
          >
            <p>
              {{shareCommand}}
              <span v-if="typedBy != null" class="typed-by">// by {{typedBy}}</span>
            </p>
          </div>
          <!-- Result table -->
          <div id="resultSection">
            <sql-result-table
              :error="message"
              :results="results"
              :keys="keys"
              :background="resultBackground"
            ></sql-result-table>
          </div>
        </div>

        <div>
          <h2 class="header" style="color: var(--sql-lighter-dark)">
            Session history
            <i
              v-popover:sessionInfo
              class="fas fa-info-circle"
              style="transform: scale(.75)"
            ></i>
            <popover
              name="sessionInfo"
              transition="fade"
              class="neumorphic"
              style="font-size: .95rem; font-weight: 300; text-align: left; padding: .5rem 1rem; width: 15rem"
            >
              <strong
                style="font-size: 1.1rem; border-bottom: 2px solid rgba(var(--sql-lighter-dark-v), 0.8);"
              >More about session history</strong>
              <br />
              <br />

              <li>
                Session history is a list of all the commands that were
                <strong>run</strong> on this session
              </li>
              <br />
              <li>The list includes, commands that were run in the session, who ran it and when it was run.</li>
              <br />
              <li>You can click on a command to instantly copy it to the command box above.</li>
            </popover>
          </h2>
          <sql-history :sessionId="sessionInfo.sessionId" @copy-command="command = $event" />
        </div>
      </div>

      <!-- Update:showBar event emitted from sidebar child component, on emission, showBar is assigned the value of 
      data passed from child component, which is a boolean value-->
      <div>
        <sidebar @update:showBar="showBar = $event">
          <!-- Cheat sheet body -->
          <template #sessionInfo>
            <!-- Each cheat is its own bullet point using the li tag -->
            <code-snippet language="SQL">
              Session name
              <strong @click="copyId">{{sessionInfo.sessionId}}</strong>
            </code-snippet>
            <code-snippet>
              Session pin
              <strong @click="copyPin">{{sessionInfo.pin}}</strong>
            </code-snippet>
            <code-snippet>
              Session link
              <br />
              <strong @click="copyLink">colearn.tech/join/{{sessionInfo.sessionId}}</strong>
            </code-snippet>
            <code-snippet>
              Sample tables
              <br />
              <strong
                style="text-decoration: none; cursor: default"
              >Artist, Album, Customer, Employee, Genre, Invoice, Playlist, PlaylistTrack, Track</strong>
            </code-snippet>
            <p class="tip">Tip: Click on an item to copy it</p>

            <h3 style="text-align: center; color: var(--dark); margin: .5rem 0">
              <i class="fas fa-users"></i>Colearners in session
            </h3>
            <div class="session-profiles" v-for="(socket, index) in userSocket" :key="index">
              <div class="profile-card neumorphic border">
                <i class="fas fa-user"></i>
                <div class="details">
                  <p class="name">{{socket.username}}</p>
                  <p>Online</p>
                </div>
              </div>
            </div>
          </template>
        </sidebar>
      </div>
    </div>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>

<script>
//Component imports
import sqlPageTitle from "@/components/Sql/sql-page-title.vue";
import sqlInput from "@/components/Sql/sql-input.vue";
import sidebar from "@/components/General/sidebar.vue";
import codeSnippet from "@/components/General/code-snippet.vue";
import sqlResultTable from "@/components/Sql/sql-result-table.vue";
import sqlHistory from "@/components/Sql/sql-history.vue";
import io from "socket.io-client";

import ENUM from "@/enums/firebase_enum";

//Mixin imports
import responsive from "@/mixins/responsive";
import { mapGetters } from "vuex";
import { EventBus } from "@/bus/bus";
/**
 * Main view for SQL collaborations
 * @param {String} route holds the route to backend sql query api
 * @param {Array} results is an array of results that was fed back by backend
 * @param {Array} keys is an array of field names from the result table
 * @param {String} message returned error message string from backend
 * @param {Boolean} showBar is a boolean value that determines whether to show cheat bar
 * @param {Number} width is the width of the cheat bar
 */
export default {
  name: "sql-view",
  mixins: [responsive],
  components: {
    "sql-page-title": sqlPageTitle,
    "sql-input": sqlInput,
    sidebar,
    "code-snippet": codeSnippet,
    "sql-result-table": sqlResultTable,
    sqlHistory
  },
  computed: {
    ...mapGetters({
      user: "user",
      userSocket: "getSocket"
    })
  },
  data() {
    return {
      route: "/sql/local-sql-query",
      results: [],
      keys: [],
      message: "",
      showBar: false,
      showTable: false,
      resultBackground: "",
      width: 0,
      progress: 0,
      type: null,
      command: null,
      sessionInfo: {
        sessionId: null
      },
      socket: null,
      verified: null,
      loadState: ENUM.INIT,
      users: [],
      shareCommand:
        "This sync box is shared by everyone in the session for realtime collaboration",
      height: 1.5,
      typedBy: null
    };
  },
  created() {
    if (this.user.authenticated) {
      this.sessionInfo.sessionId = this.$route.params.sessionId;
      this.socket = io("https://colearn-tech.herokuapp.com/sql");

      this.verifySession();
      this.$store.dispatch("getSessionHistory", this.sessionInfo.sessionId);
      document.title = "🟢 Session - " + this.sessionInfo.sessionId;
      this.watchUsers();
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close();
      this.$store.dispatch("updateUser", {
        sessionId: this.sessionInfo.sessionId,
        username: this.user.data.displayName,
        status: "Offline"
      });
    }
    this.$store.dispatch("resetState");
  },
  beforeRouteEnter(to, from, next) {
    if (to && from) {
      next(vm => {
        if (!vm.user.authenticated) next({ name: "authenticate" });
      });
    }
  },
  methods: {
    /**
     * GETs the result of the sql command from the backend
     * @param {String} command SQL command that is received from the input and send to the backend
     */
    fetchSqlLocal(command) {
      // command = "SELECT * FROM PERSONS"; //ONLY FOR TESTING PURPOSES. REMOVE this from build
      this.$http
        .get(this.route, {
          params: {
            query: command
          }
        })
        .then(res => {
          //If response is an array, it means successful SELECT command was run
          if (Array.isArray(res.data)) {
            this.results = res.data;
            this.keys = Object.keys(this.results[0]);
            this.message = "";
            this.resultBackground = "var(--sql-lighter-dark)";
            this.showTable = true;
          } else {
            this.messageHandler(res.data);
            this.socket.emit(
              "sync_result",
              this.$route.params.sessionId,
              res.data
            );
          }
        })
        .catch(() => {});
    },
    /**
     * Resets arrays to become empty when child compononent emits "reset-sql", also used to update the result table message and background color of the component
     * @param {String} message is the response from backend which will be displayed on the result table
     * @param {String} background is a css variable, defined in the @/assets/styles/style.scss file
     */
    updateResultTable(
      message = "Run a SQL command to display results here",
      background = "var(--sql-lighter-dark)"
    ) {
      this.results = [];
      this.keys = [];
      this.showTable = false;
      this.message = message;
      this.resultBackground = background;
    },

    /**
     * Checks backend response and updates, result table message and background color
     * @param {String} message is the response from backend after a SQL command has been. Only populated when response is not an array
     */
    messageHandler(message) {
      this.message = message;
      let cleanMessage = message.replace(/^([\w:/-]+\s)/g, "");
      if (typeof message == "string") {
        if (message.match(/SUCCESSFULLY/i)) {
          this.updateResultTable(cleanMessage, "var(--success)");
        } else if (message.match(/DELETED/i)) {
          this.updateResultTable(cleanMessage, "var(--success)");
        } else if (message.match(/UPDATED/i)) {
          this.updateResultTable(cleanMessage, "var(--sql-light-primary)");
        } else if (message.match(/ERROR/i)) {
          this.updateResultTable(cleanMessage, "var(--danger)");
        } else if (message.match(/NO MATCHING/i)) {
          this.updateResultTable(cleanMessage, "var(--danger-light)");
        } else if (message.match(/Empty table/i)) {
          this.updateResultTable(cleanMessage, "var(--g-secondary)");
        } else {
          this.updateResultTable(
            "Something went wrong, please reset and try again.",
            "var(--dark)"
          );
        }
      } else {
        this.updateResultTable("Invalid command", "var(--danger)");
      }
    },
    showTipOnFocus(message, resultBackground) {
      if (
        !this.showTable &&
        this.message != "Run a SQL command to display result here"
      ) {
        this.updateResultTable(message, resultBackground);
      }
    },
    verifySession() {
      this.loadState = ENUM.LOADING;
      this.$http
        .get("/session/sql/fetch-session", {
          params: {
            sessionId: this.sessionInfo.sessionId
          }
        })
        .then(res => {
          this.sessionInfo = res.data;
          if (res.data.leader != this.user.data.email) {
            if (!Array.isArray(res.data.colearners)) {
              this.$router.replace({
                name: "join-sql",
                params: { sessionId: this.sessionInfo.sessionId }
              });
            }
            if (!res.data.colearners.includes(this.user.data.email)) {
              this.$router.replace({
                name: "join-sql",
                params: { sessionId: this.sessionInfo.sessionId }
              });
            } else {
              this.$http
                .post("/session/sql/join-session", {
                  email: this.user.data.email,
                  sessionId: this.sessionInfo.sessionId,
                  pin: ""
                })
                .then(() => {
                  this.socket.emit(
                    "new_user_session",
                    this.user.data.displayName,
                    this.sessionInfo.sessionId
                  );
                  this.$store.dispatch("updateUser", {
                    sessionId: this.sessionInfo.sessionId,
                    username: this.user.data.displayName,
                    status: "online"
                  });
                  this.users = this.$store.getters.getSocket;

                  this.verified = true;
                  this.loadState = ENUM.LOADED;
                });
            }
          } else {
            this.$http
              .post("/session/sql/join-session", {
                email: this.user.data.email,
                sessionId: this.sessionInfo.sessionId,
                pin: ""
              })
              .then(() => {
                this.socket.emit(
                  "new_user_session",
                  this.user.data.displayName,
                  this.sessionInfo.sessionId
                );
                this.$store.dispatch("updateUser", {
                  sessionId: this.sessionInfo.sessionId,
                  username: this.user.data.displayName,
                  status: "online"
                });
                this.verified = true;
                this.loadState = ENUM.LOADED;
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    copyId() {
      this.$clipboard(this.sessionInfo.sessionId);
    },
    copyPin() {
      this.$clipboard(this.sessionInfo.pin);
    },
    copyLink() {
      this.$clipboard(
        "https://colearn.tech/learn-sql/" + this.sessionInfo.sessionId
      );
    },
    copyToCommandBox() {
      if (
        this.shareCommand ==
        "This sync box is shared by everyone in the session for realtime collaboration"
      ) {
        this.$notify({
          group: "error",
          title: "<i class='fas fa-ban    '></i> Stop!",
          text: "What's the point of copying that?",
          type: "error"
        });
      } else {
        EventBus.$emit("copyToCommand", this.shareCommand);
      }
    },
    watchUsers() {
      this.socket.on("new_user", username => {
        setTimeout(() => {
          this.$store.dispatch("setUsers", this.sessionInfo.sessionId);
        }, 500);
        this.$notify({
          group: "sessionUsers",
          title: "<i class='fas fa-user-plus    '></i>" + username,
          text: " Joined the session",
          type: "joined"
        });
      });
      this.socket.on("user_left", username => {
        setTimeout(() => {
          this.$store.dispatch("setUsers", this.sessionInfo.sessionId);
        }, 500);
        this.$notify({
          group: "sessionUsers",
          title: "<i class='fas fa-user-minus    '></i>" + username,
          text: "left the session",
          type: "user-left"
        });
      });
      this.socket.on("receiving", (command, username) => {
        this.shareCommand = command;
        if (command != "") this.typedBy = username;
        if (command == "") {
          this.shareCommand =
            "This sync box is shared by everyone in the session for realtime collaboration";
        }
      });
      this.socket.on("get_sql", command => {
        this.command = command;
        command == "" ? this.updateResultTable() : this.fetchSqlLocal(command);
        setTimeout(() => {
          this.$store.dispatch("getSessionHistory", this.sessionInfo.sessionId);
        }, 800);
      });
      this.socket.on("sync_result", result => {
        this.messageHandler(result);
        setTimeout(() => {
          this.$store.dispatch("getSessionHistory", this.sessionInfo.sessionId);
        }, 800);
      });
    }
  },
  watch: {
    loadState(newValue) {
      if (newValue == ENUM.LOADING) this.$refs.topProgress.start();
      if (newValue == ENUM.LOADED) this.$refs.topProgress.done();
      if (newValue == ENUM.ERROR) this.$refs.topProgress.fail();
    },
    shareCommand(newValue) {
      this.rows = newValue.split("\n").length;
      this.height = this.rows * 1.6;
      if (
        newValue ==
        "This sync box is shared by everyone in the session for realtime collaboration"
      ) {
        this.rows = 1;
        this.height = 1.5;
        this.typedBy = null;
      }
    }
  }
};
</script>

<style lang="scss">
$user1: rgba(38, 14, 61, 1);
$user2: rgba(58, 82, 33, 1);
$user3: rgba(13, 6, 20, 1);
$user4: rgba(69, 49, 89, 1);
$user5: rgba(125, 46, 46, 1);
#loader {
  margin-top: 15rem;
}

#sqlBody {
  width: 100%;

  margin-top: 0.5rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10rem !important;

  transition: margin-top 0.4s ease-in-out;
}

#inputSection {
  display: inline-flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: 0.2s;
}

#resultSection {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
}
h2 {
  p {
    font-size: 0.85rem;
    opacity: 0.8;
  }
}
#shareBox {
  background-color: white;
  width: 88%;
  margin: 0.5rem auto;
  margin-bottom: 0;
  padding: 0.5rem;

  white-space: pre-line;

  border-radius: 5px;

  color: var(--sql-lighter-dark);

  transition: 0.8s;

  cursor: pointer;
  .typed-by {
    opacity: 0.8;
    font-size: 0.95rem;
  }
}

.border-not-type {
  border: 3px solid transparent;

  transition: 0.4s;
}

.border-type {
  border: 3px solid var(--sql-light-primary);
}
.notif {
  margin-bottom: 4rem;
}
.vue-notification {
  padding: 10px;
  margin: 0 5px 5px;
  color: var(--sql-lighter-dark);
  background: white;
  box-shadow: 6px 6px 12px 0 rgba(0, 0, 0, 0.2),
    -6px -6px 12px 0 rgba(255, 255, 255, 0.5);

  .notification-title {
    font-size: 1rem;
  }

  .notification-content {
    font-size: 0.95rem;
  }

  &.joined {
    border-left: 5px solid var(--success);
  }

  &.user-left {
    border-left: 5px solid var(--danger);
  }
  &.error {
    color: white;
    .notification-content {
      font-size: 0.8rem;
    }
  }
}

.session-profiles {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.profile-card {
  display: flex;
  align-items: center;
  flex-direction: row;
  background-color: white;
  width: 90%;
  margin: 0.5rem;

  padding: 0.5rem 1rem;

  border-radius: 5px;

  color: var(--sql-light-primary);
  .details {
    display: block;
  }
  transition: border 0.4s;
  i {
    transform: scale(1.4);
    margin-right: 1rem;
  }
  p:first-child {
    font-size: 1.1rem;
  }
  p:last-child {
    font-size: 0.8rem;
    opacity: 0.8;
    color: var(--success);
  }
}

@media screen and (min-width: 470px) {
  #loader {
    margin-top: 0;

    height: 85vmin;
  }
  #sqlBody {
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 1250px) {
  #loader {
    margin-top: 0;
    height: 85vmin;
  }
  #sqlBody {
    width: 1250px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>