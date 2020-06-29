<template>
  <div id="pageTitle">
    <transition name="fade-fast" mode="out-in">
      <!-- When only sql logo is displayed (when cheat sheet is open on small or medium display) -->
      <div v-if="showBar && (this.$mq == 'sm' || this.$mq == 'md')" key="onlySqlLogo">
        <img
          id="onlySqlLogo"
          src="../../assets/img/titles/language-sql.svg"
          :style="{width: showTable ? '50%' : ''}"
        />
      </div>
      <!-- When the entire logo is displayed -->
      <div v-else id="clSqlLogo" key="wholeLogo">
        <img
          id="clLogo"
          src="../../assets/img/titles/co-learn-sql.svg"
          :style="{width: showTable ? this.$mq == 'sm' ? '10rem' : '15rem' : ''}"
        />
        <img
          id="sqlLogo"
          src="../../assets/img/titles/language-sql.svg"
          :style="{width: showTable ? this.$mq == 'sm' ? '10rem' : '15rem' : ''}"
        />
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
  max-width: 40%;
  max-height: 60%;
  width: 14rem;
  height: 2rem;
  margin: auto;
  margin-right: 0;
  transition: width 0.4s;
}

#sqlLogo {
  display: block;
  max-width: 40%;
  max-height: 60%;
  width: 14rem;
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