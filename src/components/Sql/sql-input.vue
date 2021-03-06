<template>
  <div id="inputBox">
    <vue-topprogress ref="sqlResultProgress" :height="5"></vue-topprogress>

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
        @keydown.shift.enter.exact.prevent="sendSql(command)"
        :class="{
          sql: true,
          font: true,
          focus: focus || command != '' ? true : false,
        }"
        :style="{
          rows: rows,
          height: height + 'rem',
          width:
            focus || command != '' ? '100%' : this.$mq == 'sm' ? '70%' : '50%',
        }"
        v-model="command"
        :placeholder="
          placeholder
        "
        @focus="focus = true"
        @blur="focus = false"
      ></textarea>

      <!-- Command box label -->
      <!-- Displayed when commandbox is empty -->

      <!-- DEPRECATED: Using textarea's own placeholder now -->
      <!-- <transition name="fade">
        <label
          class="placeholder"
          v-if="!focus && command == ''"
          for="commandInput"
        >Enter a SQL command</label>
      </transition>-->
    </div>
    <!-- Action buttons for the input field -->
    <div id="actionButtons">
      <!-- Update button does exactly the same as Shift + Enter keyup, shares the latest value of command -->
      <button class="sql font neumorphic button" @click="update">Update</button>

      <!-- Run button  -->
      <!-- Compiles and runs code then fetches result -->
      <button class="sql font neumorphic button" @click="sendSql(command)">
        <i id="runArrows" class="fas fa-angle-double-right"></i> Run
      </button>

      <!-- Reset button -->
      <!-- Clears everything -->
      <button class="sql font neumorphic button" @click="reset">
        <i class="fas fa-undo-alt"></i> Reset
      </button>
    </div>
  </div>
</template>

<script>
//Mixins import
import responsive from "@/mixins/responsive";
import { EventBus } from "@/bus/bus";
import { mapGetters } from "vuex";

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
  props: { sessionInfo: Object, socket: Object },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  created() {
    EventBus.$on("copy-command", event => {
      this.command = event;
      this.update();
    });
    EventBus.$on("copyToCommand", event => {
      this.command = event;
    });
    this.socket.on("get_sql", command => {
      this.command = command;
    });
    this.socket.on("sync_sql", command => {
      this.command = command;
    });
  },
  /**
   * Sockets listening for "sqlTyping" which overwrites command value, with whatever is being emitted over
   * the "sqlTyping" channel
   * @param {String} data is the command that will overwrite, this.command
   */
  data() {
    return {
      command: "", //Input field value
      height: 1.5, //Height of a single line
      rows: 1, //Number of rows in the command box
      focus: false, //Focus boolean for the input field
      session: null,
      placeholder: "Enter a SQL command",
      tab: 0,
      loading: false
    };
  },
  methods: {
    /**
     * Emits "send-sql" event internally that is handled in the parent component to communicate with the backend
     * @param data SQL command that is to be sent to the backend to get back a query result
     */
    sendSql(data) {
      EventBus.$emit("get-tab");
      EventBus.$on("send-tab", data => {
        this.tab = data;
      });
      let name =
        this.user.data.displayName.charAt(0).toUpperCase() +
        this.user.data.displayName.slice(1);
      this.$http
        .post("/session/sql/add", {
          sessionId: this.sessionInfo.sessionId,
          command: this.command,
          type: "run",
          by: name
        })
        .then(() => {
          this.$store.dispatch(
            "getSessionHistory",
            this.$route.params.sessionId
          );
          if (data.match(/SELECT/i)) {
            this.socket.emit(
              "get_sql",
              this.sessionInfo.sessionId,
              this.command,
              this.tab
            );
          } else {
            this.update();
          }
          this.$emit("send-sql", data);
        });
    },
    createNewLine() {
      this.rows++;
      this.height = this.rows * 1.6;
    },

    /**
     * Synchronizes session data by sending a post request to firestore
     */
    update() {
      this.socket.emit(
        "sync_sql",
        this.sessionInfo.sessionId,
        this.command,
        this.tab
      );
    },
    /**
     * Resets all the parameters to default values
     * Emits "reset-sql" event to parent component
     */
    reset() {
      this.command = "";
      this.socket.emit("get_sql", this.sessionInfo.sessionId, this.command);
      this.$emit("reset-sql");
    }
  },
  watch: {
    /**
     * Command watcher to synchronize input table
     * @param {String} newValue Current value of the command variable
     */
    command: {
      immediate: false,
      handler(newValue) {
        EventBus.$emit("typing", newValue);
        this.socket.emit(
          "typing",
          newValue,
          this.$route.params.sessionId,
          this.user.data.displayName
        );
        this.rows = newValue.split("\n").length;
        this.height = this.rows * 1.6;
        if (newValue == "") {
          this.rows = 1;
          this.height = 1.5;
        }
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
// Contains the input and hint label
#commandBox {
  display: inline-flex;
  align-content: center;
  justify-content: center;
  width: 100%;
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
  transition: box-shadow 0.3s, border-radius 0.4s, border-color 0.5s, width 0.4s,
    height 0.3s;
}

textarea::placeholder {
  text-align: center;
  font-size: 0.9rem;
  padding-top: 1rem;
}
// Input field focus styling
.focus {
  margin: 0 5px;
  border-color: var(--sql-dark);
  border-radius: var(--border-radius);
  box-shadow: 6px 6px 12px 0 rgba(0, 0, 0, 0.2) inset,
    -6px -6px 12px 0 rgba(255, 255, 255, 0.5) inset;
}

// Input field hint
.hint {
  position: fixed;
  top: 6vw;
  background-color: var(--sql-dark);
  z-index: -1;

  padding: 2px 2px 15px 2px;

  margin-left: 5px;

  border-radius: 5px;
  border: 2px solid var(--sql-secondary);
  box-shadow: 6px 6px 12px 0 rgba(0, 0, 0, 0.2),
    -6px -6px 12px 0 rgba(255, 255, 255, 0.5);

  color: white;
  font-size: 0.9rem;
}

// Update and Run div
#actionButtons {
  display: inline-flex;
  align-content: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
}

// Update and Run buttons
#actionButtons button {
  margin-right: 0.5rem;

  padding: 0.5rem 0.5rem;

  background-color: var(--sql-lighter-dark);

  border: none;
  border-radius: 5px;
  outline: none;

  font-size: 0.8rem;
  color: white;

  transition: background-color 0.3s, box-shadow 0.4s,
    padding-left 0.4s ease-in-out, padding-right 0.4s ease-in-out;
}

//Neumorphic inset shadows on click
#actionButtons .button:active {
  box-shadow: inset 3px 3px 12px 0 rgba(0, 0, 0, 0.2),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123);
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
  margin-right: 0;
  padding: 0 0.4rem;

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

//Medium screens >= 470px
@media only screen and (min-width: 470px) {
  #actionButtons button {
    padding: 0.5rem 1.5rem;

    font-size: 0.95rem;
  }

  textarea::placeholder {
    padding-top: 0.5rem;

    font-size: 1rem;
  }
}

//Large screens >= 1250px
@media only screen and (min-width: 1250px) {
  #actionButtons button {
    padding: 0.9rem 2.4rem;

    font-size: 1rem;
  }

  textarea::placeholder {
    padding-top: 0.5rem;

    font-size: 1rem;
  }
}
</style>
