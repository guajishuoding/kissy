KISSY.Editor.add("link/dialog",function(h){var f=KISSY,e=f.Editor;e.namespace("Link");var g=e.Link;g.Dialog||function(){function i(a){this.editor=a;e.Utils.lazyRun(this,"_prepareShow","_real")}var j=e.Dialog,k=e.Utils.addRes,l=e.Utils.destroyRes;g.Dialog=i;f.augment(i,{_prepareShow:function(){var a=new j({autoRender:true,width:500,headerContent:"\u94fe\u63a5",bodyContent:"<div style='padding:20px 20px 0 20px'><p><label>\u94fe\u63a5\u7f51\u5740\uff1a <input  data-verify='^(https?://[^\\s]+)|(#.+)$'  data-warning='\u8bf7\u8f93\u5165\u5408\u9002\u7684\u7f51\u5740\u683c\u5f0f' class='ke-link-url ke-input' style='width:390px;vertical-align:middle;' /></label></p><p style='margin: 15px 0 10px 0px;'><label>\u94fe\u63a5\u540d\u79f0\uff1a <input class='ke-link-title ke-input' style='width:100px;vertical-align:middle;'></label> <label><input class='ke-link-blank' style='vertical-align: middle; margin-left: 21px;' type='checkbox'/> &nbsp; \u5728\u65b0\u7a97\u53e3\u6253\u5f00\u94fe\u63a5</label></p></div>",
footerContent:"<div style='padding:5px 20px 20px;'><a class='ke-link-ok ke-button' style='margin-left:65px;margin-right:20px;'>\u786e\u5b9a</a> <a class='ke-link-cancel ke-button'>\u53d6\u6d88</a></div>",mask:true});this.dialog=a;var b=a.get("body"),d=a.get("footer");a.urlEl=b.one(".ke-link-url");a.urlTitle=b.one(".ke-link-title");a.targetEl=b.one(".ke-link-blank");b=d.one(".ke-link-cancel");d=d.one(".ke-link-ok");d.on("click",this._link,this);b.on("click",function(c){c&&c.halt();a.hide()});e.Utils.placeholder(a.urlEl,
"http://");k.call(this,d,b,a,a.urlEl)},_link:function(a){a&&a.halt();var b=this,d=b.cmd;a=b.dialog;var c=a.urlEl.val();if(e.Utils.verifyInputs(a.get("el").all("input"))){a.hide();var m={href:c,target:a.targetEl[0].checked?"_blank":"_self",title:f.trim(a.urlTitle.val())};setTimeout(function(){d.call("_link",m,b._selectedEl)},0)}},_real:function(){var a=this.editor.cfg.pluginConfig.link||{},b=this.cmd,d=b.call("_getSelectedLink");b=b.call("_getSelectionLinkUrl");var c=this.dialog;if(this._selectedEl=
d){e.Utils.valInput(c.urlEl,b);c.urlTitle.val(d.attr("title")||"");c.targetEl[0].checked=d.attr("target")=="_blank"}else{e.Utils.resetInput(c.urlEl);c.urlTitle.val("");if(a.target)c.targetEl[0].checked=true}c.show()},show:function(a){this.cmd=a;this._prepareShow()},destroy:function(){l.call(this)}})}();h.addDialog("link/dialog",new g.Dialog(h))},{attach:false});