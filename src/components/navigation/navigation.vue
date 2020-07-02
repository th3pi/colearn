<template>
  <div>
    <div id="navBar" class="open-sans">
      <li>
        <a>
          <clLogo v-if="this.$mq != 'sm'" class="logo" fill="var(--sql-light-primary)" />
          <i v-else class="fas fa-bars logo"></i>
        </a>
      </li>
      <nAuth :user="user" v-if="user.authenticated" />
      <nUnAuth v-else />
    </div>
  </div>
</template>

<script>
import clLogo from "@/assets/img/titles/cl-logo.vue";
import nAuth from "./n-authenticated";
import nUnAuth from "./n-unauthenticated";
import { mapGetters } from "vuex";

export default {
  name: "navigation",
  components: { clLogo, nAuth, nUnAuth },
  methods: {},
  computed: {
    ...mapGetters({
      user: "user"
    })
  }
};
</script>

<style lang="scss">
#navBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  padding-right: 0;

  box-shadow: 0 4px 20px rgba($color: #000000, $alpha: 0.05);

  color: var(--sql-light-primary);
}
#navBar li {
  display: inline;
}

#navBar .logo {
  margin: 0.25rem 0.2rem;

  font-size: 2rem;
  cursor: pointer;
}
#rightNav {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
#rightNav .button {
  margin-right: 0.5rem;
  padding: 0.4rem 0.8rem;

  border-radius: 5px;

  cursor: pointer;
}

@media only screen and (min-width: 470px) {
  #navBar {
    padding: 1rem 1.5rem;
    padding-right: 0rem;
  }
  #navBar .logo {
    width: 3rem;
    height: auto;
    margin: 0;
  }
  #rightNav .button {
    padding: 0.5rem 1rem;
  }
}
@media only screen and (min-width: 1250px) {
}
</style>