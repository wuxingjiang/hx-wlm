<template>
  <div id="InputCount" class="InputCount">
    <span>{{length || 0}}</span>/{{maxLength}}</div>
  </div>
</template>
<script>
export default {
  name: 'InputCount',
  props: ['length', 'maxLength'],
  data() {
    return {
      msg: 'InputCount'
    }
  }
}
</script>
<style lang="less">
.InputCount {
  color:#999;
  font-size: 12px;
}
</style>