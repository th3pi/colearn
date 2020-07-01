<template>
  <div id="rightNav">
    <transition name="fade-fast" mode="out-in">
      <a
        v-if="$route.name == 'home'"
        @click="$router.push({name: 'authenticate'})"
        id="signIn"
        class="button neumorphic n-active"
        key="fromHome"
      >
        <i class="fas fa-sign-in-alt"></i>
        Log In
      </a>
      <a
        v-if="$route.name == 'authenticate'"
        @click="$router.push({name: 'register'})"
        id="signIn"
        class="button neumorphic n-active"
        key="fromLogin"
      >
        <i class="fas fa-pencil-alt"></i>
        Sign up
      </a>
      <a
        v-if="$route.name == 'register'"
        @click="$router.push({name: 'authenticate'})"
        id="signIn"
        class="button neumorphic n-active"
        from="fromRegister"
      >
        <i class="fas fa-sign-in-alt"></i>
        Log In
      </a>
    </transition>
    <i id="more" class="fas fa-caret-down button neumorphic n-active"></i>
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
  background-color: var(--sql-light-primary);

  color: white;
}

#dropdown {
  margin-top: 0.5rem;
}
.dropdown-content a {
  color: var(--sql-light-primary) !important;
}
</style>