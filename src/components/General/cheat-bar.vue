<template>
  <!-- Sidebar help guide content - slots generate the content
        Slots should be overriden in parents
  -->
  <div id="cheat">
    <!-- Side bar help guide activation button -->
    <button
      id="cheatButton"
      class="button"
      @click="showBar = true"
      :style="{'opacity' : showBar ? 0 : 1}"
    >
      <transition name="fade" mode="out-in">
        <p v-if="!showBar && this.$mq == 'lg'" style="font-size:.95rem;">Cheat Sheet</p>
        <i v-else class="fas fa-info"></i>
      </transition>
    </button>
    <!-- Cheat bar section -->
    <div
      :class="{ 'cheatBar' : true, 'showBar' : showBar ? true : false}"
      :style="getWidth(showBar, '50vw', '40vw','30vw')"
    >
      <div id="content" :style="{'opacity' : showBar ? 1 : 0}">
        <!-- Header section-->
        <div id="header">
          <p class="bungee">
            <!-- Header prop for language -->
            <strong class="bungee-shade">{{language}}</strong> Cheat Sheet
          </p>

          <!-- Help guide close button -->
          <i id="closeBarButton" class="far fa-times-circle" @click="showBar = false"></i>
        </div>
        <br />
        <div id="body" class="sql font">
          <p>
            <!-- Header prop for language -->
            At a glance
          </p>
          <slot class="cheatSheet" name="cheatSheet"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//Mixin imports
import responsive from "@/mixins/responsive";
export default {
  name: "cheat-bar",
  mixins: [responsive],
  props: {
    language: String
  },
  data() {
    return {
      showBar: false //boolean to determine whether to show the help guide, changes on cheatButton click
    };
  },
  watch: {
    /**
     * Emits showBar value to parent component on change of current value
     * @event update:showBar Emits event update:showBar, which can parent listen to, data payload is the showBar Boolean value
     * @param {Boolean} newValue holds the updated value of showBar Boolean
     */
    showBar(newValue) {
      this.$emit("update:showBar", newValue);
    }
  }
};
</script>

<style lang="scss">
// Entire component
#cheat {
  position: fixed;
  right: 0;
}

// Cheat bar open button
#cheatButton {
  height: 2rem;
  width: 8vw;
  max-width: 15rem;
  background-color: rgba($color: #ffffff, $alpha: 1);

  margin-top: 1.5rem;

  border: 1px solid rgba($color: #254e70, $alpha: 0.4);
  border-right: none;
  border-radius: 5px 0 0 5px;
  outline: none;

  box-shadow: 6px 6px 12px 0 rgba(0, 0, 0, 0.2),
    -6px -6px 12px 0 rgba(255, 255, 255, 0.5);

  transition: background-color 0.3s, color 0.4s, box-shadow 0.4s, width 0.4s;
}

#cheatButton:hover {
  background-color: rgba(var(--sql-dark-v), 1);

  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.3);

  color: white;
}

#cheat .button:active {
  box-shadow: inset 3px 3px 12px 0 rgba(0, 0, 0, 0.2),
    inset -3px -3px 12px 0 rgba(0, 0, 0, 0.2);
}

// Cheat bar
.cheatBar {
  position: fixed;
  top: 0;
  right: -5px;
  z-index: 1;

  height: 100vh;
  width: 0;
  background-color: white;

  border: 3px solid rgba($color: #254e70, $alpha: 0.2);
  border-radius: 10px 0 0 10px;
  overflow-x: hidden;

  box-shadow: 6px 6px 12px 0 rgba(0, 0, 0, 0.2),
    -6px -6px 12px 0 rgba(255, 255, 255, 0.5);

  transition: width 0.2s, box-shadow 2s;
}

.cheatBar:hover {
  box-shadow: 0 2px 12px rgba($color: #000000, $alpha: 0.3);
}

// Cheatbar box-shadow class
.showBar {
  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.2);
}

// Cheat bar content body
#content {
  margin: 0.2rem 0.5rem 0.2rem 0.5rem;
  margin-top: 0.2rem;
  margin-left: 0.5rem;
  transition: 0.4s;
}

// Cheat bar header
#header {
  display: flex;
  flex: nowrap;
  justify-content: space-between;
}

#header p {
  margin-top: 3px;
  font-size: 1.2rem;
}

// Cheat bar close button
#closeBarButton {
  margin-top: 0.4rem;

  font-size: 1.4rem;

  cursor: pointer;

  transition: transform 0.8s ease-in, color 0.4s, text-shadow 1s;
}

#closeBarButton:hover {
  color: var(--danger);
  text-shadow: 0 2px 4px rgba($color: #ed1c24, $alpha: 0.4);
}

#body {
  font-size: 0.85rem;
}

//Medium sized screens
@media screen and (min-width: 500px) {
  #header p {
    font-size: 1.4rem;
  }

  #body {
    font-size: 0.9rem;
  }

  #closeBarButton {
    font-size: 1.4rem;
  }
}

// large screens
@media screen and (min-width: 1250px) {
  #header p {
    font-size: 2rem;
  }
  #body {
    font-size: 1rem;
  }
  #closeBarButton {
    margin-top: 0.6rem;
    font-size: 1.6rem;
  }
}
</style>