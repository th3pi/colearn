<template>
  <div>
    <input v-model="statement" type="text" @keyup.enter="sendStatement(statement)" />
    <div v-for="(result, index) in results" :key="index">
      <p>{{result}}</p>
    </div>
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
  created() {    
  },
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
          this.$socket.emit('test','TEST');
          console.log(res.data);
          
        });
    },

  },
  watch: {
    results: function(newValue, oldValue) {
    console.log(newValue);
    console.log(oldValue);

    }
  }
};
</script>