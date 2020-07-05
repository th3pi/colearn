<template>
  <div id="notFoundBody" class="open-sans">
    <verifiedLogo fill="var(--sql-light-primary)" id="logo" />
    <h3>You're all set!</h3>
    <a
      class="neumorphic hover n-active"
      @click="$router.replace({name:'home', query: {verified: true}})"
    >
      <i class="fas fa-arrow-left"></i>Go Home
    </a>
  </div>
</template>
<script>
import verifiedLogo from "@/assets/img/titles/verified-logo.vue";
import firebase from "firebase";
export default {
  name: "Verified",
  components: {
    verifiedLogo
  },
  created() {
    firebase
      .auth()
      .applyActionCode(this.$route.query.oobCode)
      .then(() => {
        this.$store.dispatch("setVerified", true);
        this.$store.dispatch("fetchUser", firebase.auth().currentUser);
      });
  }
};
</script>

<style lang="scss">
#notFoundBody {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 85vmin;
}

#notFoundBody #logo {
  width: 35rem;
  height: auto;
}

#notFoundBody h3 {
  color: var(--sql-light-primary);
}

#notFoundBody a {
  margin-top: 1rem;

  padding: 0.75rem 1.25rem;

  border-radius: 5px;

  color: var(--sql-light-primary);
  font-weight: 700;
  cursor: pointer;
}

@media screen and (max-width: 470px) {
  #notFoundBody {
    margin-top: 10rem;
    height: auto;
  }
}
</style>