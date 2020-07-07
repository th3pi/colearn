<template>
  <div id="sqlHistory" class="neumorphic">
    <div id="tableSection" v-if="progress == 100" key="loaded">
      <table v-if="commands.length != 0">
        <tr>
          <th>
            Command
            <i class="fas fa-redo" @click="getSessionHistory"></i>
          </th>
          <th>By</th>
          <th>When</th>
        </tr>
        <tr v-for="(command, index) in commands" :key="index" @click="sendCommand(command.command)">
          <td class="command">
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
      </table>

      <p v-if="commands.length == 0" style="padding: 2rem 0">
        There's nothing to show here right now.
        <br />Your session history will show up here when you or someone else in the session runs a command
      </p>
    </div>
    <div class="loader" v-else key="loading">
      <vue-ellipse-progress :progress="progress" :loading="true" :size="20" />
    </div>
  </div>
</template>

<script>
import ENUM from "@/enums/firebase_enum";
import loader from "@/mixins/loader";
import { EventBus } from "@/bus/bus";
import time from "@/mixins/time";
export default {
  name: "sql-history",
  mixins: [loader, time],
  props: {
    sessionId: {
      type: String
    }
  },
  data() {
    return {
      commands: null,
      loadState: ENUM.INIT,
      progress: 0,
      clipboard: {
        command: null,
        clip: null,
        success: null,
        fail: null,
        sessionId: null
      }
    };
  },
  created() {
    this.getSessionHistory();
  },
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
  width: 100%;

  border-collapse: collapse;

  overflow: auto;
}

#sqlHistory #tableSection {
  max-height: 20vh;
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
</style>