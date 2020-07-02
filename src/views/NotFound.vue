<template>
  <div id="notFoundBody" class="open-sans">
    <error404Logo id="logo" />
    <h3>Oops! Seem's like the page you are looking for doesn't exist</h3>
    <a class="neumorphic hover n-active" @click="$router.replace({name:'home'})">
      <i class="fas fa-arrow-left"></i>Go Home
    </a>
  </div>
</template>
<script>
import error404Logo from "@/assets/img/titles/error404-logo.vue";
export default {
  name: "NotFound",
  components: {
    error404Logo
  }
};
</script>

<style lang="scss">
#notFoundBody {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 85vmin;
}

#notFoundBody #logo {
  width: 35rem;
  height: auto;
}

#notFoundBody h3 {
  color: var(--sql-light-primary);
}

#notFoundBody a {
  margin-top: 1rem;

  padding: 0.75rem 1.25rem;

  border-radius: 5px;

  color: var(--sql-light-primary);
  font-weight: 700;
  cursor: pointer;
}

@media screen and (max-width: 470px) {
  #notFoundBody {
    margin-top: 10rem;
    height: auto;
  }
}
</style>