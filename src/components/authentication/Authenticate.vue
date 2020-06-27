<template>
  <div>
    <div id="authenticationBody">
      <div id="authLogo">
        <authenticate-logo class="logo" fill="var(--sql-light-primary)" />
      </div>
      <div id="regForm" class="flex center columns">
        <div id="field">
          <label
            for="email"
            :class="{'label' : true, 'label-go-top': (email.length > 0 || focus.email) ? true : false}"
          >Email or Phone</label>
          <input
            v-model="email"
            name="email"
            type="email"
            class="input neumorphic"
            @focus="focus.email = true"
            @blur="focus.email = false"
            placeholder
            required
          />
        </div>

        <div id="field">
          <label
            for="password"
            :class="{'label' : true, 'label-go-top': (password.length > 0 || focus.password) ? true : false}"
          >Password</label>
          <input
            v-model="password"
            id="passwordBox"
            name="password"
            :type="peekPassword.peek ? 'text' : 'password'"
            class="input neumorphic"
            @focus="focus.password = true"
            @blur="focus.password = false"
            placeholder
            required
          />
          <transition name="scale-up-ver-center" mode="out-in">
            <i
              @click="peekPassword.peek = false"
              v-if="peekPassword.peek"
              class="fas fa-circle peek"
              key="peek"
            ></i>
            <i v-else @click="peekPassword.peek = true" class="far fa-circle peek" key="dont-peek"></i>
          </transition>
        </div>
        <div id="regOptions" class="neumorphic inset">
          <p style="display: inline">Or authenticate using,</p>
          <!-- <i @click="registerWithGoogle" class="fab fa-google neumorphic n-active"></i>
          <i @click="registerWithFacebook" class="fab fa-facebook-f neumorphic n-active"></i>
          <i @click="registerWithGithub" class="fab fa-github neumorphic n-active"></i>
          <i @click="registerWithApple" class="fab fa-apple neumorphic n-active"></i>-->
        </div>
        <div id="authenticationButtons">
          <button class="neumorphic button" @click="signInUsingEmail">Authenticate</button>
        </div>
        <div id="alternate" class="neumorphic inset">
          <a>
            Not registered?
            <span
              class="neumorphic n-active"
              @click="$router.push({name: 'register'})"
            >Register!</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

import authenticateLogo from "@/assets/img/titles/authenticate-logo.vue";

export default {
  name: "authenticate",
  components: { "authenticate-logo": authenticateLogo },
  data() {
    return {
      email: "",
      password: "",
      error: null,
      focus: {
        email: false,
        password: false
      },
      peekPassword: {
        peek: false
      }
    };
  },
  methods: {
    signInUsingEmail() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          this.error = err;
        });
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
  #authenticationButtons button {
    padding: 0.9rem 2.4rem;

    font-size: 1rem;
  }

  #authLogo .logo {
    width: 28rem;
  }
}
</style>