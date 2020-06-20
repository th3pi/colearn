<template>
  <div id="inputBox">
    <textarea
      id="commandInput"
      name="commandInput"
      :class="{'sql' : true, 'font' : true, 'focus': (focus || command != '') ? true : false}"
      :style="{'rows':rows, 'height': height+'rem'}"
      v-model="command"
      @keyup.enter="createNewLine"
      @keyup.shift.space="emitMessage"
      @focus="focus = true"
      @blur="focus = false"
    ></textarea>
    <transition name="fade">

    <label class="placeholder" v-if="!focus && command == ''" for="commandInput">Enter a SQL command</label>
</transition>

    <transition name="fade">
    
    <label class="hint" v-if="focus || command != ''" for="commandInput">// <strong>Shift + Enter</strong> to share what you have typed</label>
</transition>
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
      focus: false,
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
  border-bottom: 2px solid var(--sql-secondary);
}

.focus {
  border-color: var(--sql-dark);
  border-radius: var(--border-radius);
  box-shadow: 0 1px 8px rgba($color: #000000, $alpha: 0.25);
}

label {
  position: absolute;
  background-color: transparent;
  left: 5.5vw;
  margin-top: 1rem;
  color: rgba($color: #000000, $alpha: 0.4);
}

.hint{
  position: absolute;
  background-color: var(--sql-dark);
  left: 5.5vw;
  margin-top: -1.6rem;
  padding: 2px 10px 8px 10px;
  z-index: -1;

  border-radius: 5px;
  border: 2px solid var(--sql-secondary);
  box-shadow: 0 -2px 6px rgba($color: #000000, $alpha: 0.2);

  color: white;
  font-size: .9rem;
}
</style>