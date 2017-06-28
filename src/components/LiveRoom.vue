<template>
  <div class="liveRoom" id="liveRoom">
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
        <div class="h-like" @click="followtearch">
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
    <div
    ref = "container"
    class="container" >
      <swiper 
      v-model="index" 
      :show-dots="false"
      ref = 'swiper'
      :height="containerHeight">
        <swiper-item height="100%" class="c-item" v-for="(item, index) in list" :key="index">
          <scroller
          :ref = "`scroller${index}`"
          v-model="pullStatus"
          height="100%"
          scrollbarY
          :use-pulldown="index === 0 && !noMore? true : false"
          :pulldown-config="pulldownConfig"
          @on-pulldown-loading="getHistoryMsg">
            <div class="js-msg-container">
              <divider v-if="index == '0' && noMore">没有更多数据</divider>
              <msg-manager
              v-for="(msg, num) in leftMsg"
              v-if="item === '直播观点'"
              :authority = "authority"
              :info="msg"
              :key="msg.type + num"
              :type= "item"
              :interface="interface"
              :roomId ="roomId"
              :sub = "num"
              ></msg-manager>
              <msg-manager
            
              v-for="(msg, num) in rightMsg"
              v-if="item === '互动交流'"
              :authority = "authority"
              :info="msg"
              :key = "msg.type + num"
              :type= "item"
              @answerMethod = 'answerMethod'
              @explainMethod = 'explainMethod'
              :interface="interface"
              :roomId="roomId"
              :sub = "num"
              ></msg-manager>
            </div>
          </scroller>
        </swiper-item>
      </swiper>
    </div>

    <flexbox class="footer vux-NaNrem-t">
      <flexbox-item :span="85/100">
        <x-button 
        class="f-btn-edit" 
        plain
        :action-type="'button'"
        @click.native="setEditSpeakShow(true)"
        >
          <input-placeholder :placeholder="speakPlaceholder"></input-placeholder>
        </x-button>
      </flexbox-item>
      <flexbox-item :span="15/100">
        <x-button
        class="f-btn-emoji"
        @click.native="eventOpenEmoji"
        plain>
          <svg class="icon e-xiaolian" aria-hidden="true">
              <use xlink:href="#icon-xiaolian"></use>
          </svg>
        </x-button>
      </flexbox-item>
    </flexbox>
    <textarea-group
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
    <wu-edit
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

    ></wu-edit>
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
            <x-button class="c-a-l-btn c-a-l-btn-one" @click.native="eventExplainOpen">公开回答</x-button>
            <x-button class="c-a-l-btn c-a-l-btn-two vux-1px-t" @click.native="eventExplainSolo">私密回答</x-button>   
            <x-button class="c-a-l-btn c-a-l-btn-three" @click.native="setChoseExplainshow(false)">取消</x-button>
          </div>
      </popup>
    </div>
  </div>
</template>

<script>
import MsgManager from '@/components/Msg-Manager.vue'
import InputPlaceholder from '@/components/InputPlaceholder.vue'
import TextareaGroup from '@/components/TextareaGroup.vue'
import wuEdit from '@/components/wuEdit.vue'
import {mqttSession} from '@/assets/js/mqttSession.js'
import webenv from '@/assets/js/config.js'
import * as Browser from '@/assets/js/browser.js';


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
  Flexbox,
  FlexboxItem,
  Popup,
  XTextarea,
  Scroller,
  AjaxPlugin,
  Divider,
  XDialog,
  TransferDom
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
    Flexbox,
    FlexboxItem,
    Popup,
    XTextarea,
    Scroller,
    Divider,
    XDialog,
    TransferDom,
    'msg-manager': MsgManager,
    'input-placeholder':InputPlaceholder,
    'textarea-group': TextareaGroup,
    'wu-edit': wuEdit,
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
      msg: 'Hello World!',
      webenv: webenv,
      defaultSelected: '直播观点',
      index: 0,
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
      pulldownConfig: {
        content: '下拉加载更多',
        height: 60,
        autoRefresh: false,
        downContent: '下拉加载更多',
        upContent: '释放加载',
        loadingContent: '加载中...',
        clsPrefix: 'xs-plugin-pulldown-'
      },
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
          topic:'',
        }
      }, // 房间信息
      identity: 'user', // 用户身份
      leftMsg: [],
      rightMsg: [],
      historyList:[],
      msgDomInfo: false,
      editType: 'send', //编辑器类型 默认send 发送消息 answer 回复 explan 解答
      answerWho: '回复谁',
      choseSendTypeShow: false,
      sendType: {},
      choseExplainshow: false,
      containerHeight: 439/2 +'px',
      weChatLogin: false, // 是否绑定微信
    }
  },
  computed: {
    interface() {
      let apidomain= this.webenv.apiHost;
      return {
        api:{
          getRoomInfo:apidomain+'api/room/get_room_info?roomId=',//获取房间信息
          getFollowInfo:'http://follow.zq.hexun.com/relation/isattention.do',//获取是否关注
          followtearch:'http://follow.zq.hexun.com/relation/add.do',//关注老师
          getTearchInfo:'http://partner.px.hexun.com/api/partner/get_partnershow_info',//合作者信息
          getLeftMsg:apidomain+'api/room/get_teacher_messages',//获取直播观点
          getRightMsg:apidomain+'api/room/get_users_messages',//获取互动交流
          getRoomInfo:apidomain+'api/room/enter_room',//获取互动交流
          getHistoryList:apidomain+'api/room/get_room_history',//获取历史列表
          setRoomTopic: `${apidomain + 'api/room/management/set_room_topic'}`, // 设置主题
          sendMessage: `${apidomain}/api/room/send_message`, // 发送消息
          delMessage: `${apidomain}api/room/management/delete_message`, // 删除消息
          setImMsg: `${apidomain}api/room/management/set_message_important`, // 设置重要观点
          addUserBlackList: `${apidomain}api/room/management/add_user_blacklist`, // 拉黑用户
          kickUser: `${apidomain}api/room/management/kick_user`, // 踢人
          silenceUser: `${apidomain}api/room/management/silence_user`, // 禁言


        },
        islogin:'http://reg.tool.hexun.com/wapreg/checklogin.aspx?format=json&encode=utf-8',//判断登陆
        h5logurl: 'https://reg.hexun.com/h5/login.aspx?regtype=5&gourl=' + escape(window.location.href),
        isBindWeChat: 'https://regtool.hexun.com/wapreg/CheckBindWechat.aspx', // 是否绑定微信
        bindWeChat: `https://reg.hexun.com/bindweixin.aspx?gourl=${escape(window.location.href)}`,
      }
    },
    headerShow() {
      const browser = new Browser.Browser().browser;
      let arr = ['Wechat', 'QQ']
      return arr.indexOf(browser) == '-1';
    },
     // 是否在微信
    isWechat(){
      const browser = new Browser.Browser().browser;
      return browser == 'Wechat';
    },
    // 时候在App
    isApp(){
      const ua = navigator.userAgent.toLowerCase();
      if(ua.indexOf('hxappid')>0) {
        return true;
      } else {
        return false;
      }
    },
    roomId() {
      return this.$route.query.roomId;
    },
    // 权限
    authority() {
      const iden = this.identity;
      return {
        operation: iden == 'teacher' || iden == 'assistant', // 操作权限 真三该查 管理权限
        answerService: iden != "anonymous", // 回复功能
      }
    },
    leftMsgLen() {
      return this.leftMsg.length;
    },
    rightMsgLen() {
      return this.rightMsg.length;
    }
  },
  watch: {
    leftMsgLen(newVal,oldVal) {
      this.reflashBox(newVal,oldVal)
    },
    rightMsgLen(val,nal) {
      this.reflashBox(val,nal)
    },
    index() {
      this.reflashBox([1],[1])
    },
    containerHeight(val , nal) {
      if(val !== nal) {
        this.$refs.swiper._watcher.vm.xheight = val
      }
    }
  },
  methods: {
    //删除消息
    delMessage(a) {
      console.log(a);
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
      }
      
    },
    explainMethod(params) {
      this.answerWho = {
        name: params.name,
        msgId: params.msgId,
      };
      this.setChoseExplainshow(true);
    },
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
    userAnswer() {
      this.editType = 'userAnswer';
      this.speakPlaceholder = `回复客服@${this.answerWho.name}：`
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
      this.editThemeShow = val;
    },
    setEditSpeakShow(val) {
     if(!this.isLogin()){
       return false
     }
      this.editSpeakShow = val;
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
      } else if (this.identity === 'user' && subParams.isQuestion && this.editType === 'send') {
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
      } else if (this.identity === 'user' && !subParams.isQuestion && this.editType === 'send') {
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
      } else if (this.identity === 'user' && !subParams.isQuestion && this.editType === 'userAnswer') {
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
      } else if (this.identity === 'user' && !subParams.isQuestion && this.editType === 'teacher') {
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
      }

      if(!type) {
        this.$vux.toast.show({
            type: 'warn',
            time: '2000'
          })
      }

      this.$Fetch(this.interface.api.sendMessage, params, (res)=> {
        if(res.body.resultKey == 'ok') {
          this.setEditSpeakShow(false);
          this.editSpeakValue = '';
          this.$vux.toast.show({
            type: 'success',
            time: '2000'
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
      let type= 'last'; // 默认刷新到尾部
      if(val > 0) {
          const domArr = this.$refs[`scroller${this.index}`][0].$el.getElementsByClassName('js-msg-container')[0];
          // 保存msgdom信息 用于把他们展示在可视范围内
          if(domArr) {
            this.msgDomInfo = domArr;
          }
        }
      
      if(val - nal == 1) { // 如果增加1条是发言
       type = 'last'
      } else if(val - nal == -1 ){ // 如果减少一条 是删除消息
        type = 'middle'
      } else if (val - nal > 1) { // 如果插入多条是获取更多
        type = 'first'
      }

      this.resetScrollerBox(type);
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
      this.$nextTick(() => {
        setTimeout(() => {
          let top = '0'
          if(this.msgDomInfo) {
            if(type == 'last') {
              top = this.msgDomInfo.scrollHeight - this.$refs[`scroller${this.index}`][0].$el.clientHeight;
            }
          }
          if(top < 0) {
            top = 0
          }
          if(type == 'middle') {
            this.$refs[`scroller${this.index}`][0].reset({
            })
          } else {
            this.$refs[`scroller${this.index}`][0].reset({
              top: top
            })
          }
          
          // this.pullupEnabled && this.$refs.scroller.enablePullup()
          this.pullStatus.pulldownStatus = 'default';
        }, 10)
      })
    },
    //获取历史信息时间列表
    getHistoryList() {
      const params = {
        roomId: this.roomId
      }
      return new Promise((resolve, reject) => {
        this.$http.jsonp(this.interface.api.getHistoryList, {params}).then(
          res => {
            if(res.body.resultKey === 'ok') {
              const _data = res.body.data.roomDailySumList;
              if(_data.length > 0) {
                this.historyList = _data.map(({date})=> date.toString().substring(0,8))
              }
            };
            resolve();
          },
          errmsg => {
            console.log('fail')
          }
        )
      })
      
 
    },
    // 获取互动
    getRightMsg(params = {roomId: this.roomId}, callback) {
      this.$http.jsonp(this.interface.api.getRightMsg, {params}).then(
        res => {
          if(res.body.resultKey === 'ok') {
            if(!Array.isArray(this.rightMsg)) {
               this.rightMsg = [];
            }
            this.rightMsg = this.rightMsg.concat(res.body.data.messages);
            
          }
        },
        errmsg => {
          console.log('fail')
        }
      )
    },
    // 获取直播观点
    getLeftMsg(params = {roomId: this.roomId},callback) {
      this.$http.jsonp(this.interface.api.getLeftMsg, {params}).then(
        res => {
          if(res.body.resultKey === 'ok') {
            if(!Array.isArray(this.leftMsg)) {
               this.leftMsg = [];
            }
            if(res.body.data.messages.length > 0) { // 防止没有数据时重置leftMsg
              this.leftMsg = res.body.data.messages.concat(this.leftMsg);
            }        
            if(callback && typeof(callback === 'function')) {
              callback.apply(this, [res.body.data.messages]);
            }
          }
        },
        errmsg => {
          console.log('fail')
        }
      )
    },
    // 设置主题
    setRoomTopic() {
      const params = {
        roomId: this.roomId,
        topic: this.editThemeValue,
      }
      this.$Fetch(this.interface.api.setRoomTopic, params, (res) => {
        if(res.body.resultKey === 'ok') {

            this.enterInfo.roomInfo.topic = this.editThemeValue
            this.setEditThemeShow(false);

            this.$vux.toast.show({
                type: 'success',
                time: '2000'
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
      this.$http.jsonp(this.interface.api.getFollowInfo, {params}).then(
        res => {
          if(res.body.statecode == '1') {
            if(res.body.result == true) {
              this.likeInfo = '已关注'
            } else {
              this.likeInfo = '关注'
            }
          }
        },
        errmsg => {
          console.log()
        }
      )
    },
    // 关注老师
    followtearch() {
      if(this.likeInfo === '已关注') {
        return false;
      }
      const params = {
        source: 2,
        uid: this.enterInfo.roomInfo.ownerId,
      };
      this.$http.jsonp(this.interface.api.followtearch, {params}).then(
        res => {
          if(res.body.statecode=='1') {
            this.likeInfo = '已关注'
          } else {
            this.$vux.alert.show({
              title: '温馨提示',
              content: res.body.message,
            })
          }
          
        },
        errmsg => {
          console.log(errmsg);
        }
      )
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
    // 获取房间信息
    getRoomInfo() {
      const params = {
        roomId: this.roomId
      }
      return new Promise((resolve, reject) => {
        this.$http.jsonp(this.interface.api.getRoomInfo, {params}).then(
          res => {
            if(res.body.resultKey === 'ok') {
              const data = res.body.data
              this.enterInfo = data;
              this.checkUserType(this.enterInfo)
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
                    // require(['novip']);
                    return ;
                }
                if(res.body.businessKey=='user_not_login'){
                    //没登陆
                    this.checkLogin()
                    return ;
                }
            }
          },
          errmsg => {
            console.log(errmsg);
          }
        )
      })
      
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
       if(this.loginInfo.islogin === 'False') {
        this.checkLogin();
        return false;
      } else if(!this.weChatLogin) {
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
      return new Promise((resolve, reject) => {
          this.getloginInfo(); // 获取登录信息
          this.getRoomInfo(); // 获取房间信息
          const res = Promise.all([this.getloginInfo(),this.getRoomInfo()])
      })
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
    const init = Promise.all([this.getloginInfo(),this.getRoomInfo()]).then(
      success => { 
        this.getFollowInfo();
        this.getLeftMsg();
        this.getRightMsg();
        this.getHistoryList();
        mqttSession.apply(this);
        this.containerHeight = this.$refs.container.getBoundingClientRect().height + 'px';
      }
    )

    if(this.isWechat) {
      this.isLogin();
    }
    
  },
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
    overflow: hidden;
    img {
      width: 100%;
    }
}

.h-info {
  flex: 1;
  padding-left: .266667rem;
  .i-theme {
    display: flex;
  }
  .t-text{
    width: 100px;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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

.container {
  flex: 1;
  
}

.footer {
  padding: .213333rem .266667rem;
  width: 100%;
  box-sizing: border-box;

  .f-btn-edit {
    border-radius: 1.333333rem;
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
