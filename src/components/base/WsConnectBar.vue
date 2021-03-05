<template>
  <v-expand-transition>
    <v-system-bar
      v-if="meta.show"
      dark
      class="caption justify-center"
      :color="meta.color"
      :style="meta.style"
    >
      <template v-if="meta.isDisConnected">
        <v-icon size="14">{{ $icons.mdiLinkOff }}</v-icon>
        <span>连接已断开</span>
        <v-spacer />
        <span @click="handleReconnect">重新连接</span>
      </template>
      <template v-if="meta.isConnecting">
        <v-progress-circular
          indeterminate
          size="16"
          width="1"
          class="mr-2"
          color="rgba(255, 255, 255, 0.7)"
        />
        <span>正在连接</span>
      </template>
    </v-system-bar>
  </v-expand-transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { SOCKET_STATE } from "~/types";

@Component
class SystemBar extends Vue {
  @State((state) => state.app.websocket.state) state;

  @State((state) => state.app.bottomNav.value) bottomNav;

  get meta() {
    const isConnecting = this.state === SOCKET_STATE.CONNECTING;
    const isDisConnected = [SOCKET_STATE.CLOSED, SOCKET_STATE.ERROR].includes(
      this.state
    );
    return {
      isConnecting,
      isDisConnected,
      color: isConnecting ? "info" : "error",
      show: isConnecting || isDisConnected,
      style: { bottom: this.bottomNav ? "64px" : "0" },
    };
  }

  handleReconnect() {
    // this.$ws._connect();
  }
}
export default SystemBar;
</script>
