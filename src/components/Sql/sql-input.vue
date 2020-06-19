<template>
  <div id="inputBox">
    <textarea
      id="input"
      class="sql font"
      :style="{'height':height+'rem'}"
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
    sqlTyping(data) {
      this.command = data;
    }
  },
  data() {
    return {
      command: "",
      height: 1.2,
      lines: 1
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
      this.height += 1.2;
    }
  },
  watch: {
    /**
     * Watch the command param for changes, whenever it receives an input - transmit on the "sqlTyping" channel
     * to synchronize all connected sessions
     */
    command(newValue, oldValue) {
      this.$socket.client.emit("sqlTyping", newValue);
      console.log(newValue); // LAST WORKING ON THIS FINISH BACKSPACE HEIGHT ADJUSTMENT
    }
  }
};
</script>

<style lang="scss">
#input {
  padding: 2rem 0.5rem 0rem 0.5rem;
  font-size: 1.2rem;
  width: 90vw; //90% of viewport

  //border stylign
  outline: none;
  border: none;
  border-bottom: 2px solid var(--sql-primary);
  resize: none;
}
</style>