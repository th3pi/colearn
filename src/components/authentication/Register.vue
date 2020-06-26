<template>
  <div>
    <div id="registerBody">
      <div id="registerLogo">
        <register-logo class="logo" fill="var(--sql-light-primary)" />
      </div>
      <div id="regForm" class="flex center columns">
        <div id="field">
          <label
            for="name"
            :class="{'label' : true, 'label-go-top': (name.length > 0 || focus.name) ? true : false}"
          >Display name</label>
          <input
            v-model="name"
            id="nameField"
            name="name"
            type="name"
            :class="{'input':true, 'neumorphic': true, 'valid': validName.oneWord}"
            @focus="focus.name = true"
            @blur="focus.name = false"
            placeholder
            required
          />
        </div>

        <div id="field">
          <label
            for="email"
            :class="{'label' : true, 'label-go-top': (email.length > 0 || focus.email) ? true : false}"
          >Email or Phone</label>
          <input
            v-model="email"
            name="email"
            type="email"
            :class="{'input':true, 'neumorphic': true, 
            'bottom' : validEmail.fourChars, 
            'top':     validEmail.atSign, 
            'left' :   validEmail.beforeAtSign, 
            'right':   validEmail.domain,
            'valid' :  validEmail.valid}"
            @focus="focus.email = true"
            @blur="focus.email = false"
            placeholder
            required
          />
        </div>

        <div id="field">
          <transition name="fade-fast">
            <div
              id="requirementPopup"
              :class="{'neumorphic' : true, 'valid': validPassword.valid}"
              v-if="focus.password"
              key="popup"
            >
              <p>For your security, include at least:</p>
              <p :class="{'valid': validPassword.sixChars}">
                <transition name="scale-half-animation" mode="out-in">
                  <i class="fas fa-check" v-if="validPassword.sixChars" key="valid"></i>
                  <i class="fas fa-times" v-else key="invalid"></i>
                </transition>6 characters
              </p>
              <p :class="{'valid': validPassword.upperCase}">
                <transition name="scale-half-animation" mode="out-in">
                  <i class="fas fa-check" v-if="validPassword.upperCase" key="valid"></i>
                  <i class="fas fa-times" v-else key="invalid"></i>
                </transition>One uppercase letter
              </p>
              <p :class="{'valid': validPassword.lowerCase}">
                <transition name="scale-half-animation" mode="out-in">
                  <i class="fas fa-check" v-if="validPassword.lowerCase" key="valid"></i>
                  <i class="fas fa-times" v-else key="invalid"></i>
                </transition>One lowercase letter
              </p>
              <p :class="{'valid': validPassword.number}">
                <transition name="scale-half-animation" mode="out-in">
                  <i class="fas fa-check" v-if="validPassword.number" key="valid"></i>
                  <i class="fas fa-times" v-else key="invalid"></i>
                </transition>One numeric character
              </p>
            </div>
          </transition>

          <label
            for="password"
            :class="{'label' : true, 'label-go-top': (password.length > 0 || focus.password) ? true : false}"
          >Password</label>
          <input
            v-model="password"
            id="passwordBox"
            name="password"
            :type="peekPassword.peek ? 'text' : 'password'"
            :class="{'input':true, 'neumorphic': true, 
            'bottom' : validPassword.sixChars, 
            'top': validPassword.number, 
            'left' : validPassword.lowerCase, 
            'right': validPassword.upperCase,
            'valid' : validPassword.valid}"
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
          <p style="display: inline">Or register using,</p>
          <i @click="registerWithGoogle" class="fab fa-google neumorphic n-active"></i>
          <i @click="registerWithFacebook" class="fab fa-facebook-f neumorphic n-active"></i>
          <i @click="registerWithGithub" class="fab fa-github neumorphic n-active"></i>
          <i @click="registerWithApple" class="fab fa-apple neumorphic n-active"></i>
        </div>
        <div id="regButtons">
          <button
            class="neumorphic button"
            @click="registerWithEmail"
            :disabled="(!validName.oneWord || !validPassword.valid || !validEmail.valid)"
          >Create Account</button>
        </div>
        <div id="signIn" class="neumorphic inset">
          <a>
            Already registered?
            <span class="neumorphic n-active">Sign in!</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

import registerLogo from "@/assets/img/titles/register-logo.vue";

export default {
  name: "register",
  components: { "register-logo": registerLogo },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      error: null,
      focus: {
        name: false,
        email: false,
        password: false
      },
      validPassword: {
        sixChars: null,
        lowerCase: null,
        upperCase: null,
        number: null,
        valid: null
      },
      validEmail: {
        atSign: null,
        domain: null,
        beforeAtSign: null,
        fourChars: null,
        valid: null
      },
      validName: {
        twoWords: null
      },
      peekPassword: {
        peek: false
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
            data.user.sendEmailVerification().then(() => {});
          }
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    registerWithGoogle() {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(data => {
          data.user.updateProfile({
            displayName: this.name
          });
        })
        .catch(err => {
          this.error = err;
        });
    },
    registerWithFacebook() {
      let provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(data => {
          data.user.updateProfile({
            displayName: this.name
          });
        })
        .catch(err => {
          this.error = err;
        });
    },
    registerWithGithub() {
      let provider = new firebase.auth.GithubAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(data => {
          data.user.updateProfile({
            displayName: this.name
          });
        })
        .catch(err => {
          this.error = err;
        });
    },
    registerWithApple() {
      let provider = new firebase.auth.OAuthProvider("apple.com");
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(data => {
          data.user.updateProfile({
            displayName: this.name
          });
        })
        .catch(err => {
          this.error = err;
        });
    }
  },
  watch: {
    password(newValue) {
      if (newValue.match(/[0-9]+/)) {
        this.validPassword.number = true;
      } else {
        this.validPassword.number = false;
      }
      if (newValue.match(/[a-z]+/g)) {
        this.validPassword.lowerCase = true;
      } else {
        this.validPassword.lowerCase = false;
      }
      if (newValue.match(/[A-Z]+/g)) {
        this.validPassword.upperCase = true;
      } else {
        this.validPassword.upperCase = false;
      }
      if (newValue.length > 5) {
        this.validPassword.sixChars = true;
      } else {
        this.validPassword.sixChars = false;
      }
      if (newValue.length == 0) {
        this.validPassword = {
          sixChars: null,
          lowerCase: null,
          upperCase: null,
          number: null,
          valid: null
        };
      }
      if (
        this.validPassword.sixChars &&
        this.validPassword.lowerCase &&
        this.validPassword.upperCase &&
        this.validPassword.number
      ) {
        this.validPassword.valid = true;
      } else {
        this.validPassword.valid = false;
      }
    },
    email(newValue) {
      if (newValue.match(/^\b[\w.-]+/)) {
        this.validEmail.beforeAtSign = true;
        if (newValue.length > 3) {
          this.validEmail.fourChars = true;
          if (newValue.match(/@/)) {
            this.validEmail.atSign = true;
            if (newValue.match(/@[\w.-]+\.\w{2,4}\b/)) {
              this.validEmail.domain = true;
            } else {
              this.validEmail.domain = false;
            }
          } else {
            this.validEmail.atSign = false;
          }
        } else {
          this.validEmail.fourChars = false;
        }
      } else {
        this.validEmail.beforeAtSign = false;
      }

      if (newValue.length == 0) {
        this.validEmail = {
          atSign: null,
          domain: null,
          beforeAtSign: null,
          fourChars: null,
          valid: null
        };
      }
      if (
        this.validEmail.atSign &&
        this.validEmail.domain &&
        this.validEmail.beforeAtSign &&
        this.validEmail.fourChars
      ) {
        this.validEmail.valid = true;
      } else {
        this.validEmail.valid = false;
      }
    },
    name(newValue) {
      if (newValue.match(/([a-zA-Z]+\s?\b){2,4}/)) {
        this.validName.oneWord = true;
      } else {
        this.validName.oneWord = false;
      }
    }
  }
};
</script>

<style lang="scss">
#registerBody {
  margin-top: 30vh;
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

#regButtons button {
  margin-right: 0.5rem;

  padding: 0.5rem 0.5rem;

  background-color: var(--sql-light-primary);

  border: none;
  border-radius: 5px;
  outline: none;

  font-size: 0.8rem;
  color: white;

  transition: background-color 0.3s, box-shadow 0.4s,
    padding-left 0.4s ease-in-out, padding-right 0.4s ease-in-out;
}

#regButtons button:hover {
  background-color: rgba(var(--sql-primary-v), 1);
}

#regButtons .button:active {
  box-shadow: inset 3px 3px 12px 0 rgba(0, 0, 0, 0.2),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123);
}

#regButtons button:disabled {
  box-shadow: inset 3px 3px 12px 0 rgba(0, 0, 0, 0.2),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123);
  background-color: rgba(var(--sql-light-primary-v), 0.4);
  cursor: not-allowed;
}

#field {
  padding: 1rem 0;
}

.label {
  z-index: -1;
  position: absolute;

  font-size: 0.95rem;
  color: var(--g-secondary);

  cursor: text;

  transform: translateX(1rem);
  transition: transform 0.5s ease-in-out, color 0.4s;
}

.label-go-top {
  z-index: 1;
  color: var(--sql-light-primary);
  transform: translateY(-2rem);
}

.label-behind {
  z-index: -1;
}

#nameField.valid {
  border: 2px solid rgba(var(--light-success-v), 1) !important;
  box-shadow: 6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px -6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    6px -6px 12px 2px rgba(var(--light-success-v), 0.1);
}

#passwordBox:focus {
  border: 2px solid rgba(var(--sql-light-v), 1);
}

.peek {
  position: absolute;
  margin-left: -2.5rem;
  margin-top: 0.7rem;

  cursor: pointer;
}

#field input {
  transition: 0.4s;
}

#field input:focus {
  border: 2px solid rgba(var(--sql-light-v), 1);
}

.bottom {
  border-bottom: 2px solid rgba(var(--light-success-v), 1) !important;
}

.left {
  border-left: 2px solid rgba(var(--light-success-v), 1) !important;
}

.right {
  border-right: 2px solid rgba(var(--light-success-v), 1) !important;
}

.top {
  border-top: 2px solid rgba(var(--light-success-v), 1) !important;
}

input.valid {
  box-shadow: 6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px -6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    6px -6px 12px 2px rgba(var(--light-success-v), 0.1);
}

#field:hover input {
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.2),
    -2px -2px 6px 0 rgba(255, 255, 255, 0.5);
}

label {
  font-weight: 700;
}

label.valid {
  text-shadow: 3px 3px 10px rgba(var(--light-success-v), 0.2);

  color: var(--light-success);
}

i {
  width: 1.2rem;
}

input {
  z-index: 2;
}

p.valid {
  color: var(--light-success);
}

#regOptions {
  margin-bottom: 1rem;

  padding: 0.5rem 1rem;

  border-radius: 5px;

  color: var(--sql-light-primary);

  background-color: white;
}

#regOptions p {
  margin-right: 0.5rem;

  font-size: 0.9rem;

  text-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2),
    inset -2px -2px 5px rgba(255, 255, 255, 0.5);
}

#regOptions i {
  margin-right: 0.5rem;
  padding: 0.5rem;

  background-color: white;

  border-radius: 50%;

  cursor: pointer;

  text-align: center;
}

#regOptions i:last-child {
  margin-right: 0;
}

#requirementPopup {
  position: absolute;

  padding: 0.5rem 1rem;

  background-color: white;

  border-radius: 5px;
  border: 2px solid rgba(var(--sql-light-v), 1);

  font-size: 0.85rem;
  color: var(--sql-light-primary);

  transform: translate(4rem, 3rem);

  transition: opacity 0.3s, box-shadow 0.4s;
}

#requirementPopup.valid {
  border: 2px solid rgba(var(--light-success-v), 0.4) !important;

  box-shadow: 6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px -6px 12px 2px rgba(var(--light-success-v), 0.1);

  color: var(--light-success);
}

#signIn {
  margin-top: 0.5rem;

  padding: 0.4rem 1rem;

  border-radius: 5px;

  background-color: white;
}

#signIn a {
  font-size: 0.9rem;
  color: var(--sql-primary);
}

#signIn a span {
  padding: 0.2rem 0.6rem;

  border-radius: 5px;

  background-color: white;

  cursor: pointer;
}

#signIn a:hover {
}

@media only screen and (min-width: 470px) {
  #registerLogo .logo {
    width: 21rem;
  }
  #regButtons button {
    padding: 0.5rem 1.5rem;

    font-size: 0.95rem;
  }
  #requirementPopup {
    font-size: 0.9rem;

    transform: translate(3.2rem, 3rem);
  }
}

@media only screen and (min-width: 1250px) {
  #regButtons button {
    padding: 0.9rem 2.4rem;

    font-size: 1rem;
  }

  #registerLogo .logo {
    width: 22rem;
  }

  #requirementPopup {
    font-size: 1rem;

    transform: translate(3rem, 3rem);
  }
}
</style>