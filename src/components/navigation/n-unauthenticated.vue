<template>
  <div id="rightNav">
    <a @click="$router.push({name: 'home'})" style="margin-right: 1rem; cursor:pointer;">
      <i class="fas fa-home"></i>
      Home
    </a>
    <transition name="fade-fast" mode="out-in">
      <a
        v-if="$route.name == 'home'"
        @click="$router.push({name: 'authenticate'})"
        id="signIn"
        key="fromHome"
      >
        <i class="fas fa-sign-in-alt"></i>
        Log In
      </a>
      <a
        v-if="$route.name == 'authenticate'"
        @click="$router.push({name: 'register'})"
        id="signIn"
        key="fromLogin"
      >
        <i class="fas fa-pencil-alt"></i>
        Sign up
      </a>
      <a
        v-if="$route.name == 'register'"
        @click="$router.push({name: 'authenticate'})"
        id="signIn"
        from="fromRegister"
      >
        <i class="fas fa-sign-in-alt"></i>
        Log In
      </a>
    </transition>
    <!-- <i v-if="this.$mq != 'sm'" id="more" class="fas fa-caret-down button neumorphic n-active"></i> -->
  </div>
</template>

<script>
export default {
  name: "n-unauthenticated",
  methods: {}
};
</script>

<style lang="scss">
#more {
  background-color: var(--sql-light-primary);

  margin-right: 0;

  font-size: 1.4rem;
  color: white;
}
#signIn {
  box-shadow: none;

  margin-right: 1rem;
  color: var(--sql-light-primary);

  cursor: pointer;
}

#dropdown {
  margin-top: 0.5rem;
}
.dropdown-content a {
  color: var(--sql-light-primary) !important;
}

@media screen and (max-width: 470px) {
  #signIn {
    background-color: transparent;
    color: var(--sql-light-primary);
    box-shadow: none;
    font-weight: 700;
    text-shadow: 6px 6px 12pxrgba (0, 0, 0, 0.2),
      -6px -6px 12px rgba(255, 255, 255, 0.5);
  }
}
</style>