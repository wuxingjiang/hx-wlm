<template>
  <div id="TextareaGroup" class="TextareaGroup">
    <div v-transfer-dom>
      <popup 
      v-model="selfEditShow"
      @on-hide="eventClose"
      >
        <group :title="title" class="edit-theme-group">
          <div class="edit-theme-group-textarea">
            <div  class="e-t-g-t-con">
              <x-textarea 
              v-if="type === 'textArea'"
              :height="100"
              :show-counter="false"
              :max="max"
              v-model="editValue"
              ></x-textarea>
              <div
              id="editor-trigger"
              ref="quillEdit"
              :class="['e-t-g-t-c-edit', editType == 'send'?'':'e-t-g-t-c-edit-other']"
              v-if="type === 'wuEdit'"
              v-model = "editValue"
              >
              </div>
            </div>
          <div>
          <div class="e-t-g-t-footer">
            <input-count 
            :maxLength="max"
            :length = "editLength"
            class="e-t-g-t-f-count"></input-count>
            <div class="e-t-g-t-f-group">
              <div v-if="type === 'wuEdit'" class="e-t-g-t-f-g-smile">
                <x-button
                  class="f-g-b-emoji"
                  @click.native="setEmojiShow"
                  plain>
                    <svg class="icon e-xiaolian" aria-hidden="true">
                        <use xlink:href="#icon-xiaolian"></use>
                    </svg>
                  </x-button>
              </div>
              <div class="e-t-g-t-f-g-send">
                <x-button
                :class="['f-g-b-btn', !disabled?'f-g-b-send':'f-g-b-disabled']"
                :disabled="disabled"
                @click.native = "eventSend"
                plain>
                  发送
                </x-button>
              </div>
            </div>
          </div>

          <swiper 
            height="150px"
            :dots-position="'center'"
            v-if="emojiShow">
            <swiper-item
             class="emoji-container"
             v-for="(item, index) in emojiArr"
             :key='index'
             >
              <flexbox
               wrap="wrap"
               :gutter="0"
               justify="flex-start"
               align="center">
                <flexbox-item
                class="emoji-list"
                v-for="(emoji,i) in item"
                :key="i"
                :span="1/8"
                >
                  <img @click="eventChose(i+1)" :src="`http://imgzq.hexun.com/chatRoom/static/ff/${i+1}.png`" alt="">
                </flexbox-item>
                <flexbox-item v-if="needDel">
                  <svg @click="delText" class="icon e-xiaolian" aria-hidden="true">
                      <use xlink:href="#icon-xiaolian"></use>
                  </svg>
                </flexbox-item>
              </flexbox>
              
             </swiper-item>
          </swiper>      
          <input-placeholder 
          v-if="placeholderShow" 
          :placeholder='placeholder' 
          class="e-t-g-t-g-placeholder"></input-placeholder>
          </div>
          </div>
        </group>
      </popup>
    </div>
  </div>
</template>
<script>
import InputCount from '@/components/InputCount.vue'
import InputPlaceholder from '@/components/InputPlaceholder.vue'
import wuEdit from '@/components/wuEdit.vue'
import { 
  Group,
  XButton,
  Popup,
  TransferDom,
  XTextarea ,
  WechatEmotion as Emotion,
  Divider,
  Swiper,
  SwiperItem,
  Flexbox,
  FlexboxItem,
  } from 'vux'

export default {
  name: 'TextAreaGroup',
  directives: {
    TransferDom
  },
  props:['max', 'editShow', 'value', 'title', 'type', 'placeholder', 'editType'],

  components: {
    Group,
    XButton,
    Popup,
    XTextarea,
    Emotion,
    Divider,
    Swiper,
    SwiperItem,
    Flexbox,
    FlexboxItem,
    'input-count': InputCount,
    'input-placeholder':InputPlaceholder,
    'wu-edit': wuEdit
  },
  data() {
    return {
      msg: 'TextAreaGroup',
      editLength:'',
      editValue: this.value,
      emojiShow: false,
      quill: '',
      needDel: '', // emoji是否需要删除
      editDom: ''
    }
  },
  computed: {
    placeholderShow() {
      return !this.editLength || this.editType == 'answer';
    },
    issend() {
      return !!this.editValue.trim();
    },
    selfEditShow() {
      return this.editShow;
    },
    disabled() {
      return !this.editLength;
    },
    emojiArr() {
      let emoji = new Array(64);
      let len = emoji.length;
      let gap = 24;
      const arr = []
      for(let i = 0; i <= len; i+= gap) {
        console.log(i);
        arr.push(emoji.slice(i, i + gap))
      }
      return arr;
    },

  },
  watch: {
    editValue(val) {
      const len = val.length;
      if(this.type === 'textArea') {
        this.editLength = len;
      }
      if(!val && this.type == 'wuEdit') {
        this.resetEditDom();
      }
      this.$emit('input', val)
    },
    editLength(val) {
      if(val == '0') {
        console.log('dd')
      }
    }
  },
  methods: {
    eventClose() {
      this.editValue = "";
      this.$emit('setEditShow', false)
    },
    resetEditDom() {
      if(!this.editDom) {
          this.editDom = this.$refs.quillEdit.getElementsByClassName('ql-editor')[0];
      } else {
          this.editDom.innerHTML = '';
      }
    },
    setEmojiShow() {
      this.emojiShow = !this.emojiShow;
    },
    changeText(){
      this.innerText = this.$el.innerHTML;
      this.$emit('input',this.innerText);
    },
    eventFocus() {
      console.log('get focus')
    },
    delText() {
      const range = this.quill.getSelection()
      let index = 0;
      if(range) {
        index = range.index
      }
      console.log(index)
      this.quill.deleteText(index, 1);
      console.log('del')
    },
    eventChose(e) {
      console.log(this.quill);
      const range = this.quill.getSelection()
      let index = 0;
      if(range) {
        index = range.index
      }
      // range.collapse(true);
      console.log(index)
      this.quill.insertEmbed(index, 'image', `http://imgzq.hexun.com/chatRoom/static/ff/${e}.gif`);
      if(range) {
        this.quill.setSelection(index + 1, range.length)
      }
      
    },
  // 发送按钮
    eventSend() {
      this.$emit('sendBtnMethod');
    }
  },
   mounted() {
      // console.log('dd')
    this.quill = new Quill('#editor-trigger', {
      theme: 'bubble'
    });
    this.quill.on('text-change', (delta, oldDelta, source) => {
      const ops = this.quill.getContents().ops;
      const range = this.quill.getSelection();
      let str = '';
      let len = 0
      // console.log( this.quill.getContents())
      for(let i in ops) {
        // console.log(typeof ops[i].insert === 'string')
       if(typeof ops[i].insert === 'string') {
        //  console.log('str')
         str += ops[i].insert;
         len += ops[i].insert.trim().length
       } else if(typeof ops[i].insert === 'object')  {
        str+=`[face]${ops[i].insert.image}[/face]`;
        len++
       }
      }
      this.editValue = str;
      this.editLength = len;
    });
    if(this.$refs.quillEdit) {
        this.editDom = this.$refs.quillEdit.getElementsByClassName('ql-editor')[0];
        this.resetEditDom();
    }
    
   
  }
}
</script>
<style lang="less">
.edit-theme-group {
  text-align: center;

  .weui-cells__title {
    font-size: 16px;
    color: #000;
    margin: 0;
    padding: .266667rem;
  }
  .edit-theme-group-textarea {
    padding: 0 .266667rem;
    background: #EEEEEE;
  }

  .e-t-g-t-con {
    background: #fff;
    padding: .266667rem;
    overflow: auto;
    .e-t-g-t-c-edit {
      height: 100px;
      text-align: left;
    }
  }

  .e-t-g-t-footer {
    display: flex;
    justify-content: space-between;
    padding: .266667rem;
  }

  .e-t-g-t-f-count {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .e-t-g-t-f-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .f-g-b-btn {
      border-radius: 100px;
      // padding: .213333rem .533333rem;
      line-height: .8rem;
      color: #fff;
      height: .8rem;
      width: 2rem; 
      box-sizing: border-box;
      
      font-size: 14px;
    }

    .f-g-b-disabled {
      background: #999999;
    }
    .f-g-b-send {
      background: #EE5050;
    }
      
  }
  .e-t-g-t-g-placeholder {
    position: absolute;
    top: .333333rem; // 25px
    left: .533333rem;
    pointer-events: none;
  }
  .emoji-container {
    .emoji-list{
      display: flex;
      justify-content: center;
      align-item: 'center';
      padding: .266667rem 0;
    }
  }
}

.e-t-g-t-c-edit{
  .ql-editor {
    padding: .066667rem;
  }
}

.e-t-g-t-c-edit-other {
  .ql-editor {
    text-indent: 9em;
  }
  .ql-hidden {
    display: none;
  }
}


</style>