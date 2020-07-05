<template>
  <div id="pastSessions" class="neumorphic">
    <div v-if="progress == 100" key="loaded">
      <table v-if="sessions.length != 0">
        <tr>
          <th>Session name</th>
          <th>Date</th>
        </tr>
        <tr v-for="(session, index) in sessions" :key="index">
          <td class="session-name">
            <p @click="joinSession(session.sessionId, session.language)">{{session.sessionId}}</p>
            <i
              @click="copySessionLink(session.sessionId, session.language)"
              :class="{'fas': clipboard.sessionId == session.sessionId ? true : false, 'far' : clipboard.sessionId != session.sessionId ? true : false,}"
              class="fa-copy"
            ></i>
          </td>
          <td>{{new Date((session.createdOn._seconds)* 1000).toLocaleString()}}</td>
        </tr>
      </table>
      <p v-if="sessions.length == 0" style="padding: 2rem 0">
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
  name: "past-sessions",
  mixins: [loader],
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      sessions: [],
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
    if (this.user.authenticated) {
      this.loadState = ENUM.LOADING;
      this.$http
        .get("/user/user-sessions", { params: { email: this.user.data.email } })
        .then(res => {
          this.loadState = ENUM.LOADED;
          this.sessions = res.data;
        });
    }
  },
  methods: {
    copySessionLink(sessionId, language) {
      this.clipboard.sessionId = sessionId;
      this.clipboard.clip =
        "https://colearn.tech/learn-" + language + "/" + sessionId;
      this.$clipboard(this.clipboard.clip);
    },
    joinSession(sessionId, language) {
      this.$router.push({
        name: "learn-" + language.toLowerCase(),
        params: { sessionId: sessionId }
      });
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
#pastSessions {
  display: block;

  min-height: 5rem;

  margin: 0 0.5rem;

  border-radius: 5px;
  border: 2px solid rgba($color: #000000, $alpha: 0.1);

  text-align: center;

  color: white;
  background-color: var(--sql-light-primary);
}

#pastSessions table {
  width: 100%;

  border-collapse: collapse;
}

#pastSessions th {
  padding: 10px 5px;
}

#pastSessions td {
  padding: 10px 5px;
  border-bottom: 2px solid white;
}

#pastSessions th {
  border-bottom: 2px solid whitesmoke;
}
#pastSessions tr:last-child td {
  border-bottom: transparent;
}

#pastSessions tr,
th {
  cursor: pointer;

  transition: 0.6s;
}

#pastSessions tr:hover {
  background-color: rgba(var(--sql-primary-v), 0.2);
}

#pastSessions tr:hover th {
  background-color: rgba(var(--sql-primary-v), 0.5);
}

#pastSessions .session-name {
  color: white;
  transition: color 0.5s;
}

#pastSessions .session-name p {
  display: inline;
  margin-right: 1rem;
}

#pastSession .session-name i {
  margin: 0;
}

#pastSessions .session-name:hover {
  text-decoration: underline;
}
</style>