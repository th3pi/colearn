<template>
  <div id="pastSessions" class="neumorphic">
    <div id="tableSection" v-if="progress == 100" key="loaded">
      <table v-if="sessions.length != 0">
        <tr>
          <th>
            Sessions
            <i class="fas fa-redo" @click="getSessions"></i>
          </th>
        </tr>
        <tr id="pastSessionsBody" v-for="(session, index) in sessions" :key="index">
          <div class="session-card neumorphic">
            <div>
              <p
                class="main-title"
                @click="joinSession(session.sessionId, session.language)"
              >{{session.sessionId}}</p>
              <i
                @click="copySessionName(session.sessionId)"
                :class="{'fas': clipboard.sessionId == session.sessionId ? true : false, 'far' : clipboard.sessionId != session.sessionId ? true : false,}"
                class="fa-copy copy-button"
              ></i>
              <p class="secondary-title">Host: {{session.hostname}}</p>
            </div>

            <div id="date">
              <i class="far fa-clock"></i>
              {{getTimeDifference(new Date((session.lastUsed._seconds)* 1000))}}
            </div>
          </div>
          <!-- {{new Date((session.createdOn._seconds)* 1000).toLocaleString()}} -->
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
import time from "@/mixins/time";
export default {
  name: "past-sessions",
  mixins: [loader, time],
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
      this.getSessions();
    }
  },
  methods: {
    copySessionLink(sessionId, language) {
      this.clipboard.sessionId = sessionId;
      this.clipboard.clip =
        "https://colearn.tech/learn-" + language + "/" + sessionId;
      this.$clipboard(this.clipboard.clip);
    },
    copySessionName(sessionId) {
      this.clipboard.sessionId = sessionId;

      this.clipboard.clip = sessionId;
      this.$clipboard(this.clipboard.clip);
    },
    joinSession(sessionId, language) {
      this.$router.push({
        name: "learn-" + language.toLowerCase(),
        params: { sessionId: sessionId }
      });
    },
    sortSession() {
      this.sessions.sort((a, b) => {
        return b.lastActive._seconds - a.lastActive._seconds;
      });
    },
    getUser(email) {
      this.$http
        .get("/user/get-user-by-email", { params: { email: email } })
        .then(res => {
          return res.data.displayName;
        });
    },
    getSessions() {
      this.loadState = ENUM.LOADING;
      this.$http
        .get("/user/user-sessions", {
          params: {
            email: this.user.data.email,
            limit: "5"
          }
        })
        .then(res => {
          this.loadState = ENUM.LOADED;

          this.sessions = res.data;
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

#pastSessions #tableSection {
  overflow: auto;
}

#pastSessions #pastSessionsBody {
}

#pastSessions th {
  padding: 10px 5px;
  border-bottom: 2px solid whitesmoke;
}

#pastSessions tr,
th {
  transition: 0.6s;
}

#pastSessions th i {
  transition: transform 0.3s;
  transition-delay: 0.25s;

  cursor: pointer;
}
#pastSessions th i:hover {
  transform: rotate(360deg);
}

#pastSessions tr:hover {
  background-color: rgba(var(--sql-primary-v), 0.2);
}

#pastSessions tr:hover th {
  background-color: rgba(var(--sql-primary-v), 0.5);
}

#pastSessions .session-card {
  display: flex;

  flex-direction: row;

  justify-content: space-between;

  background-color: white;

  padding: 1rem;

  margin: 0.5rem 0.5rem;

  border-radius: 5px;

  color: var(--sql-light-primary);

  transition: color 0.5s;
}

#pastSessions .session-card .main-title,
.secondary-title {
  text-align: left;
  margin-right: 0.4rem;
}

#pastSessions .session-card .main-title {
  display: inline;

  cursor: pointer;
}

#pastSessions .session-card .copy-button {
  cursor: pointer;

  transition: 0.4s;
}

#pastSessions .session-card .copy-button:hover {
  color: var(--sql-primary);
}

#pastSessions .session-card .main-title:hover {
  text-decoration: underline;
}

#pastSessions .session-card .secondary-title {
  font-size: 0.85rem;
  color: var(--sql-lighter-dark);
}

#pastSession .session-card i {
  margin: 0;
}

#pastSessions #date {
  display: block;

  color: var(--sql-lighter-dark);

  font-size: 0.85rem;
}
</style>