<template xmlns="">
  <view class="home">
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
          mode="base"
          message="成功消息"
          title=""
          confirmText="喜欢"
          cancelText="不喜欢"
          :duration="2000"
          :before-close="true"
          @close="close"
          @confirm="confirm">
        你喜欢我吗
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";

const popup = ref()
function close() {
  popup.value.close()
}
function confirm(val) {
  uni.redirectTo({
    url: '/pages/index/index'
  })
}
function open() {
  popup.value.open()
}
onMounted(() => {
  open()
})
</script>
<style>
.home {
  height: 100vh;
  background: url("~@/assets/img/bb.png");
  background-size: contain;
}
</style>
