<template>
  <div id="snippetBody" class="techincal">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "code-snipper",
  props: {
    language: String
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
  watch: {}
};
</script>

<style lang="scss">
#snippetBody {
  margin: 0.2rem 0;

  padding: 0.2rem 0.5rem;

  background-color: var(--dark);

  border: 2px solid rgba($color: #524c40, $alpha: 1);
  border-radius: 5px;

  color: var(--sql-primary);
}

#snippetBody strong {
  color: #ff5e5e;
}
</style>