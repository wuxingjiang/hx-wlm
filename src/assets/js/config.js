const env = process.env.NODE_ENV;
console.log(window.location.hostname);

const createconfig = () => {
  let host = {
    apiHost: 'http://api.zhibo.hexun.com/',
    mqttProt: 89,
  };
  if(env === 'development') { // 本地开发环境
      console.log('本地开发环境');
    host = {
        apiHost: 'http://test.api.zhibo.hexun.com/',
        mqttProt: 90,
    }
  }
  if(window.location.hostname === 'test.zhibo.hexun.com') { // 测试环境
    console.log('测试环境');
    host = {
        apiHost: 'http://test.api.zhibo.hexun.com/',
        mqttProt: 90,
    }
  }

  return host;
};

const webenv = createconfig();

export default webenv