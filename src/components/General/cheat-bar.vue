<template>
  <!-- Sidebar help guide content - slots generate the content
        Slots should be overriden in parents
  -->
  <div id="cheat">
    <!-- Side bar help guide activation button -->
    <button id="cheatButton" @click="showBar = true" :style="{'opacity' : showBar ? 0 : 1}">
      <transition name="fade" mode="out-in">
        <p v-if="this.$mq == 'lg'"> Cheat Sheet </p>
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
          <p :style="getFontSize(showBar, '0.95rem', '1.2rem','1.4rem')">
            <!-- Header prop for language -->
            <strong>{{language}}</strong> Cheat Sheet
          </p>

          <!-- Help guide close button -->
          <i
            id="closeBarButton"
            class="far fa-times-circle"
            @click="showBar = false"
            :style="getFontSize(showBar, '0.95rem', '1.4rem','1.8rem')"
          ></i>
        </div>
        <br />
        <div id="body" :style="getFontSize(showBar, '0.85rem', '.9rem','1rem')">
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
#cheat {
  position: fixed;
  right: -5px;
}

#cheatButton {
  height: 2rem;
  width: 8vw;
  max-width: 15rem;
  background-color: rgba($color: #ffffff, $alpha: 1);

  margin-top: 3rem;

  border: 1px solid rgba($color: #254e70, $alpha: 0.4);
  border-right: none;
  border-radius: 5px 0 0 5px;
  outline: none;

  box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.2);

  transition: background-color 0.3s, color 0.4s, box-shadow 0.4s, width 0.4s;
}

#cheatButton:hover {
  background-color: rgba($color: #37718e, $alpha: 1);

  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.3);

  color: white;
}

.cheatBar {
  position: absolute;
  top: 0rem;
  right: 0;
  z-index: 1;

  height: 100vh;
  width: 0;
  background-color: white;

  border: 3px solid rgba($color: #254e70, $alpha: 0.2);
  border-radius: 10px 0 0 10px;
  overflow-x: hidden;

  box-shadow: 0 0 0px rgba($color: #000000, $alpha: 0.3);

  transition: width 0.2s, box-shadow 2s;
}

.cheatBar:hover {
  box-shadow: 0 2px 12px rgba($color: #000000, $alpha: 0.3);
}

.showBar {
  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.2);
}

#content {
  margin: 0.2rem 0.5rem 0.2rem 0.5rem;
  margin-top: 0.2rem;
  margin-left: 0.5rem;
  transition: 0.4s;
}

#header {
  display: flex;
  flex: nowrap;
  justify-content: space-between;
}

#header p {
  font-size: 1.5rem;
}

#closeBarButton {
  font-size: 1.6rem;
  margin-top: 0.2rem;
  transition: transform 0.8s ease-in, color 0.4s, text-shadow 1s;
}

#closeBarButton:hover {
  color: var(--danger);
  text-shadow: 0 2px 4px rgba($color: #ed1c24, $alpha: 0.4);
}
</style>