<template>
  <div>
    <div v-transfer-dom class="BindPhone">
      <x-dialog v-model="show" :dialog-style="{'padding':'0', 'box-sizing':'border-box'}">
          <header class="b-header vux-1px-b">
            验证手机
            <svg @click="show = false" class="icon icon-guanbi" aria-hidden="true">
                <use xlink:href="#icon-guanbi"></use>
            </svg>
          </header>
          <section>
            <x-input 
            ref="inputTel"
            class="input-list vux-1px-b"
            title="" 
            type="tel"
            is-type="china-mobile"
            placeholder="请输入手机号码" 
            v-model="tel" 
            :min="11" 
            :max="11" ></x-input>
            <x-input 
            class="input-list vux-1px-b"
            title="" 
            type="number"
            is-type="funcV"
            placeholder="请输入5位验证码" 
            v-model="vnumber" 
            :min="5" 
            :max="5" >
              <x-button 
              :class="['input-btn', vbtnStatus?'btn-red':'btn-gray']" 
              :disabled="!vbtnStatus"
              slot="right" 
              plain 
              action-type="button"
              type="primary"
              @click.native="eventGetMsg"
              mini>{{vBtnText}}</x-button>
            </x-input>
          </section>
          <footer class="b-footer">
            <p class="b-f-errMsg">{{errMsg}}</p>
            <x-button 
              :class="['submit-btn',  sbtnStatus?'btn-red':'btn-gray']" 
              slot="right" 
              :disabled="!sbtnStatus"
              plain 
              type="primary" 
              @click.native="eventBindPhone"
              >确认</x-button>
            </x-input>
          </footer>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import MD5 from 'blueimp-md5'
  import {
    XDialog,
    TransferDom,
    XButton,
    XInput,
    Icon
  } from 'vux';
  export default {
    name: 'BindPhone',
    components: {
      XDialog,
      TransferDom,
      XButton,
      XInput,
      Icon 
    },
    props: ['isWechat'],
    directives: {
      TransferDom
    },
    data() {
      return {
        show: true,
        tel: '',
        vnumber: '',
        vbtnStatus: false,
        sbtnStatus: false,
        sendMsg: false,
        vBtnText: '获取验证码',
        errMsg: ''
      }
    },
    computed: {
      nowDate() {
        const date = new Date();
        return this.format(date.getTime(), 'yyyyMMdd');
      }
    },
    watch: {
      tel() {
        this.setVbtnStatus();
      },
      vnumber() {
        this.sbtnStatus = this.funcV() && this.sendMsg;
      }
    },
    methods: {
      funcV() {
        const vn = this.vnumber;
        console.log(vn.length)
        return vn && vn.length == 5
      },
      setVbtnStatus() {
       this.vbtnStatus = this.$refs.inputTel && this.$refs.inputTel.valid && !!this.tel;
      },
      format(timestamp, format = 'yyyy-MM-dd hh:mm') {
        const time = new Date(timestamp);
        let date = {
          "M+": time.getMonth() + 1,
          "d+": time.getDate(),
          "h+": time.getHours(),
          "m+": time.getMinutes(),
          "s+": time.getSeconds(),
          "q+": Math.floor((time.getMonth() + 3) / 3),
          "S+": time.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
          format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (let k in date) {
          if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
              ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
          }
        }
        return format;
      },
      eventGetMsg() {
        let params = {
          act: 'sendsms',
          mobile: this.tel,
          client: 'peixun',
          verifyCode: MD5(`peixun${this.nowDate}469810e448404a7659ef9176b6c16e28`),
        }
        // 如果在微信
        if(this.isWechat) {
          params = {
            act: 'wxsendsms',
            mobile: this.tel,
            client: 'weixin2017',
            verifyCode: MD5(`weixin2017${this.nowDate}e33a9f3c23707cbe5b62a3ce8c2d059a${this.tel}`),
          }
        }
        this.$Fetch("regTool", params, (res) => {
          if(res.body.code == 1) {
            this.sendMsg = true;
            this.vbtnStatus = false;
            let time = 60;
            const countDown = () => {
              if(time <= 0) {
                this.vBtnText = `获取验证码`;
                this.setVbtnStatus();
                return false;
              }
              setTimeout(() => {
                time--;
                this.vBtnText = `${time}秒`
                countDown()
              }, 1000);
              
            }
            countDown()
          } else {
            this.errMsg = res.body.msg
          }
        }, this, false)
      },
      eventBindPhone() {
        let params ={
          act: 'bind',
          mobile: this.tel,
          code: this.vnumber,
          client: 'peixun',
          verifyCode: MD5(`peixun${this.nowDate}469810e448404a7659ef9176b6c16e28`),
        }

        // 如果在微信
        if(this.isWechat) {
          params = {
            act: 'wxbindauthorize',
            mobile: this.tel,
            code: this.vnumber,
            client: 'weixin2017',
            verifyCode: MD5(`weixin2017${this.nowDate}e33a9f3c23707cbe5b62a3ce8c2d059a${this.tel}`),
          }
        }
        this.$Fetch("regTool", params, (res) => {
          if(res.body.code == 1) {
            this.$emit("bindSuccess", this.tel)
          } else {
            this.errMsg = res.body.msg
          }
          
        }, this, false)
      }
    }
  }
</script>
<style lang="less">
.BindPhone {
  .icon {
  /* 通过设置 font-size 来改变图标大小 */
  width: .4rem; height: .4rem;
  /* 图标和文字相邻时，垂直对齐 */
  vertical-align: -0.15em;
  /* 通过设置 color 来改变 SVG 的颜色/fill */
  color: #cacaca;
  fill: currentColor;
  
  /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
      normalize.css 中也包含这行 */
  overflow: hidden;
}
  .icon-guanbi {
   position: absolute;
   right: .4rem;
   top: .6rem;
  }
  .b-header {
    font-size: 18px;
    padding: .426667rem 0;
    position: relative;
  }
  .input-list {
    height:1.333333rem;
    box-sizing: border-box;
    padding: 0 .266667rem;
    text-indent: .4rem;
    font-size: 16px;
  }
  .input-btn {
    border: none;
    color: #fff;
    height:1.333333rem;
    border-radius: 0;
    &:active {
    border-color: rgba(0, 0, 0, .5)!important;
    color: #fff !important;
    background-color: #dd5050;
  }
  }
  .b-footer {
    padding: .533333rem 1.2rem;
    .submit-btn {
      border-radius: 100px;
      border: none;
      color: #fff;
      &:active {
        border-color: rgba(0, 0, 0, .5)!important;
        color: #fff !important;
        background-color: #dd5050;
      }
    }
  }
  .btn-red {
    background: #ee5050
    }
  .btn-gray {
    background: #bbbbbb;
  }
  .b-f-errMsg {
    padding-bottom: .53333rem;
    color: #EE5050;
  }
}

</style>