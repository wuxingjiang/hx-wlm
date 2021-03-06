export function mqttSession() {
    console.log('准备启动mqtt',this.webenv.mqttProt)
    var vm = this;
    var client =new Paho.MQTT.Client("broker.zhibo.hexun.com",vm.webenv.mqttProt, this.loginInfo.userid+'');
    var roomTopic = 'zhibo/room/' + vm.roomId,
        mc=1,
        klick_logout=false;
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
          userName : this.enterInfo.userInfo.userId+'',
          password : this.enterInfo.userInfo.sessionId,
          cleanSession : true,
          onSuccess : onConnect,
          onFailure : OnConnectFailed,
          keepAliveInterval :60
      };
      client.connect(connect_options);
      function onConnect() {
        // console.log('mqtt链接成功')
        //   var cc=null,L;
        //   /*主题直播版 订阅消息*/
        //   client.subscribe(subTopic, subscribe_options);
         //是个人直播
        client.subscribe(roomTopic,subscribe_options);


        // 订阅普通消息
        if (vm.enterInfo.userInfo.login) {
            dmTopic = 'zhibo/chat/dm/' + vm.enterInfo.userInfo.userId + '/#';
            client.subscribe(dmTopic,subscribe_options);
        }

        /*
         1助理，2高级助理，3老师，4主持人
         订阅私聊提问，问答
        */
        if (vm.identity == 'assistant' || vm.identity == 'presenter'||vm.identity == 'teacher') {
            admTopic = 'zhibo/chat/dm/' + vm.enterInfo.roomInfo.ownerId + '/#';
            client.subscribe(admTopic,subscribe_options);
        }
      }
      function OnConnectFailed(responseObject) {
        console.log('mqtt链接失败')
        console.log(responseObject)
        if(klick_logout||responseObject.errorCode==6){return}
          setTimeout(function(){client.connect(connect_options);},5000);
          
      }

      function OnSubSuccess(responseObject) {
        console.log(responseObject)
      }

      function OnSubFailed(responseObject) {
        console.log('f2')
        client.connect(connect_options)
        }

      function onConnectionLost(responseObject) {
        console.log(responseObject)
          if (responseObject.errorCode !== 0) {
              setTimeout(function(){client.connect(connect_options);},5000);
          }
      }
     
      var Mess={
          t_ss: function(a) {

          },
          t_s:function(a){
              //'老师发表直播观点',a.type;
              console.log('老师发表直播观点')
              vm.leftMsg.push(a)
          },
          u_s:function(a){
              //'学生发表网友互动',a.type;
              vm.rightMsg.push(a)
          },
          u_a:function(a){
              //'学生提问',a.type;
              console.log('学生提问')
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
              console.log('提出用户', a)
              if(a.toKickUserId == vm.enterInfo.userInfo.userId) {
                vm.isBlack = true;
                vm.dialogText = a.body
            }
          },
          kick_user_multi_account:function(a){
              /*单点登陆*/
          },
          blacklist_user:function(a){
            //拉黑用户
         
            if(a.toBlackListUserId == vm.enterInfo.userInfo.userId) {
                vm.isBlack = true;
                vm.dialogText = a.body
            }
           
          },
          delete_message:function(a){
            //删除消息
            console.log('删除消息');
            vm.delMessage(a)
          },
          close_room:function(a){
              //产品已经下线
          },
          silence_user:function(a){
              //console.log('将该用户禁言', a.type);
              //d5.leftMsg(a);
              console.log('禁言', a)
              if(a.toSilenceUserId == vm.enterInfo.userInfo.userId) {
                vm.isBlack = true;
                vm.dialogText = a.body
            }
          },
          delete_a:function (a) {
              //删除消息
              console.log('删除互动',)
              //d5.delMsg('s' + a.toDeleteMessageId);
              vm.delMessage(a)
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
              console.log('xxxxxxxxxxxxxxxxx',a.field)
              switch (a.field) {
                  case 'announcement':
                      //更新公告
                      
                      break;
                  case 'topic':
                      /*更新主题*/
                      console.log('更新主题')
                      vm.enterInfo.roomInfo.topic = a.value;
                      a.value = `房间主题已变更为:【${a.value}】`
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
                      console.log(a)
                      break;
                  case 'webinar_popularity':
                      //更新人气
                      break;
              }
          }
      };
      function onMessageArrived(mqttMsg) {
        console.log('new msg'); 
        try{
          var a = JSON.parse(mqttMsg.payloadString);
          console.log(a.type); 
          Mess[a.type](a);
        }catch(e){
            throw new TypeError('script error for message server connect fail');    
        }
      };

}