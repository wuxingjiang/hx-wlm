
const Fetch = {};

 Fetch.install = function(Vue, options) {
  
 // 添加实例方法
  Vue.prototype.$Fetch = function (url, params, callback, vm) {
    
    // 打开loading
    Vue.$vux.loading.show({
        text: 'Loading'
      })

    Vue.http.jsonp(url,{params}).then(
      success => {
        Vue.$vux.loading.hide()
        if(callback && typeof callback === "function") {
            callback.call(vm, success)
        }
      },
      fail => {
        Vue.$vux.loading.hide()
      }
    )
  }

}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Fetch);
}

module.exports = Fetch;