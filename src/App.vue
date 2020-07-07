<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div v-if="progress == 100" key="content">
        <div id="ifAuth" v-if="user.beta">
          <navigation />
          <transition name="fade" id="mainBody" mode="out-in">
            <router-view class="body"></router-view>
          </transition>
          <cl-footer />
        </div>
        <div id="ifNot" v-else>
          <beta />
        </div>
      </div>
      <div div id="loader" v-else key="loader">
        <vue-ellipse-progress :progress="progress" :loading="true" />
      </div>
    </transition>
  </div>
</template>

<script>
import navigation from "@/components/navigation/navigation.vue";
import footer from "@/components/footer/footer.vue";
import { mapGetters, mapState } from "vuex";
import ENUM from "@/enums/store_enum";
import beta from "@/views/Beta.vue";

export default {
  name: "App",
  components: { navigation, "cl-footer": footer, beta },
  data() {
    return {
      progress: 0 //Progress value for loading local vuex data
    };
  },
  computed: {
    /**
     * Maps user from local storage state to user
     */
    ...mapGetters({ user: "user" }),

    /**
     * Maps storeApi.state from local storage state to storeApi
     */
    ...mapState({
      storeApi: state => state.storeApi.state
    }),

    /**
     * Returns true if storeApi is loaded
     */
    storeApiLoaded() {
      return this.storeApi == ENUM.LOADED;
    },

    /**
     * Returns true if storeApi is loading or has initialized
     */
    storeApiLoading() {
      return this.storeApi == ENUM.LOADING || this.storeApi == ENUM.INIT;
    }
  },
  created() {
    this.getProgress();
  },
  methods: {
    /**
     * Gets progress value based on storeApi load value
     */
    getProgress() {
      if (this.storeApiLoaded) {
        this.progress = 100;
      }
    }
  },
  watch: {
    /**
     * If storeApi value changes, and the new value is 3 - loading is complete
     * @param {Number} newValue is the current storeApi value
     */
    storeApi(newValue) {
      console.log("STORE API LOADED: " + newValue);
      console.log(this.user.beta);
      if (newValue == 3) {
        this.progress = 100;
      }
    },
    $route(to) {
      document.title = to.meta.title;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/style.scss";
@import "@/assets/styles/animations.scss";

html,
body {
  margin: 0;
  height: 100vh;
}
#loader {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}
.body {
  margin-top: 5rem;
}
</style>