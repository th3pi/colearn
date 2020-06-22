<template>
  <div id="sqlResults">
    <!-- Query result table -->
    <transition name="dropdown-animation" mode="out-in">
      <div v-if="results.length > 0" key="stats">
        <div class="tableStats">
          <p>
            Showing
            <strong>{{results.length}}</strong> results
          </p>
          <dropdown>
            <i class="fas fa-ellipsis-v"></i>
            <template #content>
              <a>Save</a>
              <a>Share</a>
              <a>Reload</a>
            </template>
          </dropdown>
        </div>

        <table v-if="results.length > 0" key="table">
          <!-- Table header row -->
          <tr>
            <!-- Row count column -->
            <th>#</th>
            <!-- Dynamically generated header columns (keys) -->
            <th v-for="(key, index) in keys" :key="index">{{key}}</th>
          </tr>

          <!-- Entry rows -->
          <tr v-for="(row, no) in results" :key="no">
            <!-- Entry row index column -->
            <td>{{no+1}}</td>

            <!-- Dynamically generated entry columns -->
            <td v-for="(value, key) in row" :key="key">{{value}}</td>
          </tr>
        </table>
      </div>
      <div id="emptyResultBox" v-else>
        <p>Run a SQL command to display result here</p>
      </div>
    </transition>

    <!-- Message display if there are no results to display -->
  </div>
</template>

<script>
import dropdown from "@/components/General/dropdown.vue";
/**
 * Generates a table that displays SQL command results
 * Disection of keys and results are done in the parent component
 * @prop {Array} results takes an array of results from parent as a property
 * @prop {Array} keys takes the array of field names of the result table from query result as property
 */
export default {
  name: "sql-result-table",
  components: { dropdown },
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
  width: 88%;
  background-color: var(--sql-lighter-dark);

  border: 2px solid rgba(var(--sql-dark-v), 0.2);
  border-radius: var(--border-radius);

  box-shadow: 0 2px 8px rgba($color: #000000, $alpha: 0.2);

  color: white;

  overflow-x: auto;
}

.tableStats {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0.5rem 0.4rem 0.2rem;
  background-color: var(--sql-light-primary);

  box-shadow: 0 -2px 8px rgba($color: #000000, $alpha: 0.2) inset;

  font-size: 0.9rem;
}

.tableStats p {
  margin: 0 0 0 0.2rem;
}

.tableStats i {
  margin: 0.2rem 0 0 0;

  transition: 0.2s;

  cursor: pointer;
}

.tableStats i:hover {
  text-shadow: 0 4px 8px rgba($color: #000000, $alpha: 0.2);
}

#sqlResults table {
  width: 100%;

  text-align: left;

  border-collapse: collapse;
}

#sqlResults th {
  padding: 5px 5px;
  border-bottom: 2px solid white;
}

#sqlResults td {
  padding: 5px 5px;
  border-bottom: 1px solid rgba(var(--sql-light-v), $alpha: 0.5);
}

#sqlResults tr {
  transition: 0.2s;
}

#sqlResults tr:hover {
  background-color: rgba(var(--danger-light-v), $alpha: 1);
}

#emptyResultBox {
  padding: 5px 0 5px 0;

  background-color: rgba(var(--sql-light-primary-v), $alpha: 0.2);

  border-radius: 0 10px 10px 0;
  border-left: 5px solid rgba(var(--sql-light-primary-v), $alpha: 1);

  font-size: 0.9rem;
}
#emptyResultBox p {
  margin-left: 5px;
}
</style>