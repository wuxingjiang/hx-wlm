<template>
  <div id="Msg-Manager" class="Msg-Manager">
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
                <div v-html="cData.cbody"></div>
                <div 
                v-if="cData.originalMessageObj" 
                class="c-c-question" 
                >
                  <div v-html="cData.originalMessageObj._contentText"></div>
                </div>
              </div> 
            </div>
            <p class="m-c-opera">
              <span class="btn">
                删除
              </span>
              <span class="gap"></span>
              <span class="btn">
                复制
              </span>
              <span class="gap"></span>
              <span class="btn">
                重要观点
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
  props:['info'],
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
      const TEACHERANSWER = ['t_rol','t_ror'];
      const CUSTOMER = ['u_s'];
      const SYSTEM = ['topic'];
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
        obj.cbody = obj.value;
        obj.level = '系统消息';
      }
      
      if(typeof (obj.originalMessage)!='undefined') {
        obj.originalMessageObj = JSON.parse(obj.originalMessage)
        obj.originalMessageObj._contentText = this.filter(obj.originalMessageObj.body)
      }
      
      return obj;
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
  }
}
</script>
<style lang="less">
.Msg-Manager {
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
      background: red;
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
}
</style>