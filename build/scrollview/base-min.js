/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: May 15 21:37
*/
KISSY.add("scrollview/base",function(b,m,p,n,i,j){var d=d,q=b.all,b=b.Features.isTouchSupported(),k=j.KeyCodes;return p.Controller.extend({bindUI:function(){var a=this.get("el");a.on("mousewheel",this._onMouseWheel,this);a.on("scroll",this._onElScroll,this)},_onElScroll:function(){var a=this.get("el")[0],c=a.scrollTop,e=a.scrollLeft;c&&this.set("scrollTop",c+this.get("scrollTop"));e&&this.set("scrollLeft",e+this.get("scrollLeft"));a.scrollTop=a.scrollLeft=0},handleKeyEventInternal:function(a){var c=
a.target,e=m.nodeName(c);if("input"==e||"textarea"==e||"select"==e||m.hasAttr(c,"contenteditable"))return d;var a=a.keyCode,o=this.isAxisEnabled("x"),h=this.isAxisEnabled("y"),c=this.minScroll,e=this.maxScroll,f=this.scrollStep,b,g=d;if(h){var j=f.top,i=this.clientHeight,l=this.get("scrollTop"),h=l==e.top;b=l==c.top;if(a==k.DOWN){if(h)return d;this.scrollTo(d,l+j);g=!0}else if(a==k.UP){if(b)return d;this.scrollTo(d,l-j);g=!0}else if(a==k.PAGE_DOWN){if(h)return d;this.scrollTo(d,l+i);g=!0}else if(a==
k.PAGE_UP){if(b)return d;this.scrollTo(d,l-i);g=!0}}if(o)if(o=f.left,f=this.get("scrollLeft"),h=f==e.left,b=f==c.left,a==k.RIGHT){if(h)return d;this.scrollTo(f+o);g=!0}else if(a==k.LEFT){if(b)return d;this.scrollTo(f-o);g=!0}return g},_onMouseWheel:function(a){if(!this.get("disabled")){var c,e,b=this.scrollStep,h,f=this.maxScroll,j=this.minScroll;if((h=a.deltaY)&&this.isAxisEnabled("y")){var g=this.get("scrollTop");c=f.top;e=j.top;g<=e&&0<h||g>=c&&0>h||(this.scrollTo(d,g-a.deltaY*b.top),a.preventDefault())}if((h=
a.deltaX)&&this.isAxisEnabled("x"))g=this.get("scrollLeft"),c=f.left,e=j.left,g<=e&&0<h||g>=c&&0>h||(this.scrollTo(g-a.deltaX*b.left),a.preventDefault())}},syncUI:function(){var a=this.get("el")[0],c=this.get("contentEl")[0],e=Math.max(a.scrollHeight,c.scrollHeight),d=Math.max(a.scrollWidth,c.scrollWidth),c=a.clientHeight,b,f=a.clientWidth;this.scrollHeight=e;this.scrollWidth=d;this.clientHeight=c;this.clientWidth=f;b=this._allowScroll={};e>c&&(b.top=1);d>f&&(b.left=1);this.minScroll={left:0,top:0};
this.maxScroll={left:d-f,top:e-c};a=q(a.ownerDocument);this.scrollStep={top:Math.max(0.7*c*c/a.height(),20),left:Math.max(0.7*f*f/a.width(),20)};a=this.get("scrollLeft");e=this.get("scrollTop");this.scrollTo(a,e)},isAxisEnabled:function(a){return this._allowScroll["x"==a?"left":"top"]},stopAnimation:function(){this.get("contentEl").stop()},scrollTo:function(a,c){var e=this.maxScroll,b=this.minScroll;this.stopAnimation();a!=d&&(a=Math.min(Math.max(a,b.left),e.left),this.set("scrollLeft",a));c!=d&&
(c=Math.min(Math.max(c,b.top),e.top),this.set("scrollTop",c))}},{ATTRS:{contentEl:{view:1},scrollLeft:{view:1},scrollTop:{view:1},focusable:{value:!b},allowTextSelection:{value:!0},handleMouseEvents:{value:!1},xrender:{value:i}}},{xclass:"scrollview"})},{requires:["dom","component/base","component/extension","./base/render","event"]});
KISSY.add("scrollview/base/render",function(b,m,p){var n,i={_onSetScrollLeft:function(b){this.get("contentEl")[0].style.left=-b+"px"},_onSetScrollTop:function(b){this.get("contentEl")[0].style.top=-b+"px"}};b.Features.isTransformSupported()&&(n=(b=b.Features.getTransformPrefix())?b+"Transform":"transform",i._onSetScrollLeft=function(b){var d=this.get("scrollTop");this.get("contentEl")[0].style[n]="translate3d("+-b+"px,"+-d+"px,0)"},i._onSetScrollTop=function(b){var d=this.get("scrollLeft");this.get("contentEl")[0].style[n]=
"translate3d("+-d+"px,"+-b+"px,0)"});return m.Render.extend([p.ContentRender],i,{ATTRS:{scrollLeft:{value:0},scrollTop:{value:0}}})},{requires:["component/base","component/extension"]});