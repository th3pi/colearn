<template>
  <div>
    <vue-topprogress ref="topProgress" :height="5"></vue-topprogress>

    <div key="loaded">
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
            @send-sql="fetchSqlLocal"
            @reset-sql="updateResultTable"
            @focus-sql="showTipOnFocus"
          />
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
              <strong>Artist, Album, Customer, Employee, Genre, Invoice, Playlist, PlaylistTrack, Track</strong>
            </code-snippet>
          </template>
        </sidebar>
      </div>
    </div>
  </div>
</template>

<script>
//Component imports
import sqlPageTitle from "@/components/Sql/sql-page-title.vue";
import sqlInput from "@/components/Sql/sql-input.vue";
import sidebar from "@/components/General/sidebar.vue";
import codeSnippet from "@/components/General/code-snippet.vue";
import sqlResultTable from "@/components/Sql/sql-result-table.vue";
import sqlHistory from "@/components/Sql/sql-history.vue";

import ENUM from "@/enums/firebase_enum";

//Mixin imports
import responsive from "@/mixins/responsive";
import { mapGetters } from "vuex";
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
      user: "user"
    })
  },
  sockets: {
    connect() {},
    /**
     * Receives a run command from the session
     * @param {String} command is a sql command received from the socket
     */
    get_sql(command) {
      this.command = command;
      command == "" ? this.updateResultTable() : this.fetchSqlLocal(command);
    },
    sync_result(result) {
      this.messageHandler(result);
    },
    left_session(name, num) {
      console.log(num);
    }
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
      }
    };
  },
  created() {
    if (this.user.authenticated) {
      this.verifySession();
      this.$socket.client.open();
      this.$socket.client.emit(
        "new_session",
        this.$route.params.sessionId,
        this.user.data.displayName
      );

      document.title = "🟢 Session - " + this.$route.params.sessionId;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to && from) {
      this.$socket.client.emit("leave_session", this.$route.params.sessionId);
      next();
    }
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
          0;
          //If response is an array, it means successful SELECT command was run
          if (Array.isArray(res.data)) {
            this.results = res.data;
            this.keys = Object.keys(this.results[0]);
            this.message = "";
            this.resultBackground = "var(--sql-lighter-dark)";
            this.showTable = true;
          } else {
            this.messageHandler(res.data);

            this.$socket.client.emit(
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
            sessionId: this.$route.params.sessionId
          }
        })
        .then(res => {
          this.sessionInfo = res.data;
          if (res.data.leader != this.user.data.email) {
            if (!Array.isArray(res.data.colearners)) {
              this.$router.replace({
                name: "join-sql",
                params: { sessionId: this.$route.params.sessionId }
              });
            }
            if (!res.data.colearners.includes(this.user.data.email)) {
              this.$router.replace({
                name: "join-sql",
                params: { sessionId: this.$route.params.sessionId }
              });
            } else {
              this.$http
                .post("/session/sql/join-session", {
                  email: this.user.data.email,
                  sessionId: this.$route.params.sessionId,
                  pin: ""
                })
                .then(() => {
                  this.loadState = ENUM.LOADED;
                });
            }
          } else {
            this.$http
              .post("/session/sql/join-session", {
                email: this.user.data.email,
                sessionId: this.$route.params.sessionId,
                pin: ""
              })
              .then(() => {
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
        "https://colearn.tech/join/" + this.sessionInfo.sessionId
      );
    }
  },
  watch: {
    loadState(newValue) {
      if (newValue == ENUM.LOADING) this.$refs.topProgress.start();
      if (newValue == ENUM.LOADED) this.$refs.topProgress.done();
      if (newValue == ENUM.ERROR) this.$refs.topProgress.fail();
    }
  }
};
</script>

<style lang="scss">
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
