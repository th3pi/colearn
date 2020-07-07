<template>
  <div id="clFooter" class="open-sans">
    <div id="credits">
      <p>
        <i class="far fa-copyright copyright"></i>2020 Colearn, made with
        <i class="fas fa-heart heart"></i> by
        <i class="fab fa-github github"></i>th3pi
      </p>
    </div>
    <div id="links">
      <p>Navigate to:</p>
      <li>
        <a>Home</a>
      </li>
      <li>
        <a>Login</a>
      </li>
      <li>
        <a>Registration</a>
      </li>
      <li>
        <a>Support</a>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: "cl-footer"
};
</script>

<style lang="scss">
#clFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: -9999;

  height: 3rem;

  box-shadow: 2px -4px 8px rgba($color: #000000, $alpha: 0.05);

  background-color: white;

  font-size: 0.85rem;
  color: var(--sql-lighter-dark);
}

#credits .copyright {
  margin-right: 0.1rem;
  transform: scale(0.8);
}

#credits .heart {
  margin-right: 0;

  color: var(--danger-lighter);

  opacity: 0.8;

  text-shadow: 0px 4px 8px rgba(var(--danger-lighter-v), 0.2);
}

#credits .github {
  margin-right: 0.25rem;
}
#links p {
  display: inline;
  margin-right: 0.5rem;
}
#links li {
  display: inline;
  margin-right: 0.45rem;

  text-decoration: underline;

  cursor: pointer;

  transition: opacity 0.1s;
}

#links li:hover {
  opacity: 0.8;
}

#links li:last-child {
}

@media screen and (max-width: 470px) {
  #links {
    display: none;
  }
  #clFooter {
    justify-content: center;
    align-items: center;
  }
}
</style>