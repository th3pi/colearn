<template>
  <div class="open-sans">
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
  margin-top: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
input {
  margin: 0 1rem;
  padding: 10px 5px 10px 1rem;

  width: 20rem;
  border: 2px solid rgba(var(--sql-light-v), 0);
  border-bottom: 2px solid rgba(var(--sql-light-v), 1);
  border-radius: 5px;

  background-color: transparent;

  outline: none;

  font-size: 1rem;

  transition: border 0.4s, box-shadow 0.5s;
}

label {
  margin: 0.5rem 1rem 0.1rem 1rem;
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

#field {
  padding: 1rem 0;
}

.label {
  z-index: -1;
  position: absolute;

  font-size: 0.95rem;
  color: var(--g-secondary);

  cursor: text;

  transform: translateX(1rem);
  transition: transform 0.5s ease-in-out, color 0.4s;
}

.label-go-top {
  z-index: 1;
  color: var(--sql-light-primary);
  transform: translateY(-2rem);
}

.label-behind {
  z-index: -1;
}

#passwordBox:focus {
  border: 2px solid rgba(var(--sql-light-v), 1);
}

.peek {
  position: absolute;
  margin-left: -2.5rem;
  margin-top: 0.7rem;

  cursor: pointer;
}

#field input {
  transition: 0.4s;
}

#field input:focus {
  border: 2px solid rgba(var(--sql-light-v), 1);
}

.bottom {
  border-bottom: 2px solid rgba(var(--light-success-v), 1) !important;
}

.left {
  border-left: 2px solid rgba(var(--light-success-v), 1) !important;
}

.right {
  border-right: 2px solid rgba(var(--light-success-v), 1) !important;
}

.top {
  border-top: 2px solid rgba(var(--light-success-v), 1) !important;
}

#field:hover input {
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.2),
    -2px -2px 6px 0 rgba(255, 255, 255, 0.5);
}

label {
  font-weight: 700;
}

i {
  width: 1.2rem;
}

input {
  z-index: 2;
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

#alternate a:hover {
}

@media only screen and (min-width: 470px) {
  #authenticationButtons button {
    padding: 0.5rem 1.5rem;

    font-size: 0.95rem;
  }
}

@media only screen and (min-width: 1250px) {
  #authenticationButtons button {
    padding: 0.9rem 2.4rem;

    font-size: 1rem;
  }
}
</style>