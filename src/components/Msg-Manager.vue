<template>
  <div  class="Msg-Manager">
    <div :class="['m-list', cData.class]">
      <div class="l-container">
        <div class="c-img" >
          <img :src="cData.userImage" alt="">
        </div>
        <div class="c-msg" >
          <header class="c-m-head">
            <span class="m-h-name">
              {{cData.nickName}}
            </span>
            <span class="m-h-char">
              {{cData.level}}
            </span>
            <span class="m-h-time">
              {{cData.formatTime}}
            </span>
          </header>
          <section class="c-m-content">
            <div class="m-c-con">
              <div class="c-c-answer" 
              >
                <div v-html="cData.cbody" :id="`xxx${cData.messageId}`"></div>
                <div 
                v-if="cData.originalMessageObj" 
                class="c-c-question" 
                >
                  <div v-html="cData.originalMessageObj._contentText"></div>
                </div>
              </div> 
            </div>
            <p class="m-c-opera"  v-if="operation.zhibo">
              <span class="btn" @click="eventDelGD">
                删除
              </span>
              <span class="gap"></span>
              <span class="btn" 
              v-clipboard:copy="cData.cbody"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">
                复制
              </span>
              <span class="gap"></span>
              <span class="btn" v-if="cData.important">      
                已推送
              </span>
              <span @click="eventSendImMsg" class="btn" v-else>      
                推送为重要观点
              </span>
            </p>
            <p class="m-c-opera"  v-if="operation.hudong ">
              <span class="btn"
              @click="eventKickMethod">
                踢
              </span>
              <span class="gap"></span>
              <span class="btn"
              @click="eventBlackMethod">
                黑
              </span>
              <span class="gap"></span>
              <span class="btn"
              @click="eventSilenceMethod">
                禁
              </span>
              <span class="gap"></span>
              <span class="btn"
              @click = "eventDelUserMethod">
                删
              </span>
              <span class="gap"></span>
              <span class="btn" 
              v-clipboard:copy="cData.cbody"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">
                复制
              </span>
              <span class="gap"></span>
              <span class="btn" @click="eventAnswerMethod(cData.nickName, cData.messageId, true)">
                回复
              </span>
            </p>
            <p class="m-c-opera"  v-if="operation.huifu ">
              <span class="btn" @click="eventAnswerMethod(cData.nickName, cData.messageId, false)">
                回复
              </span>
            </p>
            <p  class="m-c-opera"  v-if="operation.jieda ">
              <span class="btn" @click='eventExplainMethod(cData.nickName, cData.messageId)'>
                解答
              </span>
            </p>
          </section>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import {BBcode} from '../assets/js/BBcode.js'

import { 
  Flexbox,
  FlexboxItem,
  } from 'vux'

export default {
  name: 'Msg-Manager',
  components: {
    Flexbox,
    FlexboxItem,
  },
  props:['info', 'authority', 'type','interface', 'roomId', 'sub'],
  data() {
    return {
      msg: 'Msg-Manager',
      
    }
  },
  computed: {
    cData() {
      const obj = this.info;
      const timeStr = obj.messageTime;
      obj.formatTime = this.splitTime(timeStr, 'MM-DD hh:mm:ss');
      const TEACHERSPEAK=['t_s'];
      const TEACHERANSWER = ['t_rol', 't_ror', 't_rp', 't_ro', 'ta_ror', 'ta_rol', 'ta_rp', 'ta_ro', 'ta_s'];
      const CUSTOMER = ['u_s', 'u_r', 'u_a'];
      const HXSERVICE = ['cs_s', 'cs_ro'];
      const HOST = ['zc_s', 'zc_rp', 'zc_ro', 'zc_rol', 'zc_ror']
      const SYSTEM = ['topic', 'ad_robot_room', 'ad_robot_all', 'room_sys_msg', 'gift', 'announcement', 'speak_policy', 'update_room'];
      if(typeof(obj.body) !== 'undefined') {
        obj.cbody = this.bbcode(obj.body)
      }

      if(TEACHERSPEAK.indexOf(obj.type) != -1) {
        obj.class = 'manager-speak';
        obj.level = '老师'
      } else if (TEACHERANSWER.indexOf(obj.type) != -1) {
        obj.class = 'manager-answer';
        obj.level = '老师'
      } else if (CUSTOMER.indexOf(obj.type) != -1) {
        obj.class = 'customer';
        if(obj.isVip) {
          obj.level = 'VIP'
        } else {
          obj.level = '普通'
        }
        
      } else if (SYSTEM.indexOf(obj.type) != -1) {
        obj.class = 'system';
        obj.cbody = obj.value || obj.cbody;
        obj.level = '系统消息';
        obj.userImage = require('@/assets/system.png')
        if(obj.type == 'gift') { // 送礼
          obj.cbody = `${obj.userName}送给老师${obj.giftNum}${obj.giftUnit}${obj.giftName}`
        }
      } else if (HXSERVICE.indexOf(obj.type) != -1){
        obj.class = 'service';
        obj.level = '和讯客服';
      }
      
      if(typeof (obj.originalMessage)!='undefined') {
        obj.originalMessageObj = JSON.parse(obj.originalMessage)
        obj.originalMessageObj._contentText = this.bbcode( this.filter(obj.originalMessageObj.body))
      }
      
      return obj;
    },
    operation() {
      return {
        zhibo: this.cData.class != 'system'  && this.authority.operation && this.type == '直播观点',
        hudong: this.cData.class != 'system' && this.cData.type != 'u_a' && this.cData.class !="service" && this.authority.operation && this.type == '互动交流' && this.cData.level != '老师',
        huifu: this.authority.answerService && this.type == '互动交流' && this.cData.class == 'service',
        jieda: this.cData.class != 'system' && this.cData.type == 'u_a' && this.cData.class !="service" && this.authority.operation && this.type == '互动交流' && this.cData.level != '老师',
      }
    }
  },
  methods: {
    // 20170616160629
    splitTime(timeStr, format = 'YYYY-MM-DD hh:mm:ss') {
      timeStr = String(timeStr);
      let date = {
        "Y+": timeStr.substr(0, 4),
        "M+": timeStr.substr(4, 2),
        "D+": timeStr.substr(6, 2),
        "h+": timeStr.substr(8, 2),
        "m+": timeStr.substr(10, 2),
        "s+": timeStr.substr(12, 2),
      };

      for (let k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, date[k])
        }
      }
      return format;
    },
    filter(a,i){
      let  f='',s='',
            input=/(\&lt;\u0073\u0063\u0072\u0069\u0070\u0074(.+?)\/\u0073\u0063\u0072\u0069\u0070(.+?)\&gt;)|(\&lt;\u0069\u0066\u0072\u0061\u006d\u0065(.+?)\/\u0069\u0066\u0072\u0061\u006d(.+?)\&gt;)|(\&lt;\u0066\u006f\u006e\u0074(.+?)size(.+?)\/\u0066\u006f\u006e(.+?)\&gt;)|(\&lt;\u0076\u0069\u0064\u0065\u006f(.+?)\/\u0076\u0069\u0064\u0065(.+?)\&gt;)|(\&lt;\u0061\u0075\u0064\u0069\u006f(.+?)\/\u0061\u0075\u0064\u0069(.+?)\&gt;)|(\u0063\u006f\u006e\u0074\u0065\u006e\u0074\u0065\u0064\u0069\u0074\u0061\u0062\u006c\u0065)|(\&lt;\u0070\u0072\u0065(.+?)\/\u0070\u0072(.+?)\&gt;)|(\&lt;\u0074\u0065\u0078\u0074\u0061\u0072\u0065\u0061(.+?)\/\u0074\u0065\u0078\u0074\u0061\u0072\u0065(.+?)\&gt;)|(\&lt;\u006d\u0065\u0074\u0061(.+?)\&gt;)|(\&lt;\u0062\u0075\u0074\u0074\u006f\u006e(.+?)\&gt;)|(\&lt;\u006f\u0062\u006a\u0065\u0063\u0074(.+?)\/\u006f\u0062\u006a\u0065\u0063\u0074)|(\&lt;\u0065\u006d\u0062\u0065\u0064(.+?)\/\u0065\u006d\u0062\u0065\u0064)|(\&lt;\u006c\u0069\u006e\u006b)|(\&lt;\u0073\u0065\u006c\u0065\u0063\u0074(.+?)\/\u0073\u0065\u006c\u0065\u0063\u0074)|(\&lt;\u0073\u0076\u0067(.+?)\/\u0073\u0076\u0067)|(\&lt;\u0062\u006f\u0064\u0079(.+?))|(\&lt;\u0068\u0074\u006d\u006c(.+?))|(\&lt;\u0068\u0065\u0061\u0064(.+?))|(\&lt;\u0074\u0069\u0074\u006c\u0065(.+?))|(\&lt;\u0075(.+?)\&lt;\/\u0075)|(\&lt;\u0069(.+?)\&lt;\/\u0069)|(\&lt;\u0073(.+?)\&lt;\/\u0073)|(\&lt;\u0066\u006f\u0072\u006d(.+?)\&lt;\/\u0066\u006f\u0072\u006d)|(\&lt;\u006d\u0065\u006e\u0075(.+?)\/\u006d\u0065\u006e\u0075)|(\&lt;\u0066\u0069\u0065\u006c\u0064\u0073\u0065\u0074(.+?)\/\u0066\u0069\u0065\u006c\u0064\u0073\u0065\u0074)|(\&lt;\u006f\u0070\u0074\u0069\u006f\u006e(.+?)\/\u006f\u0070\u0074\u0069\u006f\u006e)|(\&lt;\u006d\u0061\u0070(.+?)\/\u006d\u0061\u0070)|(\&lt;\u0061\u0072\u0065\u0061)|(\&lt;\u0070\u0072\u006f\u0067\u0072\u0065\u0073\u0073)|(\&lt;\u0076\u0061\u0072)|(\&lt;\u0063\u006f\u0064\u0065)|(\&lt;\u006d\u0061\u0072\u0071\u0075\u0065\u0065)|(\&lt;\u0078\u006d\u0070)|(\&lt;\u0062\u0067\u0073\u006f\u0075\u006e\u0064)|(\&lt;\u0066\u0072\u0061\u006d\u0065\u0073\u0065\u0074)|(\&lt;\u0062\u0061\u0073\u0065)|(\&lt;\u0062\u0069\u0067)|(\&lt;\u0062\u006c\u0069\u006e\u006b)|(\&lt;\u0066\u0072\u0061\u006d\u0065)|(\&lt;\u006d\u0075\u006c\u0074\u0069\u0070\u006c\u0065)|(\&lt;\u006e\u006f\u0066\u0072\u0061\u006d\u0065)|(\&lt;\u0073\u0075\u0062)|(\&lt;\u0073\u0075\u0070)|(\&lt;\u0074\u0061\u0062\u006c\u0065)|(\&lt;\u0074\u0069\u0074\u006c\u0065)/ig,
          output=/(<script(.+?)\<\/scrip(.+?)>)|(<iframe(.+?)<\/ifram(.+?)>)|(size=['|"](.+?)['|"])|(javascript)|(onclick)|(onmousedown)|(onmouseup)|(onmousemove)|(face=['|"](.+?)['|"])|(<video(.+?)\/vide(.+?)>)|(<audio(.+?)\/audi(.+?)>)|(contenteditable)|(<pre(.+?)\/pr(.+?)>)|(<textarea(.+?)\/textare(.+?)>)|(<(.+?)?meta(.+?)>)|(<button(.+?)>)|(<object(.+?)\/objec(.+?)>)|(<embed(.+?)\/embe(.+?)>)|(<link(.+?)>)|(<select(.+?)\/selec(.+?)>)|(<svg(.+?)\/sv(.+?)>)|(<body(.+?))|(<html(.+?))|(<head(.+?))|(<title(.+?))|(<u>(.+?)<\/u>)|(<i(.+?)<\/i)|(<s>(.+?)<\/s>)|(<form(.+?)\/form)|(<menu(.+?)<(.+?)menu)|(<fieldset(.+?)\/fieldset)|(<option(.+?)\/option)|(<map(.+?)\/map)|(<area)|(<progress)|(<var)|(<code)|(<marquee)|(<xmp)|(<bgsound)|(<frameset)|(<base)|(<big)|(<blink)|(<frame)|(<multiple)|(<noframe)|(<sub)|(<sup)|(<table)|(<title)|(style=["|'](.+?)["|'])|(class=["|'](.+?)["|'])|(id=["|'](.+?)["|'])|(width=["|'](.+?)["|'])|(height=["|'](.+?)["|'])|(size=["|'](.+?)["|'])|(weight=["|'](.+?)["|'])/ig;
      a=a.replace(/(<input(.+?)>)|(style=["|']([\s\S)]*?)["|'])|(class=["|']([\s\S)]*?)["|'])|(id=["|']([\s\S)]*?)["|'])/gi,s);
      a=a.replace(/(<div)|(<h[1-6])/ig,'<p').replace(/(<\/div)|(<\/h[1-6])/ig,'</p');
      a=a.replace(input,f);
      return a.replace(output,f);
	  },
    bbcode(body) {
      const codejs = new BBcode();
      return codejs.ins(body).toHTML('face').toHTML('img').toHTML('url').toHTML('at').out();
    },
    eventAnswerMethod(who, msgId, isChoseType) {   
      if(this.authority.operation) {
        isChoseType = true;
      }   
      const params = {
          name: who,
          msgId: msgId,
          type: isChoseType
        }
      
      this.$emit('answerMethod', params)
    },
    eventExplainMethod(who, msgId) {
      const params = {
          name: who,
          msgId: msgId,
        }
      this.$emit('explainMethod', params)
    },
    onCopy() {
      this.$vux.toast.show({
        type: 'success',
        time: '2000'
      })

    },
    onError() {
      this.$vux.toast.show({
        type: 'cancel',
        time: '2000'
      })
    },
    // 删除观点
    eventDelGD() {
      this.$vux.confirm.show({
        content: '你确定删除本条观点么？',

        onConfirm: () =>{
          this.delMsg();
        },
      }) 
    },
    // 推送重要观点
    eventSendImMsg() {
      const params = {
        msgId: this.info.messageId,
      }
      this.$Fetch(this.interface.api.setImMsg, params, (res)=> {
        if(res.body.resultKey == 'ok') {
          this.$emit('delMethod', this.sub)
          this.$vux.toast.show({
            text: res.body.data.msg,
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
    // 拉黑用户
    eventBlackMethod() {
      this.$vux.confirm.show({
        content: `你确定,需要把当前用户</br>${this.cData.nickName}残忍的拉入黑名单么？`,
        onConfirm: () => {
          const params = {
            roomId: this.roomId,
            userId: this.cData.userId,
            startTime: '1970-01-01',
            endTime: '9999-12-31',
          }
          this.$Fetch(this.interface.api.addUserBlackList, params, (res) => {
            if(res.body.resultKey == 'ok') {
            // this.$emit('delMethod', this.sub)
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

        }
      })
    },
    // 踢人
    eventKickMethod() {
      this.$vux.confirm.show({
        content: `你确定,需要把当前用户</br>${this.cData.nickName}踢出直播室么？`,
        onConfirm: () => {
          const params = {
            roomId: this.roomId,
            userId: this.cData.userId,
          }
          this.$Fetch(this.interface.api.kickUser, params, (res) => {
            if(res.body.resultKey == 'ok') {
            // this.$emit('delMethod', this.sub)
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
        }
      })
    },
    //禁言
    eventSilenceMethod() {
      this.$vux.confirm.show({
        content: `你确定,需要把当前用户</br>${this.cData.nickName}残忍的禁言么？`,
        onConfirm: () => {
          const params = {
            roomId: this.roomId,
            userId: this.cData.userId,
          }
          this.$Fetch(this.interface.api.silenceUser, params, (res) => {
            if(res.body.resultKey == 'ok') {
            // this.$emit('delMethod', this.sub)
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
        }
      })
    },
    //删除
    eventDelUserMethod() {
      this.$vux.confirm.show({
        content: `您确定，需要把当前用户</br>${this.cData.nickName}发表的信息删除么？`,
        onConfirm: () => {
          this.delMsg()
        }
      })
    },
    delMsg() {
      const params = {
        roomId: this.roomId,
        msgId: this.info.messageId
      }

      this.$Fetch(this.interface.api.delMessage, params, (res)=> {
        if(res.body.resultKey == 'ok') {
    
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
    }
  },

  mounted() {
   
  }
}
</script>
<style lang="less">
.Msg-Manager {
  padding: .266667rem 0;
  .l-container {
    display: flex;
    justify-content: flex-start;
  }
  .m-list {
    // padding: 0 .266667rem;
  }
  .c-img {
    align-self: flex-start;
    padding-top: .533333rem;
    width: 1.6rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    img {
      background: #fff;
      height: 1.066667rem;
      width: 1.066667rem;
      border-radius: 50%;
      border: none;
    }
  }

  .c-msg {
    width: 6.813333rem;
    box-sizing: border-box;
  }

  .c-m-head {
    display: flex;
    justify-content: flex-start;

    .m-h-char {
      padding: 0 8px;
      margin: 0 5px;
      border-radius: 100px;
      color: #fff;
      background: #EE5151;
    }

    .m-h-time {
      color: #C2C2C2;
    }
  }

  .c-m-content {
    margin: .173333rem 0;
    background: #BEE4FB;
    padding: .24rem;
    border-radius: 5px;
    position: relative;
    word-wrap: break-word;
    .m-c-opera {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .btn {
        color:#049DFF;
        padding: 0 .266667rem;
      }
      .gap {
        height: .346667rem;
        width: 1px;
        background: #049DFF;
      }
    }
  }

  .c-m-content::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-top: .133333rem solid transparent;
    border-right: .266667rem solid #BEE4FB;
    border-bottom: .133333rem solid transparent;
    position: absolute;
    top: .266667rem;
    left: -.266667rem;
    
  }

  .manager-speak,.manger-answer {
    .m-h-char {
      background: #EE5151;
    }
  }

 
  .c-c-question {
      background: #9DD4F3;
      // background: red;
      padding: .24rem;
      border-radius: 5px;
    }

  .customer {
    .l-container {
      display: flex;
      justify-content: flex-end;
    }
    .c-img {
      order: 2;
    }
    .c-msg {
      order: 1;
    }
    .c-m-content {
      background: #fff;
    }
    .c-m-content::after {
      border-right: none;
      border-top: .133333rem solid transparent;
      border-left: .266667rem solid #fff;
      border-bottom: .133333rem solid transparent;
      top: .266667rem;
      left: 6.8rem;
    }
    .c-m-head {
      display: flex;
      justify-content: flex-end;
    }
    .m-h-char {
      background: #FFA800;
    }
  }
  .service {
    .l-container {
      display: flex;
      justify-content: flex-end;
    }
    .c-img {
      order: 2;
    }
    .c-msg {
      order: 1;
    }
    .c-m-content {
      background: #fff;
    }
    .c-m-content::after {
      border-right: none;
      border-top: .133333rem solid transparent;
      border-left: .266667rem solid #fff;
      border-bottom: .133333rem solid transparent;
      top: .266667rem;
      left: 6.8rem;
    }
    .m-h-char {
      background: #049DFF;
    }
  }
}
</style>