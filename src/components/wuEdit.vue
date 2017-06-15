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
        const dom = this.$el;
        if(window.getSelection) {
          console.log(window.getSelection().getRangeAt(0))
          const range = window.getSelection().getRangeAt(0);
          const newNode = document.createElement('p');
          newNode.appendChild(document.createTextNode("New Node Inserted Here"));
          range.insertNode(newNode);
        }
      }
    }
  }
</script>
<style>
.wuEdit {

}
</style>