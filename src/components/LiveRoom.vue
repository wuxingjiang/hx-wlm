<template>
  <div class="liveRoom" id="liveRoom">
    <x-header>直播室名称</x-header>
    <header class="head">
        <div class="h-img">
            <img src="" alt="">
        </div>
        <div class="h-info">
            <p class="i-name">
              都问（神仙看盘）
            </p>
            <p class="i-theme">
              主题：都为直播室互动
              <span class="t-btn" @click="setEditShow">
                <svg class="icon b-edit" aria-hidden="true">
                  <use xlink:href="#icon-edit"></use>
                </svg>
              </span>
            </p>
        </div>
        <div class="h-like">
          <svg class="icon l-btn" aria-hidden="true">
            <use xlink:href="#icon-jia"></use>
          </svg>
          <span>
            关注
          </span>
        </div>
    </header>
    <tab
    :line-width="3"
    custom-bar-width="NaNrem"
    active-color="#ee5050"
    defaultColor="#444"
    bar-active-color="#ee5050"
    v-model="index">
      <tab-item 
      class="vux-center" 
      :selected="defaultSelected === item" 
      v-for="(item, index) in list" 
      @click="defaultSelected = item"
      :key="index">
        {{item}}
      </tab-item>
    </tab>
    <swiper 
    v-model="index" 
    class="container" 
    :show-dots="false"
    height="100%">
      <swiper-item class="c-item" v-for="(item, index) in list" :key="index">
        <msg-manager :type="'manger-speak'"></msg-manager>
        <msg-manager :type="'manger-answer'"></msg-manager>
        <msg-manager :type="'customer'"></msg-manager>
      </swiper-item>
    </swiper>
    <flexbox class="footer vux-NaNrem-t">
      <flexbox-item :span="85/100">
        <x-button 
        class="f-btn-edit" 
        plain
        >
          <input-placeholder></input-placeholder>
        </x-button>
      </flexbox-item>
      <flexbox-item :span="15/100">
        <x-button
        class="f-btn-emoji"
        plain>
          <svg class="icon e-xiaolian" aria-hidden="true">
              <use xlink:href="#icon-xiaolian"></use>
          </svg>
        </x-button>
      </flexbox-item>
    </flexbox>
    <textarea-group
    :max="editMax"
    :editShow="editShow"
    @setEditShow="setEditShow"
    v-model="editValue"
    :title="'编辑今日主题'"
    :smile='false'
    ></textarea-group>
  </div>
</template>

<script>
import MsgManager from '@/components/Msg-Manager.vue'
import InputPlaceholder from '@/components/InputPlaceholder.vue'
import TextareaGroup from '@/components/TextareaGroup.vue'

import { 
  Sticky, 
  XHeader, 
  Tab, 
  TabItem, 
  Swiper, 
  SwiperItem, 
  XInput, 
  Group, 
  XButton,
  Flexbox,
  FlexboxItem,
  Popup,
  XTextarea 
  } from 'vux'

const list = () => ['直播观点', '互动交流']

export default {
 
  components: {
    Sticky,
    XHeader,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Group,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem,
    Popup,
    XTextarea,
    'msg-manager': MsgManager,
    'input-placeholder':InputPlaceholder,
    'textarea-group': TextareaGroup
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!',
      defaultSelected: '直播观点',
      index: 0,
      list: list(),
      editShow: false,
      editMax: 1000,
      editValue: '',
      editLength: 0,
    }
  },
  computed: {
    
  },
  methods: {
    setEditShow() {
      this.editShow = !this.editShow;
    }
  }
}
</script>

<style lang="less">
.liveRoom {
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.icon {
  /* 通过设置 font-size 来改变图标大小 */
  width: 1em; height: 1em;
  /* 图标和文字相邻时，垂直对齐 */
  vertical-align: -0.15em;
  /* 通过设置 color 来改变 SVG 的颜色/fill */
  
  fill: currentColor;
  /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
      normalize.css 中也包含这行 */
  overflow: hidden;
}

.b-edit {
  /* 通过设置 font-size 来改变图标大小 */
  width: .493333rem; height: .493333rem;
}

.l-btn {
  /* 通过设置 font-size 来改变图标大小 */
  width: .266667rem; height: .266667rem;
}

.head {
    height: 2.4rem;
    background: #1F1F2D;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .4rem;
}

.h-img {
    width: 1.44rem;
    height: 1.44rem;
    border-radius: 50%;
    background: #fff;
    border: NaNrem solid #34343F;
}

.h-info {
  flex: 1;
}

.h-like {
  height: .8rem;
  width: 2rem;
  background: #EE5151;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    margin: .066667rem 0;
  }
}

.container {
  flex: 1;
}

.footer {
  padding: .213333rem .266667rem;
  width: 100%;
  box-sizing: border-box;

  .f-btn-edit {
    border-radius: NaNrem;
    border: none;
    background: #F5F5F5;
    text-align: left;
    color: #999999;
    font-size: NaNrem ;
  }

  .f-btn-emoji {
    border: none;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }

}

.e-xiaolian {
    /* 通过设置 font-size 来改变图标大小 */
  width: .8rem; height: .8rem;
  color: #666666;
}

.c-item {
  background: #f5f5f5;
  overflow: auto;
  padding: .4rem 0;
}
  

.edit-theme-group {
    text-align: center;
    .edit-theme-group-textarea {
      padding: 0 .266667rem;
      background: #EEEEEE;
    }

    .e-t-g-t-con {
      background: #fff;
      padding: .266667rem;
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

      .f-g-b-send {
        background: red;
        border-radius: 100px;
        // padding: .213333rem .533333rem;
        line-height: .8rem;
        color: #fff;
        height: .8rem;
        width: 2rem; 
        box-sizing: border-box;
      }
      
    }
    .e-t-g-t-g-placeholder {
      position: absolute;
      top: .266667rem;
      left: .533333rem;
      pointer-events: none;
    }
  }

.weui-cell {
  padding: 0 !important;
}

</style>
