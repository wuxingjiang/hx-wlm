export function scrollToBottom (el, isManual) {  
    setTimeout(() =>{
      const eH = el.getBoundingClientRect().height
      const esH = el.scrollHeight
      const isScroll = el.getAttribute('isScroll')
      const scrollTop = el.getAttribute('scrollTop')
      if(scrollTop) {
        el.scrollTop = scrollTop
      }
      if(esH > 0 && (esH - el.scrollTop < eH * 2 || isManual || !isScroll)) {
        el.scrollTop = esH
        el.scrollTop = el.scrollTop - 20
        // 如果滚动过得div添加一个属性表示首次滚动过
        el.setAttribute('isScroll', true)
      }
    },200) 
};