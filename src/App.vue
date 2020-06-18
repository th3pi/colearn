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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
