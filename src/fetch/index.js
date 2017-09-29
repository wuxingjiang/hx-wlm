import webenv from '@/assets/js/config.js';
const apidomain= webenv.apiHost
const api = {
    getRoomBaseInfo:apidomain+'api/room/get_room_info',//获取房间信息
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
    getRoomPrice: `${apidomain}api/room/get_room_prices`, // 获取VIP房间价格信息
    regTool:`https://regtool.hexun.com/wapreg/UserMobile.aspx`, // 过去短信验证
  }
const Fetch = {};
Fetch.install = function(Vue, options) {
  
 // 添加实例方法
  Vue.prototype.$Fetch = function (url, params, callback, vm, load = true) {
    // 打开loading
    if(load) {
      Vue.$vux.loading.show({
        text: 'Loading'
      })
    }
    
    Vue.http.jsonp(api[url],{params}).then(
      success => {
        Vue.$vux.loading.hide();
        if(success.body.resultKey == 'validation_error') {     
          this.$vux.alert.show({
            title: '系统提示',
            content: success.body.errorMessage
          });
          return false;
          }
        if(callback && typeof callback === "function") {
            callback.call(vm, success)
        }
      },
      fail => {
        if(load) {
          Vue.$vux.loading.hide()
        }
      }
    )
  }

}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Fetch);
}

export default Fetch;