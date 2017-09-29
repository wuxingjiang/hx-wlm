<template>
  <div id="InputPlaceholder" class="InputPlaceholder">
    <svg class="icon e-icon" aria-hidden="true">
        <use xlink:href="#icon-shuru"></use>
    </svg>
    <span>
      {{placeholder}}
    </span>
  </div>
</template>
<script>
export default {
  name: 'InputPlaceholder',
  props: ['placeholder'],
  data () {
    return {
      msg: 'InputPlaceholder'
    }
  },
  updated () {
    console.log('rander')
  }
}
</script>
<style lang="less">
.InputPlaceholder {
  color: #999;
  font-size: 14px;
    .e-icon {
    /* 通过设置 font-size 来改变图标大小 */
    width: .4rem; height: .4rem;
    color: #999999;
  }
}
</style>