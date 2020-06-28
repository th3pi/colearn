<template>
  <div>
    <div id="navBar" class="open-sans">
      <li>
        <a @click="$router.push({name:'home'})">
          <logo class="logo" fill="var(--sql-light-primary)" />
        </a>
        <transition name="fade" mode="out-in">
          <div v-if="user.authenticated" id="profile" key="loggedIn">
            <a id="user" class="bold">{{user.data.displayName}}</a>
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

import logo from "@/assets/img/titles/co-learn-logo.vue";
import dropdown from "@/components/General/dropdown.vue";
import { mapGetters } from "vuex";

export default {
  name: "navigation",
  components: { logo, dropdown },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
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
  padding: 1rem 1.5rem;

  box-shadow: 0 4px 20px rgba($color: #000000, $alpha: 0.1);

  color: var(--sql-light-primary);
}
#navBar li {
  display: inline;
}

#navBar .logo {
  width: 10rem;
  height: auto;

  margin-top: 0.5rem;

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
  margin-right: 1rem;

  padding: 0.5rem 1rem;

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

  font-size: 1.4rem;
  color: white;
}
#profile a:last-child {
  margin-right: 0;
}
</style>