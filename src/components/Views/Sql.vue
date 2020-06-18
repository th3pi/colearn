<template>
  <div>
    <input v-model="statement" type="text" @keyup.enter="sendStatement(statement)" />
  </div>
</template>

<script>
/**
 * Main view for SQL collaborations
 * @param {String} route holds the route to backend sql query api
 * @param {String} statement is the SQL statement that is to be sent
 * @param {Array} results is an array of results that was fed back by backend
 */
export default {
  name: "sql-view",
  sockets: {
    /**
     * Called on successful connection to the server
     */
    connect() {
      console.log("Socket connected on the browser");
    },

    /**
     * Called on disconnection from the session
     */
    disconnect() {
      console.log("Socket disconnected from the browser");
    },

    /**
     * Synchronizes the SQL command input field between all users in the session
     * @param {String} data Transmitted sql command being typed by someone into the field
     */
    typing(data) {
      this.statement = data;
    }
  },
  data() {
    return {
      route: "/sql/sql-query",
      statement: "",
      results: []
    };
  },
  created() {},
  methods: {
    /**
     * Method to send the statement to backend
     */
    sendStatement(statement) {
      this.$http
        .get("/sql/sql-query", {
          params: {
            sql: statement
          }
        })
        .then(res => {
          console.log(res.data);
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