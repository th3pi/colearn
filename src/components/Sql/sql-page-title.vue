<template>
  <div id="pageTitle">
    <!-- When only sql logo is displayed (when cheat sheet is open on small or medium display) -->
    <!-- When the entire logo is displayed -->
    <div id="clSqlLogo">
      <img id="clLogo" src="../../assets/img/titles/co-learn-sql.svg" />
      <img id="sqlLogo" src="../../assets/img/titles/language-sql.svg" />
    </div>
  </div>
</template>

<script>
/**
 * Displays a page title
 * @prop {Boolean} showBar is used to determine whether to show to co-learn logo as well
 */
export default {
  name: "sql-page-title",
  props: {
    showBar: Boolean,
    showTable: Boolean
  }
};
</script>

<style lang="scss">
#clSqlLogo {
  display: flex;
  flex-direction: row;
}

#clLogo {
  display: block;
  max-width: 30%;
  max-height: 60%;
  width: 10rem;
  height: 2rem;
  margin: auto;
  margin-right: 0;
  transition: width 0.4s;
}

#sqlLogo {
  display: block;
  max-width: 30%;
  max-height: 60%;
  width: 10rem;
  height: 3rem;
  margin: auto;
  margin-left: 0;
  transition: width 0.4s;
}

#onlySqlLogo {
  display: block;

  width: 70%;
  height: 25%;
  margin-left: auto;
  margin-right: auto;
}

//Medium sized screens
@media screen and (min-width: 470px) {
  #clLogo {
    display: block;
    width: 20rem;
    height: 50%;
    margin: auto;
    margin-right: 0;
  }

  #sqlLogo {
    display: block;
    width: 20rem;
    height: 50%;
    margin: auto;
    margin-left: 0;
  }
}
</style>