<template>
  <div>
    <notifications group="sessionUsers" class="open-sans notif neumorphic" position="bottom right" />
    <notifications group="error" :max="1" class="open-sans neumorphic" position="bottom right" />
    <notifications group="sync" :max="1" class="open-sans neumorphic" position="top right" />
    <vue-topprogress ref="topProgress" :height="5"></vue-topprogress>

    <div v-if="verified" key="loaded">
      <div class="sql font" id="sqlBody">
        <div id="inputSection">
          <!-- Page title for SQL view -->
          <!-- Display only the language title if on a mobile device or something with a very small display -->
          <sql-page-title />
          <!-- SQL command input box -->
          <sql-input
            class="sqlInput"
            :sessionInfo="sessionInfo"
            :socket="socket"
            @send-sql="fetchSqlLocal"
            @reset-sql="updateResultTable"
            @typing="shareCommand = $event == '' ? 'This sync box is shared by everyone in the session for realtime collaboration' : $event"
          />
        </div>
        <div>
          <sql-syncbox :socket="socket" />
          <!-- Result table -->
          <div id="resultSection" class="neumorphic">
            <el-tabs
              v-model="tables.name"
              type="card"
              class="result-tabs"
              @tab-click="tabListener"
              :stretch="true"
            >
              <el-tab-pane
                v-for="(table, index) in tables.tables"
                :key="index"
                :name="''+index"
                :label="'' +(index + 1)"
              >
                <sql-result-table
                  :results="table.results"
                  :keys="table.keys"
                  :error="table.message"
                  :background="table.background"
                ></sql-result-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <div>
          <h2 class="header" style="color: var(--sql-lighter-dark)">
            <i
              class="fas fa-sync"
              style="transform: scale(.75)"
              @click="$refs.sqlHistory.getSessionHistory()"
            ></i>
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
          <sql-history
            ref="sqlHistory"
            :sessionId="sessionInfo.sessionId"
            @copy-command="command = $event"
            @open-table="fetchSqlLocal('SELECT * FROM ' + $event)"
          />
        </div>
      </div>

      <div>
        <!-- Custom sidebar for SQL -->
        <sql-sidebar :sessionInfo="sessionInfo" />
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
import sqlSidebar from "@/components/Sql/sql-sidebar.vue";
import sqlSyncBox from "@/components/Sql/sql-syncbox.vue";
import io from "socket.io-client";
import { Tabs, TabPane } from "element-ui";

import ENUM from "@/enums/firebase_enum";

//Mixin imports
import responsive from "@/mixins/responsive";
import { mapGetters } from "vuex";
import { EventBus } from "@/bus/bus";
import { ScaleTransition } from "vue2-transitions";
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
    "code-snippet": codeSnippet,
    "sql-result-table": sqlResultTable,
    sqlHistory,
    ScaleTransition,
    sqlSidebar,
    "el-tabs": Tabs,
    "el-tab-pane": TabPane,
    "sql-syncbox": sqlSyncBox
  },
  computed: {
    ...mapGetters({
      user: "user", // gets current authenticated user
      userSocket: "getSocket" // gets current sockets connected to the session
    })
  },
  data() {
    return {
      route: "/sql/local-sql-query",
      command: null,
      sessionInfo: {
        sessionId: null
      },
      socket: null,
      verified: null,
      loadState: ENUM.INIT,
      shareCommand:
        "This sync box is shared by everyone in the session for realtime collaboration",
      height: 1.5,
      loader: false,
      tables: {
        tables: [
          { results: [], keys: [], error: "" },
          { results: [], keys: [], error: "" },
          { results: [], keys: [], error: "" },
          { results: [], keys: [], error: "" },
          { results: [], keys: [], error: "" }
        ],
        count: 0,
        name: "0",
        max: 5,
        current: {
          index: 0,
          name: "0"
        }
      }
    };
  },
  created() {
    if (this.user.authenticated) {
      this.sessionInfo.sessionId = this.$route.params.sessionId;
      this.socket = io("http://localhost:5000/sql");
      // "https://back.colearn.tech/sql"
      // http://localhost:5000/sql

      this.verifySession();
      this.$store.dispatch("getSessionHistory", this.sessionInfo.sessionId);
      document.title = "🟢 Session - " + this.sessionInfo.sessionId;
      this.attachSocketEvents();
      this.openTable();
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
      this.loader = true;
      this.$http
        .get(this.route, {
          params: {
            query: command,
            db: this.sessionInfo.sessionId
          }
        })
        .then(res => {
          this.loader = false;
          //If response is an array, it means successful SELECT command was run
          if (Array.isArray(res.data)) {
            this.$set(this.tables.tables, this.tables.current.index, {
              keys: Object.keys(res.data[0]),
              results: res.data,
              showTable: true
            });
          } else {
            // If response is not an array, it means response is an error message. Display error message
            this.$set(this.tables.tables, this.tables.current.index, {
              results: [],
              keys: [],
              showTable: false,
              name: this.tables.current.index
            });
          }
          this.tables.name = "" + this.tables.current.index;
          this.messageHandler(res.data, this.tables.current.index);
          this.socket.emit(
            "sync_result",
            this.$route.params.sessionId,
            res.data,
            command,
            this.tables.name
          );
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
      background = "var(--sql-lighter-dark)",
      tableIndex
    ) {
      this.$set(this.tables.tables, tableIndex, {
        results: [],
        keys: [],
        message: message,
        showTable: false,
        background: background
      });
    },

    /**
     * Checks backend response and updates, result table message and background color
     * @param {String} message is the response from backend after a SQL command has been. Only populated when response is not an array
     */
    messageHandler(message, tableIndex) {
      this.message = message;
      let cleanMessage = message.replace(/^([\w:/-]+\s)/g, "");
      if (typeof message == "string") {
        if (message.match(/SUCCESSFULLY/i)) {
          this.updateResultTable(cleanMessage, "var(--success)", tableIndex);
        } else if (message.match(/DELETED/i)) {
          this.updateResultTable(cleanMessage, "var(--success)", tableIndex);
        } else if (message.match(/UPDATED/i)) {
          this.updateResultTable(
            cleanMessage,
            "var(--sql-light-primary)",
            tableIndex
          );
        } else if (message.match(/ERROR/i)) {
          this.updateResultTable(
            cleanMessage,
            "var(--danger-lighter)",
            tableIndex
          );
        } else if (message.match(/NO MATCHING/i)) {
          this.updateResultTable(
            cleanMessage,
            "var(--danger-light)",
            tableIndex
          );
        } else if (message.match(/Empty table/i)) {
          this.updateResultTable(
            cleanMessage,
            "var(--g-secondary)",
            tableIndex
          );
        } else {
          this.updateResultTable(
            "Something went wrong, please reset and try again.",
            "var(--dark)",
            tableIndex
          );
        }
      } else {
        this.updateResultTable("Invalid command", "var(--danger)", tableIndex);
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

    // Listens to tab switches to update current tab index
    tabListener(data) {
      this.tables.name = data.name;
      this.tables.current.name = data.name;
      this.tables.current.index = parseInt(data.index);
    },

    attachSocketEvents() {
      EventBus.$on("get-tab", () => {
        EventBus.$emit("send-tab", this.tables.name);
      });

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

      this.socket.on("get_sql", (command, username, tab) => {
        this.command = command;
        this.tables.current.index = tab;
        if (command == "") {
          this.updateResultTable();
        } else {
          this.fetchSqlLocal(command);
          this.$store.dispatch("addCommand", {
            command: command,
            type: "run",
            by: username,
            ranAt: {
              _seconds: new Date() / 1000
            }
          });
        }
      });
      this.socket.on("sync_result", (result, command, username, tab) => {
        console.log(result, username, tab);
        this.tables.name = tab;
        this.messageHandler(result, tab);
        this.$store.dispatch("addCommand", {
          command: command,
          type: "run",
          by: username,
          ranAt: {
            _seconds: new Date() / 1000
          }
        });
        this.$notify({
          group: "sync",
          title: "Command executed",
          text: result,
          type: "error"
        });
      });
    },
    openTable() {
      EventBus.$on("open-table", data => {
        this.fetchSqlLocal("SELECT * FROM " + data, true);
      });
    }
  },
  watch: {
    loadState(newValue) {
      if (newValue == ENUM.LOADING) this.$refs.topProgress.start();
      if (newValue == ENUM.LOADED) this.$refs.topProgress.done();
      if (newValue == ENUM.ERROR) this.$refs.topProgress.fail();
    },
    loader(newValue) {
      if (newValue) this.$refs.topProgress.start();
      this.$refs.topProgress.done();
    }
  }
};
</script>

<style lang="scss">
#sqlBody {
  width: 100%;

  margin-top: 0.5rem;
  margin-left: auto;
  margin-right: auto;

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
  margin: 0 auto;
  margin-top: 2rem;
  width: 90%;
  background-color: var(--sql-lighter-dark);

  border-radius: 5px;

  .el-tabs__header {
    margin: 0;
    border: none;
  }
  .el-tabs__content {
    height: auto;
  }
  .el-tabs__nav {
    border-radius: 5px;

    border-color: transparent;

    .el-tabs__item.is-active {
      border-radius: 5px 5px 0 0;

      font-weight: 700;

      background-color: var(--sql-light-primary);

      color: white;
    }
    .el-tabs__item {
      border-color: transparent;

      color: var(--sql-primary);

      transition: background-color 0.5s;
    }
  }
}
h2 {
  p {
    font-size: 0.85rem;
    opacity: 0.8;
  }
}

.result-tabs {
  margin: 0 auto;
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
  background: white !important;
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
    color: var(--sql-lighter-dark);
  }

  &.user-left {
    border-left: 5px solid var(--danger);
    color: var(--sql-lighter-dark);
  }
  &.error {
    .notification-content {
      font-size: 0.8rem;
    }
  }
}

@media screen and (min-width: 470px) {
  #sqlBody {
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 1250px) {
  #sqlBody {
    width: 1250px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>