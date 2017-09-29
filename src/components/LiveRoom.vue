
<template>
  <div class="liveRoom">
    <view-box ref="viewBox" class="liveRoom-viewBox">
    <x-header v-if="headerShow">{{enterInfo.roomInfo.roomName}}</x-header>
    <header class="head">
        <div class="h-img">
            <img :src="enterInfo.roomInfo.imageUrl" alt="">
        </div>
        <div class="h-info">
            <p class="i-name">
              {{enterInfo.roomInfo.ownerNick}}
            </p>
            <p class="i-theme">
              <span class="t-text">主题：{{enterInfo.roomInfo.topic}}</span>
              <span  
              class="t-btn"
              v-if="authority.operation"
              @click="setEditThemeShow(true)"
              >
                <svg class="icon b-edit" aria-hidden="true">
                  <use xlink:href="#icon-edit"></use>
                </svg>
              </span>
            </p>
        </div>
        <div v-if="!isWechat" :class="['h-like', likeInfo !== '关注'?'has-like':'']" @click="followtearch">
          <svg v-if="likeInfo === '关注'" class="icon l-btn" aria-hidden="true">
            <use xlink:href="#icon-jia"></use>
          </svg>
          <span>
            {{likeInfo}}
          </span>
        </div>
    </header>
    <tab
    :line-width="2"
    custom-bar-width="6em"
    active-color="#ee5050"
    defaultColor="#444"
    bar-active-color="#ee5050"
    v-model="activeIndex">
      <tab-item 
      class="vux-center" 
      :selected="defaultSelected === item" 
      v-for="(item, index) in list" 
      @click="defaultSelected = item"
      :key="index">
        {{item}}
      </tab-item>
    </tab>
    <div
    ref = "container"
    class="container" >
        <div 
        ref="js_leftCon"
        v-show="activeIndex == 0"
        class="c-item js_item"
        v-c-s
        @scroll="eventScroll"
        >
              <msg-manager
              class="left"
              v-for="(msg, num) in leftMsg"
              v-show="msg.type != 't_ss' && msg.contentType != 'audio'"
              :authority = "authority"
              :info="msg"
              :key="msg.type + num"
              :type= "'直播观点'"
              :interface="interface"
              :roomId ="roomId"
              :sub = "num"
              ></msg-manager>
              
        </div>
        <div 
          ref="js_RightCon"
          class="c-item js_item"
          @scroll="eventScroll"
          v-show="activeIndex == 1"
          style="overflow:hidden;">
          <ul>
            <li  v-if="noMore" >
              <load-more
                :show-loading="showloadmore"  
                :tip="loadtext"
                :background-color="'#f5f5f5'">
              </load-more>
            </li>
            <li
            v-for="(msg, num) in rightMsg">
              <msg-manager    
                class="right"
                v-show=" msg.type != 't_ss'  && msg.contentType != 'audio'"
                :authority = "authority"
                :info="msg"
                :key = "msg.type + num"
                :type= "'互动交流'"
                @answerMethod = 'answerMethod'
                @explainMethod = 'explainMethod'
                :interface="interface"
                :roomId="roomId"
                :sub = "num"
                :userId = 'enterInfo.userInfo.userId'
                ref='rightMsg'
                >
              </msg-manager>
            </li>
          </ul>
        </div>
    </div>

    <div class="footer vux-1px-t">
      <div
      class="f-btn-edit" 
      plain
      :action-type="'button'"
      @click="setEditSpeakShow(true)"
      >
        <input-placeholder :placeholder="speakPlaceholder"></input-placeholder>
      </div>
      <div
      v-if="!isAndroid4"
      class="f-btn-emoji"
      @click="eventOpenEmoji"
      plain>
        <svg class="icon e-xiaolian" aria-hidden="true">
            <use xlink:href="#icon-xiaolian"></use>
        </svg>
      </div>
    </div>

    </view-box>
    <textarea-group
    ref="themeEditor"
    :max="editThemeMax"
    :placeholder="'请输入今日主题'"
    :editShow="editThemeShow"
    :editemojiShow = "editemojiShow"
    @setEditShow="setEditThemeShow"
    @sendBtnMethod="setRoomTopic"
    v-model="editThemeValue"
    :title="'编辑今日主题'"
    :type="'textArea'"
    :editType="editType"
    :identity = "identity"
    ></textarea-group>
    <quill-edit
    ref="quillEditor"
    :max="editSpeakMax"
    :placeholder="speakPlaceholder"
    :editShow="editSpeakShow"
    @setEditShow="setEditSpeakShow"
    @resetEdit="resetEdit"
    @sendBtnMethod="sendMessage"
    @setEditemojiShow = "setEditemojiShow"
    v-model="editSpeakValue"
    :title="'编辑内容'"
    :type="'wuEdit'"
    :editType="editType"
    :identity = "identity"
    :editemojiShow = "editemojiShow"
    :isAndroid4="isAndroid4"
    ></quill-edit>
    <div v-transfer-dom >
      <x-dialog v-model = "isBlack" :dialog-style="{padding:'40px 20px'}">{{dialogText}}</x-dialog>
    </div>
    <div v-transfer-dom>
      <popup 
      v-model="choseAnswershow"
      is-transparent >
        <div class="chose-answer-list">
            <x-button class="c-a-l-btn c-a-l-btn-one" @click.native="eventAnswerOpen">左侧直播观点显示</x-button>
            <x-button class="c-a-l-btn c-a-l-btn-two vux-1px-t" @click.native="eventAnswerSolo">右侧互动交流显示</x-button>   
            <x-button class="c-a-l-btn c-a-l-btn-three" @click.native="setChoseAnswershow(false)">取消</x-button>
          </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup 
      v-model="choseExplainshow"
      is-transparent >
        <div class="chose-answer-list">
          <x-button v-if="false" class="c-a-l-btn c-a-l-btn-one" @click.native="eventExplainOpen">公开回答</x-button>
          <x-button v-if="false" class="c-a-l-btn c-a-l-btn-two vux-1px-t" @click.native="eventExplainSolo">私密回答</x-button>
          <x-button class="c-a-l-btn c-a-l-btn-two vux-1px-t" style="border-radius: .133333rem;" @click.native="eventExplainSolo">私密回答</x-button>
          <x-button class="c-a-l-btn c-a-l-btn-three" @click.native="setChoseExplainshow(false)">取消</x-button>
        </div>
      </popup>
    </div>
    <buy-vip 
    v-if="isNoVip"
    :isWechat="isWechat"
    :dplusInfo="dplusInfo"
    :webenv="webenv"
    :roomId="roomId"></buy-vip>
    <bind-phone 
    v-if="bindPhoneShow"
    :isWechat="isWechat"
    :roomId="roomId"
    :show="true"
    :dplusInfo="dplusInfo"
    @closeBindPhone="closeBindPhone"
    @bindSuccess="bindPhoneSuccess"></bind-phone>
  </div>
  
</template>

<script>
require('@/assets/js/iscroll-probe.js')
import VuePullRefresh from 'vue-pull-refresh'
import MsgManager from '@/components/Msg-Manager.vue'
import InputPlaceholder from '@/components/InputPlaceholder.vue'
import TextareaGroup from '@/components/TextareaGroup.vue'
import BuyVip from '@/components/BuyVip.vue'
import BindPhone from '@/components/BindPhone.vue'
import quillEdit from '@/components/quillEdit.vue'
import {mqttSession} from '@/assets/js/mqttSession.js'
import webenv from '@/assets/js/config.js'
import * as Browser from '@/assets/js/browser.js'
import {
  Actionsheet,
  Sticky,
  XHeader,
  Tab,
  TabItem,
  Swiper,
  SwiperItem,
  XInput,
  Group,
  XButton,
  Popup,
  XTextarea,
  Scroller,
  Divider,
  XDialog,
  TransferDom,
  ViewBox,
  LoadMore
  } from 'vux'

const list = () => ['直播观点', '互动交流']

export default {
  components: {
    Actionsheet,
    Sticky,
    XHeader,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Group,
    XInput,
    XButton,
    Popup,
    XTextarea,
    Scroller,
    Divider,
    XDialog,
    ViewBox,
    LoadMore,
    'msg-manager': MsgManager,
    'input-placeholder': InputPlaceholder,
    'textarea-group': TextareaGroup,
    'quill-edit': quillEdit,
    'buy-vip': BuyVip,
    'bind-phone': BindPhone,
    'vue-pull-refresh': VuePullRefresh
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      webenv: webenv,
      defaultSelected: '直播观点',
      activeIndex: 0,
      list: list(),
      editThemeShow: false,
      editThemeMax: 20,
      editThemeValue: '',
      editSpeakShow: false,
      editSpeakMax: 1000,
      editSpeakValue: '',
      editemojiShow: false,
      likeInfo: '关注', // 关注信息
      speakPlaceholder: '说说你的想法…',
      choseAnswershow: false, // 回复选择弹出
      isBlack: false, // 是否是黑名单用户
      dialogText: '',
      noMore: false,
      pullStatus: {
        pulldownStatus: 'default'
      },
      loginInfo: '', // 登录信息
      enterInfo: {
        roomInfo: {
          roomName: '',
          ownerNick: '',
          imageUrl: '',
          topic: ''
        }
      }, // 房间信息
      identity: 'user', // 用户身份
      leftMsg: [],
      rightMsg: [],
      historyList: [],
      msgDomInfo: false,
      editType: 'send', // 编辑器类型 默认send 发送消息 answer 回复 explan 解答
      answerWho: '回复谁',
      choseSendTypeShow: false,
      sendType: {},
      choseExplainshow: false,
      weChatLogin: false, // 是否绑定微信
      isNoVip: false,
      bindPhoneShow: false, // 绑定手机dialog
      loadMore: false,
      myScroll: null,
      rightShow: false,
      rightOldY: false, // 保存切换标签后的右侧滚动位置Y
      loadtext: '下拉加载更多',
      showloadmore: false,
      roomBaseInfo: {
        roomName: '',
        ownerId: '',
        ownerNick: ''
      } // 基本房间信息
    }
  },
  computed: {
    interface () {
      return {
        islogin: 'http://reg.tool.hexun.com/wapreg/checklogin.aspx?format=json&encode=utf-8', // 判断登陆
        h5logurl: 'https://reg.hexun.com/h5/login.aspx?regtype=5&gourl=' + escape(window.location.href),
        isBindWeChat: 'https://regtool.hexun.com/wapreg/CheckBindWechat.aspx', // 是否绑定微信
        bindWeChat: `https://reg.hexun.com/bindweixin.aspx?gourl=${escape(window.location.href)}&fromhost=weixin`,
        exitLogin: `http://utility.tool.hexun.com/Quit.aspx?gourl=${escape(window.location.href)}`
      }
    },
    headerShow () {
      const headerShow = this.$route.query.header
      const browser = new Browser.Browser().browser

      if (headerShow === 'off') {
        return false
      }
      let arr = ['Wechat', 'QQ']
      return arr.indexOf(browser) == '-1' && !this.isApp;
    },
     // 是否在微信
    isWechat (){
      const browser = new Browser.Browser().browser;
      return browser == 'Wechat';
    },
    isIos () {
      const browser = new Browser.Browser().os;
      return browser == 'iOS';
    },
    // 在App
    isApp (){
      
      const ua = navigator.userAgent.toLowerCase();
      if(ua.indexOf('hxappid')>0) {
        return true;
      } else {
        return false;
      }
    },
    roomId () {
      return this.$route.query.roomId;
    },
    // 权限
    authority () {
      const iden = this.identity;
      return {
        operation: iden == 'teacher' || iden == 'assistant', // 操作权限 真三该查 管理权限
        answerService: iden != 'anonymous' && iden != 'service', // 回复客服功能
        answerUser: iden == 'service' || iden == 'presenter' || iden == 'vipUser', // 回复学院
        
      }
    },
    leftMsgLen () {
      return this.leftMsg.length;
    },
    rightMsgLen() {
      return this.rightMsg.length;
    },
    dplusInfo() {
      return {
        pId: this.roomBaseInfo.ownerId,
        pName: this.roomBaseInfo.ownerNick,
        rName: this.roomBaseInfo.roomName
      } 
    },
    browser() {
      return new Browser.Browser()
    },
    isAndroid4 () { // 是否安卓4.4以下
      if (this.browser.os == 'Android' && parseFloat(this.browser.osVersion) < 5.0) {
        return true
      } else {
        return false
      }
    },
     
  },
  watch: {
    leftMsgLen(newVal,oldVal) {
      this.$scrollToBottom(this.$refs.js_leftCon)
    },
    rightMsgLen(val,nal) {
      const myScroll = this.myScroll
      if(Math.abs(myScroll.maxScrollY - myScroll.y) <= myScroll.wrapperHeight) {
        this.rightGoButtom()
      } else {
        this.$nextTick(() => {
          this.myScroll.refresh()
        })
      }
      // this.$scrollToBottom(this.$refs.js_RightCon)
    },
    activeIndex(val) {
      if(val == 0) {
        this.$scrollToBottom(this.$refs.js_leftCon)
      } else {
        if(!this.rightShow || !this.rightOldY) {
          this.rightShow = true;
          this.rightGoButtom()
        } else {
          console.log('ss')
          this.myScroll.scrollTo(0, this.rightOldY)
        }
        // this.$scrollToBottom(this.$refs.js_RightCon)
      }
      
    },
  },
  methods: {
    // 滚动记录
    eventScroll(e) {
      const el = e.target
      el.setAttribute('scrollTop', el.scrollTop);
      // 如果是互动交流
    },
    rightGoButtom () {
      this.$nextTick(() => {
        this.myScroll.refresh()
        this.myScroll.scrollTo(0, this.myScroll.maxScrollY)
      })
    
    },
    //删除消息
    delMessage(a) {
      this.leftMsg.filter(({messageId}, index) => {
        if(messageId == a.toDeleteMessageId) {
            this.leftMsg.splice(index, 1)
            return true;
        }
      })
      this.rightMsg.filter(({messageId}, index) => {
        if(messageId == a.toDeleteMessageId) {
            this.rightMsg.splice(index, 1)
            return true;
        }
      })
    },
    // 重置编辑器数据
    resetEdit() {
      this.speakPlaceholder = '说说你的想法…'
      this.editType = 'send';
    },
    // 回答问题
    answerMethod(params) {
      console.log(params)
      this.answerWho = {
        name: params.name,
        msgId: params.msgId,
      };

      if(params.type) {
         this.setChoseAnswershow(true);
      } else {
        if(this.identity == 'user' || this.identity == 'vipUser') {
          this.userAnswer()
        }
        if(this.identity == 'service') { // 客服
          this.serviceAnswer()
        }
        if(this.identity == 'presenter') { // 主持人
          this.presenterAnswer()
        } 
      }    
    },
    // 解答
    explainMethod(params) {
      this.answerWho = {
        name: params.name,
        msgId: params.msgId,
      };
      this.setChoseExplainshow(true);
    },
    // 直接展开emoji
    eventOpenEmoji () {
      this.setEditSpeakShow(true);
      this.setEditemojiShow(true);
    },
    // 公开回答
    eventExplainOpen() {
      this.setChoseExplainshow(false); // close chose list popup
      this.editType = 'openExplain';
      this.speakPlaceholder = `回答@${this.answerWho.name}：`
      this.setEditSpeakShow(true); // open editor
    },
    // 私密回答
    eventExplainSolo() {
      this.setChoseExplainshow(false); // close chose list popup
      this.editType = 'soloExplain';
      this.speakPlaceholder = `私密回答@${this.answerWho.name}：`
      this.setEditSpeakShow(true); // open editor
    },
    // 左侧回答
    eventAnswerOpen() {
      this.setChoseAnswershow(false); // close chose list popup
      this.editType = 'openAnswer';
      this.speakPlaceholder = `互动回复@${this.answerWho.name}：`
      this.setEditSpeakShow(true); // open editor
    },
    // 右侧回答
    eventAnswerSolo() {
      this.setChoseAnswershow(false); // close chose list popup
      this.editType = 'soloAnswer';
      this.speakPlaceholder = `互动回复@${this.answerWho.name}：`
      this.setEditSpeakShow(true); // open editor
    },
    presenterAnswer() {
      this.editType = 'presenterAnswer';
      this.setChoseAnswershow(true);
    },
    userAnswer() {
      this.editType = 'userAnswer';
      this.speakPlaceholder = `回复客服@${this.answerWho.name}：`
      this.setEditSpeakShow(true); // open editor
    },
    serviceAnswer() {
      this.editType = 'serviceAnswer';
      this.speakPlaceholder = `回复@${this.answerWho.name}：`
      this.setEditSpeakShow(true); // open editor
    },
    teacherAnswer() {
      this.editType = 'teacherAnswer';
      this.speakPlaceholder = `回复客服@${this.answerWho.name}：`
      this.setEditSpeakShow(true); // open editor
    },
    setEditemojiShow(val) {
      this.editemojiShow = val;
    },
    setEditThemeShow(val) {
      if(!this.isLogin()){
       return false
     }
      // 是否绑定手机
      if(!this.enterInfo.userInfo.bindMobile) {
        this.bindPhoneShow = true;
        return false;
      }
      this.editThemeShow = val;
      this.$refs.themeEditor.$emit('autoFocus')
    },
    setEditSpeakShow(val) {
      // 是否登录
     if(!this.isLogin()){
       return false
     }
     // 是否绑定手机
     if(!this.enterInfo.userInfo.bindMobile) {
        this.bindPhoneShow = true;
        return false;
     }
      this.editSpeakShow = val;
      this.$refs.quillEditor.$emit('autoFocus')
    },
    // 关闭绑定手机弹窗
    closeBindPhone() {
      this.bindPhoneShow = false;
    },
    // 绑定手机成功
    bindPhoneSuccess(val) {
      this.bindPhoneShow = false;
      location.reload();
    },
    setChoseAnswershow(val) {
      this.choseAnswershow = val;
    },
    setChoseExplainshow(val) {
      this.choseExplainshow = val;
    },
    sendMessage(subParams) {
      let type = '';
      let msgId = '';
      let params;
      if(this.identity === 'teacher' && this.editType === 'send') {
        type = 't_s';
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          attributes: '', 
        }
      } else if (this.identity === 'teacher' && this.editType === 'openAnswer') {
        type = 't_rol'; // 公开回复
        msgId = this.answerWho.msgId;
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: msgId,
          attributes: '', 
        }

      } else if (this.identity === 'teacher' && this.editType === 'soloAnswer') {
        type = 't_ror' // 私密回复
        msgId = this.answerWho.msgId;
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: msgId,
          attributes: '', 
        }
      } else if (this.identity === 'teacher' && this.editType === 'openExplain') {
        type = 't_ro' // 公开回答
        msgId = this.answerWho.msgId;
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: msgId,
          attributes: '', 
        }
      } else if (this.identity === 'teacher' && this.editType === 'soloExplain') {
        type = 't_rp' // 私密回答
        msgId = this.answerWho.msgId;
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/chat/dm/${this.enterInfo.roomInfo.ownerId}/${this.enterInfo.userInfo.userId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: msgId,
          attributes: '', 
        }
      } else if ((this.identity === 'user' || this.identity ==='vipUser') && subParams.isQuestion && this.editType === 'send') {
        type = 'u_a' // 用户提问
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/chat/dm/${this.enterInfo.roomInfo.ownerId}/${this.enterInfo.userInfo.userId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          attributes: '', 
        }
      } else if ((this.identity === 'user'|| this.identity ==='vipUser') && !subParams.isQuestion && this.editType === 'send') {
        type = 'u_s' // 用户发言
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          attributes: '', 
        }
      } else if ((this.identity === 'user'|| this.identity ==='vipUser') && !subParams.isQuestion && this.editType === 'userAnswer') {
        type = 'u_r' // 用户回答客服
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: this.answerWho.msgId,
          attributes: '', 
        }
      } else if ((this.identity === 'user'|| this.identity ==='vipUser') && !subParams.isQuestion && this.editType === 'teacher') {
        type = 'u_r' // 用户回答客服
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: this.answerWho.msgId,
          attributes: '', 
        }
      } else if (this.identity === 'presenter' && this.editType == "send" && !subParams.isQuestion) {
        type = 'zc_s' // 主持人发言
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: this.answerWho.msgId,
          attributes: '', 
        }
      } else if (this.identity === 'service' && this.editType == "send" && !subParams.isQuestion) {
        type = 'cs_s' // 客服发言
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: this.answerWho.msgId,
          attributes: '', 
        }
      } else if (this.identity === 'service' && this.editType == 'serviceAnswer') {
        type = 'cs_ro' // 客服回复
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: this.answerWho.msgId,
          attributes: '', 
        }
      } else if (this.identity === 'presenter' && this.editType == 'openAnswer') {
        type = 'zc_rol' // 主持左侧回复
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: this.answerWho.msgId,
          attributes: '', 
        }
      } else if (this.identity === 'presenter' && this.editType == 'soloAnswer') {
        type = 'zc_ror' // 主持右侧回复
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: this.answerWho.msgId,
          attributes: '', 
        }
      } else if(this.identity === 'assistant' && this.editType === 'send') {
        type = 'ta_s';
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          attributes: '', 
        }
      } else if (this.identity === 'assistant' && this.editType === 'openAnswer') {
        type = 'ta_rol'; // 公开回复
        msgId = this.answerWho.msgId;
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: msgId,
          attributes: '', 
        }

      } else if (this.identity === 'assistant' && this.editType === 'soloAnswer') {
        type = 'ta_ror' // 私密回复
        msgId = this.answerWho.msgId;
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: msgId,
          attributes: '', 
        }
      } else if (this.identity === 'assistant' && this.editType === 'openExplain') {
        type = 'ta_ro' // 公开回答
        msgId = this.answerWho.msgId;
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/room/${this.roomId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: msgId,
          attributes: '', 
        }
      } else if (this.identity === 'assistant' && this.editType === 'soloExplain') {
        type = 'ta_rp' // 私密回答
        msgId = this.answerWho.msgId;
        params = {
          roomId: this.roomId,
          type: type,
          from:'pc',
          contentType:'text',
          topic: `zhibo/chat/dm/${this.enterInfo.roomInfo.ownerId}/${this.enterInfo.userInfo.userId}`,
          body: this.editSpeakValue,
          sendToFree: false, 
          originalMessageId: msgId,
          attributes: '', 
        }
      }

      if(!type) {
        this.$vux.toast.show({
            type: 'warn',
            time: '1000'
          })
      }
      this.setEditSpeakShow(false);
      this.$Fetch("sendMessage", params, (res)=> {
        if(res.body.resultKey == 'ok') {
          this.editSpeakValue = '';
          this.$vux.toast.show({
            type: 'success',
            time: '1000'
          })
        } else {
          this.$vux.alert.show({
            title: '系统提示',
            content: res.body.errorMessage,
          })
        }
      }, this)
    },
    // reflash
    reflashBox(val, nal) {
    //   // return false
      
      // let type= 'last'; // 默认刷新到尾部
      // if(val > 0) {
      //   console.log(this.$refs[`msgCon${this.activeIndex}`])
      //     const domArr = this.$refs[`msgCon${this.activeIndex}`][0];
      //     // 保存msgdom信息 用于把他们展示在可视范围内
      //     if(domArr) {
      //       this.msgDomInfo = domArr;
      //     }
         
      //   this.$nextTick(() => {
      //     domArr.scrollTop = domArr.scrollHeight;
      //   })
      //   }
      
      // if(val - nal == 1) { // 如果增加1条是发言
      //  type = 'last'
      // } else if(val - nal == -1 ){ // 如果减少一条 是删除消息
      //   type = 'middle'
      // } else if (val - nal > 1) { // 如果插入多条是获取更多
      //   type = 'first'
      // }
     
      // this.resetScrollerBox(type);
    },
    // 下拉刷新
    getHistoryMsg() {
      const getData = () => {
        const params = {
          roomId: this.roomId,
          date:this.historyList[0]
        }
          if(params.date) {
          this.getLeftMsg(params, callback)
        } else {
          setTimeout(() => {
              this.resetScrollerBox('first')
              this.noMore = true;
            }, 10)
          
        }
      }
      const callback = (data) => {
        this.historyList.shift();
        if(data.length > 0) {
        } else {
          getData()
        }
     
      }
      getData()
    },
  
    // 重置scroller viewbox
    resetScrollerBox(type = 'last') {
    },
    //获取历史信息时间列表
    getHistoryList() {
      const params = {
        roomId: this.roomId
      }
      return new Promise((resolve, reject) => {
        this.$Fetch("getHistoryList", params, (res) => {
          if(res.body.resultKey === 'ok') {
              const _data = res.body.data.roomDailySumList;
              if(_data.length > 0) {
                this.historyList = _data.map(({date})=> date.toString().substring(0,8))
              }
            };
            resolve();
        }, this)
      })
    },
    // 获取互动
    getRightMsg(params = {roomId: this.roomId}, callback) {
      this.$Fetch("getRightMsg", params, (res) => {
        if(res.body.resultKey === 'ok') {
            if(!Array.isArray(this.rightMsg)) {
               this.rightMsg = [];
            }
            this.rightMsg = this.rightMsg.concat(res.body.data.messages);
          }
      }, this)
    },
    // 获取互动历史
    getMoreRight () {
      if(this.activeIndex == 1) {
        // 如果滚动到了最顶部
          const messageId = this.rightMsg[0].messageId
          const params = {
            roomId: this.roomId,
            LoadMore: true,
            messageId: messageId
          }
          this.$Fetch("getRightMsg", params, (res) => {
            if(res.body.resultKey === 'ok') {
              const data = res.body.data.messages
                if(!Array.isArray(this.rightMsg)) {
                  this.rightMsg = [];
                }
                this.rightMsg = data.concat(this.rightMsg);
                this.myScroll.loadMore = false
                this.showloadmore = false
                this.$nextTick(() => {
                  if(data.length <= 0) {
                    this.loadtext = '没有更多消息'
                  } else {
                    const oldview = this.$refs.rightMsg.filter((item) => {                    
                    return item.info.messageId == messageId
                  })
                    this.myScroll.refresh()
                    this.myScroll.scrollToElement(oldview[0].$el, 0, 0, -20)
                    this.noMore = false
                  }
                  })
                
              }
          }, this, false)
        
      }
    },
    // 获取直播观点
    getLeftMsg(params = {roomId: this.roomId},callback) {
      this.$Fetch("getLeftMsg", params, (res) => {
        if(res.body.resultKey === 'ok') {          
            if(!Array.isArray(this.leftMsg)) {
               this.leftMsg = [];
            }
            if(res.body.data.messages.length > 0) { // 防止没有数据时重置leftMsg
              this.leftMsg = res.body.data.messages.concat(this.leftMsg);
            }        
            if (callback && typeof (callback === 'function')) {
              callback.apply(this, [res.body.data.messages]);
            }
          }
          // 首次加载自动滚动到底部
          setTimeout(() => {
            this.$scrollToBottom(this.$refs.js_leftCon, true)
          }, 500)
      }, this);
    },
    // 设置主题
    setRoomTopic() {
      const params = {
        roomId: this.roomId,
        topic: this.editThemeValue,
      }
      this.$Fetch("setRoomTopic", params, (res) => {
        if(res.body.resultKey === 'ok') {

            this.enterInfo.roomInfo.topic = this.editThemeValue
            this.setEditThemeShow(false);

            this.$vux.toast.show({
                type: 'success',
                time: '1000'
              })
          } else {
            this.$vux.alert.show({
                title: '系统提示',
                content: res.body.errorMessage,
              })
          }
      }, this)
     
    },
    //获取关注信息
    getFollowInfo() {
      const params = {
        source: 2,
        uid: this.enterInfo.roomInfo.ownerId,
      };
      this.$Fetch("getFollowInfo", params, (res) => {
         if(res.body.statecode == '1') {
            if(res.body.result == true) {
              this.likeInfo = '已关注'
            } else {
              this.likeInfo = '关注'
            }
          }
      }, this)
    },
    // 关注老师
    followtearch() {
      if(this.likeInfo === '已关注') {
        return false;
      }
      // 是否登录
      if(!this.isLogin()){
       return false
     }
      const params = {
        source: 2,
        uid: this.enterInfo.roomInfo.ownerId,
      };
      this.$Fetch("followtearch", params, (res) => {
        if(res.body.statecode=='1') {
            this.likeInfo = '已关注'
          } else {
            this.$vux.alert.show({
              title: '温馨提示',
              content: res.body.message,
            })
          }
      }, this);
    },
    // 获取登录信息
    getloginInfo() {
      return new Promise((resolve, reject) => {
        this.$http.jsonp(this.interface.islogin).then(
          res => {
            this.loginInfo = res.body;
            
            resolve();
          },
          errmsg => {
            console.log(errmsg)
          }
        )
      })
      
    },
    exitLogin () {
      this.$http.jsonp(this.interface.exitLogin).then(
          res => {
            this.loginInfo = '';
            
          },
          errmsg => {
            console.log(errmsg)
          }
        )
    },
    // 获取房间信息
    getRoomInfo() {
      const params = {
        roomId: this.roomId
      }
      return new Promise((resolve, reject) => {
         this.$Fetch("getRoomInfo", params, (res) => {
           console.log(res)
           if(res.body.resultKey === 'ok') {
              const data = res.body.data
              this.enterInfo = data;
              this.checkUserType(this.enterInfo)
              this.editThemeValue = this.enterInfo.roomInfo.topic;
              resolve();
            } else {
              if(res.body.businessKey=='user_baned'){
                    //您被该直播室拉黑了
                    this.isBlack = true;
                    this.dialogText = res.body.errorMessage
                    return;
                }
              if(res.body.businessKey=='user_not_buy_room'){
                  //novip
                  this.isNoVip = true;
                  return
              }
              if(res.body.businessKey=='user_not_login'){
                  //没登陆
                  this.checkLogin()
                  return
              }
              
            }
         }, this)
      })
      
    },
    //获取房间信息
    getRoomBaseInfo() {
      const params = {
        roomId: this.roomId
      }

      this.$Fetch("getRoomBaseInfo", params, (res) => {
        if(res.body.resultKey == 'ok') {
          this.roomBaseInfo = res.body.data.roomInfo;
        }
      }, this)
    },
    // 判断用户身份
    checkUserType(info) {
      const permission = info.userPermissions;
      this.linkInfo = info.isfavorite ? '已关注': '关注'; // 是否关注该老师
      this.topicWebinar = info.topicWebinar; // 是否是主题直播
      this.isFree = info.type == 'free'&&true;
      console.log(info.userInfo.userId == info.roomInfo.ownerId)
      //当前登录身份识别 -----登录用户身份
      if(!info.userInfo.login) {
        this.identity = 'anonymous' // 游客
      } else if(permission.isZhiboCompere) {
        this.identity = 'presenter' // 主持人
      } else if(info.userInfo.userId == info.roomInfo.ownerId && permission.isRoomOwner) {
        this.identity = 'teacher' // 老师
      } else if(permission.isTeacherAssistant&&permission.isRoomOwner) {
        this.identity = 'teacher' // 老师
      } else if (permission.isTeacherAssistant) {
        this.identity = 'assistant' // 助手
      } else if (permission.isCustomerService) {
        this.identity = 'service' // 客服
      } else if(permission.isTeachersStudent) {
        this.identity = 'vipUser' // VIP
      } else {
        this.identity = 'user' // 普通用户
      }
    },
    // 是否登录
    isLogin() {
      // 如果没有登录
       if(this.loginInfo.islogin === 'False') {
        this.checkLogin(); // 去登陆
        return false;
      } else if(!this.weChatLogin) { // 判断是否绑定微信
        if(this.isWechat) {
          this.checkBindWechat();
        }
        return true;
      }
       return true;
    },
    // 检测是否绑定微信
    checkBindWechat() {
      this.$http.jsonp(this.interface.isBindWeChat).then(
        res => {
          if(res.body.code == 0) { // 没有绑定
            location.href= this.interface.bindWeChat;
          } else if(!res.body.code == 1){ // 如果其他状态
            this.$vux.alert.show({
              title: '系统提示',
              content: res.body.msg
            })
          } else if (res.body.code == 1) {
            this.weChatLogin = true;
          }
        },
        errmsg => {

        },
      )
    },
    // 去登录
    checkLogin() {
      if(this.isApp) {
        window.javatojs.login();
      } else if(this.isWechat) {
        location.href= this.interface.bindWeChat;
      } else {
        location.href= this.interface.h5logurl;
      }
    },
    init() {
      Promise.all([this.getloginInfo(), this.getRoomInfo()]).then(
        success => { 
          if(this.isWechat) {
            this.isLogin();
          }
          this.getFollowInfo();
          this.getLeftMsg();
          this.getRightMsg();
          // 不加载往日信息
          // this.getHistoryList();
          mqttSession.apply(this);
        }
      )
    },
    
  },
  created() {
    if(!this.roomId) {
      this.$vux.alert.show({
        title: '系统提示',
        content: '进入房间失败',
      })
      return false;
    };
    this.getRoomBaseInfo();
    this.init();
  },
  mounted() {
    const dom = this.$refs.js_RightCon
    this.myScroll = new IScroll(dom, {
      mouseWheel: true,
      bounce: true,
      // click: true,
      tap: true,
      probeType: 2 // 触发scroll事件
    })

    this.myScroll.on('scrollEnd', () => {
      const that = this.myScroll
      this.rightOldY = this.myScroll.y
      if(this.myScroll.loadMore) {
        this.showloadmore = true
        this.loadtext = "正在加载"
        setTimeout(() => {
          this.getMoreRight()
        }, 500)
      }
    })

    this.myScroll.on('scroll', () => {
      const that = this.myScroll
      const y = parseInt(that.y)
      if (y > 40){
        this.noMore = true
        this.loadtext = "松开加载更多"
        this.myScroll.loadMore = true
      }
    })
    
  },
  updated() {
    // this.myScroll.refresh()
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
.liveRoom-viewBox #vux_view_box_body{
  display: flex;
  flex-direction: column;
  padding: 0;
}
.weui-loadmore_line {
  margin: 0 auto !important;
}
.icon {
  /* 通过设置 font-size 来改变图标大小 */
  width: .8rem; height: .8rem;
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
  overflow: hidden;
    img {
      width: 100%;
    }
}

.h-info {
  flex: 1;
  padding-left: .266667rem;
  .i-name {
    font-size: 15px;
  }
  .i-theme {
    display: flex;
  }
  .t-text{
    max-width: 4.3rem;
    display: block;
    align-items: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #CECECF;
  }
  .t-btn {
    padding-left: .266667rem; 
  }
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

.has-like {
  background: rgba(255,255,255,.2);
}

.container {
  flex: 1;
  display: flex;
  .c-item {
    flex: 1;
  }
}

.footer {
  padding: .2rem .266667rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  
  .f-btn-edit {
    padding: 0 .333333rem;
    flex: 9;
    border-radius: 1.333333rem;
    border: none;
    display: flex;
    align-items: center;
    background: #eee;
    text-align: left;
    color: #999999;
    font-size: 14px;
  }

  .f-btn-emoji {
    flex: 1;
    padding-left: .266667rem;
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
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: .4rem 0;
}

.weui-cell {
  padding: 0 !important;
}

.chose-answer-list {
  padding: .266667rem;
  background: transparent;
  .weui-btn:after {
    border-radius: 0;
    border: none;
  }
  .c-a-l-btn {
    border-radius: 0;
  }
  .c-a-l-btn-one {
    border-top-right-radius: .133333rem;
    border-top-left-radius: .133333rem;
  }
  .c-a-l-btn-two {
    margin: 0;
    margin-top: 0 !important;
    border-bottom-right-radius: .133333rem;
    border-bottom-left-radius: .133333rem;
  }
  .c-a-l-btn-three {
    border-radius: .133333rem;
    
  }
}
</style>
