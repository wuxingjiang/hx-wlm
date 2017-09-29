<template>
  <div class="edit-theme">
    <div v-transfer-dom>
      <popup
      class="edit-theme"
      v-model="selfEditShow"
      @on-hide="eventClose"
      >
        <group :title="title" ref="editGroup" class="edit-theme-group">
          <div class="edit-theme-group-textarea">
            <div  class="e-t-g-t-con" >
              <x-textarea 
              ref="js_textArea"
              v-if="type === 'textArea'"
              :height="100"
              :show-counter="false"
              :max="max"
              v-model="editValue"
              ></x-textarea>
            
            </div>
          <div>
          <div class="e-t-g-t-footer">
            <input-count
            :maxLength="max"
            :length = "editLength"
            class="e-t-g-t-f-count">
            </input-count>
            <div class="e-t-g-t-f-group">
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
import CheckIcon from '@/components/CheckIcon.vue'
import {
  Group,
  XButton,
  Popup,
  TransferDom,
  XTextarea,
  Divider,
  Flexbox,
  FlexboxItem
  } from 'vux'

export default {
  name: 'TextAreaGroup',
  directives: {
    TransferDom
  },
  props: ['max', 'editShow', 'value', 'title', 'type', 'placeholder', 'editType', 'identity', 'authority', 'editemojiShow'],
  components: {
    Group,
    XButton,
    Popup,
    XTextarea,
    Divider,
    Flexbox,
    FlexboxItem,
    CheckIcon,
    'input-count': InputCount,
    'input-placeholder': InputPlaceholder
  },
  data () {
    return {
      msg: 'TextAreaGroup',
      editLength: '',
      editValue: this.value,
      needDel: '', // emoji是否需要删除
      editDom: '',
      isQuestion: false
    }
  },
  computed: {
    placeholderShow () {
      const arr = ['wuEdit', 'textArea']

      return !this.editLength && arr.indexOf(this.type) != -1
    },
    insetPlacehold () {
      const arr = ['send']

      return arr.indexOf(this.editType) == -1
    },
    issend () {
      return !!this.editValue.trim()
    },
    selfEditShow () {
      return this.editShow
    },
    disabled () {
      return !this.editLength
    }
  },
  watch: {
    value (val) {
      this.editValue = val
    },
    editValue (val, oldVal) {
      const len = val.length
      if (this.type === 'textArea') {
        this.editLength = len
      }
      this.$emit('input', val)
    }
  },
  methods: {
    eventClose () {
      // this.editValue = "";
      this.isQuestion = false
      this.$emit('setEditShow', false)
      this.$emit('resetEdit')
    },
    // 发送按钮
    eventSend () {
      this.$emit('sendBtnMethod', {
        isQuestion: this.isQuestion
      })
    }
  },
  created () {
    this.$on('autoFocus', () => {
      setTimeout(() => {
        const node = this.$refs.js_textArea.$el.getElementsByTagName('textarea')[0]
        const autofocus = node.getAttribute('autofoces')
        if (!autofocus) {
          node.focus()
          node.setAttribute('autofocus', 'autofocus')
        }
      }, 600)
    })
  }
}
</script>
<style lang="less">
.edit-theme {
  .edit-theme-group {
  text-align: center;

  .weui-cells:before {
    border: none;
  }
  
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
    .e-t-g-t-c-edit {
      height: 100px;
      text-align: left;
    }
    .input-count-user {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .e-t-g-t-footer {
    display: flex;
    justify-content: space-between;
    padding: .266667rem 0;
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
}



</style>