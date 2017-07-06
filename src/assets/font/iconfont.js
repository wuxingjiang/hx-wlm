(function(window){var svgSprite="<svg>"+""+'<symbol id="icon-jia" viewBox="0 0 1024 1024">'+""+'<path d="M128.036583 448.384124l766.998695 0 0 126.889969-766.998695 0 0-126.889969Z"  ></path>'+""+'<path d="M448.090946 128.32976l126.889969 0 0 766.999718-126.889969 0 0-766.999718Z"  ></path>'+""+"</symbol>"+""+'<symbol id="icon-shuru" viewBox="0 0 1024 1024">'+""+'<path d="M816.192 932.864c0 14.976-12.16 27.136-27.136 27.136L129.28 960c-14.976 0-27.072-12.096-27.072-27.136l0-15.04c0-14.912 12.096-27.136 27.072-27.136l659.776 0c14.912 0 27.136 12.16 27.136 27.136L816.192 932.864zM768.576 79.872L695.04 153.344l137.344 137.408 73.472-73.472c21.184-21.184 21.184-55.488 0-76.672l-60.672-60.736C824.064 58.688 789.696 58.688 768.576 79.872zM801.319296 321.982733l-383.494758 383.386304-137.372928-137.411789 383.494758-383.386304 137.372928 137.411789ZM387.52 735.424L250.24 598.208 167.232 818.432Z" fill="" ></path>'+""+"</symbol>"+""+'<symbol id="icon-xiaolian" viewBox="0 0 1024 1024">'+""+'<path d="M512.325 958.82c-246.335 0-446.743-200.408-446.743-446.743 0-246.333 200.408-446.741 446.743-446.741 246.338 0 446.748 200.407 446.748 446.741C959.073 758.412 758.663 958.82 512.325 958.82zM512.325 93.683c-230.705 0-418.396 187.691-418.396 418.394 0 230.704 187.691 418.396 418.396 418.396 230.708 0 418.402-187.692 418.402-418.396C930.728 281.374 743.033 93.683 512.325 93.683zM309.909 367.747c0-38.908 31.543-70.45 70.451-70.45 38.908 0 70.45 31.542 70.45 70.45 0 38.909-31.542 70.451-70.45 70.451C341.452 438.198 309.909 406.656 309.909 367.747L309.909 367.747zM586.087 367.747c0-38.908 31.542-70.45 70.452-70.45 38.908 0 70.449 31.542 70.449 70.45l0 0c0 38.909-31.541 70.451-70.449 70.451C617.629 438.198 586.087 406.656 586.087 367.747zM264.154 555.567c0 303.45 493.328 312.371 505.491 0C264.154 555.567 264.154 555.567 264.154 555.567z"  ></path>'+""+"</symbol>"+""+'<symbol id="icon-edit" viewBox="0 0 1024 1024">'+""+'<path d="M995.60075 104.524314L382.51891 740.66015a41.622205 41.622205 0 0 1-19.781578 11.508613l-105.563031 26.399949 25.480732-109.497284c1.764899-7.794971 5.625616-14.854568 11.067388-20.516953L906.8778 12.418639a40.813293 40.813293 0 0 1 59.197658 0l29.525292 30.665123c16.362086 16.987154 16.362086 44.490166 0 61.440552z m-391.21931 36.915807H163.193422c-54.454492 0-73.537464 52.946974-73.537465 110.342965v625.031679c0 56.55031 19.082972 73.574233 73.537465 73.574233h625.068447c55.263405 0 73.500696-17.023923 73.500696-73.574233v-441.224787c0-13.199975 40.997136-4.743166 53.792655-4.743166a23.531989 23.531989 0 0 1 23.090764 23.973213v424.458245c0 82.95026-69.639979 144.611424-150.384115 144.611424h-625.068447c-79.935224 0-148.067685-61.661164-148.067685-144.611424V223.507931c0-83.795941 65.080656-151.928402 144.979111-151.928402H592.321296c12.75875 0 23.053995 10.699701 23.053995 23.973214 0 13.199975 1.801668 45.887378-10.993851 45.887378z"  ></path>'+""+"</symbol>"+""+'<symbol id="icon-jianpan" viewBox="0 0 1024 1024">'+""+'<path d="M512 1024c-281.6 0-512-230.4-512-512s230.4-512 512-512 512 230.4 512 512-230.4 512-512 512zM512 32C249.6 32 32 249.6 32 512s217.6 480 480 480 480-217.6 480-480S774.4 32 512 32z"  ></path>'+""+'<path d="M211.2 288h83.2v83.2H211.2zM384 288h83.2v83.2H384zM556.8 288H640v83.2H556.8zM729.6 288h83.2v83.2h-83.2z"  ></path>'+""+'<path d="M211.2 467.2h83.2v83.2H211.2zM384 467.2h83.2v83.2H384zM556.8 467.2H640v83.2H556.8zM729.6 467.2h83.2v83.2h-83.2z"  ></path>'+""+'<path d="M211.2 652.8h595.2v83.2H211.2z"  ></path>'+""+"</symbol>"+""+'<symbol id="icon-guanbi" viewBox="0 0 1024 1024">'+""+'<path d="M1011.580699 951.633055L571.281266 511.343495l437.703029-437.709611c16.476799-16.450473 16.476799-43.135188 0-59.58237-16.450473-16.450473-43.115443-16.450473-59.585661 0l-437.703029 437.703029-439.335242-439.335242c-16.555777-16.559068-43.385285-16.559068-59.941062 0-16.555777 16.559068-16.555777 43.411611 0 59.944353l439.331952 439.328661-435.886534 435.886533c-16.450473 16.453764-16.450473 43.131897 0 59.611987 16.48009 16.440601 43.135188 16.440601 59.585661 0l435.889824-435.902987 440.292851 440.286269c16.555777 16.562359 43.385285 16.562359 59.947644 0 16.549196-16.549196 16.549196-43.375413 0-59.941062z"  ></path>'+""+"</symbol>"+""+"</svg>";var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)