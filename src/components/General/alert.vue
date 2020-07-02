<template>
  <transition name="fade">
    <div
      v-if="state"
      id="alertBody"
      class="alert neumorphic"
      :style="{'color':color, 'background-color':'rgba('+backgroundColor+','+opacity+')', 'border-color':bordercolor,}"
    >
      <slot />
      <i v-if="dismiss" @click="state = false" id="dismissButton" class="fas fa-times"></i>
      <p v-if="dismiss" @click="state = false" id="dismissText">Close</p>
    </div>
  </transition>
</template>

<script>
/**
 * Creates an alert box that can be dismissed (optional)
 * @prop {String} color sets the color for text
 * @prop {String} backgroundColor sets the color for background (accepts rgb values only)
 * @prop {String} borderColor sets the border color
 * @prop {String} opacity sets the background color opacity
 */
export default {
  name: "alert",
  props: {
    color: {
      type: String,
      default: "var(--sql-lighter-dark)"
    },
    backgroundColor: {
      type: String,
      default: "var(--sql-primary-v)"
    },
    bordercolor: {
      type: String
    },
    opacity: {
      type: String,
      default: "0.8"
    },
    dismiss: {
      type: Boolean,
      default: false
    }
  },
  created() {
    if (this.bordercolor == "") {
      this.bordercolor = this.color;
    }
  },
  data() {
    return {
      shadow: this.backgroundColor,
      state: true
    };
  }
};
</script>

<style lang="scss">
#alertBody {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.alert {
  padding: 0.5rem 1rem;
  border-width: 2px;
  border-style: solid;
  border-radius: 5px;
  text-align: center;
}
.link {
  text-decoration: underline;

  cursor: pointer;
}

#dismissButton {
  float: right;
  margin-top: 0.2rem;

  cursor: pointer;
}

#dismissText {
  display: none;
}

@media screen and (max-width: 470px) {
  #alertBody {
    margin-top: 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;

    font-size: 0.9rem;
  }

  #dismissButton {
    display: none;
  }

  #dismissText {
    display: block;
    text-decoration: underline;
  }
}
</style>