<template>
  <div id="app">
    <SqlView />
  </div>
</template>

<script>
import SqlView from "@/components/Views/Sql.vue";

export default {
  name: "App",
  components: { SqlView }
};
</script>

<style lang="scss">
@import "@/assets/styles/style.scss";
</style>
