<template>
  <div id="sqlView">
    <!-- <h1 class="sql font">HELLO!!!</h1> -->
    <sql-input @send-sql="fetchSql" />
  </div>
</template>

<script>
import sqlInput from "@/components/Sql/sql-input.vue";
/**
 * Main view for SQL collaborations
 * @param {String} route holds the route to backend sql query api
 * @param {String} statement is the SQL statement that is to be sent
 * @param {Array} results is an array of results that was fed back by backend
 */
export default {
  name: "sql-view",
  components: {
    "sql-input": sqlInput
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
      results: []
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
.sql.font {
  font-family: "Open Sans", sans-serif;
}

#sqlView {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>