<template>
  <div id="Msg-Manager" class="Msg-Manager">
    <div :class="['m-list', type]">
      <div class="l-container">
        <div class="c-img" >
          <img src="" alt="">
        </div>
        <div class="c-msg" >
          <header class="c-m-head">
            <span class="m-h-name">
              逗我
            </span>
            <span class="m-h-char">
              老师
            </span>
            <span class="m-h-time">
              10-29 09:36
            </span>
          </header>
          <section class="c-m-content">
            <p class="m-c-con">
              <p class="c-c-answer">
                超级周的来临加剧了市场的波动性，英国大选，欧央行会议，美国前FBI局长科米到参议院情报委员会作证词。http://stock.hexun.com/2017-02-22/188251841. 
                超级周的来临加剧了市场的波动性，英国大选，欧央行会议，美国前FBI局长科米到参议院情报委员会作证词。http://stock.hexun.com/2017-02-22/188251841. 
              </p>
              <p class="c-c-question">
                超级周的来临加剧了市场的波动性，英国大选，欧央行会议，美国前FBI局长科米到参议院情报委员会作证词。http
                超级周的来临加剧了市场的波动性，英国大选，欧央行会议，美国前FBI局长科米到参议院情报委员会作证词。http
                超级周的来临加剧了市场的波动性，英国大选，欧央行会议，美国前FBI局长科米到参议院情报委员会作证词。http
              </p>
            </p>
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
  props:['type'],
  data() {
    return {
      msg: 'Msg-Manager'
    }
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
    .m-c-con {
      
    }
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

  .manger-answer {
    .c-c-question {
      background: #9DD4F3;
      padding: .24rem;
      border-radius: 5px;
    }
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