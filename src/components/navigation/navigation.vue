<template>
  <div>
    <div id="navBar" class="open-sans">
      <li>
        <a>
          <clLogo v-if="this.$mq != 'sm'" class="logo" fill="var(--sql-light-primary)" />
          <i v-else class="fas fa-bars logo"></i>
        </a>
        <transition name="fade" mode="out-in">
          <div v-if="user.authenticated" id="profile" key="loggedIn">
            <a id="user" class="bold">Hello, {{user.details.firstName}}</a>
            <div id="dropdown">
              <dropdown>
                <a id="settings" class="button neumorphic n-active">Settings</a>
                <template id="dropdownContent" #content>
                  <a>Account</a>
                  <a>Sessions</a>
                  <a @click="logout">Logout</a>
                </template>
              </dropdown>
            </div>
          </div>
          <div id="profile" v-else key="loggedOut">
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
        </transition>
      </li>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

import clLogo from "@/assets/img/titles/cl-logo.vue";
import dropdown from "@/components/General/dropdown.vue";
import { mapGetters } from "vuex";

export default {
  name: "navigation",
  components: { clLogo, dropdown },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.sessionStorage.clear();
          this.$store.dispatch("giveAccess", false);
          this.$router.replace({ name: "home" });
        });
    },
    getButtonText() {
      switch (this.$route.name) {
        case "authenticate":
          return "Sign up";
        case "register":
          return "Log in";
        case "home":
          return "Log in";
      }
    }
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  }
};
</script>

<style lang="scss">
#navBar {
  padding: 0.5rem 0.75rem;
  padding-right: 0;

  box-shadow: 0 4px 20px rgba($color: #000000, $alpha: 0.05);

  color: var(--sql-light-primary);
}
#navBar li {
  display: inline;
}

#navBar .logo {
  width: 3rem;
  height: auto;

  margin-top: 0.5rem;

  font-size: 2rem;
  cursor: pointer;
}

#navBar #profile {
  float: right;
}

#profile {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  margin-top: 0.25rem;
}

#profile #user {
  margin-right: 1rem;
}
#profile .button {
  margin-right: 0.4rem;

  padding: 0.4rem 0.8rem;

  border-radius: 5px;

  text-align: center;

  cursor: pointer;
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
#user {
  margin-top: -0.75rem;
}

#more {
  background-color: var(--sql-light-primary);

  margin-right: 0;

  font-size: 1.4rem;
  color: white;
}
#profile a:last-child {
  margin-right: 0;
}

@media only screen and (min-width: 470px) {
  #profile .button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
  }

  #navBar {
    padding: 1rem 1.5rem;
    padding-right: 0rem;
  }
}

@media only screen and (min-width: 1250px) {
}
</style>