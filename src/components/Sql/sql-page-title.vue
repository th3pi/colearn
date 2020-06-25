<template>
  <div id="pageTitle">
    <transition name="fade-fast" mode="out-in">
      <div v-if="showBar && this.$mq == 'sm'" key="onlySqlLogo">
        <img id="onlySqlLogo" src="../../assets/img/titles/language-sql.svg" />
      </div>
      <div v-else id="clSqlLogo" key="wholeLogo">
        <img id="clLogo" src="../../assets/img/titles/co-learn.svg" :style="{width: showTable ? '20%' : ''}" />
        <img id="sqlLogo" src="../../assets/img/titles/language-sql.svg" :style="{width: showTable ? '20%' : ''}" />
      </div>
    </transition>
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
    showTable: Boolean,
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
  max-width: 40%;
  max-height: 60%;
  width: 40%;
  height: 25%;
  margin: auto;
  margin-right: 0;
  transition: 0.4s;
}

#sqlLogo {
  display: block;
  max-width: 40%;
  max-height: 60%;
  width: 40%;
  height: 25%;
  margin: auto;
  margin-left: 0;
  transition: 0.4s;

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
    width: 30%;
    height: 50%;
    margin: auto;
    margin-right: 0;
  }

  #sqlLogo {
    display: block;
    width: 30%;
    height: 50%;
    margin: auto;
    margin-left: 0;
  }
}

// large screens
@media screen and (min-width: 1250px) {
  #clLogo {
    display: block;
    max-width: 40%;
    max-height: 60%;
    width: 25%;
    height: 50%;
    margin: auto;
    margin-right: 0;
  }

  #sqlLogo {
    display: block;
    width: 25%;
    height: 50%;
    margin: auto;
    margin-left: 0;
  }
}
</style>