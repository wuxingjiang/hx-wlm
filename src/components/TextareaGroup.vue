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
              <div  class="e-t-g-t-c-edit" contenteditable="true"
                v-html="editValue"
                @focus="eventFocus"
                @blur="eventBlur"
                @input="changeText">
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
                v-for="emoji in item"
                :key="emoji"
                :span="1/8"
                >
                  <emotion is-gif @click.native="eventChose(emoji)">{{emoji}}</emotion>
                </flexbox-item>
                <flexbox-item>
                  <svg class="icon e-xiaolian" aria-hidden="true">
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
  props:['max', 'editShow', 'value', 'title', 'type', 'placeholder'],

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
      emoji: ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极'],
      emojiShow: false,
      range: '',
    }
  },
  computed: {
    placeholderShow() {
      return !this.editValue;
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
      let emoji = this.emoji;
      let len = emoji.length;
      let gap = 23;
      const arr = []
      for(let i = 0; i <= len; i+= 23) {
        console.log(i);
        arr.push(emoji.slice(i, i + gap))
      }
      return arr;
    },

  },
  watch: {
    editValue(val) {
      const len = val.length;
      this.editLength = len;
      this.$emit('input', val)
    }
  },
  methods: {
    eventClose() {
      this.editValue = "";
      this.$emit('setEditShow')
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
    eventBlur() {
      if(window.getSelection) {
        const range = window.getSelection().getRangeAt(0);
        
        this.range = window.getSelection().getRangeAt(0)
        
      }
    },
    eventChose(e) {
      console.log(e);
      this.rangeInser(e)
    },
    rangeInser(node) {
      if(this.range) {
        const newNode = document.createElement('p');
        newNode.appendChild(document.createTextNode(`${node}`));
        this.range.insertNode(newNode);
      }  
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
    }
  }
}

.TextareaGroup {
  
}
</style>