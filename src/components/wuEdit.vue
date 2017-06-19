<template>
  <div id="wuEdit" class="wuEdit" >
    <div id="editor-trigger" ></div>
  </div>
</template>
<script>
  export default {
    name: 'wuEdit',
    props: ['value'],
    data(){
        return {
          innerText:this.value,
          editor: '',
          }
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
    },
    mounted() {
      // console.log('dd')
      var quill = new Quill('#editor-trigger', {
      theme: 'bubble'
      });
    }
  }
</script>
<style>
.wuEdit {

}
</style>