<template>
  <div class="liveRoom" id="liveRoom">
    <x-header>{{roomInfo.roomInfo.roomName}}</x-header>
    <header class="head">
        <div class="h-img">
            <img :src="roomInfo.roomInfo.imageUrl" alt="">
        </div>
        <div class="h-info">
            <p class="i-name">
              {{roomInfo.roomInfo.ownerNick}}
            </p>
            <p class="i-theme">
              <span class="t-text">主题：{{roomInfo.roomInfo.topic}}</span>
              <span class="t-btn" @click="setEditThemeShow(true)">
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
    <swiper 
    v-model="index" 
    class="container" 
    :show-dots="false"
    height="100%">
      <swiper-item class="c-item" v-for="(item, index) in list" :key="index">
        <msg-manager
        v-for="(msg, num) in leftMsg"
        v-if="item === '直播观点'"
        :info="msg"
        :key = "msg.type + num"
        ></msg-manager>
        <msg-manager
        v-for="(msg, num) in rightMsg"
        v-if="item === '互动交流'"
        :info="msg"
        :key = "msg.type + num"
        ></msg-manager>
      </swiper-item>
    </swiper>
    <flexbox class="footer vux-NaNrem-t">
      <flexbox-item :span="85/100">
        <x-button 
        class="f-btn-edit" 
        plain
        :action-type="'button'"
        @click.native="setEditSpeakShow"
        >
          <input-placeholder :placeholder="speakPlaceholder"></input-placeholder>
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
    :max="editThemeMax"
    :placeholder="'请输入今日主题'"
    :editShow="editThemeShow"
    @setEditShow="setEditThemeShow"
    @sendBtnMethod="setRoomTopic"
    v-model="editThemeValue"
    :title="'编辑今日主题'"
    :type="'textArea'"
    ></textarea-group>
    <textarea-group
    :max="editSpeakMax"
    :placeholder="speakPlaceholder"
    :editShow="editSpeakShow"
    @setEditShow="setEditSpeakShow"
    v-model="editSpeakValue"
    :title="'编辑内容'"
    :type="'wuEdit'"
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
  XTextarea,
  AjaxPlugin,
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
      editThemeShow: false,
      editThemeMax: 20,
      editThemeValue: '',
      editSpeakShow: false,
      editSpeakMax: 20,
      editSpeakValue: ';;;',
      likeInfo: '关注', // 关注信息
      speakPlaceholder: '说说你的想法…',
      loginInfo: '', // 登录信息
      roomInfo: {
        roomInfo: {
          roomName: '',
          ownerNick: '',
          imageUrl: '',
          topic:'',
        }
      }, // 房间信息
      leftMsg: [
        
      ],
      rightMsg: [],
    }
  },
  computed: {
    interface() {
      let apidomain='http://api.zhibo.hexun.com/';
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
          setRoomTopic: `${apidomain + 'api/room/management/set_room_topic'}` // 设置主题
        },
        islogin:'http://reg.tool.hexun.com/wapreg/checklogin.aspx?format=json&encode=utf-8',//判断登陆
        h5logurl: 'https://reg.hexun.com/h5/login.aspx?regtype=5&gourl=' + escape(window.location.href),
      }
    },
    roomId() {
      return this.$route.query.roomId;
    }
  },
  methods: {
    setEditThemeShow(val) {
      console.log('111111');
      this.editThemeShow = val;
    },
    setEditSpeakShow() {
      this.editSpeakShow = !this.editSpeakShow;
    },
    // 获取直播观点
    getRightMsg(params = {roomId: this.roomId}) {
      this.$http.jsonp(this.interface.api.getRightMsg, {params}).then(
        res => {
          if(res.body.resultKey === 'ok') {
            this.rightMsg = this.rightMsg.concat(res.body.data.messages)
          }
        },
        errmsg => {
          console.log('fail')
        }
      )
    },
    // 获取直播观点
    getLeftMsg(params = {roomId: this.roomId}) {
      this.$http.jsonp(this.interface.api.getLeftMsg, {params}).then(
        res => {
          if(res.body.resultKey === 'ok') {
            this.leftMsg = this.leftMsg.concat(res.body.data.messages)
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
      this.$http.jsonp(this.interface.api.setRoomTopic, {params}).then(
        res => {
          
          if(res.body.resultKey === 'ok') {
            this.roomInfo.roomInfo.topic = this.editThemeValue
            this.setEditThemeShow(false);
          } else {
            console.log('失败')
          }
        },
        errmsg => {
          console.log('shibao')
        }
      )
    },
    //获取关注信息
    getFollowInfo() {
      const params = {
        source: 2,
        uid: this.roomInfo.roomInfo.ownerId,
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
        uid: this.roomInfo.roomInfo.ownerId,
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
              this.roomInfo = res.body.data;
              resolve();
              this.getFollowInfo();
            } else {
              console.log()
            }
          },
          errmsg => {
            console.log(errmsg);
          }
        )
      })
      
    },
    init() {
      return new Promise((resolve, reject) => {
          this.getloginInfo(); // 获取登录信息
          this.getRoomInfo(); // 获取房间信息
          const res = Promise.all([this.getloginInfo(),this.getRoomInfo()])
      })
    },
    mqttFeatch() {
      var client =new Paho.MQTT.Client("broker.zhibo.hexun.com",89, this.loginInfo.userid+''); 
      var roomTopic = 'zhibo/room/' + this.roomId,mc=1,klick_logout=false;
      var dmTopic,admTopic,one_mc=false;
      var subscribe_options = {
          qos : 0,
          onSuccess : OnSubSuccess,
          onFailure : OnSubFailed
      };
      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived
      var connect_options = {
          useSSL:false,  
          //useSSL : true,
          userName : this.loginInfo.userid+'',
          password : this.roomInfo.userInfo.sessionId,
          cleanSession : true,
          onSuccess : onConnect,
          onFailure : OnConnectFailed,
          keepAliveInterval :60
      };
      console.log(connect_options)
      client.connect(connect_options);
      function onConnect() {
        console.log('-f')
          var cc=null,L;
          /*主题直播版 订阅消息*/
          client.subscribe(roomTopic, subscribe_options);
      }
      function OnConnectFailed(responseObject) {
        if(klick_logout||responseObject.errorCode==6){return}
          setTimeout(function(){client.connect(connect_options);},5000);
          console.log('f')
      }

      function OnSubSuccess(responseObject) {
        console.log(responseObject)
      }

      function OnSubFailed(responseObject) {
        console.log('f2')
        client.connect(connect_options)
        }

      function onConnectionLost(responseObject) {
        console.log('f3')
          if (responseObject.errorCode !== 0) {
              setTimeout(function(){client.connect(connect_options);},5000);
          }
      }
      var vm = this;
      var Mess={
          t_s:function(a){
              //'老师发表直播观点',a.type;
              console.log('222xxxxx')
              vm.leftMsg.push(a)
          },
          u_s:function(a){
              //'学生发表网友互动',a.type;
              vm.rightMsg.push(a)
          },
          u_a:function(a){
              //'学生提问',a.type;
              vm.rightMsg.push(a)
          },
          t_rp:function(a){
              //'老师解答学生提问（私聊）',a.type;
              vm.rightMsg.push(a)
          },
          t_rol:function(a){
              //老师左侧公开左侧回复
              vm.leftMsg.push(a)
          },
          t_ro:function(a){
              //老师公开解答
              vm.leftMsg.push(a);
          },
          t_ror:function(a){
              //'老师回互动交流右侧回复',a.type;
              vm.rightMsg.push(a)
          },
          u_r:function(a){
              //'vip和普通用户 回复互动的消息，右侧显示'
              vm.rightMsg.push(a)
          },
          cs_s:function(a){
              // '和讯客服发言，右侧显示';
              vm.rightMsg.push(a)
          },
          cs_ro:function(a){
              // 和讯客服回复用户，右侧互动交流显示';
              vm.rightMsg.push(a)
          },
          ta_ror:function(a){
              // 助理互动交流回复用户，右侧显示',;
              vm.rightMsg.push(a)
          },
          ta_rol:function(a){
              // '助理互动交流回复用户，公开回复';
              vm.leftMsg.push(a)
          },
          ta_rp:function(a){
              //'助理私密解答 右侧'
              vm.rightMsg.push(a)
          },
          ta_ro:function(a){
              //'助理公开解答 左侧'
              vm.leftMsg.push(a)
          },
          ta_s:function(a){
              //'助理发言，左则显示';
              vm.leftMsg.push(a)
          },
          zc_s:function(a){
              //主持人发言 左侧
              vm.leftMsg.push(a)
          },
          zc_rp:function (a) {
              //主持人私密解答
              vm.rightMsg.push(a)
          },
          zc_ro:function (a) {
              //主持人公开解答
              vm.leftMsg.push(a)
          },
          zc_rol:function (a) {
              //主持人互动交流左侧回复
              vm.leftMsg.push(a)
          },
          zc_ror:function(a){
              //主持人互动交流右侧回复
              vm.rightMsg.push(a)
          },
          ad_robot_room:function (a) {
              //'广告机器人(直播室[当前直播室])',;
              vm.leftMsg.push(a)
          },
          ad_robot_all:function(a){
              // 广告机器人(直播平台[全局广告])';
              vm.leftMsg.push(a)
          },
          room_sys_msg:function(a){
              // 直播室内系统消息（在右侧用户区显示）
              vm.rightMsg.push(a)
          },
          kick_user:function(a){
              /*踢出用户*/
          },
          kick_user_multi_account:function(a){
              /*单点登陆*/
          },
          blacklist_user:function(a){
            //拉黑用户
          },
          delete_message:function(a){
            //解答问题后删除消息
          },
          close_room:function(a){
              //产品已经下线
          },
          silence_user:function(a){
              //console.log('将该用户禁言', a.type);
              //d5.leftMsg(a);
          },
          delete_a:function (a) {
              //删除消息
              //d5.delMsg('s' + a.toDeleteMessageId);
          },
          topic_webinar_start:function(a){
              /*一次性*/
          },
          topic_webinar_stop:function(a){
              console.log('结束主题直播', a.type);
          },
          gift:function(a){
              //双11礼物
              vm.leftMsg.push(a)
          },
          hongbao:function(a){
              //红包
          },
          update_room:function(a){
              switch (a.field) {
                  case 'announcement':
                      //更新公告
                      a.value = live.main.filter(a.value);
                      a.value = live.main.filterImg(a.value);
                      a.type = 'announcement';
                      vm.leftMsg.push(a)
                      break;
                  case 'topic':
                      /*更新主题*/
                      a.value = a.value.slice(0, 20);
                      a.type = 'topic';
                      vm.leftMsg.push(a)
                      break;
                  case 'speak_policy':
                      //更新房间发言控制
                      a.type = 'speak_policy';
                      vm.leftMsg.push(a)
                      break;
                  case 'online':
                      //老师是否在线
                      a.value ? $('#online').removeClass('visible') : $('#online').addClass('visible');
                      break;
                  case 'popularity':
                      //直播室人气更新
                      break;
                  case 'webinar_popularity':
                      //更新人气
                      break;
              }
          }
      };
      function onMessageArrived(mqttMsg) {
        console.log(mqttMsg);
        
        
        try{
          var a = JSON.parse(mqttMsg.payloadString);
          console.log(a); 
          Mess[a.type](a);
        }catch(e){
            throw new TypeError('script error for message server connect fail');    
        }
      };
    }
  },
  created() {
    // this.init()
    const init = Promise.all([this.getloginInfo(),this.getRoomInfo()]).then(
      success => {
        this.getLeftMsg();
        this.getRightMsg();
        this.mqttFeatch();
        
        
        console.log('end')
      }
    )
    
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

</style>
