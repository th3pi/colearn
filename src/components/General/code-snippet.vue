<template>
  <div id="snippetBody" class="techincal neumorphic">
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
  margin: 0.5rem 0;

  padding: 1rem 0.5rem;

  border: 2px solid rgba(var(--sql-light-primary-v), $alpha: 0.2);
  border-radius: 5px;

  color: var(--sql-lighter-dark);

  font-weight: 700;

  transition: border 0.5s;
}

#snippetBody:hover {
  border: 2px solid rgba(var(--sql-light-primary-v), $alpha: 0.9);
}

#snippetBody strong {
  cursor: pointer;

  color: var(--sql-light-primary);

  font-weight: 800;
}

#snippetBody strong:hover {
  text-decoration: underline;
}
</style>