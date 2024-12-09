<template>
  <view class="container">
    <view :style="{opacity: visibility ? '1' : '0'}" id="romanticText" ref="text">{{ textContent }}</view>
  </view>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

const text = ref()
const textContent = ref('遇见你的每一天都是星辰大海')
const visibility = ref(false)
onMounted(() => {
  play()
  let index = 0;
  const words = ["遇见你的每一天都是星辰大海。",
    "与你一见如故，尽余生之欢。",
    "你是我心中最美的星辰。",
    "愿陪你走完这漫漫人生路。"];

  function changeText() {
    visibility.value = false
    setTimeout(() => {
      textContent.value = words[index];
      visibility.value = true
      index = (index + 1) % words.length;
    }, 500); // 等待半秒让淡出效果完成
  }
  setInterval(changeText, 6000); // 每6秒更换一次文字
})
let innerAudioContext: any = null
function play():void {
  if (true) {
    innerAudioContext = uni.createInnerAudioContext();
    innerAudioContext
        .autoplay = true;
    innerAudioContext
        .src = '/static/audio/luxiaoyu.mp3';
    innerAudioContext.loop = true;
    innerAudioContext
        .onPlay(() => {
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
</script>


<style scoped lang="scss">

.container {
  text-align: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  overflow: hidden;
}

#romanticText {
  font-size: 2em;
  color: white;
  animation: fadeInOut 5s infinite;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
