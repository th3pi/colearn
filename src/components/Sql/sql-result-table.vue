<template>
  <div id="sqlResults">
    <!-- Query result table -->
    <table v-if="results.length > 0">
      <!-- Table header row -->
      <tr>
        <!-- Row count column -->
        <th>#</th>
        <!-- Dynamically generated header columns (keys) -->
        <th v-for="(key, index) in keys" :key="index">{{key}}</th>
      </tr>

      <!-- Entry rows -->
      <tr v-for="(row, index) in results" :key="index">
        <!-- Entry row index column -->
        <td>{{index+1}}</td>

        <!-- Dynamically generated entry columns -->
        <td v-for="(value, key) in row" :key="key">{{value}}</td>
      </tr>
    </table>

    <!-- Message display if there are no results to display -->
    <div id="emptyResultBox" v-else>
      <p>Run a SQL command to display result here</p>
    </div>
  </div>
</template>

<script>
/**
 * Generates a table that displays SQL command results
 * Disection of keys and results are done in the parent component
 * @prop {Array} results takes an array of results from parent as a property
 * @prop {Array} keys takes the array of field names of the result table from query result as property
 */
export default {
  name: "sql-result-table",
  props: {
    results: Array,
    keys: Array
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
#sqlResults {
  display: inline-block;
  width: 85vw;
  background-color: var(--sql-lighter-dark);

  padding: 10px;

  border: 2px solid rgba(var(--sql-dark-v), 0.2);
  border-radius: var(--border-radius);

  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.2);

  color: white;

  overflow-x: auto;
}

#sqlResults table {
  width: 100%;

  background-color: var(--sql-lighter-dark);

  text-align: left;

  border-collapse: collapse;
}

#sqlResults th {
  padding: 5px 5px;
  border-bottom: 2px solid white;
}

#sqlResults td {
  padding: 2px 5px;
  border-bottom: 1px solid rgba(var(--sql-light-v), $alpha: 0.5);
}

#sqlResults tr {
  transition: 0.2s;
}

#sqlResults tr:hover {
  background-color: rgba(var(--sql-light-primary-v), $alpha: 0.4);
}

#emptyResultBox {
  padding-left: 5px;
  background-color: rgba(var(--sql-light-primary-v), $alpha: 0.2);

  border-radius: 0 10px 10px 0;
  border-left: 5px solid rgba(var(--sql-light-primary-v), $alpha: 1);

  font-size: 0.9rem;
}
</style>