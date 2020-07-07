<template>
  <page>
    <vue-topprogress ref="topProgress" :height="5"></vue-topprogress>

    <template #logo>
      <session-logo id="logo" fill="var(--sql-light-primary)" />
    </template>
    <div id="sessionOptions">
      <button class="button neumorphic hover n-active" @click="createSession">
        <i class="fas fa-plus"></i> Create a new Session
      </button>
      <button class="button neumorphic hover n-active" @click="joinSession">
        <i class="fas fa-user-plus"></i>Join a Session
      </button>
    </div>
    <div id="sessionsPage">
      <div class="cards" v-for="(session, index) in sessions" :key="index">
        <div class="card neumorphic border">
          <div class="card-header">
            <div class="header-title neumorphic">
              <p>{{session.sessionId}}</p>
              <i
                @click="copySessionName(session.sessionId)"
                :class="{'fas': clipboard.sessionId == session.sessionId ? true : false, 'far' : clipboard.sessionId != session.sessionId ? true : false,}"
                class="fa-copy copy-button"
              ></i>
            </div>
            <div class="option">
              <button v-popover:pinCode class="neumorphic n-active">
                <i class="fas fa-key"></i>
              </button>
              <popover name="pinCode" transition="dropdown-animation">{{session.pin}}</popover>
              <button
                v-if="(index % 2) == 0 ? false : true"
                v-popover:sessionSettings.left
                class="neumorphic n-active"
              >
                <i class="fas fa-cogs"></i>
              </button>
              <button v-else v-popover:sessionSettings class="neumorphic n-active">
                <i class="fas fa-cogs"></i>
              </button>
            </div>
          </div>
          <popover
            name="sessionSettings"
            class="pop-options"
            transition="dropdown-animation"
            :pointer="false"
          >
            <button class="button neumorphic n-active">
              <i class="fas fa-signature"></i>Reset name
            </button>
            <button class="button neumorphic n-active">
              <i class="fas fa-key"></i>Reset pin
            </button>
            <button class="button neumorphic n-active">
              <i class="fas fa-backspace"></i>Delete
            </button>
          </popover>

          <div class="card-body">
            <div class="description">
              <p>
                Hosted by
                <span>{{session.leader == user.data.email ? 'You' : session.hostname}}</span>
              </p>
              <p>
                Language
                <span>{{session.language == 'sql' ? session.language.toUpperCase() : session.language}}</span>
              </p>
              <p>
                Session has
                <span>{{session.colearners.length}} member(s)</span>
              </p>
            </div>
            <div class="time">
              <p>Last entered</p>

              <i class="far fa-clock"></i>
              {{getTimeDifference(new Date((session.lastUsed._seconds)* 1000))}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </page>
</template>

<script>
import page from "@/components/General/page.vue";
import sessionLogo from "@/assets/img/titles/session-logo.vue";
import ENUM from "@/enums/firebase_enum";
import time from "@/mixins/time";
import { mapGetters } from "vuex";
export default {
  name: "sessions",
  mixins: [time],
  components: {
    page,
    sessionLogo
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
      },
      sessionIdToJoin: null
    };
  },
  created() {
    this.getSessions();
  },
  computed: {
    ...mapGetters({ user: "user" })
  },
  methods: {
    createSession() {
      this.$http
        .post("/session/sql/create-session", {
          email: this.user.data.email,
          name: this.user.data.displayName
        })
        .then(res => {
          let sessionId = res.data.message;
          this.$store.dispatch("setActiveSession", sessionId);
          this.$router.push({
            name: "learn-sql",
            params: { sessionId: sessionId }
          });
        })
        .catch(() => {});
    },
    joinSession() {
      this.$router.push({
        name: "join-sql",
        params: { sessionId: "getone" }
      });
    },
    getSessions() {
      this.loadState = ENUM.LOADING;
      this.$http
        .get("/user/user-sessions", {
          params: {
            email: this.user.data.email,
            limit: "25"
          }
        })
        .then(res => {
          this.loadState = ENUM.LOADED;

          this.sessions = res.data;
        });
    },
    copySessionName(sessionId) {
      this.clipboard.sessionId = sessionId;

      this.clipboard.clip = sessionId;
      this.$clipboard(this.clipboard.clip);
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
#sessionOptions {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  margin: 1rem 0;

  button:not(:last-child) {
    margin-right: 1rem;
  }

  button {
    font-size: 1.1rem;

    padding: 0.5rem 1.25rem;

    i {
      margin-right: 0.25rem;
      transform: scale(0.85);
    }
  }
}
#sessionsPage {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 400px));
  grid-auto-rows: 8rem;
  margin: 0 1rem;
  color: var(--sql-lighter-dark);
}
.card {
  height: 100%;
  border-radius: 5px;

  transition: border-color 0.4s;

  background-color: white;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  margin: 0.5rem;
  .option {
    border-radius: 5px;

    button {
      color: white;
      background-color: var(--sql-light-primary);

      border: none;

      border-radius: 5px;

      outline: none;

      padding: 0.5rem 0.75rem;

      i {
        margin: 0 auto;
      }
    }

    button:first-child {
      margin-right: 0.5rem;
    }
  }
}

.card .header-title {
  background-color: var(--sql-light-primary);

  padding: 0.5rem 0.75rem;

  border-radius: 5px;

  color: white;

  p {
    display: inline;
    margin-right: 0.3rem;

    cursor: pointer;
  }

  i {
    cursor: pointer;

    transition: opacity 0.4s;
  }

  i:hover {
    opacity: 0.8;
  }
}

.card .header-title p:hover {
  text-decoration: underline;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  margin: 0.5rem 0.5rem;

  font-size: 0.85rem;
  .time {
    p {
      text-align: right;
      font-size: 90%;
      opacity: 0.6;
    }
    i {
      margin-right: 0.1rem;
    }
  }
}

.pop-options {
  display: grid;
  gap: 0.25rem;
  background-color: rgba($color: #fff, $alpha: 0.2);
  box-shadow: 2px 4px 8px rgba($color: #000000, $alpha: 0.05);
  button {
    display: block;
    text-align: left;
    color: var(--sql-light-primary);
    background-color: white;
    padding: 0.5rem 0.75rem;
    i {
      margin-right: 0.25rem;
    }
  }
}

@media screen and (min-width: 470px) {
  #sessionsPage {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}
@media screen and (min-width: 1230px) {
  #sessionsPage {
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  }
}

@media screen and (max-width: 470px) {
  #sessionOptions {
    margin: 0.5rem 1rem;

    button {
      font-size: 0.95rem;

      padding: 0.5rem 0.5rem;

      i {
        margin-right: 0.25rem;
        transform: scale(0.85);
      }
    }
  }
  #sessionsPage {
    grid-template-columns: repeat(auto-fit, minmax(1fr, 1fr));
  }

  .card .header-title {
    margin-left: 0.25rem;

    padding: 0.25rem 0.45rem;

    p {
      font-size: 85%;
      cursor: pointer;
    }
    i {
      transform: scale(1.25);
      margin-left: 0.4rem;
      cursor: pointer;

      transition: opacity 0.4s;
    }

    i:hover {
      opacity: 0.8;

      cursor: pointer;
    }
  }

  .card-body .time {
    font-size: 0.75rem;
    margin-right: 0.5rem;
    p {
      text-align: right;
      font-size: 95%;
      opacity: 0.6;
    }
    i {
      margin-right: 0.05rem;
    }
  }
}
</style>