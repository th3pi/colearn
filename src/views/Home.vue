<template>
  <div class="page">
    <div id="homeBody">
      <div id="coLearnLogo">
        <logo class="logo" fill="#29251d" />
      </div>
      <div id="sessionButtons">
        <button></button>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/img/titles/co-learn-logo.vue";
export default {
  name: "home",
  components: {
    logo
  }
};
</script>

<style lang="scss">
#homeBody {
  position: absolute;
  left: 0;
  top: 35%;
}

//Logo
#coLearnLogo .logo {
  display: block;

  width: 35%;
  height: auto;
  margin: auto;
}

#sessionButtons {
  display: inline-flex;
  align-content: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
}

#sessionButtons button {
  margin-right: 0.5rem;

  padding: 0.5rem 0.5rem;

  background-color: var(--sql-lighter-dark);

  border: none;
  border-radius: 5px;
  outline: none;

  font-size: 0.8rem;
  color: white;

  transition: background-color 0.3s, box-shadow 0.4s,
    padding-left 0.4s ease-in-out, padding-right 0.4s ease-in-out;
}

//Medium sized screens
@media screen and (min-width: 470px) {
  #coLearnLogo .logo {
    display: block;

    width: 45%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
  }
}

// large screens
@media screen and (min-width: 1250px) {
  #coLearnLogo .logo {
    display: block;

    width: 35%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>