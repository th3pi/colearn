<template>
  <div>
    <div id="authenticationBody">
      <div id="registerLogo">
        <register-logo class="logo" fill="var(--sql-light-primary)" />
      </div>
      <div id="regForm" class="flex center columns">
        <cl-input type="name" @name-validity="valid.name = $event" @name="name = $event">Name</cl-input>
        <cl-input type="email" @email-validity="valid.email = $event" @email="email = $event">Email</cl-input>
        <cl-input
          type="password"
          @password-validity="valid.password = $event"
          @password="password = $event"
        >Password</cl-input>
      </div>
      <thirdparty-auth msg="Or register using, " />
      <div id="authenticationButtons">
        <button
          class="neumorphic button"
          @click="registerWithEmail"
          :disabled="!valid.name || !valid.email || !valid.password"
        >Create Account</button>
      </div>
      <div id="alternate" class="neumorphic inset">
        <a>
          Already registered?
          <span
            class="neumorphic n-active"
            @click="$router.push({name: 'authenticate'})"
          >Sign in!</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

import registerLogo from "@/assets/img/titles/register-logo.vue";

import thirdpartyAuth from "@/components/authentication/thirdparty-auth.vue";

import clInput from "@/components/General/cl-input.vue";

export default {
  name: "register",
  components: {
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
      password: ""
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
    }
  },
  watch: {}
};
</script>

<style lang="scss">
input.valid {
  box-shadow: 6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px -6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    6px -6px 12px 2px rgba(var(--light-success-v), 0.1);
}
label.valid {
  text-shadow: 3px 3px 10px rgba(var(--light-success-v), 0.2);

  color: var(--light-success);
}
p.valid {
  color: var(--light-success);
}
#authenticationBody {
  margin-top: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#nameField.valid {
  border: 2px solid rgba(var(--light-success-v), 1) !important;
  box-shadow: 6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px -6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    6px -6px 12px 2px rgba(var(--light-success-v), 0.1);
}

#registerLogo .logo {
  display: block;
  width: 18rem;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
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

@media only screen and (min-width: 470px) {
  #registerLogo .logo {
    width: 21rem;
  }
  #requirementPopup {
    font-size: 0.9rem;

    transform: translate(3.2rem, 3rem);
  }
}

@media only screen and (min-width: 1250px) {
  #registerLogo .logo {
    width: 22rem;
  }

  #requirementPopup {
    font-size: 1rem;

    transform: translate(3rem, 3rem);
  }
}
</style>