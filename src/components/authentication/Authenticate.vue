<template>
  <div>
    <div id="authenticateBody" @keyup.enter="signInUsingEmail">
      <!-- Logo -->
      <div id="coLearnLogo">
        <logo class="logo" fill="var(--sql-light-primary)" />
      </div>
      <div id="authLogo">
        <authenticate-logo class="logo" fill="var(--sql-light-primary)" />
      </div>

      <!-- Input form -->
      <div id="form" class="flex center columns">
        <!-- Email input -->
        <cl-input
          type="email"
          :validate="false"
          @email="email = $event"
          :tabindex="1"
          :autofocus="true"
        >Email</cl-input>

        <!-- Password input -->
        <cl-input
          type="password"
          :validate="false"
          @password="password = $event"
          :tabindex="2"
        >Password</cl-input>

        <!-- Thirdparty authentication options -->
        <thirdparty-auth method="sign-in">Or sign in using,</thirdparty-auth>

        <!-- Submit button -->
        <div id="authenticationButtons">
          <button class="neumorphic n-active bold button" @click="signInUsingEmail">Authenticate</button>
        </div>

        <!-- Swap to registraion form -->
        <div id="alternate" class="neumorphic inset">
          <transition name="slide-in-right" mode="out-in">
            <a v-if="error.noAccount" class="error" key="noAccount">
              {{error.noAccount}}
              <span
                class="neumorphic n-active"
                @click="routeToRegister"
              >Get an account?</span>
            </a>
            <a v-else-if="error.incorrect" class="error" key="incorrect">
              {{error.incorrect}}
              <span
                class="neumorphic n-active"
                @click="routeToRegister"
              >Try resetting?</span>
            </a>
            <a v-else-if="error.badEmail" class="error" key="badEmail">
              {{error.badEmail}}
              <span
                class="neumorphic n-active"
                @click="routeToRegister"
              >Get an account?</span>
            </a>
            <a v-else key="noError">
              Not registered?
              <span
                class="neumorphic n-active"
                @click="routeToRegister"
              >Create an account!</span>
            </a>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Component name: authenticate
 * Usage: Login users
 * @prop {String} email Holds user email
 * @prop {String} password Holds user password
 * @prop {String} error Holds the authentication error message
 */

import firebase from "firebase";

import logo from "@/assets/img/titles/co-learn-logo.vue";
import authenticateLogo from "@/assets/img/titles/authenticate-logo.vue";
import thirdpartyAuth from "@/components/authentication/thirdparty-auth.vue";
import clInput from "@/components/General/cl-input.vue";

export default {
  name: "authenticate",
  components: {
    "authenticate-logo": authenticateLogo,
    logo,
    "cl-input": clInput,
    "thirdparty-auth": thirdpartyAuth
  },
  data() {
    return {
      email: "",
      password: "",
      error: {
        noAccount: null,
        incorrect: null,
        badEmail: null,
        badPassword: null
      }
    };
  },
  methods: {
    //Sign in method using email
    //Third party authentications are handled by the thirdparty authentication component
    signInUsingEmail() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.replace({ name: "home" });
        })
        .catch(err => {
          console.log(err.code);

          if (err.code.match(/user-not-found/i)) {
            this.error.noAccount = "Sorry you're not in our records!";
          }
          if (err.code.match(/wrong-password/i)) {
            this.error.incorrect = "Incorrect email or password.";
          }
          if (err.code.match(/invalid-email/i)) {
            this.error.badEmail = "That email doesn't look right.";
          }
        });
    },

    //Navigation method for swapping to registration form
    routeToRegister() {
      this.$router.replace({ name: "register" });
    }
  },
  watch: {}
};
</script>

<style lang="scss">
#authLogo .logo {
  display: block;
  width: 20rem;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
}

#authenticateBody {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
@media screen and (min-height: 800px) {
  #authenticationBody {
    margin-top: 25vh;
  }
}

@media only screen and (min-width: 470px) {
  #authLogo .logo {
    width: 26rem;
  }
  #authenticationButtons button {
    padding: 0.5rem 1.5rem;

    font-size: 0.95rem;
  }
}

@media only screen and (min-width: 1250px) {
  #authLogo .logo {
    width: 28rem;
  }
  #authenticationButtons button {
    padding: 0.9rem 2.4rem;

    font-size: 1rem;
  }
}
</style>