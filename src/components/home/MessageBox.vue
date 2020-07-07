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
          Enter the name of the session you wish to
          <strong>join</strong>
        </p>
        <p>
          <i class="fas fa-chevron-right"></i>
          Or leave it blank, and
          <strong>create</strong> a new session
        </p>
        <input v-model="sessionId" type="text" class="neumorphic" placeholder="e.g LeopardNoahYes" />
        <div id="sessionGroup">
          <button class="button border neumorphic hover n-active" @click="emitJoin">
            <i class="fas fa-user-plus"></i> Join
          </button>
          <button class="button border neumorphic hover n-active" @click="emitCreate">
            <i class="fas fa-plus"></i> Create
          </button>
        </div>
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
  margin-top: 1rem;

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
  flex-direction: column;
}

#message #steps p {
  padding: 0.25rem;
  font-size: 0.9rem;
  transition: box-shadow 0.4s;
}

#message .button {
  display: block;
  padding: 0.5rem 1rem;

  margin-right: 1rem;
  outline: none;

  background-color: white;

  font-weight: 700;
  color: var(--sql-light-primary);
}

#message .button:last-child {
  margin-right: 0;
}
#message input {
  display: flex;
  margin: 0.75rem auto;
  background-color: white;
}

#message input::placeholder {
  color: var(--sql-primary);
  opacity: 0.5;
}

#message #sessionGroup {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

//Medium sized screens
@media screen and (min-width: 800px) {
  #message {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 50%;
  }
  #message #steps p {
    font-size: 100%;
  }
}
</style>