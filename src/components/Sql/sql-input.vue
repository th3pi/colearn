<template>
  <div id="inputBox">
    <textarea
      id="input"
      class="sql font"
      :style="{'rows':rows, 'height': height+'rem'}"
      v-model="command"
      @keyup.enter="createNewLine"
    ></textarea>
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
      rows: 1 //Number of rows in the command box
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
    }
  },
  watch: {
    /**
     * Watch the command param for changes, whenever it receives an input - transmit on the "sqlTyping" channel
     * to synchronize all connected sessions
     */
    command() {
      this.$socket.client.emit(
        "sqlTyping",
        this.command,
        this.rows,
        this.height
      );
    }
  }
};
</script>

<style lang="scss">
#input {
  padding: 5px;
  font-size: 1.2rem;
  width: 90vw; //90% of viewport

  //border stylign
  outline: none;
  border: none;
  border-bottom: 2px solid var(--sql-primary);

  //transition
}

textarea {
  min-height: 2rem;
  resize: none;
  overflow-y: auto;
}
</style>