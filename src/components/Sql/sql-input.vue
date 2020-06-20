<template>
  <div id="inputBox">
    <textarea
      id="commandInput"
      name="commandInput"
      class="sql font"
      :style="{'rows':rows, 'height': height+'rem'}"
      v-model="command"
      @keyup.enter="createNewLine"
      @keyup.shift.space="emitMessage"
      @focus="labelMsg = '// Shift + Enter to share what you typed'"
      @blur="labelMsg = 'Some SQL statement'"
    ></textarea>
    <label for="commandInput">{{labelMsg}}</label>
  </div>
</template>

<script>
/**
 * Input capture box for SQL co-learn module
 * @param {String} command Valid SQL command that is transmitted between all sessions active
 */
export default {
  name: "sql-input",

  /**
   * Sockets listening for "sqlTyping" which overwrites command value, with whatever is being emitted over
   * the "sqlTyping" channel
   * @param {String} data is the command that will overwrite, this.command
   */
  sockets: {
    /**
     * Socket listening for activities on the "sqlTyping" channel
     */
    sqlTyping(command, rows) {
      if (command != "") {
        this.command = command;
        this.rows = rows;
        this.height = this.rows * 1.6;
      } else {
        this.command = "";
        this.rows = 1;
        this.height = 1.5;
      }
    },
    /**
     * Socket listenting for text area height change on the "sqlNewLine" channel
     */
    sqlNewLine(rows, height) {
      this.rows = rows;
      this.height = height;
    }
  },
  data() {
    return {
      command: "",
      height: 1.5, //Height of a single line
      rows: 1, //Number of rows in the command box
      labelMsg: "Some SQL statement"
    };
  },
  methods: {
    /**
     * Emits "send-line" event internally that is handled in the parent component to communicate with the backend
     * @param data SQL command that is to be sent to the backend to get back a query result
     */
    sendSql(data) {
      this.$emit("send-sql", data);
    },
    createNewLine() {
      this.rows++;
      this.height = this.rows * 1.6;
    },

    /**
     * Called on shift+space, emits on the "sqlTyping" channel on shift+space
     */
    emitMessage() {
      this.$socket.client.emit(
        "sqlTyping",
        this.command,
        this.rows,
        this.height
      );
    },
    isFocus(bool) {
      if (bool) console.log("isFocused");
      else console.log("not focused");
    }
  },
  watch: {
    /**
     * Watch the command param for changes, whenever it receives an input - transmit on the "sqlTyping" channel
     * to synchronize all connected sessions
     */
    /**
     * Deprecated, causes performance issues
     */
    // command() {
    //   this.$socket.client.emit(
    //     "sqlTyping",
    //     this.command,
    //     this.rows,
    //     this.height
    //   );
    // }
    command(newValue) {
      if (newValue == "") {
        this.rows = 1;
        this.height = 1.5;
        this.emitMessage();
      }
    }
  }
};
</script>

<style lang="scss">
#commandInput {
  padding: 5px;
  font-size: 1.2rem;
  width: 90vw; //90% of viewport

  //border stylign
  outline: none;

  //transition
  transition: box-shadow 0.3s, border-radius 0.4s, border-color 0.5s;
}

textarea {
  min-height: 2rem;
  resize: none;
  overflow-y: auto;
  border: 2px solid;
  border-radius: 3px;
  border-color: transparent;
  border-bottom: 2px solid var(--sql-primary);
}

textarea:focus {
  border-color: var(--sql-secondary);
  border-radius: var(--border-radius);
  box-shadow: 0 1px 4px rgba($color: #000000, $alpha: 0.2);
}

label {
  position: absolute;
  background-color: transparent;
  left: 5.5vw;
  margin-top: 1rem;
  transition: 0.3s;
  color: rgba($color: #000000, $alpha: 0.4);
}

textarea:focus + label {
  font-size: 0.8rem;
  transform: translateY(-2.5rem);
}
</style>