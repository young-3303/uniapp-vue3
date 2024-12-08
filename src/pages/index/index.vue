<template>
  <!--<view class="content">-->
  <!--  <image class="logo" src="@/static/logo.png" />-->
  <!--  <view class="text-area">-->
  <!--    <text class="title">{{ title }}</text>-->
  <!--  </view>-->
  <!--</view>-->
  <view>
    <canvasView @webview-loaded="loaded" :src="src"></canvasView>
  </view>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import CanvasView from "@/components/canvasView/index.vue";
const title = ref('Hello')
// const src = ref<string>('http://121.40.131.144/')
const src = ref<string>('https://young-3303.github.io/forever_young/')
function play():void {
  if (!import.meta.env.PROD) {
    const innerAudioContext = uni.createInnerAudioContext();
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
  console.log('loaded');
  play()
}
onMounted(() => {

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
