<template>
  <div id="sqlHistory" class="neumorphic">
    <div v-if="progress == 100" key="loaded">
      <table v-if="commands.length != 0">
        <tr>
          <th>Command</th>
          <th>Ran at</th>
        </tr>
        <tr v-for="(command, index) in commands" :key="index">
          <td class="session-name">
            <p>{{command.command}}</p>
          </td>
          <td>{{new Date((command.ranAt._seconds)* 1000).toLocaleString()}}</td>
        </tr>
      </table>
      <p v-if="commands.length == 0" style="padding: 2rem 0">
        There's nothing to show here right now.
        <br />Your past sessions will show up here as you keep joining sessions or creating new sessions
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
export default {
  name: "sql-history",
  mixins: [loader],
  props: {
    sessionId: {
      type: String
    }
  },
  data() {
    return {
      commands: [],
      loadState: ENUM.INIT,
      progress: 0,
      clipboard: {
        clip: null,
        success: null,
        fail: null,
        sessionId: null
      }
    };
  },
  created() {
    this.loadState = ENUM.LOADING;
    this.$http
      .get("/session/sql/get-history", {
        params: { sessionId: this.sessionId }
      })
      .then(res => {
        this.loadState = ENUM.LOADED;
        this.commands = res.data;
      });
  },
  methods: {
    copySessionLink(sessionId, language) {
      this.clipboard.sessionId = sessionId;
      this.clipboard.clip =
        "https://colearn.tech/learn-" + language + "/" + sessionId;
      this.$clipboard(this.clipboard.clip);
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

  min-height: 5rem;

  margin: 0 0.5rem;

  border-radius: 5px;
  border: 2px solid rgba($color: #000000, $alpha: 0.1);

  text-align: center;

  color: white;
  background-color: var(--sql-light-primary);
}

#sqlHistory table {
  width: 100%;

  border-collapse: collapse;
}

#sqlHistory th {
  padding: 10px 5px;
}

#sqlHistory td {
  padding: 10px 5px;
  border-bottom: 2px solid white;
}

#sqlHistory th {
  border-bottom: 2px solid whitesmoke;
}
#sqlHistory tr:last-child td {
  border-bottom: transparent;
}

#sqlHistory tr,
th {
  cursor: pointer;

  transition: 0.6s;
}

#sqlHistory tr:hover {
  background-color: rgba(var(--sql-primary-v), 0.2);
}

#sqlHistory tr:hover th {
  background-color: rgba(var(--sql-primary-v), 0.5);
}

#sqlHistory .session-name {
  color: white;
  transition: color 0.5s;
}

#sqlHistory .session-name p {
  display: inline;
  margin-right: 1rem;
}

#pastSession .session-name i {
  margin: 0;
}

#sqlHistory .session-name:hover {
  text-decoration: underline;
}
</style>