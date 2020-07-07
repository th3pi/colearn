<template>
  <page>
    <template #logo>
      <account-logo id="logo" fill="var(--sql-light-primary)" />
    </template>
    <vue-topprogress ref="topProgress" :height="5"></vue-topprogress>
    <div v-if="account" class="profile">
      <div class="name" :class="{'editing' : edit.basic}">
        <h3>
          Basic info
          <i class="fas fa-edit" @click="edit.basic = true" v-if="!edit.basic"></i>
          <i class="far fa-check-square" @click="edit.basic = false" v-if="edit.basic"></i>
        </h3>
      </div>
      <collapse-transition mode="out-in">
        <div class="profile-body neumorphic border" v-if="!edit.basic" key="nonEdit">
          <div class="row">
            <p>First name</p>
            <p>{{account.firstName}}</p>
          </div>
          <div class="row">
            <p>Last name</p>
            <p>{{account.lastName}}</p>
          </div>
          <div class="row">
            <p>Email</p>
            <p>{{user.data.email}}</p>
          </div>
          <div class="row">
            <p>Password</p>
            <p
              style="filter: blur(.4rem);"
              onmousedown="return false;"
              onselectstart="return false;"
              class="password"
            >AStrongPassword</p>
          </div>
        </div>
        <div v-else class="profile-body neumorphic" key="edit">
          <div class="row">
            <p>First name</p>
            <cl-input
              type="name"
              :validate="true"
              @name-validity="valid.firstName = $event"
              @name="basic.firstName = $event"
              :placeholder="account.firstName"
            ></cl-input>
          </div>
          <div class="row">
            <p>Last name</p>
            <cl-input
              type="name"
              :validate="true"
              @name-validity="valid.lastName = $event"
              @name="basic.lastName = $event"
              :placeholder="account.lastName"
            ></cl-input>
          </div>
          <div class="row">
            <p>Email</p>
            <cl-input
              type="email"
              :validate="true"
              @name-validity="valid.lastName = $event"
              @name="basic.email = $event"
            ></cl-input>
          </div>
          <div class="row">
            <p>Password</p>
            <cl-input
              type="password"
              :validate="true"
              @name-validity="valid.lastName = $event"
              @name="basic.password = $event"
            ></cl-input>
          </div>
        </div>
      </collapse-transition>
      <div class="name">
        <h3>Billing info</h3>
      </div>
      <div class="profile-body neumorphic inset">
        <div class="coming-soon">
          <h2>
            <i class="fas fa-stopwatch"></i> Coming soon!
          </h2>
        </div>
      </div>
      <div class="name">
        <h3>Usage info</h3>
      </div>
      <div class="profile-body neumorphic inset">
        <div class="coming-soon">
          <h2>
            <i class="fas fa-stopwatch"></i> Coming soon!
          </h2>
        </div>
      </div>
    </div>
  </page>
</template>

<script>
import page from "@/components/General/page";
import ENUM from "@/enums/firebase_enum";
import loader from "@/mixins/loader";
import clInput from "@/components/General/cl-input";
import accountLogo from "@/assets/img/titles/account-logo";
import { mapGetters } from "vuex";
import { CollapseTransition } from "vue2-transitions";

export default {
  name: "account",
  mixins: [loader],
  components: { page, clInput, accountLogo, CollapseTransition },
  data() {
    return {
      account: null,
      loadState: ENUM.INIT,
      edit: {
        basic: null,
        billing: null
      },
      basic: {
        firstName: null,
        lastName: null,
        email: null,
        password: null
      },
      focus: null,
      valid: {
        firstName: null,
        lastName: null,
        email: null,
        password: null
      }
    };
  },
  computed: {
    ...mapGetters({ user: "user" })
  },
  created() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      this.loadState = ENUM.LOADING;
      this.$http
        .get("/user/get-user", {
          params: {
            email: this.user.data.email
          }
        })
        .then(res => {
          this.loadState = ENUM.LOADED;
          this.account = res.data;
        })
        .catch(err => {
          console.log(err);

          this.loadState = ENUM.ERROR;
        });
    }
  },
  watch: {
    loadState(newValue) {
      if (newValue == ENUM.LOADING) this.$refs.topProgress.start();
      if (newValue == ENUM.LOADED) this.$refs.topProgress.done();
      if (newValue == ENUM.ERROR) this.$refs.topProgress.fail();
    }
  }
};
</script>

<style lang="scss">
#logo {
  width: 20rem;
  height: auto;
}
.profile {
  display: flex;
  align-items: center;
  flex-direction: column;
  color: var(--sql-light-primary);
}
.name {
  margin-top: 1rem;
  i {
    cursor: pointer;
    margin-left: 1rem;

    transition: 0.4s;
  }
  i:hover {
    color: var(--sql-primary);
  }

  transition: 0.5s;
}
.editing {
  padding: 0 0.5rem;

  border-radius: 5px;

  background-color: var(--sql-light-primary);
  color: white;
  i {
    margin: 0;
    margin-left: 1rem;
    transition: 0.4s;
  }

  i:hover {
    opacity: 0.9;
  }
}

.profile-body {
  display: block;
  width: 85%;
  margin: 1rem auto;

  border-radius: 5px;

  transition: 0.4s ease-in-out;

  .row {
    display: grid;
    gap: 1rem;
    grid-template-columns: 10rem 1fr;
    margin: 1rem 2rem;
    p {
      display: inline;
      margin-right: 1rem;
    }
    p:last-child {
      margin-right: 0;
    }
    .password {
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
    }
    #field {
      padding: 0;
      input {
        margin: 0;
      }
      p {
        display: block;
      }
      .peek {
        margin-left: -1.5rem;
      }
    }
  }

  .coming-soon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
  }
}

.loader {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (min-width: 1250px) {
  .profile-body {
    width: 800px;
  }
}
</style>