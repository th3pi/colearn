<template>
  <div>
    <div id="field" v-if="type == 'name'">
      <label
        for="name"
        :class="{'label' : true, 'label-go-top': (name.length > 0 || focus.name) ? true : false}"
      >
        <slot />
      </label>
      <input
        v-model="name"
        id="nameField"
        name="name"
        type="name"
        :class="{'input':true, 'neumorphic': true, 'valid': validName.oneWord}"
        @focus="focus.name = true"
        @blur="focus.name = false"
        placeholder
        required
      />
    </div>
    <div id="field" v-if="type == 'email'">
      <label
        for="email"
        :class="{'label' : true, 'label-go-top': (email.length > 0 || focus.email) ? true : false}"
      >
        <slot />
      </label>
      <input
        v-model="email"
        name="email"
        type="email"
        :class="{'input':true, 'neumorphic': true, 
            'bottom' : validEmail.fourChars, 
            'top':     validEmail.atSign, 
            'left' :   validEmail.beforeAtSign, 
            'right':   validEmail.domain,
            'valid' :  validEmail.valid}"
        @focus="focus.email = true"
        @blur="focus.email = false"
        placeholder
        required
      />
    </div>
    <div id="field" v-if="type == 'password'">
      <popup :valid="validPassword.valid" :focus="focus.password">
        <p>For your security, include at least:</p>
        <p :class="{'valid': validPassword.sixChars}">
          <transition name="scale-half-animation" mode="out-in">
            <i class="fas fa-check" v-if="validPassword.sixChars" key="valid"></i>
            <i class="fas fa-times" v-else key="invalid"></i>
          </transition>6 characters
        </p>
        <p :class="{'valid': validPassword.upperCase}">
          <transition name="scale-half-animation" mode="out-in">
            <i class="fas fa-check" v-if="validPassword.upperCase" key="valid"></i>
            <i class="fas fa-times" v-else key="invalid"></i>
          </transition>One uppercase letter
        </p>
        <p :class="{'valid': validPassword.lowerCase}">
          <transition name="scale-half-animation" mode="out-in">
            <i class="fas fa-check" v-if="validPassword.lowerCase" key="valid"></i>
            <i class="fas fa-times" v-else key="invalid"></i>
          </transition>One lowercase letter
        </p>
        <p :class="{'valid': validPassword.number}">
          <transition name="scale-half-animation" mode="out-in">
            <i class="fas fa-check" v-if="validPassword.number" key="valid"></i>
            <i class="fas fa-times" v-else key="invalid"></i>
          </transition>One numeric character
        </p>
      </popup>
      <label
        for="password"
        :class="{'label' : true, 'label-go-top': (password.length > 0 || focus.password) ? true : false}"
      >
        <slot />
      </label>
      <input
        v-model="password"
        id="passwordBox"
        name="password"
        :type="peekPassword.peek ? 'text' : 'password'"
        :class="{'input':true, 'neumorphic': true, 
            'bottom' : validPassword.sixChars, 
            'top': validPassword.number, 
            'left' : validPassword.lowerCase, 
            'right': validPassword.upperCase,
            'valid' : validPassword.valid}"
        @focus="focus.password = true"
        @blur="focus.password = false"
        placeholder
        required
      />
      <transition name="scale-up-ver-center" mode="out-in">
        <i
          @click="peekPassword.peek = false"
          v-if="peekPassword.peek"
          class="fas fa-circle peek"
          key="peek"
        ></i>
        <i v-else @click="peekPassword.peek = true" class="far fa-circle peek" key="dont-peek"></i>
      </transition>
    </div>
  </div>
</template>

<script>
import popup from "@/components/General/popup.vue";

export default {
  name: "cl-input",
  components: { popup },
  props: {
    direction: String,
    type: String
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      error: null,
      focus: {
        name: false,
        email: false,
        password: false
      },
      validPassword: {
        sixChars: null,
        lowerCase: null,
        upperCase: null,
        number: null,
        valid: null
      },
      validEmail: {
        atSign: null,
        domain: null,
        beforeAtSign: null,
        fourChars: null,
        valid: null
      },
      validName: {
        twoWords: null
      },
      peekPassword: {
        peek: false
      },
      validAll: false
    };
  },
  watch: {
    password(newValue) {
      if (newValue.match(/[0-9]+/)) {
        this.validPassword.number = true;
      } else {
        this.validPassword.number = false;
      }
      if (newValue.match(/[a-z]+/g)) {
        this.validPassword.lowerCase = true;
      } else {
        this.validPassword.lowerCase = false;
      }
      if (newValue.match(/[A-Z]+/g)) {
        this.validPassword.upperCase = true;
      } else {
        this.validPassword.upperCase = false;
      }
      if (newValue.length > 5) {
        this.validPassword.sixChars = true;
      } else {
        this.validPassword.sixChars = false;
      }
      if (newValue.length == 0) {
        this.validPassword = {
          sixChars: null,
          lowerCase: null,
          upperCase: null,
          number: null,
          valid: null
        };
      }
      if (
        this.validPassword.sixChars &&
        this.validPassword.lowerCase &&
        this.validPassword.upperCase &&
        this.validPassword.number
      ) {
        this.validPassword.valid = true;
        this.$emit("password-validity", true);
        this.$emit("password", this.password);
      } else {
        this.$emit("password-validity", false);
        this.validPassword.valid = false;
      }
    },
    email(newValue) {
      if (newValue.match(/^\b[\w.-]+/)) {
        this.validEmail.beforeAtSign = true;
        if (newValue.length > 3) {
          this.validEmail.fourChars = true;
          if (newValue.match(/@/)) {
            this.validEmail.atSign = true;
            if (newValue.match(/@[\w.-]+\.\w{2,4}\b/)) {
              this.validEmail.domain = true;
            } else {
              this.validEmail.domain = false;
            }
          } else {
            this.validEmail.atSign = false;
          }
        } else {
          this.validEmail.fourChars = false;
        }
      } else {
        this.validEmail.beforeAtSign = false;
      }

      if (newValue.length == 0) {
        this.validEmail = {
          atSign: null,
          domain: null,
          beforeAtSign: null,
          fourChars: null,
          valid: null
        };
      }
      if (
        this.validEmail.atSign &&
        this.validEmail.domain &&
        this.validEmail.beforeAtSign &&
        this.validEmail.fourChars
      ) {
        this.$emit("email-validity", true);
        this.$emit("email", this.email);

        this.validEmail.valid = true;
      } else {
        this.$emit("email-validity", true);

        this.validEmail.valid = false;
      }
    },
    name(newValue) {
      if (newValue.match(/([a-zA-Z]+\s?\b){2,4}/)) {
        this.validName.oneWord = true;
        this.$emit("name-validity", true);
        this.$emit("name", this.name);
      } else {
        this.$emit("name-validity", true);

        this.validName.oneWord = false;
      }
    }
  }
};
</script>

<style lang="scss">
</style>