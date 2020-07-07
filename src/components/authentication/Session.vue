<template>
  <div id="sessionAuthBody" class="center-body open-sans" @keyup.enter="validate">
    <logo class="logo" fill="var(--sql-light-primary)" />
    <h3>Enter session pin to join</h3>
    <clInput ref="input" :validate="false" class="code-input" type="name">Pin</clInput>
    <button
      class="button neumorphic n-active hover open-sans"
      :style="{'background-color': invalid ? 'var(--danger-lighter)' : ''}"
      :duration="200"
      @click="validate"
    >
      <div v-if="validateProgress == 0">Join</div>
      <div v-else>
        <vue-ellipse-progress
          emptyColor="white"
          :color="!invalid ? 'var(--sql-primary)' : 'var(--danger)'"
          :legend="false"
          :size="20"
          mode="in-over"
          :progress="validateProgress"
          animation="default 500 100"
        />
      </div>
    </button>
  </div>
</template>

<script>
import logo from "@/assets/img/titles/co-learn-logo.vue";
import clInput from "@/components/General/cl-input.vue";

import firebaseENUM from "@/enums/firebase_enum";

import { mapGetters } from "vuex";
export default {
  name: "beta",
  created() {
    document.title = "Join - " + this.$route.params.sessionId;
  },
  components: {
    clInput,
    logo
  },
  beforeRouteEnter(to, from, next) {
    if (to && from) {
      next(vm => {
        if (!vm.user.authenticated) next({ name: "authenticate" });
      });
    }
  },
  computed: {
    ...mapGetters({ user: "user" })
  },
  data() {
    return {
      loadSate: firebaseENUM.INIT,
      sessionLoadState: firebaseENUM.INIT,
      pin: "",
      invalid: false,
      validateProgress: 0,
      focus: false,
      request: {
        text: "Request Access",
        requested: false,
        validEmail: false
      }
    };
  },
  methods: {
    validate() {
      this.loadSate = firebaseENUM.LOADING;
      this.pin = this.$refs.input.getInput();
      if (this.pin == "") {
        this.loadSate = firebaseENUM.ERROR;
        return (this.invalid = true);
      }
      console.log({
        email: this.user.data.email,
        sessionId: this.$route.params.sessionId,
        pin: this.pin,
        name: this.user.data.displayName
      });

      this.$http
        .post("/session/sql/join-session", {
          email: this.user.data.email,
          sessionId: this.$route.params.sessionId,
          pin: this.pin,
          name: this.user.data.displayName
        })
        .then(res => {
          if (res.data) {
            this.loadSate = firebaseENUM.LOADED;
            setTimeout(() => {
              this.$router.replace({
                name: "learn-sql",
                params: { sessionId: this.$route.params.sessionId }
              });
            }, 500);
          } else {
            this.loadSate = firebaseENUM.ERROR;
            this.invalid = true;
          }
        });
    }
  },
  watch: {
    loadSate(newValue) {
      switch (newValue) {
        case firebaseENUM.INIT:
          this.validateProgress = 0;
          break;
        case firebaseENUM.LOADING:
          this.validateProgress = 65;
          break;
        case firebaseENUM.LOADED:
          this.validateProgress = 100;
          break;
        case firebaseENUM.ERROR:
          this.validateProgress = 0;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.center-body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 85vmin;
}

.center-items {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#sessionAuthBody .code-input input {
  text-align: center;
  font-family: "Share Tech Mono", monospace;
  font-weight: 400;
  letter-spacing: 10px;
}

#sessionAuthBody h3,
h4 {
  color: var(--sql-primary);
  text-align: center;
}

#sessionAuthBody .logo {
  width: 25rem;
  height: auto;
}

#sessionAuthBody .code-input {
  margin-top: 1rem;
}

#sessionAuthBody button {
  width: 8rem;
  height: 2.5rem;

  padding: 0.5rem 1rem;
  background-color: var(--sql-light-primary);

  border-radius: 5px;
  border: none;
  outline: none;

  font-size: 1rem;
  color: white;
}

#sessionAuthBody button:active {
  border: none;
}

#sessionAuthBody #requestAccess {
  position: absolute;
  width: 15rem;
  bottom: 1rem;
}

#sessionAuthBody #requestAccess h3 {
  margin: 0.5rem 0;
}

#sessionAuthBody #requestAccess i {
  transform: scale(0.9);
  margin-right: 0rem;
}

#sessionAuthBody #requestAccess p {
  margin: 0;
  text-decoration: none;
  text-align: center;

  color: var(--g-primary);

  cursor: pointer;
}

#sessionAuthBody #requestAccess .notreq-position {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: translate(-6rem, -11.5rem);
}

#sessionAuthBody .notreq-position button {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 12rem;
}

#sessionAuthBody .req-position {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: translate(-4.7rem, -12.3rem);
  width: 21rem;
}
#sessionAuthBody .req-position i {
  margin-right: 0.3rem !important;
}

#sessionAuthBody .req-position p {
  margin-bottom: 0.5rem !important;
}

#sessionAuthBody .req-position button {
  display: block;
  margin-left: auto;
  margin-right: auto;
  background-color: var(--light-success);
}
</style>
