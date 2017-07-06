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
          @click.native="eventBtnClick(item.productid, item.priceid)"
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
  props: ['roomId',],
  data() {
    return {
      msg: 'this is buy',
      show: true,
      priceData: [],
      stop: false,
    }
  },
  methods: {
    eventBtnClick(productid,priceid) {
      // http://vip.px.hexun.com/payment/h5/PaymentOrder.aspx?productid=40182&priceid=13321
      location.href=`http://vip.px.hexun.com/payment/h5/PaymentOrder.aspx?productid=${productid}&priceid=${priceid}&returnurl=${window.location.href}`
    }
  },
  created() {

    this.$Fetch("getRoomPrice", {roomId: this.roomId}, (res)=> {
        if(res.body.resultKey == 'ok') {
          const roomPricesList = res.body.data.roomPricesList;
          const priceData = roomPricesList.filter(({roomId}) => {
            return roomId == this.roomId;
          })
          this.priceData = priceData[0].roomPrices
          if(this.priceData.length <= 0) {
            this.stop = true;
            this.show = false;
          }
        } else {
            this.$vux.alert.show({
            title: '系统提示',
            content: res.body.errorMessage,
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