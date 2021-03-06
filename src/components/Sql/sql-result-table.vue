<template>
  <div id="sqlResults" :style="{'background-color' : background}">
    <!-- Query result table -->
    <transition name="dropdown-animation" mode="out-in">
      <!-- Table stats - only shown when results array is populated -->
      <div v-if="results.length > 0" key="stats">
        <!-- Table stats -->
        <div class="tableStats">
          <p>
            Showing
            <strong>{{results.length}}</strong> results
          </p>
        </div>

        <!-- Table section -->
        <div id="tableSection">
          <table v-if="results.length > 0" key="table">
            <!-- Table header row -->
            <tr>
              <!-- Row count column -->
              <th>#</th>
              <!-- Dynamically generated header columns (keys) -->

              <th v-for="(key, index) in keys" :key="index">{{key}}</th>
            </tr>

            <!-- Entry rows -->
            <tr v-for="(row, no) in results" :key="no" class="tr">
              <!-- Entry row index column -->
              <td id="index">{{no+1}}</td>

              <!-- Dynamically generated entry columns -->
              <td v-for="(value, key) in row" :key="key">{{value}}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Empty result box message -->
      <!-- Only shown when results array is empty -->
      <div id="emptyResultBox" v-else>
        <p v-if="!error">Run a SQL command to display result here</p>
        <p v-else>{{error}}</p>
      </div>
    </transition>
  </div>
</template>

<script>
/**
 * Generates a table that displays SQL command results
 * Disection of keys and results are done in the parent component
 * @prop {Array} results takes an array of results from parent as a property
 * @prop {Array} keys takes the array of field names of the result table from query result as property
 * @prop {String} error gets a value if there's an error
 */
export default {
  name: "sql-result-table",
  components: {},
  props: {
    results: Array,
    keys: Array,
    error: String,
    background: String
  },
  data() {
    return {
      dropdownShow: false
    };
  },
  methods: {}
};
</script>

<style lang="scss">
#sqlResults {
  display: block;
  margin: 0 auto;
  background-color: var(--sql-lighter-dark);

  border: 2px solid rgba(var(--sql-dark-v), 0.2);
  border-radius: 0 0 5px 5px;

  color: white;

  transition: background-color 0.3s, box-shadow 0.8s;
}

.tableStats {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0.5rem 0.4rem 0.2rem;
  background-color: var(--sql-light-primary);

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

#tableSection {
  overflow: auto;
}

#sqlResults table {
  table-layout: auto;
  width: 100%;
  white-space: pre;

  overflow: auto;

  font-size: 0.9rem;

  border-collapse: collapse;
}

#sqlResults th {
  border-bottom: 2px solid white;
}

#sqlResults td {
  padding: 0;
  border: 1px solid rgba(var(--sql-light-v), $alpha: 0.5);
}

#sqlResults tr {
  transition: 0.2s;
}

#sqlResults tr:hover {
  background-color: rgba(var(--danger-light-v), $alpha: 1);
}

#emptyResultBox {
  padding: 5px 0 5px 0;

  border-radius: 0 0 5px 5px;

  font-size: 0.9rem;

  transition: box-shadow 1s;
}
#emptyResultBox p {
  text-align: center;
}

#emptyResultBox p::first-letter {
  text-transform: capitalize;
}

#emptyResultBox:hover {
  box-shadow: 0 -4px 12px rgba($color: #d8d8d8, $alpha: 0.4) inset,
    0 4px 12px rgba($color: #000000, $alpha: 0.2) inset;
}

@media screen and (min-width: 470px) {
  #sqlResults table {
    font-size: 0.85rem;
  }

  #sqlResults th {
    padding: 5px 10px;
  }
  #sqlResults td {
    padding: 8px 10px;
  }

  #tableSection {
    table-layout: auto;
    overflow: auto;
    height: 20rem;
    resize: vertical;
  }
}

@media screen and (min-width: 1250px) {
  #sqlResults th {
    padding: 8px 10px;
  }
  #sqlResults td {
    padding: 10px 10px;
  }
}
</style>