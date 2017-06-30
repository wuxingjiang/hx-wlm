<template>
  <div @click="eventClick" class="wuEditor">
    <textarea name="" id="editorElem" cols="30" rows="10">
      
    </textarea>
  </div>
</template>
<script>
export default {
  name: 'wuEditor',
  props: ['value','insetPlacehold'],
  data() {
    return {
      eValue: '',
      editor: '',
    }
  },
  watch: {
    eValue(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.eValue = val
      if(!val) {
        this.editor.$txt.html('')
      }
    }
  },
  computed: {
   
  },
  methods: {
    eventClick() {
      this.editor.$txt.focus();
    },
  },
  created () {
    
    this.$on('insertImg', (val) => {

      this.editor.command('InsertImage', false, `http://imgzq.hexun.com/chatRoom/static/ff/${val}.gif`, event)
    })
  },
  mounted() {
    this.editor = new _$$_E('editorElem');
    this.editor.init();
    this.editor.change = () => {
      const html = this.editor.$txt.html();
      if(html.trim()) {
        this.eValue = html
      }
    }
    this.editor.command('string', false, this.insetPlacehold, event)
  }
}
</script>
<style lang="less">
.wuEditor {
  height: 100%;
}
</style>