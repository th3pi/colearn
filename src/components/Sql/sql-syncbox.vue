<template>
  <div>
    <h2 class="header" style="color: var(--sql-lighter-dark)">
      Sync box
      <i v-popover:syncBox class="fas fa-info-circle" style="transform: scale(.75)"></i>
      <p>Click on the box at anytime to copy its contents to your input field</p>
      <popover
        name="syncBox"
        transition="fade"
        class="neumorphic"
        style="font-size: .95rem; font-weight: 300; text-align: left; padding: .5rem 1rem; width: 15rem"
      >
        <strong
          style="font-size: 1.1rem; border-bottom: 2px solid rgba(var(--sql-lighter-dark-v), 0.8);"
        >More about Sync Box</strong>
        <br />
        <br />

        <li>
          Sync box is
          <strong>instantly synchronized</strong> between all colearners in a session
        </li>
        <br />
        <li>Click on the box at any time to copy it into your command box</li>
      </popover>
    </h2>

    <div id="syncBox">
      <pre
        class="sync-box neumorphic n-active"
        v-highlightjs="sqlCommand"
        @click="copyToCommandBox"
      >
            <code class="sql"></code> <span class="typed-by" v-if="typedBy != null"> -- {{typedBy}} is typing</span>
        </pre>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/bus/bus";
import "highlight.js/styles/github-gist.css";
// import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";

export default {
  name: "sql-syncBox",
  components: {
    // "el-dropdown": Dropdown,
    // "el-dropdown-menu": DropdownMenu,
    // "el-dropdown-item": DropdownItem
  },
  props: {
    socket: Object
  },
  data() {
    return {
      shareCommand: "",
      sqlCommand: "",
      typedBy: null,
      syncBox: {
        height: 1.5
      }
    };
  },
  created() {
    this.sqlCommand =
      "Sync box is shared by everyone in the session for real time collaboration";
    this.syncBoxListener();
  },
  computed: {},
  methods: {
    syncBoxListener() {
      EventBus.$on("typing", command => {
        this.sqlCommand = command;
      });
      this.socket.on("receiving", (command, username) => {
        if (command != "") {
          this.sqlCommand = command;
          this.typedBy = username;
        }
        if (command == "") {
          this.sqlCommand = command;
          this.typedBy = null;
        }
      });
    },
    copyToCommandBox() {
      if (
        this.sqlCommand !=
        "Sync box is shared by everyone in the session for real time collaboration"
      ) {
        EventBus.$emit("copyToCommand", this.sqlCommand);
      }
    }
  },
  watch: {
    sqlCommand(newValue) {
      this.rows = newValue.split("\n").length;
      this.height = this.rows * 1.6;
      if (
        newValue ==
        "This sync box is shared by everyone in the session for realtime collaboration"
      ) {
        this.rows = 1;
        this.height = 1.5;
        this.typedBy = null;
      }
    }
  }
};
</script>

<style lang="scss">
.sync-box {
  background-color: white;
  width: 88%;
  margin: 0.5rem auto;
  padding: 1rem;
  border-radius: 5px;
  font-size: 120%;

  cursor: pointer;

  .typed-by {
    font-size: 90%;
    opacity: 0.6;
  }
}
</style>