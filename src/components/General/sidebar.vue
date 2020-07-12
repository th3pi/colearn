<template>
  <div>
    <button id="sidebarButton" class="button neumorphic n-active hover" @click="showBar = true">
      <i class="fas fa-info" style="color: var(--sql-lighter-dark)"></i>
    </button>

    <div id="sidebar">
      <el-drawer
        title="Info and Settings"
        :visible.sync="showBar"
        direction="rtl"
        @open="con"
        class="sidebar-body open-sans"
        custom-class="custom-sidebar"
      >
        <template #title>
          <div class="title">
            <slot name="title" />
          </div>
        </template>
        <slot name="sessionInfo"></slot>
      </el-drawer>
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
  },
  methods: {
    toggle() {
      this.showBar = this.showBar ? false : true;
    },
    con() {
      console.log("OPEN");
    }
  }
};
</script>

<style lang="scss">
// Entire component
#sidebar {
  .title {
    color: var(--dark);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }
}

#sidebar > * {
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

.sidebar-body {
  button {
    outline: none;
  }
  .el-drawer {
    outline: none;
  }
}

.custom-sidebar {
  min-width: 20rem;
}

// Sidebar content body
#content {
  margin: 0.2rem 0.5rem 5rem 0.5rem;
  margin-top: 0.2rem;
  margin-left: 0.5rem;
  transition: 0.4s;
  margin-bottom: 10rem;
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