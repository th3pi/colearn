<template>
  <div>
    <div class="sql font" id="sqlBody" :style="{'margin-top': (results.length == 0) ? '25vh' : 0}">
      <div id="inputSection" :style="getWidth(showBar,'50%', '60%', '70')">
        <!-- Page title for SQL view -->
        <!-- Display only the language title if on a mobile device or something with a very small display -->
        <sql-page-title :showBar="showBar" :showTable="showTable" />
        <!-- SQL command input box -->
        <sql-input
          class="sqlInput"
          @send-sql="fetchSql"
          @reset-sql="updateResultTable"
          @focus-sql="showTipOnFocus"
        />
      </div>

      <!-- Result table -->
      <div id="resultSection">
        <sql-result-table
          :error="message"
          :results="results"
          :keys="keys"
          :background="resultBackground"
        ></sql-result-table>
      </div>
    </div>
    <!-- Update:showBar event emitted from cheat-bar child component, on emission, showBar is assigned the value of 
    data passed from child component, which is a boolean value-->
    <div id="sidebar">
      <cheat-bar language="SQL" @update:showBar="showBar = $event">
        <!-- Cheat sheet body -->
        <template #cheatSheet>
          <!-- Each cheat is its own bullet point using the li tag -->
          <li>
            <strong>SELECT</strong> used to select data from a database
            <code-snippet language="SQL">
              <strong>SELECT</strong> *
              <strong>FROM</strong> table;
            </code-snippet>
            <p>
              Gets all the rows from the
              <strong>table</strong>
            </p>
          </li>
        </template>
      </cheat-bar>
    </div>
  </div>
</template>

<script>
//Component imports
import sqlPageTitle from "@/components/Sql/sql-page-title.vue";
import sqlInput from "@/components/Sql/sql-input.vue";
import cheatBar from "@/components/General/cheat-bar.vue";
import codeSnippet from "@/components/General/code-snippet.vue";
import sqlResultTable from "@/components/Sql/sql-result-table.vue";

//Mixin imports
import responsive from "@/mixins/responsive";
/**
 * Main view for SQL collaborations
 * @param {String} route holds the route to backend sql query api
 * @param {Array} results is an array of results that was fed back by backend
 * @param {Array} keys is an array of field names from the result table
 * @param {String} message returned error message string from backend
 * @param {Boolean} showBar is a boolean value that determines whether to show cheat bar
 * @param {Number} width is the width of the cheat bar
 */
export default {
  name: "sql-view",
  mixins: [responsive],
  components: {
    "sql-page-title": sqlPageTitle,
    "sql-input": sqlInput,
    "cheat-bar": cheatBar,
    "code-snippet": codeSnippet,
    "sql-result-table": sqlResultTable
  },
  sockets: {
    /**
     * Called on successful connection to the server
     */
    connect() {},

    /**
     * Called on disconnection from the session
     */
    disconnect() {},

    /**
     * Called when user in the session running a SQL command
     */
    sendSql(data) {
      this.fetchSql(data);
    },

    /**
     * Called when user in the session resetting SQL workspace
     */
    resetSql(command, message, resultBackground) {
      this.updateResultTable(message, resultBackground);
    },

    /**
     * Called when a non SELECT command is sent, to share only the message between users
     * to avoid sending multiple modifying commands
     */
    handleMessage(message) {
      this.messageHandler(message);
    }
  },
  data() {
    return {
      route: "/sql/sql-query",
      results: [],
      keys: [],
      message: "",
      showBar: false,
      showTable: false,
      resultBackground: "",
      width: 0
    };
  },
  created() {},
  methods: {
    /**
     * GETs the result of the sql command from the backend
     * @param {String} command SQL command that is received from the input and send to the backend
     */
    fetchSql(command) {
      // command = "SELECT * FROM PERSONS"; //ONLY FOR TESTING PURPOSES. REMOVE this from build
      this.$http
        .get(this.route, {
          params: {
            sql: command
          }
        })
        .then(res => {
          //If response is an array, it means successful SELECT command was run
          if (Array.isArray(res.data)) {
            this.results = res.data;
            this.keys = Object.keys(this.results[0]);
            this.message = "";
            this.resultBackground = "var(--sql-lighter-dark)";
            this.showTable = true;
          } else {
            console.log(res.data);
            this.$socket.client.emit("handleMessage", res.data);
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    /**
     * Resets arrays to become empty when child compononent emits "reset-sql", also used to update the result table message and background color of the component
     * @param {String} message is the response from backend which will be displayed on the result table
     * @param {String} background is a css variable, defined in the @/assets/styles/style.scss file
     */
    updateResultTable(message, background) {
      this.results = [];
      this.keys = [];
      this.showTable = false;
      this.message = message;
      this.resultBackground = background;
    },

    /**
     * Checks backend response and updates, result table message and background color
     * @param {String} message is the response from backend after a SQL command has been. Only populated when response is not an array
     */
    messageHandler(message) {
      if (typeof message == "string") {
        if (message.match(/SUCCESSFULLY/i)) {
          this.updateResultTable(message, "var(--success)");
        } else if (message.match(/DELETED/i)) {
          this.updateResultTable(message, "var(--success)");
        } else if (message.match(/UPDATED/i)) {
          this.updateResultTable(message, "var(--sql-light-primary)");
        } else if (message.match(/ERROR/i)) {
          this.updateResultTable(message, "var(--danger)");
        } else if (message.match(/NO MATCHING/i)) {
          this.updateResultTable(message, "var(--danger-light)");
        } else if (message.match(/Empty table/i)) {
          this.updateResultTable(message, "var(--g-secondary)");
        } else {
          this.updateResultTable(
            "Something went wrong, please reset and try again.",
            "var(--dark)"
          );
        }
      } else {
        this.updateResultTable("Invalid command", "var(--danger)");
      }
    },
    showTipOnFocus(message, resultBackground) {
      if (!this.showTable) {
        this.updateResultTable(message, resultBackground);
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss">
#sqlBody {
  width: 100%;

  margin-top: 0.5rem;
  margin-left: auto;
  margin-right: auto;

  transition: margin-top 0.4s ease-in-out;
}

#inputSection {
  display: inline-flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: 0.2s;
}

#resultSection {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#sidebar {
  position: fixed;
  top: 0;
}

@media screen and (min-width: 470px) {
  #sqlBody {
    width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media screen and (min-width: 1250px) {
  #sqlBody {
    width: 1250px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>