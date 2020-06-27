<template>
  <div id="regOptions" class="neumorphic inset">
    <p style="display: inline">{{msg}}</p>
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