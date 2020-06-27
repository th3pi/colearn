<template>
  <div id="authOptions" class="neumorphic inset">
    <p style="display: inline">
      <slot />
    </p>
    <i @click="registerWithGoogle" class="fab fa-google neumorphic n-active"></i>
    <i @click="registerWithFacebook" class="fab fa-facebook-f neumorphic n-active"></i>
    <i @click="registerWithGithub" class="fab fa-github neumorphic n-active"></i>
    <i @click="registerWithApple" class="fab fa-apple neumorphic n-active"></i>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "thirdparty-auth",
  props: {
    msg: String
  },
  methods: {
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
          this.$emit("error", err.message);
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
          this.$emit("error", err.message);
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
          this.$emit("error", err.message);
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
          this.$emit("error", err.message);
        });
    }
  }
};
</script>

<style lang="scss">
#authOptions {
  margin-bottom: 1rem;

  padding: 0.5rem 1rem;

  border-radius: 5px;

  color: var(--sql-light-primary);

  background-color: white;
}

#authOptions p {
  margin-right: 0.5rem;

  font-size: 0.9rem;

  text-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2),
    inset -2px -2px 5px rgba(255, 255, 255, 0.5);
}

#authOptions i {
  margin-right: 0.5rem;
  padding: 0.5rem;

  width: 1.2rem;

  background-color: white;

  border-radius: 50%;

  cursor: pointer;

  text-align: center;
}

#authOptions i:last-child {
  margin-right: 0;
}
</style>