<template>
  <div>
    <div id="registerBody">
      <div id="coLearnLogo">
        <logo class="logo" fill="var(--sql-light-primary)" />
      </div>
      <div id="registerLogo">
        <register-logo class="logo" fill="var(--sql-light-primary)" />
      </div>
      <div id="form" class="flex center columns">
        <cl-input
          type="name"
          :validate="true"
          @name-validity="valid.name = $event"
          @name="name = $event"
        >Name</cl-input>
        <cl-input
          type="email"
          :validate="true"
          @email-validity="valid.email = $event"
          @email="email = $event"
        >Email</cl-input>
        <cl-input
          type="password"
          :validate="true"
          @password-validity="valid.password = $event"
          @password="password = $event"
        >Password</cl-input>
      </div>
      <thirdparty-auth>Or register using,</thirdparty-auth>
      <div id="authenticationButtons">
        <button
          class="neumorphic button"
          @click="registerWithEmail"
          :disabled="!valid.name || !valid.email || !valid.password"
        >Create Account</button>
      </div>
      <div id="alternate" class="neumorphic inset">
        <transition name="slide-in-right" mode="out-in">
          <a v-if="error.accountExists" class="error" key="accountExists">
            {{error.accountExists}}
            <span
              class="neumorphic n-active"
              @click="routeToAuthenticate"
            >Sign me in!</span>
          </a>
          <a v-else>
            Already registered?
            <span
              class="neumorphic n-active"
              @click="routeToAuthenticate"
            >Sign in!</span>
          </a>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

import logo from "@/assets/img/titles/co-learn-logo.vue";
import registerLogo from "@/assets/img/titles/register-logo.vue";

import thirdpartyAuth from "@/components/authentication/thirdparty-auth.vue";

import clInput from "@/components/General/cl-input.vue";

export default {
  name: "register",
  components: {
    logo,
    "register-logo": registerLogo,
    "thirdparty-auth": thirdpartyAuth,
    "cl-input": clInput
  },
  data() {
    return {
      valid: {
        name: false,
        email: false,
        password: false
      },
      name: "",
      email: "",
      password: "",
      error: {
        accountExists: null
      }
    };
  },
  methods: {
    registerWithEmail() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.name
            })
            .then(() => {});
          if (data.user && data.user.emailVerified == false) {
            data.user.sendEmailVerification().then(() => {
              this.$router.replace({ name: "home" });
            });
          }
        })
        .catch(err => {
          console.log(err.code);
          if (err.code.match(/email-already-in-use/i)) {
            this.error.accountExists = "You already have an account";
          }
        });
    },
    routeToAuthenticate() {
      this.$router.replace({ name: "authenticate" });
    }
  },
  watch: {}
};
</script>

<style lang="scss">
#registerBody {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#registerLogo .logo {
  display: block;
  width: 18rem;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
}

@media only screen and (min-width: 470px) {
  #registerLogo .logo {
    width: 21rem;
  }
}

@media only screen and (min-width: 1250px) {
  #registerLogo .logo {
    width: 22rem;
  }
}
</style>