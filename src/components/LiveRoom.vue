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
              <span class="t-btn" @click="editShow = true;">
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
    custom-bar-width="117px"
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
    <flexbox class="footer vux-1px-t">
      <flexbox-item :span="85/100">
        <x-button 
        class="f-btn-edit" 
        plain
        >
          <svg class="icon e-icon" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
          </svg>
          <span>
            说说你的想法…
          </span>
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
    <div v-transfer-dom>
      <popup v-model="editShow">
        <group :title="'编辑内容'" class="edit-theme-group">
          <div class="edit-theme-group-textarea">
            <x-textarea 
            :height="100"
            :max="1000"
            ></x-textarea>
            <div>
              <div class="e-t-g-t-footer">
                <div class="e-t-g-t-f-count">0/1000</div>
                <div class="e-t-g-t-f-group">
                  <div class="e-t-g-t-f-g-smile">
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
            </div>
          </div>
        </group>
      </popup>
    </div>
  </div>
</template>

<script>
import MsgManager from '@/components/Msg-Manager.vue'
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
  TransferDom,
  XTextarea 
  } from 'vux'

const list = () => ['直播观点', '互动交流']

export default {
  directives: {
    TransferDom
  },
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
    border: 2px solid #34343F;
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
    border-radius: 100px;
    border: none;
    background: #F5F5F5;
    text-align: left;
    color: #999999;
    font-size: 14px ;
  }

  .f-btn-emoji {
    border: none;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }

}

.e-icon {
  /* 通过设置 font-size 来改变图标大小 */
  width: .4rem; height: .4rem;
  color: #999999;
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

    .e-t-g-t-footer {
      display: flex;
      justify-content: space-between;
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
        width: 2.666667rem; 
        box-sizing: border-box;
      }
    }
}

.weui-cell {
  padding: 0 !important;
}

</style>
