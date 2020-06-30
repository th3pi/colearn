<template>
  <div>
    <!-- Name input type input box -->
    <div id="field" v-if="type == 'name'">
      <!-- Input label, label is default slot -->
      <label
        for="name"
        :class="{
          label: true,
          'label-go-top': name.length > 0 || focus.name ? true : false,
        }"
      >
        <slot />
      </label>
      <!-- Input box -->
      <input
        v-model="name"
        id="nameField"
        name="name"
        type="name"
        :class="{
          input: true,
          neumorphic: true,
          valid: validName.oneWord && validate,
        }"
        @focus="focus.name = true"
        @blur="focus.name = false"
        placeholder
        required
        :tabindex="tabindex"
        :autofocus="autofocus"
      />
    </div>

    <!-- Email input type input box -->
    <div id="field" v-if="type == 'email'">
      <!-- Input label, label is default slot -->

      <label
        for="email"
        :class="{
          label: true,
          'label-go-top': email.length > 0 || focus.email ? true : false,
        }"
      >
        <!-- Input label, label is default slot -->
        <slot />
      </label>
      <!-- Input box -->
      <input
        v-model="email"
        name="email"
        type="email"
        :class="{
          input: true,
          neumorphic: true,
          bottom: validEmail.fourChars && validate,
          top: validEmail.atSign && validate,
          left: validEmail.beforeAtSign && validate,
          right: validEmail.domain && validate,
          valid: validEmail.valid && validate,
        }"
        @focus="focus.email = true"
        @blur="focus.email = false"
        placeholder
        required
        :tabindex="tabindex"
        :autofocus="autofocus"
      />
    </div>

    <!-- Password input type input box -->
    <div id="field" v-if="type == 'password'">
      <!-- Password requirements popup -->
      <popup
        v-if="validate"
        :valid="validPassword.valid"
        :focus="focus.password"
      >
        <p>For your security, include at least:</p>
        <p :class="{ valid: validPassword.sixChars }">
          <transition name="scale-half-animation" mode="out-in">
            <i
              class="fas fa-check"
              v-if="validPassword.sixChars"
              key="valid"
            ></i>
            <i class="fas fa-times" v-else key="invalid"></i> </transition
          >6 characters
        </p>
        <p :class="{ valid: validPassword.upperCase }">
          <transition name="scale-half-animation" mode="out-in">
            <i
              class="fas fa-check"
              v-if="validPassword.upperCase"
              key="valid"
            ></i>
            <i class="fas fa-times" v-else key="invalid"></i> </transition
          >One uppercase letter
        </p>
        <p :class="{ valid: validPassword.lowerCase }">
          <transition name="scale-half-animation" mode="out-in">
            <i
              class="fas fa-check"
              v-if="validPassword.lowerCase"
              key="valid"
            ></i>
            <i class="fas fa-times" v-else key="invalid"></i> </transition
          >One lowercase letter
        </p>
        <p :class="{ valid: validPassword.number }">
          <transition name="scale-half-animation" mode="out-in">
            <i class="fas fa-check" v-if="validPassword.number" key="valid"></i>
            <i class="fas fa-times" v-else key="invalid"></i> </transition
          >One numeric character
        </p>
      </popup>
      <!-- Input label -->
      <label
        for="password"
        :class="{
          label: true,
          'label-go-top': password.length > 0 || focus.password ? true : false,
        }"
      >
        <!-- Label is default slot -->
        <slot />
      </label>
      <!-- Input box -->
      <input
        v-model="password"
        id="passwordBox"
        name="password"
        :type="peekPassword.peek ? 'text' : 'password'"
        :class="{
          input: true,
          neumorphic: true,
          bottom: validPassword.sixChars && validate,
          top: validPassword.number && validate,
          left: validPassword.lowerCase && validate,
          right: validPassword.upperCase && validate,
          valid: validPassword.valid && validate,
        }"
        @focus="focus.password = true"
        @blur="focus.password = false"
        placeholder
        required
        :tabindex="tabindex"
        :autofocus="autofocus"
      />

      <!-- Peek password buttons -->
      <transition name="fade-fast" mode="in-out">
        <i
          @click="peekPassword.peek = false"
          v-if="peekPassword.peek"
          class="fas fa-dot-circle peek"
          key="peek"
        ></i>
        <i
          v-else
          @click="peekPassword.peek = true"
          class="fas fa-circle peek"
          key="dont-peek"
        ></i>
      </transition>
    </div>
  </div>
</template>

<script>
/**
 * Component: cl-input
 * Usage: For inputs with or without validation requirements
 * @prop {String} direction Determines which way the password requirement popup should display
 * @prop {String} type Determines the kind of input type
 * @prop {Boolean} validate Determines if the input requires validation
 * @prop {Number} tabindex Determines the index of focus
 * @prop {Boolean} autofocus Determines if input box will be focus on creation
 * @param {String} name Model for the name type input box
 * @param {String} email Model for the email type input box
 * @param {String} password Model for the password type input box
 * @param {Object} focus Holds attributes that determine which input box has the focus
 * @param {Object} validPassowrd Determines the validity of each validation criteria of the password input
 * @param {Object} validEmail Determines the validity of each validation criteria of the email input
 * @param {Object} validName Determines the validity of each validation criteria of the name input
 * @param {Object} peekPassword Determines if password should be visible to user or hidden
 */
import popup from "@/components/General/popup.vue";

export default {
  name: "cl-input",
  components: { popup },
  props: {
    direction: String,
    type: String,
    validate: Boolean,
    tabindex: Number,
    autofocus: Boolean,
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
        password: false,
      },
      validPassword: {
        sixChars: null,
        lowerCase: null,
        upperCase: null,
        number: null,
        valid: null,
      },
      validEmail: {
        atSign: null,
        domain: null,
        beforeAtSign: null,
        fourChars: null,
        valid: null,
      },
      validName: {
        twoWords: null,
      },
      peekPassword: {
        peek: false,
        hover: false,
      },
    };
  },
  methods: {
    getInput() {
      return this.name;
    },
  },
  watch: {
    /**
     * Watch the password parameter, and validate on each change
     * @param {String} newValue holds the latest password value
     */
    password(newValue) {
      //Contains at least 1 number
      if (newValue.match(/[0-9]+/)) {
        this.validPassword.number = true;
      } else {
        this.validPassword.number = false;
      }
      //Contains at least one lowercase letter
      if (newValue.match(/[a-z]+/g)) {
        this.validPassword.lowerCase = true;
      } else {
        this.validPassword.lowerCase = false;
      }

      //Contains at least one uppercase letter
      if (newValue.match(/[A-Z]+/g)) {
        this.validPassword.upperCase = true;
      } else {
        this.validPassword.upperCase = false;
      }

      //Contains at least 6 characters
      if (newValue.length > 5) {
        this.validPassword.sixChars = true;
      } else {
        this.validPassword.sixChars = false;
      }

      //Resets boolean values if password box is empty
      if (newValue.length == 0) {
        this.validPassword = {
          sixChars: null,
          lowerCase: null,
          upperCase: null,
          number: null,
          valid: null,
        };
      }

      //If all criterias are valid, mark password as valid
      //And emit the valid password to parent component
      //And emit the validity of the password to parent component
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
    /**
     * Watch the email parameter, and validate on each change
     * @param {String} newValue holds the latest email value
     */
    email(newValue) {
      //Check if email starts with words
      if (newValue.match(/^\b[\w.-]+/)) {
        this.validEmail.beforeAtSign = true;
        //Check if email length is at least 3 before the @ sign
        if (newValue.length > 3) {
          this.validEmail.fourChars = true;
          // Check if theres an @ sign
          if (newValue.match(/@/)) {
            this.validEmail.atSign = true;
            // Check if there's at least one domain
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
          valid: null,
        };
      }
      //If all criterias are valid, mark email as valid
      //And emit the valid email to parent component
      //And emit the validity of the email to parent component
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

    /**
     * Checks for name validation. Must be more than a word
     * @param {Boolean} newValue contains the updated name value
     */
    name(newValue) {
      if (newValue.match(/([a-zA-Z]+?\b){1}/)) {
        this.validName.oneWord = true;
        this.$emit("name-validity", true);
        this.$emit("name", this.name);
      } else {
        this.$emit("name-validity", true);

        this.validName.oneWord = false;
      }
    },
  },
};
</script>

<style lang="scss">
#field {
  padding: 1rem 0;
}

#field input {
  transition: 0.4s;
}
#field input:focus {
  border: 2px solid rgba(var(--sql-light-v), 1);
}

.bottom {
  border-bottom: 2px solid rgba(var(--light-success-v), 1) !important;
}

.left {
  border-left: 2px solid rgba(var(--light-success-v), 1) !important;
}

.right {
  border-right: 2px solid rgba(var(--light-success-v), 1) !important;
}

.top {
  border-top: 2px solid rgba(var(--light-success-v), 1) !important;
}

#field:hover input {
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.2),
    -2px -2px 6px 0 rgba(255, 255, 255, 0.5);
}
input {
  z-index: 2;

  margin: 0 1rem;
  padding: 10px 5px 10px 1rem;

  width: 20rem;
  border: 2px solid rgba(var(--sql-light-v), 0);
  border-bottom: 2px solid rgba(var(--sql-light-v), 1);
  border-radius: 5px;

  background-color: transparent;

  outline: none;

  font-size: 1rem;

  transition: border 0.4s, box-shadow 0.5s;
}

input.valid {
  border: 2px solid rgba(var(--light-success-v), 1) !important;
  box-shadow: 3px 3px 8px 0px rgba(var(--light-success-v), 0.1),
    -3px -3px 8px 0px rgba(var(--light-success-v), 0.1),
    -3px 3px 8px 0px rgba(var(--light-success-v), 0.1),
    3px -3px 8px 0px rgba(var(--light-success-v), 0.1);
}

label {
  margin: 0.5rem 1rem 0.1rem 1rem;
}
label {
  font-weight: 700;
}

.label {
  z-index: -1;
  position: absolute;

  font-size: 0.95rem;
  color: var(--g-secondary);

  cursor: text;

  transform: translateX(1rem);
  transition: transform 0.5s ease-in-out, color 0.4s;
}

.label-go-top {
  z-index: 1;
  color: var(--sql-light-primary);
  transform: translateY(-2rem);
}

.label-behind {
  z-index: -1;
}

p.valid {
  color: var(--light-success);
}

.peek {
  position: absolute;
  margin-left: -2.5rem;
  margin-top: 0.7rem;

  color: var(--sql-light-primary);

  cursor: pointer;
}

i {
  margin-right: 0.4rem;
}
</style>
