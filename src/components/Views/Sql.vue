<template>
  <div id="view">
    <div class="sql font" id="sqlView" :style="{top: (results.length == 0) ? '35%' : 0}">
      <div id="inputSection" :style="getWidth(showBar,'45vw', '55vw', '65vw')">
        <!-- SQL view title -->
        <!-- Display only the language title if on a mobile device or something with a very small display -->
        <transition name="fade-fast" mode="out-in">
          <h1 v-if="showBar && this.$mq == 'sm'" class="title bungee-shade">{SQL}</h1>
          <h1 v-else class="title bungee">
            Co-learn
            <span class="bungee-shade" style="color: var(--dark);">{SQL}</span>
          </h1>
        </transition>
        <sql-input class="sqlInput" @send-sql="fetchSql" @reset-sql="reset" />
      </div>

      <sql-result-table :results="results" :keys="keys"></sql-result-table>
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
      values: [],
      showBar: false,
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
      command = "SELECT * FROM PERSONS"; //ONLY FOR TESTING PURPOSES. REMOVE this from build
      this.$http
        .get(this.route, {
          params: {
            sql: command
          }
        })
        .then(res => {
          this.results = res.data;
          this.keys = Object.keys(this.results[0]);
          console.log(this.results);
        });
    },

    reset() {
      this.results = [];
      this.keys = [];
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
  display: block;
  position: absolute;
  transition: top 0.4s ease-in-out;
}
#inputSection {
  display: inline-flex;
  width: 85vw;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  float: left;
}

#cheatBarDiv {
  position: absolute;
  top: 0;
}
</style>