<template>
  <v-container class="f-bg-greyscale-7" style="height: 100%">
    <div class="py-2" v-if="loading">
      <f-loading :loading="loading"></f-loading>
    </div>
    <div class="text-center">
      <f-button-tabs v-model="tabIndex" class="mb-4">
        <template #tabs>
          <v-btn
            v-for="(item, index) in tabs"
            :key="index"
            :data-value="index"
            :ripple="false"
            class="px-4 py-3"
          >
            <span>{{ item.text }}</span>
          </v-btn>
        </template>
      </f-button-tabs>
    </div>

    <div v-if="tabIndex === 0" class="tabs-items">
      <div v-if="flips.auctioning.length">
        <auction-item
          v-for="flip in flips.auctioning"
          :key="flip.id"
          :flip="flip"
          class="mb-4"
        />
      </div>
      <div v-else class="empty f-body-2">
        {{ $t("auction.list.tab.empty") }}
      </div>
    </div>
    <div v-if="tabIndex === 1" class="tabs-items">
      <div v-if="flips.done.length">
        <auction-item
          v-for="flip in flips.done"
          :key="flip.id"
          :flip="flip"
          class="mb-4"
        />
      </div>
      <div v-else class="empty f-body-2">
        {{ $t("auction.list.tab.empty") }}
      </div>
    </div>
    <!-- <v-tabs
      v-model="tab"
      centered
      hide-slider
      background-color="transparent"
      color="primary"
      class="tabs mb-4"
    >
      <v-tab
        active-class="tab-active"
        class="f-bg-greyscale-6 tab px-4"
        href="#auctioning"
        :ripple="false"
      >
        {{ $t("auction.list.tab.at-auction") }}
      </v-tab>
      <v-tab
        active-class="tab-active"
        class="f-bg-greyscale-6 tab px-4"
        href="#done"
        :ripple="false"
      >
        {{ $t("auction.list.tab.done") }}
      </v-tab>
    </v-tabs> -->
    <!-- <v-tabs-items v-model="tab" class="tabs-items">
      <v-tab-item v-for="(val, name) in flips" :key="name" :value="name">
        <div v-if="val.length">
          <auction-item
            v-for="flip in val"
            :key="flip.id"
            :flip="flip"
            class="mb-4"
          />
        </div>
        <div v-else class="empty f-body-2">
          {{ $t("auction.list.tab.empty") }}
        </div>
      </v-tab-item>
    </v-tabs-items> -->
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { IFlip } from "~/services/types/vo";
import AuctionItem from "~/components/particles/AuctionItem.vue";
import { FlipAction } from "~/types";

@Component({
  components: {
    AuctionItem,
  },
})
export default class AuctionsPage extends Mixins(mixins.page) {
  loading = false;
  has_next = true;
  cursor = null as string | null;
  flips = {
    done: [] as IFlip[],
    auctioning: [] as IFlip[],
  };
  tabIndex = 0;

  get appbar() {
    if (!this.isLogged) {
      return {
        back: false,
        avatar: false,
        customContent: true,
        mixinImmersive: this.$utils.helper.isMixin(),
      };
    }
    return {
      back: false,
      customContent: true,
      avatar: true,
      mixinImmersive: this.$utils.helper.isMixin(),
    };
  }

  get tabs() {
    return [
      {
        text: this.$t("auction.list.tab.at-auction"),
        value: "auctioning",
      },
      {
        text: this.$t("auction.list.tab.done"),
        value: "done",
      },
    ];
  }

  mounted() {
    this.requestFlips();
  }

  get bottomNav() {
    return "auctions";
  }

  get title() {
    return `${this.$t("auctions.title")}`;
  }

  async requestFlips() {
    if (this.loading || !this.has_next) {
      return;
    }
    this.loading = true;
    try {
      const res = await this.$http.getFlips({
        limit: 20,
        cursor: this.cursor,
      });
      const flips = res?.data?.flips || [];
      this.has_next = res?.data?.pagination?.has_next || false;
      this.cursor = res?.data?.pagination?.next_cursor || null;
      flips.forEach((v) => {
        if (v.action === FlipAction.FlipDeal) {
          this.flips.done.push(v);
        } else {
          this.flips.auctioning.push(v);
        }
      });
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .tab {
    border-radius: 8px;
    overflow: hidden;
    height: 37px;
    line-height: 37px;
    color: #000000 !important;
    text-transform: capitalize;
    font-size: 13px;
    letter-spacing: -0.0025em;
    &-active {
      color: #ffffff !important;
      background-color: #000000 !important;
    }
  }
  .tabs-items {
    background-color: transparent;
  }
}

.theme--dark.v-application {
  .tab {
    color: #ffffff !important;
    &-active {
      background-color: #ffffff !important;
      color: #000000 !important;
    }
  }
}

.empty {
  background: url(../assets/images/no_auction.png) no-repeat 110px / 110px;
  background-position-x: center;
  background-position-y: calc(100% - 52px);
  padding-top: 32.5vh;
  text-align: center;
}
</style>
