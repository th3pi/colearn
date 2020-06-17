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
          console.log("LOGGING:");

          console.log(res.data);
        });
    }
  }
};
</script>