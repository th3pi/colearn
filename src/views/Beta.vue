<template>
  <div id="betaBody" class="center-body open-sans" @keyup.enter="validate">
    <logo class="logo" fill="var(--sql-light-primary)" />
    <h3>Under construction! If you have a beta code, please enter below</h3>
    <clInput ref="input" :validate="false" class="code-input" type="name">Beta code</clInput>
    <transition name="fade" mode="out-in">
      <button
        class="button neumorphic n-active hover open-sans"
        :style="{
          'background-color':
            invalid || tooManyValid ? 'var(--danger-lighter)' : '',
        }"
        :duration="200"
        @click="validate"
        v-if="!tooManyValid"
        key="valid"
      >
        <div v-if="validateProgress == 0">
          <i class="fas" :class="{ 'fa-unlock': !invalid, 'fa-lock': invalid }"></i>
          Validate
        </div>
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
      <div id="tooManyValid" v-else-if="tooManyValid" key="invalid">
        <div class="message">
          <i class="fas fa-ban"></i> Too many frequent attempts
        </div>
        <p>Please try again later</p>
      </div>
    </transition>

    <!-- Request access popup -->
    <div id="requestAccess">
      <transition name="fade" mode="out-in">
        <!-- Request access form -->
        <popup v-if="!request.requested" :focus="focus" class="notreq-position" key="notRequested">
          <h3>Let's get your beta access set up!</h3>
          <clInput
            ref="requestInput"
            :validate="true"
            class="cl-input"
            type="email"
            @email-validity="request.validEmail = $event"
          >Email</clInput>
          <button
            class="button neumorphic n-active hover open-sans"
            @click="sendRequest"
            :disabled="!request.validEmail"
          >
            <i class="fas fa-plus"></i>
            {{ request.text }}
          </button>
        </popup>
        <!-- Request access form confirmation -->
        <popup v-else-if="tooManyRequest" :focus="focus" class="req-position" key="requested">
          <h3 style="font-size: 1.05rem">Looks like you're already on the list!</h3>
          <p>
            We took a note of your eagerness and bumped you up on the list, get
            ready to
            <strong>Colearn</strong>
          </p>
          <button @click="focus = false">
            <i class="fa fa-check" aria-hidden="true"></i>Done
          </button>
        </popup>
        <!-- Request access form confirmation -->
        <popup v-else :focus="focus" class="req-position" key="requested">
          <h3>Almost there!</h3>
          <p>
            Thank you for your interest! Participants are selected randomly - in
            the coming weeks you may receive an email with the beta access code
            and instructions on how get started with
            <strong>Colearn</strong>
          </p>
          <button @click="focus = false">
            <i class="fa fa-check" aria-hidden="true"></i>Done
          </button>
        </popup>
      </transition>
      <div>
        <p v-if="!focus" key="noFocus" style="cursor: not-allowed;">
          <i class="fas fa-times-circle"></i> Colearn is not accepting any more beta testers
        </p>
        <p v-else key="focused" style="color: var(--danger)">
          <i class="fas fa-times"></i> Close
        </p>
      </div>
      <!-- <div @click="focus = focus ? false : true">
        <p v-if="!focus" key="noFocus">
          <i class="fas fa-plus-circle"></i> Click here to request access
        </p>
        <p v-else key="focused" style="color: var(--danger)">
          <i class="fas fa-times"></i> Close
        </p>
      </div>-->
    </div>
  </div>
</template>

<script>
/**
 * Beta landing page
 */
import logo from "@/assets/img/titles/co-learn-logo.vue";
import clInput from "@/components/General/cl-input.vue";
import popup from "@/components/General/popup.vue";

import firebaseENUM from "@/enums/firebase_enum";

import loader from "@/mixins/loader";
export default {
  name: "beta",
  mixins: [loader],
  created() {
    document.title = "Colearn is in beta!";
  },

  components: {
    clInput,
    logo,
    popup,
  },
  data() {
    return {
      loadSate: firebaseENUM.INIT,
      code: "",
      invalid: false,
      validateProgress: 0, //Progress counter for validate button
      requestProgress: 0, //Progress counter for request button
      focus: false, //Focus boolean for Request form
      request: {
        // Request form variables
        text: "Request Access",
        requested: false,
        validEmail: false,
      },
      tooManyValid: false, //Boolean to determine if backend reports this ip had requested too many validations
      tooManyRequest: false, //Boolean to determine if backend reports this ip had requested too many access codes
    };
  },
  methods: {
    /**
     * Validates user input beta code
     */
    validate() {
      this.loadSate = firebaseENUM.LOADING;
      this.code = this.$refs.input.getInput();
      if (this.code == "") {
        this.loadSate = firebaseENUM.ERROR;
        return (this.invalid = true);
      }
      this.$http
        .get("/beta/validate-beta", { params: { code: this.code } })
        .then((res) => {
          if (res.data) {
            this.loadSate = firebaseENUM.LOADED;
            setTimeout(() => {
              this.$router.replace({ name: "home" });
              this.$store.dispatch("giveAccess", true);
            }, 500);
          } else {
            this.loadSate = firebaseENUM.ERROR;
            this.invalid = true;
          }
        })
        .catch(() => {
          this.loadSate = firebaseENUM.ERROR;
          this.tooManyValid = true;
        });
    },

    /**
     * Send user email to database and reports to backend to generate a beta code for the user
     */
    sendRequest() {
      this.requestProgress = 45;
      this.request.text = "Requesting...";
      let email = this.$refs.requestInput.getEmail();
      this.$http
        .post("/beta/generate-beta", { email: email })
        .then(() => {
          this.requestProgress = 100;
          this.request.requested = true;
        })
        .catch(() => {
          this.tooManyRequest = true;
          this.requestProgress = 100;
          this.request.requested = true;
        });
    },
  },
  watch: {
    loadSate(newValue) {
      this.validateProgress = this.getProgress(newValue);
    },
  },
};
</script>

<style lang="scss">
#betaBody {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 85vh;
}
.center-items {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#betaBody .code-input input {
  text-align: center;
  font-family: "Share Tech Mono", monospace;
  font-weight: 400;
  letter-spacing: 10px;
}

#betaBody h3,
h4 {
  color: var(--sql-primary);
  text-align: center;
}

#betaBody .logo {
  width: 25rem;
  height: auto;
}

#betaBody .code-input {
  margin-top: 1rem;
}

#betaBody button {
  width: 8rem;
  height: 2.5rem;

  padding: 0.5rem 1rem;
  background-color: var(--sql-light-primary);

  border-radius: 5px;
  border: none;
  outline: none;

  font-size: 1rem;
  color: white;

  transition: background-color 0.4s;
}

#betaBody button:active {
  border: none;
}

#betaBody #tooManyValid .message {
  padding: 0.5rem 1rem;
  margin-bottom: 0.2rem;

  border-radius: 5px;

  background-color: var(--danger-lighter);

  color: white;

  box-shadow: inset 4px 4px 8px rgba($color: #000000, $alpha: 0.2),
    inset -4px 4px 8px rgba($color: #000000, $alpha: 0.2);
}

#betaBody #tooManyValid p {
  font-size: 0.95rem;
  color: var(--g-primary);
  text-align: center;
}

#betaBody #requestAccess {
  position: absolute;
  width: 15rem;
  height: auto;
  bottom: 2rem;
}

#betaBody #requestAccess h3 {
  margin: 0.5rem 0;
}

#betaBody #requestAccess i {
  transform: scale(0.9);
  margin-right: 0rem;
}

#betaBody #requestAccess p {
  margin: 0;
  text-decoration: none;
  text-align: center;

  color: var(--g-primary);

  cursor: pointer;
}

#betaBody #requestAccess .notreq-position {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: translate(-5.4rem, -11.5rem);
}

#betaBody .notreq-position button {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 12rem;
}

#betaBody .req-position {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transform: translate(-4rem, -12.3rem);
  width: 21rem;
}
#betaBody .req-position i {
  margin-right: 0.3rem !important;
}

#betaBody .req-position p {
  margin-bottom: 0.5rem !important;
}

#betaBody .req-position button {
  display: block;
  margin-left: auto;
  margin-right: auto;
  background-color: var(--light-success);
}

@media screen and (max-width: 480px) {
  #betaBody .logo {
    width: 18rem;
  }

  #betaBody h3 {
    font-size: 1.1rem;
  }
}
</style>
