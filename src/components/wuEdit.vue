<template>
  <div id="wuEdit" class="wuEdit" contenteditable="true"
    v-html="innerText"
    @focus="eventFocus"
    @blur="eventBlur"
    @input="changeText">
  </div>
</template>
<script>
  export default {
    name: 'wuEdit',
    props: ['value'],
    data(){
        return {innerText:this.value}
    },
    methods:{
      changeText(){
        this.innerText = this.$el.innerHTML;
        this.$emit('input',this.innerText);
      },
      eventFocus() {
        console.log('get focus')
      },
      eventBlur() {
        console.log(this.$el);
        this.$emit('recodeRange')
      }
    }
  }
</script>
<style>
.wuEdit {

}
</style>