<template>
  <div class="page">
    <div id="homeBody">
      <div id="coLearnLogo">
        <logo class="logo" fill="var(--sql-light-primary)" />
        <p id="description" class="open-sans">
          An online
          <strong>co</strong>llaborative
          <strong>learn</strong>ing platform for in-demand programming languages
        </p>
      </div>
      <div id="intro">
        <div id="message">
          <h3 class="open-sans">Get started</h3>
        </div>
        <div id="sessionButtons">
          <button class="bungee neumorphic n-active">{Java}</button>
          <button class="bungee neumorphic n-active">{SQL}</button>
          <button class="bungee neumorphic n-active">{Python}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/img/titles/co-learn-logo.vue";
import { mapGetters } from "vuex";
export default {
  name: "home",
  components: {
    logo
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  }
};
</script>
<style lang="scss">
#homeBody {
}

//Logo
#homeBody #coLearnLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15vh;
  flex-direction: column;
}

#homeBody #coLearnLogo #description {
  margin-top: 1rem;

  color: var(--dark);
  text-align: center;
  font-size: 1rem;
}

#homeBody #coLearnLogo .logo {
  width: 18rem;
  height: auto;
}

#homeBody #into #message {
  display: inline;
  color: var(--dark);
}

#homeBody #intro {
  display: flex;
  flex-direction: row;
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

  background-color: var(--sql-light-primary);

  border: none;
  border-radius: 5px;
  outline: none;

  font-size: 1rem;
  color: white;

  transition: background-color 0.3s, box-shadow 0.4s,
    padding-left 0.4s ease-in-out, padding-right 0.4s ease-in-out;
}

//Medium sized screens
@media screen and (min-width: 470px) {
  #homeBody #coLearnLogo .logo {
    width: 16rem;
    height: auto;
  }
}

// large screens
@media screen and (min-width: 1250px) {
  #homeBody #coLearnLogo .logo {
    display: block;

    width: 35%;
    height: auto;
  }
}
</style>