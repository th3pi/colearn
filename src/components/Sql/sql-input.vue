<template>
  <div id="inputBox">
    <!-- Input field for SQL command -->
    <!-- Dynamically binded focus class to determine styling based on focus of the input field -->
    <!-- If field is focused or command is empty focus class is applied -->
    <!-- Creates a new line on enter keyup -->
    <!-- Emits message to everyone on the channel on Shift + space keyup -->
    <!-- Updates focus boolean variable on gain or loss of focus -->
    <div id="commandBox">
      <textarea
        id="commandInput"
        name="commandInput"
        :class="{'sql' : true, 'font' : true, 'focus': (focus || command != '') ? true : false}"
        :style="{'rows':rows, 'height': height+'rem', 'width' : (focus || command != '') ? '100%' : '50%'}"
        v-model="command"
        @keyup.enter="createNewLine"
        @keyup.shift.space="emitMessage"
        @focus="focus = true"
        @blur="focus = false"
      ></textarea>

      <!-- Command box label -->
      <!-- Displayed when commandbox is empty -->
      <transition name="fade">
        <label
          class="placeholder"
          v-if="!focus && command == ''"
          for="commandInput"
        >Enter a SQL command</label>
      </transition>
    </div>

    <!-- Instruction label -->
    <!-- Displayed when commandbox is in focus and not empty -->
    <transition name="gainleft-animation">
      <div class="hint" v-if="(focus || command != '')">
        //
        <strong>Shift + Enter</strong> to update what you have typed
      </div>
    </transition>
    <!-- Action buttons for the input field -->
    <div id="actionButtons">
      <!-- Update button does exactly the same as Shift + Enter keyup, shares the latest value of command -->
      <button class="sql font" @click="emitMessage()">Update</button>

      <!-- Run button  -->
      <!-- Compiles and runs code then fetches result -->
      <button class="sql font" @click="sendSql(command)">
        <i id="runArrows" class="fas fa-angle-double-right"></i> Run
      </button>

      <!-- Reset button -->
      <!-- Clears everything -->
      <button class="sql font" @click="reset">
        <i class="fas fa-undo-alt"></i> Reset
      </button>
    </div>
  </div>
</template>

<script>
//Mixins import
import responsive from "@/mixins/responsive";

/**
 * Input capture box for SQL co-learn module
 * @param {String} command Valid SQL command that is transmitted between all sessions active
 * @param {String} height Variable height of the input field
 * @param {Number} rows Variable number of rows of the input field
 * @param {Boolean} focus Boolean for the focus of the input field
 */
export default {
  name: "sql-input",
  mixins: [responsive],
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
    }
  },
  data() {
    return {
      command: "", //Input field value
      height: 1.5, //Height of a single line
      rows: 1, //Number of rows in the command box
      focus: false //Focus boolean for the input field
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

    /**
     * Resets all the parameters to default values
     * Emits "reset-sql" event to parent component
     */
    reset() {
      this.command = "";
      this.$emit("reset-sql");
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

    /**
     * Command watcher to emit on the channel when input field becomes empty and reset height and rows count
     * @param {String} newValue Current value of the command variable
     */
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
// Entire body
#inputBox {
  width: 100%;
  margin-top: 1rem;
}

// Command box body
#commandBox {
  display: flex;
  align-content: center;
  justify-content: center;
}

// Input field styling
textarea {
  min-height: 2rem;
  width: 50%;

  padding: 5px;

  overflow-y: auto;

  border: 2px solid;
  border-radius: 3px;
  border-color: transparent;
  border-bottom: 2px solid var(--sql-secondary);

  font-size: 1.2rem;

  resize: none;

  //border stylign
  outline: none;

  //transition
  transition: box-shadow 0.3s, border-radius 0.4s, border-color 0.5s, width 0.4s;
}

// Input field focus styling
.focus {
  border-color: var(--sql-dark);
  border-radius: var(--border-radius);
  box-shadow: 0 1px 8px rgba($color: #000000, $alpha: 0.25);
}

// Placeholder displayed while input field is out of focus and empty
.placeholder {
  position: absolute;
  top: 6rem;
  margin-left: 0.4rem;
  background-color: transparent;
  color: rgba($color: #000000, $alpha: 0.4);
}

// Input field hint
.hint {
  position: absolute;
  top: 3.4rem;
  background-color: var(--sql-dark);
  z-index: -1;
  padding: 2px 2px 15px 2px;

  border-radius: 5px;
  border: 2px solid var(--sql-secondary);
  box-shadow: 0 -2px 6px rgba($color: #000000, $alpha: 0.2);

  color: white;
  font-size: 0.9rem;
}

// Update and Run div
#actionButtons {
  display: flex;
  align-content: center;
  justify-content: center;
  margin: 1rem 0;
}

// Update and Run buttons
#actionButtons button {
  margin-right: 0.5rem;

  padding: 0.8rem 1.2rem;

  background-color: var(--sql-lighter-dark);

  border: 2px solid rgba($color: #254e70, $alpha: 0.2);
  border-radius: 5px;
  outline: none;

  box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.2);

  color: white;

  transition: background-color 0.3s, box-shadow 0.4s,
    padding-left 0.4s ease-in-out, padding-right 0.4s ease-in-out;
}

//Medium screens >= 470px
@media only screen and (min-width: 470px) {
  #actionButtons button {
    padding: 0.8rem 2rem;

    font-size: 0.95rem;
  }
}

//Large screens >= 1250px
@media only screen and (min-width: 1250px) {
  #actionButtons button {
    padding: 0.9rem 2.4rem;
    font-size: 1rem;
  }
}

// Run button
#actionButtons button:nth-last-child(2) {
  background-color: var(--sql-primary);
}

// Update and Run buttons hover
#actionButtons button:hover {
  background-color: rgba(var(--sql-lighter-dark-v), 0.8);

  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.2);
}

#actionButtons button:last-child {
  padding: 0 1rem;

  background-color: white;

  color: var(--dark);

  transition: 0.2s;
}

#actionButtons button:last-child:hover {
  color: var(--danger);
}

#actionButtons button:last-child i {
  transition: 0.3s;
}

#actionButtons button:last-child:hover i {
  transform: rotate(-360deg);
}
</style>