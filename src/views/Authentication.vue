<template>
  <div id="authenticationBody" class="open-sans">
    <transition name="slide-in-right" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "authentication"
};
</script>

<style lang="scss">
#authenticationBody {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  margin-top: 20vh;
}

#coLearnLogo .logo {
  width: 10rem;
}

#authenticationButtons button {
  margin-right: 0.5rem;

  padding: 0.5rem 0.5rem;

  background-color: var(--sql-light-primary);

  border: none;
  border-radius: 5px;
  outline: none;

  font-size: 0.8rem;
  color: white;

  transition: background-color 0.3s, box-shadow 0.4s,
    padding-left 0.4s ease-in-out, padding-right 0.4s ease-in-out;
}

#authenticationButtons button:hover {
  background-color: rgba(var(--sql-primary-v), 1);
}

#authenticationButtons .button:active {
  box-shadow: inset 3px 3px 12px 0 rgba(0, 0, 0, 0.2),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123);
}

#authenticationButtons button:disabled {
  box-shadow: inset 3px 3px 12px 0 rgba(0, 0, 0, 0.2),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123);
  background-color: rgba(var(--sql-light-primary-v), 0.4);
  cursor: not-allowed;
}

#alternate {
  margin-top: 0.5rem;

  padding: 0.4rem 1rem;

  border-radius: 5px;

  background-color: white;
}

#alternate a {
  font-size: 0.9rem;
  color: var(--sql-primary);
}

#alternate a span {
  padding: 0.2rem 0.6rem;

  border-radius: 5px;

  background-color: white;

  cursor: pointer;
}

.error {
  color: var(--danger-light) !important;
}

.error span {
  background-color: var(--danger-lighter) !important;

  font-size: 0.85rem;
  color: white;
}

@media only screen and (min-width: 470px) {
  #authenticationButtons button {
    padding: 0.5rem 1.5rem;

    font-size: 0.95rem;
  }
}

@media screen and (min-height: 800px) {
  #authenticationBody {
    margin-top: 25vh;
  }
}

@media only screen and (min-width: 1250px) {
  #authenticationButtons button {
    padding: 0.9rem 2.4rem;

    font-size: 1rem;
  }
}
</style>