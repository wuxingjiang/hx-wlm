<template>
  <div id="TextareaGroup" class="TextareaGroup">
    <div v-transfer-dom>
      <popup 
      v-model="selfEditShow"
      position = top
      @on-hide="eventClose"
      @on-show="eventShow"
      >
        <group :title="title" ref="editGroup" class="edit-theme-group">
          <div class="edit-theme-group-textarea">
            <div  class="e-t-g-t-con" @click="eventGetFours">
              <wu-editor 
              ref = 'wuEditor'
              style="text-align:left"
              v-model = "editValue"
              :insetPlacehold="insetPlacehold"
              ></wu-editor>
              <input-count
              v-if="question"
              :maxLength="max"
              :length = "editLength"
              class="e-t-g-t-f-count input-count-user">
              </input-count>
            </div>
          <div>
          <div class="e-t-g-t-footer">
            <input-count
            v-if="!question"
            :maxLength="max"
            :length = "editLength"
            class="e-t-g-t-f-count">
            </input-count>
            <check-icon class="e-t-g-t-f-type" v-else v-model="isQuestion">向老师提问</check-icon>
            <div class="e-t-g-t-f-group">
              <div v-if="type === 'wuEdit'" class="e-t-g-t-f-g-smile">
                <x-button
                  class="f-g-b-emoji"
                  @click.native="setEmojiShow"
                  plain>
                    <svg class="icon e-xiaolian" aria-hidden="true">
                        <use v-if="!editemojiShow" xlink:href="#icon-xiaolian"></use>
                        <use v-else xlink:href="#icon-jianpan"></use>
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
            v-if="editemojiShow">
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
                @click.native="eventChose(emoji+1)"
                >
                  <img  :src="`http://imgzq.hexun.com/chatRoom/static/ff/${emoji+1}.png`" alt="">
                </flexbox-item>
                <flexbox-item v-if="needDel">
                  <svg @click.native="delText" class="icon e-xiaolian" aria-hidden="true">
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
import {BBcode} from '../assets/js/BBcode.js'
import Delta from 'quill-delta'
import InputCount from '@/components/InputCount.vue'
import wuEditor from '@/components/wuEditor.vue'
import InputPlaceholder from '@/components/InputPlaceholder.vue'
import CheckIcon from '@/components/CheckIcon.vue'
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

import E from 'wangeditor'

export default {
  name: 'TextAreaGroup',
  directives: {
    TransferDom
  },
  props:['max', 'editShow', 'value', 'title', 'type', 'placeholder', 'editType', 'identity', 'authority','editemojiShow'],

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
    CheckIcon,
    'input-count': InputCount,
    'input-placeholder':InputPlaceholder,
    'wu-editor': wuEditor
  },
  data() {
    return {
      msg: 'TextAreaGroup',
      editLength:'',
      editValue: this.value,
      quill: '',
      needDel: '', // emoji是否需要删除
      editDom: '',
      isQuestion: false,
      editor: '',
    }
  },
  computed: {
    placeholderShow() {
      const arr = ['wuEdit', 'textArea']
      return !this.editLength && arr.indexOf(this.type) != -1;
    },
    insetPlacehold() {
       const arr = ['send']
       if(arr.indexOf(this.editType) == -1) {
         return  this.placeholder;
       } else {
         return false
       }
     
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
      let emoji = new Array(64).toString().split(',').map((item,index) => {return index});
      let len = emoji.length;
      let gap = 24;
      const arr = []
      for(let i = 0; i <= len; i+= gap) {
        console.log(i);
        arr.push(emoji.slice(i, i + gap))
      }
      return arr;
    },
    question() {//显示向老师提问按钮
      return (this.identity == 'user' || this.identity =='vipUser') && this.editType == 'send'
    }, 
  },
  watch: {
    editValue(val, oldVal) {
      const len = val.length;
      if(this.type === 'textArea') {
        this.editLength = len;
      }
      if(this.type == 'wuEdit') {
        const imgTest = /<img(.+?)src=['|"](.+?)>/ig;
        const repStr = this.editValue.replace(imgTest, '0')
        const content = document.createElement('div');
        content.innerHTML = repStr;
        this.editLength = content.innerText.trim().length
      }
       
      if(len > this.max) {
        this.editValue = oldVal
      }
      this.$emit('input', val)
    },
    editLength(val) {
      if(val == '0') {
        console.log('dd')
      }
    },
    editemojiShow(val) {
    }
  },
  methods: {
    eventClose() {
      this.editValue = "";
      this.isQuestion = false;
      this.$emit('setEditShow', false);
      this.$emit('resetEdit');

    },
    setEditIndent() {
      if(!this.editDom) {
        return false;
      }
      if(this.editType != 'send') {
      const width = document.getElementById('InputPlaceholder').clientWidth;
      const htmlF = document.documentElement.getBoundingClientRect().width / 6.1;
      console.log(width / htmlF)
      this.editDom.style.textIndent = `${width / htmlF}rem`;
      } else {
        this.editDom.style.textIndent = `0em`;
      }
    },
    setEmojiShow() {
      this.$emit('setEditemojiShow', !this.editemojiShow)
    },
    changeText(){
      this.innerText = this.$el.innerHTML;
      this.$emit('input',this.innerText);
    },
    eventGetFours() {
      
    },
    delText() {
    },
    eventChose(val) {
      let e = event;
      this.$refs.wuEditor.$emit('insertImg', val)
      // this.editor.command('InsertImage', false, `http://imgzq.hexun.com/chatRoom/static/ff/${val}.gif`, event)
    },
    eventShow() {
    },
  // 发送按钮
    eventSend() {
      this.$emit('sendBtnMethod', {
        isQuestion: this.isQuestion
      })
    }
  },
  created() {
    
  },
  mounted(){
  },
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
    position: relative;
    text-align: left;
    height: 100px;
    .input-count-user {
      position: absolute;
      right: 0;
      bottom: 0;
    }
    .wuEditor-mobile-txt {
      height:100%
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

  .e-t-g-t-f-type {
    font-size: 14px;
    display: flex;
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
      padding: 0 .6rem;
      box-sizing: border-box;
      text-align: center;
      font-size: 14px;
      display: flex;
      justify-content: center;
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
    z-index: 9999;
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
    font-size: 14px;
  }
   .ql-hidden {
    display: none;
   
  }
}

.e-t-g-t-c-edit-other {
  .ql-editor {
  }
 
}
</style>