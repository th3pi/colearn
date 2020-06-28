<template>
  <div id="app">
    <navigation />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import navigation from "@/components/navigation/navigation.vue";
export default {
  name: "App",
  components: { navigation }
};
</script>

<style lang="scss">
@import "@/assets/styles/style.scss";
@import "@/assets/styles/animations.scss";

body {
  margin: 0;
}
</style>
