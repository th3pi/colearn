<template>
  <div class="open-sans">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "authentication"
};
</script>

<style lang="scss">
input {
  margin: 0 1rem;
  padding: 10px 5px 10px 1rem;

  width: 20rem;
  border: 2px solid rgba(var(--sql-light-v), 0);
  border-bottom: 2px solid rgba(var(--sql-light-v), 1);
  border-radius: 5px;

  background-color: transparent;

  outline: none;

  font-size: 1rem;

  transition: border 0.4s, box-shadow 0.5s;
}

label {
  margin: 0.5rem 1rem 0.1rem 1rem;
}
</style>