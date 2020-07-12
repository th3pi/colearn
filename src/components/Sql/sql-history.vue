<template>
  <div id="history">
    <div>
      <el-timeline>
        <el-timeline-item v-for="(command, index) in commands" :key="index">
          <div class="timeline-card neumorphic border" @click="sendCommand(command.command)">
            <div class="left-side">
              <div class="title">
                <h4>{{command.command}}</h4>
                <p>{{command.by}}</p>
              </div>
              <p class="time">
                <i @click="fetchSqlLocal(command.command)" class="run-again">
                  <i class="fas fa-history" style="margin-right: .05rem;"></i>
                </i>
                <timeago :auto-update="5" :datetime="new Date((command.ranAt._seconds) * 1000)"></timeago>
              </p>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
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
import loader from "@/mixins/loader";
import { EventBus } from "@/bus/bus";
import time from "@/mixins/time";
import { mapGetters } from "vuex";
import { CollapseTransition } from "vue2-transitions";
import { Timeline, TimelineItem } from "element-ui";

export default {
  name: "sql-history",
  mixins: [loader, time],
  props: {
    sessionId: {
      type: String
    }
  },
  components: {
    CollapseTransition,
    "el-timeline": Timeline,
    "el-timeline-item": TimelineItem
  },
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
    getSessionHistory() {
      this.$store.getters.getSessionHistory;
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
#history {
  width: 88%;
  margin: 0 auto;

  .el-timeline {
    padding: 0;
  }
}

#sqlHistory {
  border-radius: 5px;
  border: 2px solid rgba(var(--sql-light-primary), $alpha: 0.1);

  text-align: center;

  min-height: 20vh;

  color: var(--sql-lighter-dark);
  background-color: white;
}

.timeline-card {
  background-color: white;
  padding: 1rem;
  padding-top: 0.2ren;
  border-radius: 5px;
  transition: border 0.4s;
  cursor: pointer;
  .title {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin: 0;
    h4 {
      color: var(--sql-lighter-dark);
      text-align: left;
      margin-right: 0.5rem;
      max-width: 15rem;
    }
  }
  .time {
    opacity: 0.75;
  }
}

#history {
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