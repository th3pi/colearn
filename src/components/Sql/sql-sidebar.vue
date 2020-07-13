<template>
  <div class="sql-sidebar">
    <sidebar>
      <template #title>
        <i class="fas fa-info-circle"></i>
        <h3>Session Info</h3>
      </template>
      <!-- Cheat sheet body -->
      <template #sessionInfo>
        <!-- Each cheat is its own bullet point using the li tag -->
        <div class="sidebar-card neumorphic border" style="justify-content: space-between;">
          <p>Session name</p>
          <strong @click="copyId">{{sessionInfo.sessionId}}</strong>
        </div>
        <div class="sidebar-card neumorphic border" style="justify-content: space-between;">
          <p>Session pin</p>
          <strong @click="copyPin">{{sessionInfo.pin}}</strong>
        </div>
        <div class="sidebar-card neumorphic border" style="justify-content: space-between;">
          <p>Session link</p>
          <button id="copyButton" class="button neumorphic n-active" @click="copyLink">
            <scale-transition mode="out-in">
              <div
                v-if="clipboard.clip != 'https://colearn.tech/learn-sql/' + sessionInfo.sessionId"
                key="notCopied"
              >
                {{clipboard.message}}
                <i class="far fa-copy"></i>
              </div>
              <div v-else key="copied">{{clipboard.message}}</div>
            </scale-transition>
          </button>
        </div>
        <div class="sidebar-card-list neumorphic border">
          Sample tables
          <div class="sample-tables">
            <p
              v-for="(table, index) in sampleTables"
              :key="index"
              @click="openTable(table)"
            >{{table}}</p>
          </div>
        </div>

        <!-- Settings menu -->

        <h3 class="section-title">
          <i class="fa fa-cogs" aria-hidden="true"></i>Settings
          <span style="opacity: .5; font-size: .65rem;">(Coming soon)</span>
        </h3>
        <div class="sidebar-card neumorphic border">
          <el-tabs v-model="settings.currentTab" :stretch="true" class="settings-menu">
            <el-tab-pane label="Session" name="session" key="session">
              <div class="settings-item">
                <p>Session status</p>
                <el-switch
                  disabled
                  v-model="sessionSettings.status"
                  active-color="var(--sql-light-primary)"
                  inactive-color="var(--danger-lighter)"
                  @change="sessionStatusToggle"
                ></el-switch>
              </div>
              <br />
              <div class="settings-item">
                <p>Require pin</p>
                <el-switch
                  disabled
                  v-model="sessionSettings.pin"
                  active-color="var(--sql-light-primary)"
                  inactive-color="var(--dark)"
                  @change="sessionPinToggle"
                ></el-switch>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Sync box" name="syncbox" key="syncbox">
              <div class="settings-item">
                <p>Sync box status</p>
                <el-switch
                  disabled
                  v-model="syncboxSettings.status"
                  active-color="var(--sql-light-primary)"
                  inactive-color="var(--danger-lighter)"
                  @change="syncboxStatusToggle"
                ></el-switch>
              </div>
              <br />
              <div class="settings-item">
                <p>Dark mode</p>
                <el-switch
                  v-model="syncboxSettings.darkMode"
                  active-color="var(--dark)"
                  inactive-color="grey"
                  @change="syncboxDarkModeToggle"
                ></el-switch>
              </div>
              <div class="settings-item-2">
                <p>Height</p>
                <el-slider
                  v-model="syncboxSettings.height"
                  class="open-sans"
                  :min="1.5"
                  @change="syncboxHeightSlider"
                  :step=".5"
                  tooltip-class="open-sans"
                ></el-slider>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Session history" name="history" key="history">
              <div class="settings-item">
                <p>Share my logs</p>
                <el-switch
                  disabled
                  v-model="sessionHistory.shareLogs"
                  active-color="var(--sql-light-primary)"
                  inactive-color="var(--sql-lighter-dark)"
                  @change="sessionHistoryShareLogToggle"
                ></el-switch>
              </div>
              <br />
              <div class="settings-item">
                <p>Show entire history</p>
                <el-switch
                  disabled
                  v-model="sessionHistory.showAll"
                  active-color="var(--sql-light-primary)"
                  inactive-color="var(--sql-lighter-dark)"
                  @change="sessionHistoryShowAllToggle"
                ></el-switch>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- Users in session menu -->

        <h3 class="section-title">
          <i class="fas fa-users"></i>Colearners in session
        </h3>
        <div class="session-profiles" v-for="(socket, index) in userSocket" :key="index">
          <div class="sidebar-card neumorphic border">
            <div class="details">
              <i class="fas fa-user"></i>
              <div>
                <p class="name">{{socket.username}}</p>
                <p>Online</p>
              </div>
            </div>
            <div class="options">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
        </div>
      </template>
    </sidebar>
  </div>
</template>

<script>
import sidebar from "@/components/General/sidebar.vue";
import { Tabs, TabPane, Switch, Slider } from "element-ui";

import { mapGetters } from "vuex";
import { ScaleTransition } from "vue2-transitions";
import { EventBus } from "@/bus/bus";

export default {
  name: "sql-sidebar",
  components: {
    sidebar,
    ScaleTransition,
    "el-tabs": Tabs,
    "el-tab-pane": TabPane,
    "el-switch": Switch,
    "el-slider": Slider
  },
  props: { sessionInfo: Object },
  data() {
    return {
      clipboard: {
        message: "Copy",
        clip: ""
      },
      sampleTables: [
        "Artists",
        "Albums",
        "Customers",
        "Employees",
        "Genres",
        "Invoices"
      ],
      settings: {
        currentTab: "session"
      },
      sessionSettings: {
        status: true,
        pin: true
      },
      syncboxSettings: {
        status: true,
        darkMode: false,
        height: 1.5
      },
      sessionHistory: {
        shareLogs: true,
        showAll: false
      }
    };
  },
  computed: {
    ...mapGetters({ userSocket: "getSocket" })
  },
  methods: {
    copyId() {
      this.$clipboard(this.sessionInfo.sessionId);
    },
    copyPin() {
      this.$clipboard(this.sessionInfo.pin);
    },
    copyLink() {
      this.clipboard.clip =
        "https://colearn.tech/learn-sql/" + this.sessionInfo.sessionId;
      this.clipboard.message = "Copied!";
      this.$clipboard(this.clipboard.clip);
    },
    sessionStatusToggle(value) {
      EventBus.$emit("session-status-toggle", value);
    },
    sessionPinToggle(value) {
      EventBus.$emit("session-pin-toggle", value);
    },
    syncboxStatusToggle(value) {
      EventBus.$emit("syncbox-status-toggle", value);
    },
    syncboxDarkModeToggle(value) {
      EventBus.$emit("syncbox-dark-mode-toggle", value);
    },
    syncboxHeightSlider(value) {
      EventBus.$emit("syncbox-height-slider", value);
    },
    sessionHistoryShareLogToggle(value) {
      EventBus.$emit("session-history-share-log-toggle", value);
    },
    sessionHistoryShowAllToggle(value) {
      EventBus.$emit("session-history-show-all-toggle", value);
    },
    openTable(table) {
      EventBus.$emit("open-table", table);
    }
  }
};
</script>

<style lang="scss">
header#el-drawer__title {
  margin-bottom: 0 !important;
}
.sidebar-card {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: white;
  margin: 0.5rem;

  padding: 0.5rem 1rem;

  border-radius: 5px;

  color: var(--sql-light-primary);
  .details {
    display: block;
  }
  transition: border 0.4s;
  i {
    transform: scale(1.4);
    margin-right: 1rem;
  }
  p:first-child {
    font-size: 1rem;
  }
  p:last-child {
    font-size: 0.8rem;
    opacity: 0.8;
    color: var(--success);
  }
  #copyButton {
    i {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
}

.settings-menu {
  .settings-item {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 85%;
    }
  }
  .settings-item-2 {
    margin-top: 0.5rem;
    p {
      font-size: 90%;
    }
    .el-slider {
      margin: 0 1rem;
    }
  }
}

.session-profiles {
  .sidebar-card {
    justify-content: space-between;
    .details {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
    }
  }
}

.sidebar-card-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--sql-light-primary);
  padding-top: 0.5rem;
  .sample-tables {
    display: grid;
    width: 95%;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 5px;
    margin: 0.5rem 0;
    p {
      font-size: 90%;
      padding: 0.4rem 0.15rem;

      background-color: var(--sql-light-primary);

      color: white;

      border-radius: 5px;

      text-align: center;

      cursor: pointer;
    }
  }
  margin: 0.5rem;
}

.section-title {
  font-size: 100%;
  text-align: center;
  color: var(--dark);
  margin: 0.5rem 0;
}

@media screen and (max-width: 480px) {
  .sidebar-card {
    padding: 0.3rem 0.35rem;

    border-radius: 5px;

    color: var(--sql-light-primary);
    .details {
      display: block;
    }
    transition: border 0.4s;
    strong {
      font-size: 0.85rem;
    }
    i {
      transform: scale(1);
      margin-right: 0.5rem;
    }
    p:first-child {
      font-size: 0.85rem;
    }
    p:last-child {
      font-size: 0.7rem;
      opacity: 0.8;
      color: var(--success);
    }
    #copyButton {
      i {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
      }
    }
  }

  .section-title {
    font-size: 85%;
  }
}
</style>