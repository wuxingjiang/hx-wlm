<template>
  <div id="InputPlaceholder" class="InputPlaceholder">
    <svg class="icon e-icon" aria-hidden="true">
        <use xlink:href="#icon-shuru"></use>
    </svg>
    <span>
    说说你的想法…
    </span>
  </div>
</template>
<script>
export default {
  name: 'InputPlaceholder',
  data() {
    return {
      msg: 'InputPlaceholder'
    }
  }
}
</script>
<style lang="less">
.InputPlaceholder {
  color: #999;
    .e-icon {
    /* 通过设置 font-size 来改变图标大小 */
    width: .466667rem; height: .466667rem;
    color: #999999;
  }
}
</style>