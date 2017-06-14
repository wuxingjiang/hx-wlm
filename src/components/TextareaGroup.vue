<template>
  <div id="TextareaGroup" class="TextareaGroup">
    <div v-transfer-dom>
      <popup 
      v-model="selfEditShow"
      @on-hide="eventClose"
      >
        <group :title="title" class="edit-theme-group">
          <div class="edit-theme-group-textarea">
            <div class="e-t-g-t-con">
              <x-textarea 
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
            class="e-t-g-t-f-count"></input-count>
            <div class="e-t-g-t-f-group">
              <div v-if="smile" class="e-t-g-t-f-g-smile">
                <x-button
                  class="f-g-b-emoji"
                  plain>
                    <svg class="icon e-xiaolian" aria-hidden="true">
                        <use xlink:href="#icon-xiaolian"></use>
                    </svg>
                  </x-button>
              </div>
              <div class="e-t-g-t-f-g-send">
                <x-button
                class="f-g-b-send"
                plain>
                  发送
                </x-button>
              </div>
            </div>
          </div>
          <input-placeholder v-if="placeholderShow" class="e-t-g-t-g-placeholder"></input-placeholder>
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

import { 
  Group,
  XButton,
  Popup,
  TransferDom,
  XTextarea 
  } from 'vux'

export default {
  name: 'TextAreaGroup',
  directives: {
    TransferDom
  },
  props:['max', 'editShow', 'value', 'title', 'smile'],

  components: {
    Group,
    XButton,
    Popup,
    XTextarea,
    'input-count': InputCount,
    'input-placeholder':InputPlaceholder,
  },
  data() {
    return {
      msg: 'TextAreaGroup',
      editLength:'',
      editValue: ''

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
    }
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
      this.$emit('setEditShow')
    }
  }
}
</script>
<style lang="less">
.edit-theme-group {
  .weui-cells__title {
    font-size: 16px;
    color: #000;
    margin: 0;
    padding: .266667rem;
  }
}

.TextareaGroup {
  
}
</style>