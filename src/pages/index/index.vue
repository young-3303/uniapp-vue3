<template>
  <!--<view class="content">-->
  <!--  <image class="logo" src="@/static/logo.png" />-->
  <!--  <view class="text-area">-->
  <!--    <text class="title">{{ title }}</text>-->
  <!--  </view>-->
  <!--</view>-->
  <view>
    <canvasView @webview-loaded="loaded" :src="src"></canvasView>
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
          mode="base"
          title=""
          confirmText="确定"
          :duration="2000"
          :before-close="true"
          @confirm="confirm">
        听完了歌曲，下面有一些话我想对你说
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import CanvasView from "@/components/canvasView/index.vue";
const title = ref('Hello')
const popup = ref()
// const src = ref<string>('http://121.40.131.144/')
const src = ref<string>('https://young-3303.github.io/forever_young/')
let innerAudioContext: any = null
function play():void {
  if (true) {
    innerAudioContext = uni.createInnerAudioContext();
    innerAudioContext
        .autoplay = true;
    innerAudioContext
        .src = '/static/audio/manman.mp3';
    innerAudioContext
        .onPlay(() => {
          console
              .log('开始播放');
        });
    innerAudioContext
        .onError((res) => {
          console
              .log(res.errMsg);
          console
              .log(res.errCode);
        });
  }
}

function loaded() {
  play()
  innerAudioContext.onEnded(() => {
    console.log('结束了')
    popup.value.open()
  })
}

function onEnded() {
  console.log('onEnded');
}
function confirm() {
  uni.redirectTo({
    url: 'pages/Confession/index'
  })
}
onMounted(() => {
  console.log('hala', popup.value)
  popup.value.open()
})

</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
