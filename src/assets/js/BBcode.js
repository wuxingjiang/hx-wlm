   export function BBcode (){
            this.str='';
            this.ch= {
                face : {
                        r: /(\[face\](.+?)\[\/face\])/gi,
                        f: function (a, b, c) {
                            try{
                                var face=/^(http:\/\/imgzq.hexun.com\/chatRoom\/static\/ff\/\d{1,2}.gif)/i;
                                if(face.test(c)){
                                    return '<img src="' + c + '"/>';
                                }else{
                                    return b;
                                }
                            }catch(e){
                                return '';
                            }
                        }
                },
                url:{
                        r: /(\[url=(.+?)\])([\s\S)]*?)\[\/url\]/gi,
                        f: function (a, b, c) {
                            try{
                            var t=/\](.+?)\[/i,st=a.match(t), n = '';
                            n = st == null ? c : st[1]
                            return '<a href="' + c + '" target="_blank"  class="_ddf">'+ n +'</a>';
                            }catch(e){
                                return '';
                            }
                        }
                },
                at :{
                        r: /(\[at])([\s\S]*?)\[\/at\]/gi,
                        f: function (a, b, c) {
                            try{
                                return '<span class="blue">'+c+'</span>';
                            }catch(e){
                                return '';
                            }
                        }
                    },
                img :{
                        r: /(\[img\](.+?)\[\/img\])/gi,
                        f: function (a, b, c) {
                           try{
                               var img=/^(http:\/\/(.+?))/i;
                               if(img.test(c)){
                                   return '<img src="' + c + '" class="ps_img" data-p="img">';
                               }else{
                                   return ''
                               }
                           }catch(e){
                               return ''
                           }
                        }
                }
            };
            this.cb={
                url:{
                    r:/<a([\s\S]+?)>([\s\S]+?)<\/a>/ig,
                    f:function(m,a,b){
                        try{
                            var reg=/(\bhref=["|']http(.+?)["|'])/ig;
                            var dd=m.match(reg)[0];
                            dd&&(dd=dd.slice(0,-1).slice(6));
                            return '[url='+dd+']'+b+'[/url]';
                        }catch(e){
                            return '';
                        }
                    }
                },
                img:{
                    r:/<img(.+?)src=['|"](.+?)>/ig,
                    f:function(m,a,b){
                        try{
                            var img=/^(http:\/\/(.+?))/i,
                                sy2=/["|']|(\/)$/ig,ars=null,frs=null,
                                face=/^(http:\/\/imgzq.hexun.com\/chatRoom\/static\/ff\/\d{1,2}.gif)/i;
                            if(face.test(b)){
                                frs=b.split(' ');
                                b=frs[0].replace(sy2,'');
                                return '[face]'+b+'[/face]';
                            }else if(d5.isAdver&&img.test(b)){
                                ars=b.split(' ');
                                b=ars[0].replace(sy2,'');
                                return '[img]'+b+'[/img]';
                            }
                            return '';
                        }catch(e){
                            return '';
                        }
                    }
                },
                at:{
                    r:/<input(.+?)na=["|'](.+?)>/ig,
                    f:function(m,a,b){
                        try{
                            var reg=/(^@(.+?)["|'])/ig,s=null;
                            s=b.match(reg)[0];
                            return s?'[at]'+ s.slice(0,-1)+'[/at]':'';
                        }catch(e){
                            return '';
                        }
                    }
                }
            };
        };
    BBcode.prototype.ins=function(str){
            this.str=str;
        return this;
    };
    BBcode.prototype.toHTML=function(html){
        /*bbcode转html*/
        var _this=this.ch,s=this.str;
        (_this[html])&&(this.str=s.replace(_this[html].r,_this[html].f));
        return this;
    };
    BBcode.prototype.toCode=function(bbcode){
        /*html转bbcode*/
        var _this=this.cb;
        (_this[bbcode])&&(this.str=this.str.replace(_this[bbcode].r,_this[bbcode].f));
        return this;
    };
    BBcode.prototype.out=function(){
        return this.str;
    };
    /*
     * [face]表情图片[/face]
     * [img]大图[/img]
     * [url]link[/url]
     * [at]@aaa[/at]
     * */
    