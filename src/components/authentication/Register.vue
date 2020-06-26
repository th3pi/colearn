<template>
  <div>
    <div id="registerBody">
      <div id="registerLogo">
        <register-logo class="logo" fill="#0780e3" />
      </div>
      <div id="regForm" class="flex center columns bold">
        <div id="field">
          <label
            for="name"
            :class="{'label' : true, 'label-right': (name.length > 0 || focus.name) ? true : false}"
          >Name</label>
          <input
            v-model="name"
            name="name"
            type="name"
            class="input neumorphic"
            @focus="focus.name = true"
            @blur="focus.name = false"
            placeholder
            required
          />
        </div>

        <div id="field">
          <label
            for="email"
            :class="{'label' : true, 'label-right': (email.length > 0 || focus.email) ? true : false}"
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
            :class="{'label' : true, 'label-right': (password.length > 0 || focus.password) ? true : false, 'valid' : validPassword.valid}"
          >Password</label>
          <input
            v-model="password"
            id="passwordBox"
            name="password"
            type="password"
            :class="{'input':true, 'neumorphic': true, 
            'password-bottom' : validPassword.sixChars, 
            'password-top': validPassword.number, 
            'password-left' : validPassword.lowerCase, 
            'password-right': validPassword.upperCase,
            'valid' : validPassword.valid}"
            @focus="focus.password = true"
            @blur="focus.password = false"
            placeholder
            required
          />
        </div>
        <div id="regButtons">
          <button class="neumorphic button">Submit</button>
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
      }
    };
  },
  methods: {
    submit() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.name
            })
            .then(() => {});
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  },
  watch: {
    password(newValue) {
      if (newValue.match(/[0-9]+/)) {
        console.log("FOUND NUMBER");

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
    }
  }
};
</script>

<style lang="scss">
#registerBody {
  position: absolute;
  left: 0;
  top: 25%;
}

#registerLogo .logo {
  display: block;

  width: 35%;
  height: auto;
  margin: auto;
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

.label-right {
  color: var(--sql-light-primary);
  transform: translateX(22rem);
}

.label-behind {
  z-index: -1;
}

#passwordBox:focus {
  border: 2px solid rgba(var(--sql-light-v), 1);
}

.password-bottom {
  border-bottom: 2px solid rgba(var(--light-success-v), 1) !important;
}

.password-left {
  border-left: 2px solid rgba(var(--light-success-v), 1) !important;
}

.password-right {
  border-right: 2px solid rgba(var(--light-success-v), 1) !important;
}

.password-top {
  border-top: 2px solid rgba(var(--light-success-v), 1) !important;
}

input.valid {
  box-shadow: 6px 6px 12px 2px rgba(var(--light-success-v), 0.5),
    -6px -6px 12px 2px rgba(var(--light-success-v), 0.3),
    -6px 6px 12px 2px rgba(var(--light-success-v), 0.3),
    6px -6px 12px 2px rgba(var(--light-success-v), 0.3);
}

label.valid {
  color: var(--light-success);
}

@media only screen and (min-width: 470px) {
  #regButtons button {
    padding: 0.5rem 1.5rem;

    font-size: 0.95rem;
  }
}

@media only screen and (min-width: 1250px) {
  #regButtons button {
    padding: 0.9rem 2.4rem;

    font-size: 1rem;
  }
}
</style>