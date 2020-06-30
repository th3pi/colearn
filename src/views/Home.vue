<template>
  <div class="page open-sans">
    <!-- Top slideshow -->
    <div id="carousel" v-if="this.$mq != 'sm'">
      <agile :dots="false">
        <!-- First slide -->
        <div class="slide cl-slide">
          <img
            class="screenshot neumorphic"
            src="../assets/img/sql-screenshot.png"
            alt="nothing"
          />
          <div id="caption">
            <h3>Powerful and Fast</h3>
            <p>
              Colearn runs all your code using
              <strong>magic</strong> on the backend providing a minimal
              compilation time and seamless collaboration experience
            </p>
          </div>
        </div>
        <!-- Second slide -->
        <div class="slide cl-slide">
          <div id="caption">
            <h3>Guides and Cheatsheets</h3>
            <p>
              Follow along with colearn's guides and cheatsheets, that exists
              only to make sure you are never lost!
            </p>
          </div>
          <img
            class="screenshot neumorphic"
            src="../assets/img/sql-screenshot.png"
            alt="nothing"
          />
        </div>
        <!-- Overriding default agile slideshow buttons -->
        <template #prevButton>
          <i class="fas fa-chevron-left"></i>
        </template>
        <template #nextButton>
          <i class="fas fa-chevron-right"></i>
        </template>
      </agile>
    </div>
    <!-- Main content for home -->
    <div id="homeBody">
      <!-- Colearn logo and description -->
      <div id="coLearnLogo">
        <logo class="logo" fill="var(--sql-light-primary)" />
        <p id="description" class="open-sans">
          An online
          <strong>co</strong>llaborative <strong>learn</strong>ing platform for
          in-demand programming languages
        </p>
      </div>

      <!-- Primary introduction to colearn -->
      <div id="intro">
        <!-- Instructions on how to get started with colearn -->
        <div id="message">
          <div id="header">
            <h3 class="open-sans">Get started</h3>
          </div>
          <div id="steps" class="open-sans">
            <p><i class="fas fa-chevron-right"></i> Log in, or sign up</p>
            <p>
              <i v-if="this.$mq != 'sm'" class="fas fa-chevron-right"></i>
              Select a language from the right section
            </p>
            <p>
              <i class="fas fa-chevron-right"></i> Create or join a session with
              the link provided
            </p>
            <p>
              <i class="fas fa-chevron-right"></i> Start
              <strong>colearning</strong> with your buddies!
            </p>
          </div>
        </div>
        <!-- Programming language buttons -->
        <div id="sessionButtons">
          <button class="bold neumorphic hover n-active" disabled>
            <i class="fab fa-java"></i> Java
            <small>(Coming soon!)</small>
          </button>
          <button
            class="bold neumorphic hover n-active"
            @click="$router.push({ name: 'sql-view' })"
          >
            <i class="fas fa-search"></i> SQL
          </button>
          <button class="bold neumorphic hover n-active" disabled>
            <i class="fab fa-python"></i> Python
            <small>(Coming soon!)</small>
          </button>
        </div>
      </div>
      <!-- Github message for colearn -->
      <div id="subMessage">
        <a>
          <i class="fab fa-github"></i>Check out the ins and outs of
          <strong>Colearn</strong> on Github
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/img/titles/co-learn-logo.vue";
import { VueAgile } from "vue-agile";
import { mapGetters } from "vuex";
export default {
  name: "home",
  components: {
    logo,
    agile: VueAgile,
  },
  methods: {},
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  created() {
    console.log(this.user.beta);

    if (!this.user.beta) {
      this.$router.replace({ name: "beta" });
    }
  },
};
</script>
<style lang="scss">
#homeBody {
  margin-left: auto;
  margin-right: auto;

  transition: width 0.4s;
}

// Slideshow css
.agile__nav-button--next,
.agile__nav-button--prev {
  position: absolute;
  top: 7rem;

  padding: 0.5rem 1rem;

  background-color: transparent;

  border-radius: 5px;
  border: 2px solid rgba(var(--sql-light-primary-v), 0.2);
  border-color: transparent;

  color: var(--sql-light-primary);

  transition: box-shadow 1s, background-color 0.8s;
}
.agile__nav-button--next:hover,
.agile__nav-button--prev:hover {
  background-color: white;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.2),
    -2px -2px 6px 0 rgba(255, 255, 255, 0.2);
}

.agile__nav-button--next {
  right: 0.5rem;
}

.agile__nav-button--prev {
  left: 0.5rem;
}

#carousel {
  height: 20rem;
}

#carousel .cl-slide {
  display: flex;
  justify-content: center;
  align-items: center;

  padding-top: 1rem;
  padding-bottom: 1rem;

  box-shadow: inset -2px -4px 6px rgba($color: #000000, $alpha: 0.1);
}

#carousel .cl-slide .screenshot {
  width: 30rem;

  margin-right: 2vw;
  margin-left: 1vw;

  border-radius: 5px;
  border: 2px solid rgba(var(--sql-light-primary-v), 0.2);

  transition: border 1s;
}

#carousel .cl-slide .screenshot:hover {
  border: 2px solid rgba(var(--sql-light-primary-v), 1);
}

#carousel .cl-slide #caption {
  margin-right: 2vw;
  margin-left: 1vw;
}

//Logo
#homeBody #coLearnLogo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
}

#homeBody #coLearnLogo #description {
  margin-top: 1rem;

  color: var(--dark);
  text-align: center;
  font-size: 1rem;
}

#homeBody #description strong {
  color: var(--sql-lighter-dark);
}

#homeBody #coLearnLogo .logo {
  width: 18rem;
  height: auto;
}

// Intro css
#homeBody #intro {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100%;
}

#homeBody #intro #message {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  width: 50%;

  margin-top: 1rem;
  margin-left: 0.5rem;

  padding: 0.5rem;
  padding-bottom: 1rem;

  background-color: var(--sql-primary);

  border-radius: 5px;

  box-shadow: inset 3px 3px 12px 0 rgba(0, 0, 0, 0.2),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123);

  color: white;

  transition: box-shadow 0.4s;
}

#homeBody #intro #message:hover {
  box-shadow: inset 6px 6px 12px 0 rgba(0, 0, 0, 0.2),
    inset -6px -6px 12px 0 rgba(255, 255, 255, 0.123);
}

#homeBody #intro #message #header h3 {
  margin-left: auto;
  margin-right: auto;
}

#homeBody #intro #message #steps {
  margin-left: auto;
  margin-right: auto;
}

#homeBody #intro #message #steps p {
  padding: 0.25rem;

  transition: box-shadow 0.4s;
}

#homeBody #intro #sessionButtons {
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  width: 50%;
  margin-top: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  padding-top: 0.5rem;

  border-radius: 5px;
}

#sessionButtons button {
  width: 95%;

  padding: 0.8rem 0.5rem;
  margin: 0.5rem 0;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  background-color: white;

  border: none;
  border-radius: 5px;
  outline: none;

  font-size: 1rem;
  color: var(--sql-light-primary);
  text-align: left;

  transition: background-color 0.3s, box-shadow 0.4s,
    padding-left 0.4s ease-in-out, padding-right 0.4s ease-in-out;
}

#sessionButtons button i {
  font-size: 1.5rem;
}

#homeBody #subMessage {
  margin-top: 2rem;

  color: var(--g-primary);
  text-align: center;

  cursor: pointer;
}

#homeBody #subMessage a:hover {
  text-decoration: underline !important;
}

//Medium sized screens
@media screen and (min-width: 470px) {
  #homeBody {
    width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  #homeBody #coLearnLogo .logo {
    width: 16rem;
    height: auto;
  }

  #homeBody #coLearnLogo {
    margin-top: 0;
  }
}

// large screens
@media screen and (min-width: 1250px) {
  #homeBody {
    width: 1250px;
    margin-left: auto;
    margin-right: auto;
  }
  #homeBody #coLearnLogo .logo {
    display: block;

    width: 35%;
    height: auto;
  }
  #homeBody #coLearnLogo {
    margin-top: 0;
  }
}
</style>
