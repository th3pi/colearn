<template>
  <div id="message">
    <div id="unAuth" v-if="!user.authenticated">
      <div id="header">
        <h3 class="open-sans">Get started</h3>
      </div>
      <div id="steps" class="open-sans">
        <p>
          <i class="fas fa-chevron-right"></i> Log in, or sign up
        </p>
        <p>
          <i class="fas fa-chevron-right"></i>
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
    <div id="authD" v-else>
      <div id="header">
        <h3 class="open-sans">Get started</h3>
      </div>
      <div id="steps" class="open-sans">
        <p v-if="this.$mq !='sm'">
          <i class="fas fa-chevron-right"></i> Select a language from the right section
        </p>
        <p v-else>
          <i class="fas fa-chevron-right"></i> Select a language from below
        </p>
        <p>
          <i class="fas fa-chevron-right"></i>
          Enter the name of the session you want to join
        </p>
        <input v-model="sessionId" type="text" class="neumorphic" />
        <button class="button border neumorphic hover n-active" @click="emitJoin">
          <i class="fas fa-user-plus"></i> Join
        </button>

        <p>
          <i class="fas fa-chevron-right"></i> Or create a session
        </p>
        <button class="button border neumorphic hover n-active" @click="emitCreate">
          <i class="fas fa-plus"></i> Create
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "message-box",
  components: {},
  computed: {
    ...mapGetters({ user: "user" })
  },
  data() {
    return {
      sessionId: ""
    };
  },
  methods: {
    emitCreate() {
      this.$emit("create-session");
    },
    emitJoin() {
      this.$emit("join-session", this.sessionId);
    },
    getSessionId() {
      return this.sessionId;
    }
  }
};
</script>

<style lang="scss">
#message {
  display: block;

  margin-top: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  padding: 0.5rem;
  padding-bottom: 1rem;

  background-color: var(--sql-light-primary);

  border-radius: 5px;

  box-shadow: inset 3px 3px 12px 0 rgba(0, 0, 0, 0.2),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123),
    inset -3px -3px 12px 0 rgba(255, 255, 255, 0.123);

  color: white;

  transition: box-shadow 0.4s;
}

#message:hover {
  box-shadow: inset 6px 6px 12px 0 rgba(0, 0, 0, 0.2),
    inset -6px -6px 12px 0 rgba(255, 255, 255, 0.123);
}

#message #header h3 {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#message #steps p {
  padding: 0.25rem;
  font-size: 0.9rem;
  transition: box-shadow 0.4s;
}

#message .button {
  display: block;
  margin-left: auto;
  margin-right: auto;

  width: 7rem;
  padding: 0.5rem 1rem;

  outline: none;

  font-weight: 700;
  color: var(--sql-light-primary);
}
#message input {
  display: block;
  margin: 0.75rem auto;
  background-color: white;
}

//Medium sized screens
@media screen and (min-width: 470px) {
  #message {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;
  }
  #message #steps p {
    font-size: 1rem;
  }
}
</style>