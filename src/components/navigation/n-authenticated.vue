<template>
  <div id="rightNav">
    <a id="user" class="bold">Hello, {{user.details.firstName + ' ' + user.details.lastName}}</a>
    <a
      id="settings"
      @click="$router.push({name: 'home'})"
      class="neumorphic n-active"
      style="margin-right:1rem; cursor: pointer;"
    >
      <i class="fas fa-home"></i>
      Home
    </a>
    <dropdown class="right-nav">
      <a v-if="this.$mq != 'sm'" id="settings" class="neumorphic n-active">
        <i class="fas fa-cog"></i>Settings
      </a>
      <template id="dropdownContent" #content>
        <a
          class="neumorphic hover n-active"
          :style="{'background-color': bg.account, 'color': color.account + ' !important'}"
          @click="$router.push({name: 'account'})"
        >
          <i class="fas fa-user-circle"></i>Account
          <span :style="{'color': color.account + ' !important'}">Modify your account details</span>
        </a>
        <a
          class="neumorphic hover n-active"
          :style="{'background-color': bg.sessions, 'color': color.sessions + ' !important'}"
          @click="$router.push({name: 'sessions'})"
        >
          <i class="fas fa-history"></i>Sessions
          <span
            :style="{'color': color.sessions + ' !important'}"
          >Create, join or manage your sessions</span>
        </a>
        <a class="neumorphic hover n-active" @click="logout">
          <i class="fas fa-power-off"></i>Logout
        </a>
      </template>
    </dropdown>
  </div>
</template>

<script>
import firebase from "firebase";
import dropdown from "@/components/General/dropdown.vue";
import { mapGetters } from "vuex";

export default {
  name: "n-authenticated",
  components: { dropdown },
  data() {
    return {
      bg: {
        account: null,
        sessions: null
      },
      color: {
        sessions: null,
        account: null
      }
    };
  },
  computed: {
    ...mapGetters({ user: "user" })
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.dispatch("giveAccess", false);
          this.$store.dispatch("fetchUser", firebase.auth().currentUser);
        });
    }
  },
  watch: {
    $route(to) {
      if (to.name == "sessions") {
        this.bg.sessions = "var(--sql-light-primary)";
        this.bg.account = "white";
        this.color.account = "var(--sql-light-primary)";
        this.color.sessions = "white";
      }
      if (to.name == "account") {
        this.bg.account = "var(--sql-light-primary)";
        this.bg.sessions = "white";
        this.color.sessions = "var(--sql-light-primary)";
        this.color.account = "white";
      }
      if (to.name != "account" && to.name != "sessions") {
        this.bg.sessions = "white";
        this.bg.account = "white";
        this.color.account = "var(--sql-light-primary)";
        this.color.sessions = "var(--sql-light-primary)";
      }
    }
  }
};
</script>

<style lang="scss">
.dropdown {
  display: flex;
  justify-content: center;
  align-items: center;
}
#rightNav {
  margin-right: 2rem;
}
#rightNav #user {
  margin-right: 0.5rem;
}
#dropdown {
  margin-top: 0.5rem;
}

#settings {
  padding: 0.75rem;

  border-radius: 5px;
}

.dropdown-content {
  right: 6px;
  top: 2.9rem;
  width: 25rem;
  span {
    margin-left: 0.5rem;
    font-size: 0.85rem;

    color: var(--sql-lighter-dark);

    opacity: 0.8;
  }
  a:last-child {
    color: var(--danger) !important;
  }
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