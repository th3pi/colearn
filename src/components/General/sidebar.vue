<template>
  <div>
    <!-- Sidebar help guide content - slots generate the content
          Slots should be overriden in parents
    -->
    <button
      id="sidebarButton"
      class="button neumorphic n-active hover"
      @click="showBar = true"
      :style="{'opacity' : showBar ? 0 : 1}"
    >
      <i class="fas fa-info" style="color: var(--sql-lighter-dark)"></i>
    </button>
    <div id="sidebarBody">
      <!-- Side bar help guide activation button -->

      <!-- Sidebar section -->
      <div
        class="open-sans"
        :class="{ 'sidebar' : true, 'showBar' : showBar ? true : false}"
        :style="getWidth(showBar, '15rem', '30rem','30rem')"
      >
        <div id="content" :style="{'opacity' : showBar ? 1 : 0}">
          <!-- Header section-->
          <div id="header">
            <p>
              <!-- Header prop for language -->
              Info and Settings
            </p>

            <!-- Help guide close button -->
            <i id="closeBarButton" class="far fa-times-circle" @click="showBar = false"></i>
          </div>
          <br />
          <div id="body" class="sql font">
            <!-- Session info section -->
            <h3 style="text-align: center; color: var(--dark); margin-bottom: .5rem">
              <i class="far fa-file-alt"></i>Session Info
            </h3>
            <slot class="session-info" name="sessionInfo"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//Mixin imports
import responsive from "@/mixins/responsive";
export default {
  name: "sidebar",
  mixins: [responsive],
  props: {
    language: String
  },
  data() {
    return {
      showBar: false //boolean to determine whether to show the help guide, changes on sidebarButton click
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
#sidebarBody {
  position: fixed;
  right: 0;
}

// Sidebar open button
#sidebarButton {
  position: fixed;
  right: 0;
  top: 6.5rem;
  height: 2rem;
  width: 3rem;
  background-color: white;

  border: 1px solid rgba($color: #254e70, $alpha: 0.4);
  border-right: none;
  border-radius: 5px 0 0 5px;
  outline: none;

  transition: background-color 0.3s, color 0.4s, box-shadow 0.4s, width 0.4s;
}

// Sidebar
.sidebar {
  position: fixed;
  top: 5rem;
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

.sidebar:hover {
  box-shadow: 0 2px 12px rgba($color: #000000, $alpha: 0.3);
}

// Sidebar box-shadow class
.showBar {
  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.2);
}

// Sidebar content body
#content {
  margin: 0.2rem 0.5rem 0.2rem 0.5rem;
  margin-top: 0.2rem;
  margin-left: 0.5rem;
  transition: 0.4s;
}

// Sidebar header
#header {
  display: flex;
  flex: nowrap;
  justify-content: space-between;
}

#header p {
  margin-top: 3px;
  font-size: 1.2rem;
}

// Sidebar close button
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

#body .tip {
  color: var(--g-primary);
}

#body .header {
  color: var(--dark);

  font-size: 1.1rem;

  font-weight: 700;
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