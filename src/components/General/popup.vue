<template>
  <transition name="fade-fast">
    <div id="popup" :class="{'neumorphic' : true, 'valid': valid}" v-if="focus" key="popup">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: "popup",
  props: {
    direction: String,
    valid: Boolean,
    focus: Boolean
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
#popup {
  z-index: 3;
  position: absolute;

  padding: 0.5rem 1rem;

  background-color: white;

  border-radius: 5px;
  border: 2px solid rgba(var(--sql-light-v), 1);

  font-size: 0.85rem;
  color: var(--sql-light-primary);

  transform: translate(4rem, -7.2rem);

  transition: opacity 0.3s, box-shadow 0.4s;
}

#popup.valid {
  border: 2px solid rgba(var(--light-success-v), 0.4) !important;

  box-shadow: 6px 6px 12px 2px rgba(var(--light-success-v), 0.1),
    -6px -6px 12px 2px rgba(var(--light-success-v), 0.1);

  color: var(--light-success);
}
@media only screen and (min-width: 470px) {
  #popup {
    font-size: 0.9rem;
    transform: translate(3.2rem, 3rem);
  }
}
@media only screen and (min-width: 1250px) {
  #popup {
    font-size: 1rem;
    transform: translate(3rem, 3rem);
  }
}
</style>