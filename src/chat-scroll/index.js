import vChatScroll from './chat-scroll.js';
import {scrollToBottom} from './scrollToBottom.js';
var VueChatScroll = {
    install: (Vue, options) => {
        Vue.directive('c-s', vChatScroll);
        Vue.prototype.$scrollToBottom = function (el, isManual) {
          scrollToBottom(el, isManual)
        }
    }
};

export default VueChatScroll;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueChatScroll)
}