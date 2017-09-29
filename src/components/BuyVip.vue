<template>
  <div>
     <div v-transfer-dom class="BuyDialog">
      <x-dialog v-model="show" 
      :dialog-style="{
        'padding':'0 .666rem .8rem .666rem',
        'box-sizing':'border-box',
        'max-height':'10rem',
        'overflow': 'auto',
      }">
        <header class="b-header">
          购买后方可进入
        </header>
        <section>
          <x-button 
          v-for="item in priceData" 
          :key = 'item'
          @click.native="eventBtnClick(item)"
          plain type="primary" class="custom-primary-red">
            <span class="btn-price">￥{{item.price}}</span><span class="btn-unit">/{{item.unit}}</span>
          </x-button>
        </section>
        <section v-if="stop">
          <p>
            咨询热线：010-8568-7400
          </p>
          <p>
            该房间暂无运营
          </p>
        </section>
      </x-dialog>
      <x-dialog v-model="stop" :dialog-style="{'padding':'0', 'box-sizing':'border-box'}">
        <header class="b-header">
          购买后方可进入
        </header>
        <section v-if="stop">
          <p class="s-container">
            咨询热线：010-8568-7400
          </p>
          <p class="s-footer vux-1px-t">
            该房间暂无运营
          </p>
        </section>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import {
  XDialog,
  TransferDom,
  XButton
  } from 'vux'
export default {
  name: 'BuyDialog',
  components: {
    XDialog,
    TransferDom,
    XButton
  },
  directives: {
    TransferDom
  },
  props: ['roomId', 'dplusInfo', 'isWechat', 'webenv'],
  data () {
    return {
      msg: 'this is buy',
      show: true,
      priceData: [],
      stop: false
    }
  },
  computed: {
    publicfrom() {
      return this.$route.query.publicfrom;
    }
  },
  methods: {
    eventBtnClick (item) {
      let priceArea = "10元以上"
      if (item.price > 10) {
        priceArea = "10元以下"
      }
      dplus_Click("点击事件", {
        "事件功能": "购买",
        "类型": "付费",
        "所属平台": "微信工作室",
        "产品ID": item.productid,
        "产品名称": this.dplusInfo.rName,
        "合作者ID": this.dplusInfo.pId,
        "合作者名称": this.dplusInfo.pName,
        "价格区间": priceArea,
        "产品分类": "文字直播",
        "事件类别": "体验",
        "PLATFORM": "WEIXIN"
      })
      var wxlink="";
      if (this.isWechat) 
      {
        wxlink='&belong=weixingzs&jumpPlatform=public';
      }else
      {
        wxlink='&belong=zhibopt';
      }
      let link = `${this.webenv.orderHost}/order/h5/product?productid=${item.productid}&priceid=${item.priceid}&returnurl=${escape(window.location.href)}&fromhost=chat`+wxlink
      // if(this.isWechat) {
      //   link += '&jumpPlatform=public'
      // }
      if(this.publicfrom) {
        link  = `${link}&publicfrom=${this.publicfrom}`
      }
      location.href = link
    }
  },
  created () {
    this.$Fetch("getRoomPrice", {roomId: this.roomId}, (res) => {
      if (res.body.resultKey == 'ok') {
        const roomPricesList = res.body.data.roomPricesList
        const priceData = roomPricesList.filter(({roomId}) => {
          return roomId == this.roomId
        })
        this.priceData = priceData[0].roomPrices
        if (this.priceData.length <= 0) {
          this.stop = true
          this.show = false
        }
      } else {
        this.$vux.alert.show({
          title: '系统提示',
          content: res.body.errorMessage
        })
      }
    }, this)
  }
}
</script>
<style lang="less">
.BuyDialog {
  text-align: left;
  ul,li {
    list-style: none;
  }
  .b-header {
    font-size: 18px;
    padding: .426667rem 0;
  }
  .custom-primary-red {
    border-radius: 50px;
    background: #dd5050;
    color:#fff;
    border:none;
    &:active {
      border-color: rgba(0, 0, 0, .5)!important;
      color: #fff !important;
      background-color: #ee5050;
    }
  }

  .btn-price {
    font-size: 18px;
  }
  .btn-unit {
    font-size: 12px;
  }
  .s-container {
    font-size: 18px;
    padding: .4rem 0 .933333rem 0;
  }
  .s-footer {
    padding: .4rem 0;
    color: #ee5050;
    font-size: 18px;

  }
}

</style>