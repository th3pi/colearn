<template>
  <div id="page" class="open-sans">
    <div>
      <slot name="logo" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "page"
};
</script>

<style lang="scss">
#logo {
  display: block;
  width: 20rem;
  height: auto;
  margin: 1rem auto;
}

#page {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 4rem;
}

@media screen and (min-width: 470px) {
  #page {
  }
}

@media screen and (min-width: 1250px) {
  #page {
    width: 1250px;
  }
}
</style>