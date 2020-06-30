<template>
  <div class="center-body open-sans">
    <logo class="logo" fill="var(--sql-light-primary)" />
    <h3>
      Under construction! If you have a beta code, please enter below
    </h3>
    <clInput
      ref="input"
      :validate="false"
      class="cl-input"
      type="name"
      @name="code = $event"
      >Beta code</clInput
    >
    <button
      class="button neumorphic n-active hover open-sans"
      @click="validate"
    >
      <i class="fas fa-unlock"></i> Validate
    </button>
  </div>
</template>

<script>
import logo from "@/assets/img/titles/co-learn-logo.vue";
import clInput from "@/components/General/cl-input.vue";
export default {
  name: "beta",
  created() {
    document.title = "Colearn - Beta portal";
  },
  components: {
    clInput,
    logo,
  },
  data() {
    return {
      code: "",
      invalid: false,
    };
  },
  methods: {
    validate() {
      this.code = this.$refs.input.getInput();
      console.log(this.code);

      this.$http
        .get("/beta/validate-beta", { params: { code: this.code } })
        .then((res) => {
          if (res.data) {
            console.log("Giving access");
            this.$store.dispatch("giveAccess", true);
            this.$router.replace({ name: "home" });
          } else {
            this.invalid = true;
          }
        });
    },
  },
};
</script>

<style lang="scss">
.center-body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20vh;
}

input {
  text-align: center;
  font-family: "Share Tech Mono", monospace;
  font-weight: 400;
  letter-spacing: 10px;
}

h3 {
  color: var(--sql-primary);
  text-align: center;
}

.logo {
  width: 25rem;
  height: auto;
}

.cl-input {
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: var(--sql-light-primary);

  border-radius: 5px;
  border: none;
  outline: none;

  font-size: 1rem;
  color: white;
}

button:active {
  border: none;
}
</style>
