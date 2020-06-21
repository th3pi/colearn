<template>
  <div class="sql font" id="sqlView">
    <div id="inputSection" :style="getWidth(showBar,'45vw', '55vw', '65vw')">
      <h1 class="tutorial">SQL</h1>
      <sql-input class="sqlInput" @send-sql="fetchSql" />
    </div>
    <cheat-bar language="SQL" @update:showBar="showBar = $event">
      <template #cheatSheet>
        <li>
          <strong>SELECT</strong> used to select data from a database
        </li>
        <code-snippet language="SQL">
          <strong class="code">SELECT</strong> *
          <strong class="code">FROM</strong> table;
        </code-snippet>
        <p>
          Gets all the rows from the
          <strong>table</strong>
        </p>
      </template>
    </cheat-bar>
  </div>
</template>

<script>
//Component imports
import sqlInput from "@/components/Sql/sql-input.vue";
import cheatBar from "@/components/General/cheat-bar.vue";
import codeSnippet from "@/components/General/code-snippet.vue";

//Mixin imports
import responsive from "@/mixins/responsive";
/**
 * Main view for SQL collaborations
 * @param {String} route holds the route to backend sql query api
 * @param {String} statement is the SQL statement that is to be sent
 * @param {Array} results is an array of results that was fed back by backend
 */
export default {
  name: "sql-view",
  mixins: [responsive],
  components: {
    "sql-input": sqlInput,
    "cheat-bar": cheatBar,
    "code-snippet": codeSnippet
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
      this.$http
        .get("/sql/sql-query", {
          params: {
            sql: command
          }
        })
        .then(res => {
          this.results = res.data;
          console.log(this.results);
        });
    }
  },
  watch: {
    results: function(newValue, oldValue) {
      console.log(newValue);
      console.log(oldValue);
    },
    statement(newValue) {
      this.$socket.client.emit("typing", newValue);
    }
  }
};
</script>

<style lang="scss">
#inputSection {
  display: inline-flex;
  width: 85vw;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  float: left;
}
</style>