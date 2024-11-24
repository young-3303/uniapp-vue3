<template xmlns="">
  <view class="home">
    <button @click="open">打开弹窗</button>
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
import {ref} from "vue";

const popup = ref()
function close() {
  popup.value.close()
}
function confirm(val) {

}
function open() {
  popup.value.open()
}
</script>
