<template>
  <div class="open-sans">
    <!-- Top slideshow -->
    <div id="carousel" class="carousel" v-if="this.$mq != 'sm'">
      <agile :dots="false">
        <!-- First slide -->
        <div class="slide cl-slide">
          <img class="screenshot neumorphic" src="../assets/img/sql-screenshot.png" alt="nothing" />
          <div id="caption">
            <h3>Powerful and Fast</h3>
            <p>
              Colearn runs all your code using
              <strong>magic</strong> on the backend providing a minimal
              compilation time and seamless collaboration experience
            </p>
          </div>
        </div>
        <!-- Second slide -->
        <div class="slide cl-slide">
          <div id="caption">
            <h3>Guides and Cheatsheets</h3>
            <p>
              Follow along with colearn's guides and cheatsheets, that exists
              only to make sure you are never lost!
            </p>
          </div>
          <img class="screenshot neumorphic" src="../assets/img/sql-screenshot.png" alt="nothing" />
        </div>
        <!-- Overriding default agile slideshow buttons -->
        <template #prevButton>
          <i class="fas fa-chevron-left"></i>
        </template>
        <template #nextButton>
          <i class="fas fa-chevron-right"></i>
        </template>
      </agile>
    </div>

    <!-- Main content for home -->
    <div id="homeBody">
      <!-- Shows alert notifying user to register or authenticate if user entered using a beta code, and isn't signed in -->
      <alert
        v-if="!user.authenticated"
        backgroundColor="var(--sql-light-v)"
        color="var(--sql-lighter-dark)"
        :dismiss="true"
      >
        <i class="fas fa-exclamation-circle" style="transform: scale(0.95);"></i>
        <strong class="link" @click="$router.push({name: 'register'})">Register</strong> or
        <strong class="link" @click="$router.push({name: 'authenticate'})">Authenticate</strong> to confirm your beta access
      </alert>

      <alert
        v-if="verified == false && $route.query.verified != true"
        backgroundColor="var(--danger-v)"
        color="white"
        bordercolor="var(--danger)"
        :dismiss="true"
        :key="user.data.verified"
      >
        <i class="fas fa-exclamation-circle" style="transform: scale(0.95);"></i>
        Your email has not been
        <strong>verified</strong> yet.
        <a
          @click="sendVerification"
          style="text-decoration: underline; cursor: pointer;"
        >Resend verification</a>
      </alert>
      <!-- Colearn logo and description -->
      <div id="coLearnLogo">
        <logo class="logo" fill="var(--sql-light-primary)" />
        <p id="description" class="open-sans">
          An online
          <strong>co</strong>llaborative
          <strong>learn</strong>ing platform for
          in-demand programming languages
        </p>
      </div>

      <!-- Primary introduction to colearn -->
      <div id="intro">
        <!-- Instructions on how to get started with colearn -->
        <message-box @join-session="joinSession($event)" @create-session="createSession" />
        <!-- Programming language buttons -->
        <div id="sessionButtons">
          <button
            class="bold neumorphic hover n-active"
            :class="{'active': language == 'Java' ? true : false}"
            @click="markLanguage('Java')"
            disabled
          >
            <i class="fab fa-java"></i> Java
            <small>(Coming soon!)</small>
          </button>
          <button
            class="bold neumorphic hover n-active"
            :class="{'active': language == 'SQL' ? true : false}"
            @click="markLanguage('SQL')"
          >
            <i class="fas fa-search"></i> SQL
          </button>
          <button
            class="bold neumorphic hover n-active"
            :class="{'active': language == 'Python' ? true : false}"
            @click="markLanguage('Python')"
            disabled
          >
            <i class="fab fa-python"></i> Python
            <small>(Coming soon!)</small>
          </button>
        </div>
      </div>
      <!-- User sessions table -->
      <div v-if="user.authenticated">
        <h2 class="header">
          Your past sessions
          <i v-popover:sessionInfo class="fas fa-info-circle"></i>
          <popover
            name="sessionInfo"
            transition="fade"
            class="neumorphic"
            style="font-size: .95rem; font-weight: 300; text-align: left; padding: .5rem 1rem; width: 15rem"
          >
            <strong style="font-size: 1.1rem">What are past sessions?</strong>
            <br />

            <li>
              A list of all the sessions you may
              have
              <strong>joined</strong> or
              <strong>created</strong>.
            </li>
            <br />
            <li>
              You can click on the
              <strong>session names</strong> to travel back in time and checkout the session history,
              or reactivate the session.
            </li>
          </popover>
          <popover
            name="sessionName"
            transition="fade"
            class="neumorphic"
            style="font-size: .95rem; font-weight: 300; text-align: left; padding: .5rem 1rem"
          >Session names are randomly generated words that are unique to each session</popover>
        </h2>
        <!-- Past sessions table -->
        <past-sessions :user="user" />
      </div>
      <!-- Github message for colearn -->
      <div id="subMessage">
        <a>
          <i class="fab fa-github"></i>Check out the ins and outs of
          <strong>Colearn</strong> on Github
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/img/titles/co-learn-logo.vue";
import alert from "@/components/General/alert.vue";
import messageBox from "@/components/home/MessageBox.vue";
import PastSessions from "@/components/home/PastSessions.vue";
import firebase from "firebase";

import { VueAgile } from "vue-agile";
import { mapGetters } from "vuex";

export default {
  name: "home",
  components: {
    logo,
    agile: VueAgile,
    alert,
    "message-box": messageBox,
    PastSessions
  },
  props: {
    verified: {
      type: Boolean,
      default: null
    }
  },
  sockets: {
    connect() {}
  },
  data() {
    return {
      language: "sql",
      sessionId: "",
      sessions: [],
      progress: {
        sessions: 0,
        verification: 0
      }
    };
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
            name: "learn-" + this.language.toLowerCase(),
            params: { sessionId: sessionId }
          });
        })
        .catch(() => {});
    },
    joinSession(sessionId) {
      this.$router.push({
        name: "learn-" + this.language.toLowerCase(),
        params: { sessionId: sessionId }
      });
    },
    markLanguage(language) {
      this.language = this.language == language ? "" : language;
    },
    sendVerification() {
      this.progress.verification = Math.random() * 85 + 20;
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          this.progress.verification = 100;
          this.emailSent = true;
        })
        .catch(() => {
          this.progress.verification = 0;
        });
    }
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  created() {},

  watch: {}
};
</script>
<style lang="scss">
#homeBody {
  width: 100%;

  margin-top: 0.5rem;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 3.5rem;
  transition: width 0.4s;
}

// Slideshow css
.agile__nav-button--next,
.agile__nav-button--prev {
  position: absolute;
  top: 7rem;

  padding: 0.5rem 1rem;

  background-color: transparent;

  border-radius: 5px;
  border: 2px solid rgba(var(--sql-light-primary-v), 0.2);
  border-color: transparent;

  color: var(--sql-light-primary);

  transition: box-shadow 1s, background-color 0.8s;
}
.agile__nav-button--next:hover,
.agile__nav-button--prev:hover {
  background-color: white;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.2),
    -2px -2px 6px 0 rgba(255, 255, 255, 0.2);
}

.agile__nav-button--next {
  right: 0.5rem;
}

.agile__nav-button--prev {
  left: 0.5rem;
}

.header {
  text-align: center;
  margin: 1rem 0;
  color: var(--sql-light-primary);
}

.header i {
  cursor: pointer;

  transform: scale(0.75);

  transition: color 0.4s;
}

.header i:hover {
  color: var(--sql-dark);
}

#carousel {
  margin-bottom: 1rem;
}

#carousel .cl-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;

  box-shadow: inset -2px -4px 6px rgba($color: #000000, $alpha: 0.1);
}

#carousel .cl-slide .screenshot {
  width: 20rem;

  margin-right: 2vw;
  margin-left: 1vw;

  border-radius: 5px;
  border: 2px solid rgba(var(--sql-light-primary-v), 0.2);

  transition: border 1s;
}

#carousel .cl-slide .screenshot:hover {
  border: 2px solid rgba(var(--sql-light-primary-v), 1);
}

// #carousel .cl-slide #caption {
//   margin-right: 2vw;
//   margin-left: 1vw;
// }

#carousel .cl-slide #caption {
  margin-right: 2vw;
  margin-left: 1vw;
}

//Logo
#homeBody #coLearnLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
}
#homeBody #coLearnLogo #description {
  margin-top: 1rem;

  color: var(--dark);
  text-align: center;
  font-size: 1rem;
}

#homeBody #description strong {
  color: var(--sql-lighter-dark);
}

#homeBody #coLearnLogo .logo {
  width: 18rem;
  height: auto;
}

// Intro css
#homeBody #intro {
  display: block;
  margin: 0 0.5rem;
}
#sessionButtons button {
  display: block;
  width: 100%;
  padding: 0.8rem 0.5rem;

  margin: 0.5rem auto;

  background-color: white;

  border: none;
  border-radius: 5px;
  outline: none;

  font-size: 1rem;
  color: var(--sql-light-primary);
  text-align: left;

  transition: background-color 0.3s, box-shadow 0.4s,
    padding-left 0.4s ease-in-out, padding-right 0.4s ease-in-out;
}

#sessionButtons button i {
  font-size: 1.5rem;
}

.active {
  background-color: var(--sql-light-primary) !important;

  color: white !important;
}

#homeBody #subMessage {
  margin-top: 2rem;

  color: var(--g-primary);
  text-align: center;

  cursor: pointer;
}

#homeBody #subMessage a:hover {
  text-decoration: underline !important;
}

//Medium sized screens
@media screen and (min-width: 800px) {
  #carousel .cl-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1rem;
    padding-bottom: 1rem;

    box-shadow: inset -2px -4px 6px rgba($color: #000000, $alpha: 0.1);
  }

  #carousel .cl-slide .screenshot {
    width: 30rem;
  }
  #homBody {
    margin-top: 0.5rem;
    margin-left: auto;
    margin-right: auto;
  }
  #homeBody #coLearnLogo .logo {
    width: 16rem;
    height: auto;
  }

  #homeBody #coLearnLogo {
    margin-top: 0;
  }
  #homeBody #intro {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  #homeBody #intro #sessionButtons {
    flex-direction: column;
    margin-right: 0.5rem;
    width: 50%;
  }
}

// large screens
@media screen and (min-width: 1250px) {
  #homeBody {
    width: 1250px;
  }
  #homeBody #coLearnLogo .logo {
    display: block;

    width: 35%;
    height: auto;
  }
  #homeBody #coLearnLogo {
    margin-top: 0;
  }

  #homeBody #intro {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  #homeBody #intro #homeBody #intro #sessionButtons {
    flex-direction: column;
    margin-right: 0.5rem;
    width: 50%;
  }
}
</style>