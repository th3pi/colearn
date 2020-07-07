<template>
  <div class="dropdown" @click="show = show ? false : true">
    <!-- If the dropdown button is a text, then pass in a title to the title property -->
    <slot></slot>

    <transition name="spin-transition" mode="out-in">
      <!-- Open dropdown -->
      <!-- Pass in button prop that is a font awesome class name -->
      <!-- Used if no title is included -->
      <div v-if="!show" key="dots">
        <i :class="button"></i>
      </div>

      <!-- Close button -->
      <!-- Pass in button prop that is a font awesome class name -->
      <div v-else key="cross">
        <i :class="closeButton"></i>
      </div>
    </transition>
    <transition name="dropdown-animation">
      <!-- Dropdown content slot holds the dropdown menu options -->
      <div class="dropdown-content" v-if="show">
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
/**
 * Custom dropdown element w/ custom styling
 * @prop {String} title The default text/button for the dropdown
 * @prop {String} button Open button for dropdown - is a font awesome class name
 * @prop {String} closeButton close button for dropdown - is a font awesome class name
 */
export default {
  name: "dropdown",
  props: {
    title: String,
    button: String,
    closeButton: String
  },
  data() {
    return {
      show: false,
      titleText: String
    };
  },
  created() {
    this.titleText = this.title;
  },
  watch: {
    /**
     *  Watch for changes to change the title text. If dropdown is visible title text become "// Close"
     */
    show: function(newValue) {
      this.titleText = newValue ? "// Close" : this.title;
      if (newValue) this.$emit("dropdown-show", true);
      else this.$emit("dropdown-show", false);
    },

    /**
     * Watch for changes to the title, usually called after a change in sorting option
     */
    title: function(newValue) {
      this.titleText = newValue;
    }
  }
};
</script>

<style lang="scss">
//Marks the element as a dropdown
.dropdown {
  display: inline-block;
  position: relative;
  cursor: pointer;
}

//Outlined removed on focus of the dropdown element
.dropdown:focus {
  outline: none;
}

//Elements inside a dropdown
.dropdown-content {
  display: grid;

  gap: 1rem;

  padding: 0.2rem;

  position: absolute;
  top: 2rem;

  background-color: rgba($color: #fff, $alpha: 0.2);

  border-radius: 5px;

  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);

  z-index: 2;
  cursor: default;
}

//Active elements inside a dropdown gets their background color changed to primary color of object type
.dropdown-content .active {
  background-color: var(--secondary);
  border-radius: 5px;
  color: white;
  transition: 0.3s;
}

//Active elements are prepended with a '//'
.dropdown-content .active::before {
  content: "// ";
}

.dropdown .active:hover {
  color: white;
}

//Styling links of dropdowns
.dropdown-content a {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  padding: 0.85rem 1.5rem 0.85rem 1.5rem;

  color: black;
  text-decoration: none;

  border-radius: 5px;

  background-color: white;

  transition: 0.3s;

  cursor: pointer;
}

.dropdown-content p {
  text-align: end;
  border-radius: 5px;
  background-color: rgb(46, 46, 46);
  box-shadow: 0 -2px 4px rgba($color: #ffffff, $alpha: 0.5) inset;
  padding: 0.2rem 0.2rem;

  color: white;
}

.dropdown-content-divider {
  content: "";
  border: 1px solid rgba($color: #000000, $alpha: 0.4);
  border-radius: 5px;
  margin: 0.5rem 0;
}
</style>