<template>
  <div id="view">
    <div class="sql font" id="sqlView" :style="{top: (results.length == 0) ? '35%' : 0}">
      <div id="inputSection" :style="getWidth(showBar,'50%', '60%', '70')">
        <!-- SQL view title -->
        <!-- Display only the language title if on a mobile device or something with a very small display -->
        <transition name="fade-fast" mode="out-in">
          <div id="pageTitle">
            <h1 v-if="showBar && this.$mq == 'sm'" class="title bungee-shade">{SQL}</h1>
            <h1 v-else class="title bungee">
              Co-learn
              <span class="bungee-shade">{SQL}</span>
            </h1>
          </div>
        </transition>
        <sql-input class="sqlInput" @send-sql="fetchSql" @reset-sql="reset" />
      </div>

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
    <div id="cheatBarDiv">
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
    "sql-input": sqlInput,
    "cheat-bar": cheatBar,
    "code-snippet": codeSnippet,
    "sql-result-table": sqlResultTable
  },
  sockets: {
    /**
     * Called on successful connection to the server
     */
    connect() {
      console.log("Socket connected to the SQL channel");
    },

    /**
     * Called on disconnection from the session
     */
    disconnect() {
      console.log("Socket disconnected disconnected from the SQL channel");
    }
  },
  data() {
    return {
      route: "/sql/sql-query",
      results: [],
      keys: [],
      message: "",
      showBar: false,
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
          } else {
            this.message = res.data;

            // If response contains success it means successful CREATE operation was done
            if (this.message.match(/SUCCESS/i)) {
              this.results = [];
              this.resultBackground = "var(--success)";
              // If contains no results it means query didn't find anything
            } else if (this.message.match(/no results/i)) {
              this.results = [];
              this.message = "No results found";
              this.resultBackground = "var(--g-secondary)";
              // If response contains error it means query was not executed
            } else if (this.message.match(/ERROR/i)) {
              this.results = [];
              this.resultBackground = "var(--danger)";
              this.$emit("error-sql", this.message);
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.message = "No entries found";
          this.resultBackground = "var(--sql-lighter-dark)";
          this.$emit("no-result-sql", this.message);
          console.log(this.message);
        });
    },
    /**
     * Resets arrays to become empty when child compononent emits "reset-sql"
     */
    reset() {
      this.results = [];
      this.keys = [];
      this.message = "";
    }
  },
  watch: {
    statement(newValue) {
      this.$socket.client.emit("typing", newValue);
    }
  }
};
</script>

<style lang="scss">
#sqlView {
  display: inline-block;
  width: 100%;

  position: fixed;
  left: 0;

  transition: top 0.4s ease-in-out;
}

#pageTitle {
  font-size: 1rem;
}

#pageTitle .bungee-shade {
  color: var(--dark);
}

#inputSection {
  display: inline-flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: 0.2s;
}

#cheatBarDiv {
  position: fixed;
  top: 0;
}

#resultSection {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

//Medium sized screens
@media screen and (min-width: 470px) {
  #pageTitle {
    font-size: 1.1rem;
  }
}

//Medium+ sized screens
@media screen and (min-width: 580px) {
  #pageTitle {
    font-size: 1.2rem;
  }
}

// large screens
@media screen and (min-width: 1250px) {
  #pageTitle {
    font-size: 1.6rem;
  }
}
</style>