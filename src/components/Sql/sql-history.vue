<template>
  <div id="history">
    <div id="sqlHistory" class="neumorphic">
      <div
        id="tableSection"
        :class="{'center-text': commands.length == 0 ? true : false}"
        key="loaded"
      >
        <slide-x-right-transition mode="out-in">
          <table v-if="commands.length != 0" key="yesdata">
            <tr>
              <th></th>
              <th>
                Command
                <i class="fas fa-redo" @click="getSessionHistory"></i>
              </th>
              <th>By</th>
              <th>When</th>
            </tr>
            <tr v-for="(command, index) in commands" :key="index">
              <td @click="fetchSqlLocal(command.command)" class="run-again">
                <i class="fas fa-history" v-if="command.command.match(/SELECT/i)"></i>
              </td>
              <td class="command" :key="command.ranAt._seconds">
                <p>{{getCommand(command.command)}}</p>
                <i
                  @click="copyCommand(command.command)"
                  :class="{'fas': clipboard.command == command.command ? true : false, 'far' : clipboard.command != command.command ? true : false,}"
                  class="fa-copy"
                ></i>
              </td>
              <td>{{command.by}}</td>
              <td class="time-ran">{{getTimeDifference(new Date((command.ranAt._seconds)* 1000))}}</td>
            </tr>
            <!-- Table section -->
          </table>

          <p v-if="commands.length == 0" style="padding: 2rem 0" key="nodata">
            There's nothing to show here right now.
            <br />Your session history will show up here when you or someone else in the session runs a command
          </p>
        </slide-x-right-transition>
      </div>
    </div>
    <collapse-transition>
      <div id="historyTableSection" v-if="loaded" class="neumorphic">
        <div id="zoomButtons">
          <button class="button" @click="zoomIn">
            <i class="fas fa-plus"></i>
          </button>
          <button class="button" @click="zoomOut">
            <i class="fas fa-minus"></i>
          </button>
        </div>
        <table key="table" :style="{'font-size': history.fontSize + 'rem', }">
          <!-- Table header row -->
          <tr>
            <!-- Row count column -->
            <th>#</th>
            <!-- Dynamically generated header columns (keys) -->

            <th v-for="(key, index) in keys" :key="index">{{key}}</th>
          </tr>

          <!-- Entry rows -->
          <tr v-for="(row, no) in results" :key="no" class="tr">
            <!-- Entry row index column -->
            <td id="index">{{no+1}}</td>

            <!-- Dynamically generated entry columns -->
            <td v-for="(value, key) in row" :key="key">{{value}}</td>
          </tr>
        </table>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
import ENUM from "@/enums/firebase_enum";
import loader from "@/mixins/loader";
import { EventBus } from "@/bus/bus";
import time from "@/mixins/time";
import { mapGetters } from "vuex";
import { SlideXRightTransition, CollapseTransition } from "vue2-transitions";

export default {
  name: "sql-history",
  mixins: [loader, time],
  props: {
    sessionId: {
      type: String
    }
  },
  components: { SlideXRightTransition, CollapseTransition },
  computed: {
    ...mapGetters({ commands: "sessionHistory", loadState: "loadState" })
  },
  data() {
    return {
      progress: 0,
      clipboard: {
        command: null,
        clip: null,
        success: null,
        fail: null,
        sessionId: null
      },
      results: [],
      keys: [],
      loaded: false,
      history: {
        fontSize: 1,
        padding: 0.2
      }
    };
  },
  created() {},
  methods: {
    copySessionLink(sessionId, language) {
      this.clipboard.sessionId = sessionId;
      this.clipboard.clip =
        "https://colearn.tech/learn-" + language + "/" + sessionId;
      this.$clipboard(this.clipboard.clip);
    },
    copyCommand(command) {
      this.clipboard.command = command;
      this.clipboard.clip = command;
      this.$clipboard(this.clipboard.clip);
    },
    getCommand(command) {
      if (command.length > 30) {
        return command.substring(0, 30) + "...";
      } else {
        return command;
      }
    },
    getSessionHistory() {
      this.loadState = ENUM.LOADING;
      this.$http
        .get("/session/sql/get-history", {
          params: { sessionId: this.$route.params.sessionId }
        })
        .then(res => {
          this.loadState = ENUM.LOADED;
          this.commands = res.data;
        });
    },
    sendCommand(command) {
      EventBus.$emit("copy-command", command);
    },
    /**
     * GETs the result of the sql command from the backend
     * @param {String} command SQL command that is received from the input and send to the backend
     */
    fetchSqlLocal(command) {
      // command = "SELECT * FROM PERSONS"; //ONLY FOR TESTING PURPOSES. REMOVE this from build
      this.$http
        .get("/sql/local-sql-query", {
          params: {
            query: command
          }
        })
        .then(res => {
          //If response is an array, it means successful SELECT command was run
          if (Array.isArray(res.data)) {
            this.results = res.data;
            this.keys = Object.keys(this.results[0]);
            this.loaded = true;
          }
        })
        .catch(() => {
          this.loaded = false;
        });
    },
    zoomIn() {
      this.history.fontSize += 0.1;
      this.history.padding += 0.1;
      console.log(this.history.fontSize);
    },
    zoomOut() {
      this.history.fontSize -= 0.1;
      this.history.padding -= 0.1;
    }
  },
  watch: {
    loadState(newValue) {
      this.progress = this.getProgress(newValue);
    }
  }
};
</script>

<style lang="scss">
#sqlHistory {
  display: block;

  width: 88%;
  margin: 0 auto;

  margin-top: 1rem;

  border-radius: 5px;
  border: 2px solid rgba(var(--sql-light-primary), $alpha: 0.1);

  text-align: center;

  min-height: 20vh;

  color: var(--sql-lighter-dark);
  background-color: white;
}

#sqlHistory table {
  table-layout: auto;
  width: 100%;
  white-space: pre;

  border-collapse: collapse;

  overflow: auto;
}

#sqlHistory #tableSection {
  max-height: 20vh;
}
.center-text {
  display: flex;
  justify-content: center;
  align-items: center;
}

#sqlHistory th {
  padding: 10px 5px;
}

#sqlHistory td {
  padding: 10px 5px;
  border-bottom: 2px solid white;
}

#sqlHistory th {
  position: sticky;
  top: 0;
  background-color: white;
  border-bottom: 2px solid whitesmoke;

  cursor: default;
}
#sqlHistory tr:last-child td {
  border-bottom: transparent;
}

#sqlHistory tr {
  cursor: pointer;

  transition: 0.6s;
  .run-again {
    i {
      transition: color 0.4s;
      color: var(--sql-lighter-dark);
    }
    i:hover {
      color: var(--sql-light-primary);
    }
  }
}

#sqlHistory tr th:first-child {
  border-radius: 5px 0 0 5px;
}
#sqlHistory tr th:last-child {
  border-radius: 0 5px 5px 0;
}

#sqlHistory tr:hover {
  background-color: rgba(var(--sql-primary-v), 0.2);
}

#sqlHistory tr:hover th {
  background-color: white;
}
#sqlHistory th i {
  transition: transform 0.3s;
  transition-delay: 0.25s;

  cursor: pointer;
}
#sqlHistory th i:hover {
  transform: rotate(360deg);
}

#sqlHistory .command {
  color: var(--sql-lighter-dark);
  transition: color 0.5s;
}

#sqlHistory .command p {
  display: inline;
  margin-right: 1rem;
}

#pastSession .command i {
  margin: 0;
}

#sqlHistory .command p:hover {
  text-decoration: underline;
}

#sqlHistory .time-ran {
  font-size: 85%;
}

#history {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  #zoomButtons {
    position: absolute;
    display: grid;
    gap: 0.5rem;
    transform: translate(-2.5rem);
    button {
      background-color: var(--sql-lighter-dark);
    }
  }
}

#historyTableSection {
  display: inline-block;

  width: 88%;

  margin-top: 1rem;

  background-color: var(--sql-lighter-dark);

  border: 2px solid rgba(var(--sql-dark-v), 0.2);
  border-radius: var(--border-radius);

  color: white;

  transition: background-color 0.3s, box-shadow 0.8s;

  overflow: auto;

  height: 20rem;

  resize: vertical;
}

#history #historyTableSection table {
  table-layout: auto;
  width: 100%;
  white-space: pre;

  overflow: auto;

  font-size: 0.9rem;

  border-collapse: collapse;
}

#history #historyTableSection th {
  border-bottom: 2px solid white;
}

#history #historyTableSection td {
  padding-left: 0.2rem;
  border: 1px solid rgba(var(--sql-light-v), $alpha: 0.5);
}

#history #historyTableSection tr {
  transition: 0.2s;
}

#history #historyTableSection tr:hover {
  background-color: rgba(var(--danger-light-v), $alpha: 1);
}
</style>