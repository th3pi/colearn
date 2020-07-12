<template>
  <div id="pastSessions" v-if="progress == 100" key="loaded" class="neumorphic">
    <div id="pastSessionsBody" v-for="(session, index) in sessions" :key="index">
      <div
        class="session-card neumorphic hover n-active"
        @click="joinSession(session.sessionId, session.language)"
      >
        <i class="fas fa-fire popular" v-if="session.colearners.length >= 3"></i>
        <div class="main-body">
          <p class="main-title">{{session.sessionId}}</p>
          <i
            @click.stop.prevent="copySessionName(session.sessionId)"
            :class="{'fas': clipboard.sessionId == session.sessionId ? true : false, 'far' : clipboard.sessionId != session.sessionId ? true : false,}"
            class="fa-copy copy-button"
          ></i>
          <p class="secondary-title">Host: {{session.hostname}}</p>
          <timeago :auto-update="60" :datetime="new Date((session.lastUsed._seconds) * 1000)" />
        </div>
      </div>
      <!-- {{new Date((session.createdOn._seconds)* 1000).toLocaleString()}} -->
    </div>
    <p v-if="sessions.length == 0" style="padding: 2rem 0">
      There's nothing to show here right now.
      <br />Your past sessions will show up here as you keep joining sessions or creating new sessions
    </p>
  </div>
  <div class="loader" v-else key="loading">
    <vue-ellipse-progress :progress="progress" :loading="true" :size="20" />
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
            limit: "2"
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
  display: grid;

  gap: 0.25rem;

  grid-template-columns: 1fr 1fr;

  margin: 0 0.1rem;

  border-radius: 5px;

  border: 2px solid rgba($color: #000000, $alpha: 0.1);

  color: white;

  background-color: var(--sql-light-primary);
}

#pastSessions .session-card {
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;

  background-color: white;

  padding: 0.15rem 0.3rem;

  margin: 0.5rem 0.5rem;

  border-radius: 5px;

  color: var(--sql-light-primary);

  transition: 0.5s;

  .popular {
    margin-right: 1rem;
    color: orangered;
  }
}

#pastSessions .session-card .main-title,
.secondary-title {
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
  color: var(--sql-lighter-dark);
  font-size: 0.85rem;
}

@media screen and (min-width: 470px) {
  #pastSessions .session-card {
    padding: 0.85rem 0.95rem;
  }
}
</style>