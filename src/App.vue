<template>
  <div id="app">
    <navigation />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <cl-footer />
  </div>
</template>

<script>
import navigation from "@/components/navigation/navigation.vue";
import footer from "@/components/footer/footer.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: { navigation, "cl-footer": footer },
  computed: {
    ...mapGetters({ user: "user" }),
  },
  created() {
    console.log(this.user.beta);
    if (!this.user.beta || !this.user) {
      this.$router.replace({ name: "beta" });
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/style.scss";
@import "@/assets/styles/animations.scss";

html,
body {
  margin: 0;
  height: 100vh;
}
</style>
