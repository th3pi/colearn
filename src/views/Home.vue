<template>
  <div>
    <h1 @click="$router.push({name: 'sql-view'})">We are home!</h1>
  </div>
</template>

<script>
// import SqlView from "@/components/Views/Sql.vue";

export default {
  name: "home",
  components: {
    // SqlView
  }
};
</script>

<style lang="scss">
</style>