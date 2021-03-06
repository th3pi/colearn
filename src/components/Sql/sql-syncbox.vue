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

    <div id="syncBox" :class="[{'light-mode': !syncBox.dark},{'dark-mode': syncBox.dark}]">
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
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-gist.css";

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
        height: 1.5,
        dark: null
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
      EventBus.$on("syncbox-dark-mode-toggle", value => {
        this.syncBox.dark = value;
      });
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
  padding: 0 0.75rem;
  border-radius: 5px;
  font-size: 120%;
  transition: 0.5s;
  cursor: pointer;

  .typed-by {
    font-size: 90%;
    opacity: 0.6;
  }
}
.light-mode {
  .hljs {
    display: block;
    background: white;
    padding: 0.5em;
    color: #333333;
    overflow-x: auto;
    transition: 0.5s;
  }

  .hljs-comment,
  .hljs-meta {
    color: #969896;
  }

  .hljs-variable,
  .hljs-template-variable,
  .hljs-strong,
  .hljs-emphasis,
  .hljs-quote {
    color: #df5000;
  }

  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-type {
    color: #d73a49;
  }

  .hljs-literal,
  .hljs-symbol,
  .hljs-bullet,
  .hljs-attribute {
    color: #0086b3;
  }

  .hljs-section,
  .hljs-name {
    color: #63a35c;
  }

  .hljs-tag {
    color: #333333;
  }

  .hljs-title,
  .hljs-attr,
  .hljs-selector-id,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo {
    color: #6f42c1;
  }

  .hljs-addition {
    color: #55a532;
    background-color: #eaffea;
  }

  .hljs-deletion {
    color: #bd2c00;
    background-color: #ffecec;
  }

  .hljs-link {
    text-decoration: underline;
  }

  .hljs-number {
    color: #005cc5;
  }

  .hljs-string {
    color: #032f62;
  }
}

.dark-mode {
  .sync-box {
    background-color: #282c34;
  }
  .typed-by {
    color: #d19a66;
  }
  .hljs {
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    color: #abb2bf;
    background: #282c34;
    transition: 0.5s;
  }

  .hljs-comment,
  .hljs-quote {
    color: #5c6370;
    font-style: italic;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: #c678dd;
  }

  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: #e06c75;
  }

  .hljs-literal {
    color: #56b6c2;
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta-string {
    color: #98c379;
  }

  .hljs-built_in,
  .hljs-class .hljs-title {
    color: #e6c07b;
  }

  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo,
  .hljs-number {
    color: #d19a66;
  }

  .hljs-symbol,
  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-title {
    color: #61aeee;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  .hljs-link {
    text-decoration: underline;
  }
}
</style>