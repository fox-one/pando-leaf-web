<template>
  <v-layout column>
    <v-layout align-start justify-start class="collaterals-ratio-chart pl-5">
      <v-layout
        class="collateral-ratio-bar"
        v-for="(item, index) in chartData"
        :key="item.value"
        align-end
        column
      >
        <v-layout align-end class="rounded-pill mr-10" :style="styles[index]">
          <v-img
            class="collateral-ratio-chart-icon"
            width="24"
            height="24"
            aspect-ratio="1"
            @load="
              onLogoLoad(
                `chart-img-${item.asset.id}`,
                item.asset.logo,
                item.asset.id
              )
            "
            :src="item.asset.logo"
          >
            <canvas style="display: none" :id="`chart-img-${item.asset.id}`" />
          </v-img>
        </v-layout>
        <div
          :class="`align-self-start ${labelColor} f-caption mt-2 font-weight-medium`"
        >
          {{ $utils.number.toPercent(getPercent(item)) }}
        </div>
        <div
          class="align-self-start f-caption mt-2 font-weight-medium f-greyscale-4"
        >
          {{ item.asset.symbol || "" }}
        </div>
      </v-layout>
    </v-layout>
    <div :class="`divider ${dividerColor} mt-2`" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { IAsset, IVault, ICollateralRatio } from "~/services/types/vo";

@Component({})
export default class CollateralsRatio extends Vue {
  @Prop() vaults!: IVault[];
  @Prop({ default: "f-greyscale-7" }) labelColor!: string;
  @Prop({ default: "f-bg-greyscale-3" }) dividerColor!: string;
  @Getter("global/getAssetById") getAssetById!: (id) => IAsset;
  @Getter("global/getCollateral") getCollateral;

  colors = {};
  styles = [] as string[];

  get chartData() {
    const chartDataMap = {} as any;
    for (const vault of this.vaults) {
      const col = this.getCollateral(vault.collateral_id);
      const asset = this.getAssetById(col.gem);
      if (chartDataMap[asset.id] !== undefined) {
        chartDataMap[asset.id].value += Number(vault.ink) * 1;
      } else {
        const item = {
          value: Number(vault.ink) * Number(asset.price) || 0,
          asset: asset,
          color: "808080",
        } as ICollateralRatio;
        chartDataMap[asset.id] = item;
      }
    }
    const chartData = [] as ICollateralRatio[];
    for (const k in chartDataMap) {
      chartData.push(chartDataMap[k]);
    }
    chartData.sort((a, b) => {
      a.value - b.value;
      return 0;
    });
    return chartData;
  }

  @Watch("colors")
  onChanged() {
    const styles = this.chartData.map((item) => {
      return `background-color: #${this.getColor(
        item
      )}; height: ${this.getHeight(item)}px;`;
    });
    this.styles = styles;
  }

  get total() {
    let t = 0;
    for (const data of this.chartData) {
      t += data.value;
    }
    return t;
  }

  onLogoLoad(id, url, itemId) {
    if (this.colors[itemId]) return;
    const element = document.getElementById(id) as HTMLCanvasElement;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      element.height = 24;
      element.width = 24;
      const canvas = element.getContext("2d");
      canvas?.drawImage(img, 0, 0, 24, 24);
      const imageData = canvas?.getImageData(0, 0, 24, 24);
      const color = this.getHex(
        imageData?.data[48],
        imageData?.data[49],
        imageData?.data[50],
        imageData?.data[51]
      );
      Vue.set(this.colors, itemId, color);
      img.onload = null;
      img.remove();
    };
    img.src = url;
  }

  getHex(red, green, blue, alpha: number | undefined = undefined) {
    let r = Number(red).toString(16);
    let g = Number(green).toString(16);
    let b = Number(blue).toString(16);

    // 补0
    r.length == 1 ? (r = "0" + r) : "";
    g.length == 1 ? (g = "0" + g) : "";
    b.length == 1 ? (b = "0" + b) : "";

    let hex = r + g + b;
    if (alpha !== undefined) {
      let a = alpha.toString(16);
      a.length == 1 ? (a = "0" + a) : "";
      hex += a;
    }
    return hex;
  }

  getPercent(item: ICollateralRatio) {
    if (this.total === 0) return 0;
    return item.value / this.total;
  }

  getColor(item: ICollateralRatio) {
    return this.colors[item.asset.id] ? this.colors[item.asset.id] : item.color;
  }

  getHeight(item: ICollateralRatio) {
    const height = (item.value / this.chartData[0]?.value) * 90 + 24;
    if (height) {
      return height.toFixed(0);
    }
    return 0;
  }
}
</script>
<style lang="scss">
.collaterals-ratio-chart {
  height: 172px;
}

.collateral-ratio-bar {
  width: 64px;
  align-self: flex-end;
  flex: 0 0 auto;
  min-height: 64px;
}

.collateral-ratio-chart-icon {
  position: relative;
  bottom: 0px;
}
.divider {
  height: 0.5px;
  opacity: 0.24;
}
</style>
