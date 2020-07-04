<template>
  <div id="rightNav">
    <a id="user" class="bold">Hello, {{user.details.firstName}}</a>
    <div id="dropdown">
      <dropdown>
        <a v-if="this.$mq != 'sm'" id="settings" class="button neumorphic n-active">Settings</a>
        <template id="dropdownContent" #content>
          <a>Account</a>
          <a>Sessions</a>
          <a @click="logout">Logout</a>
        </template>
      </dropdown>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import dropdown from "@/components/General/dropdown.vue";

export default {
  name: "n-authenticated",
  components: { dropdown },

  props: {
    user: Object
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.sessionStorage.clear();
          this.$store.dispatch("giveAccess", false);
        });
    }
  }
};
</script>

<style lang="scss">
#rightNav #user {
  margin-right: 0.5rem;
}
#dropdown {
  margin-top: 0.5rem;
}
.dropdown-content a {
  color: var(--sql-light-primary) !important;
}
@media only screen and (min-width: 470px) {
  #rightNav #user {
    margin-right: 1rem;
  }
  #rightNav .button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
  }
}
</style>