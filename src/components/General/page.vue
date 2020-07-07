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
  margin: 0 auto;
  margin-top: 0;
}

#page {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5.5rem;
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