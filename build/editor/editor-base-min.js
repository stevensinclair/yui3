YUI.add("editor-base",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.extend(A,B.Base,{frame:null,initializer:function(){var C=new B.Frame({designMode:true,title:A.STRINGS.title,use:A.USE,dir:this.get("dir"),extracss:this.get("extracss"),host:this}).plug(B.Plugin.ExecCommand);C.after("ready",B.bind(this._afterFrameReady,this));C.addTarget(this);this.frame=C;this.publish("nodeChange",{emitFacade:true,bubbles:true,defaultFn:this._defNodeChangeFn});},copyStyles:function(F,E){var C=["color","fontSize","fontFamily","backgroundColor","fontStyle"],D={};B.each(C,function(G){D[G]=F.getStyle(G);});if(F.ancestor("b,strong")){D.fontWeight="bold";}E.setStyles(D);},_fixFirstPara:function(){var D=this.getInstance(),C;D.one("body").setContent("<p>&nbsp;</p>");C=new D.Selection();try{C.selectNode(D.one("body > p").get("firstChild"));}catch(E){}},_defNodeChangeFn:function(Q){var D=this.getInstance();switch(Q.changedType){case"keydown":var C=D.config.doc.body.innerHTML;if(C&&C.toLowerCase()=="<br>"){this._fixFirstPara();}break;case"backspace-up":case"delete-up":var N=D.all("body > p"),U,K,O,R;if(N.size()<2){R=D.one("body");if(N.item(0)){R=N.item(0);}if(D.Selection.getText(R)===""&&!R.test("p")){this._fixFirstPara();}else{if(R.test("p")&&R.get("innerHTML").length===0){Q.changedEvent.halt();}}}break;case"enter-up":if(Q.changedNode.test("p")){var J=Q.changedNode.previous(),M,F,H=false;if(J){M=J.one(":last-child");while(!H){if(M){F=M.one(":last-child");if(F){M=F;}else{H=true;}}else{H=true;}}if(M){this.copyStyles(M,Q.changedNode);}}}break;case"tab":if(!Q.changedNode.test("li, li *")&&!Q.changedEvent.shiftKey){this.execCommand("inserthtml",A.TABKEY+D.Selection.CURSOR);var O=new D.Selection().focusCursor();Q.changedEvent.halt();}break;}var E=this.getDomPath(Q.changedNode),L={},P,I,S=[],G="",T="";if(Q.commands){L=Q.commands;}E.each(function(c){var W=c.get("tagName").toLowerCase(),b=A.TAG2CMD[W],a=B.Node.getDOMNode(c);if(b){L[b]=1;}var Z=a.style;if(Z.fontWeight.toLowerCase()=="bold"){L.bold=1;}if(Z.fontStyle.toLowerCase()=="italic"){L.italic=1;}if(Z.textDecoration.toLowerCase()=="underline"){L.underline=1;}if(Z.textDecoration.toLowerCase()=="line-through"){L.strikethrough=1;}var Y=c.getStyle("fontFamily").split(",")[0].toLowerCase();if(Y){P=Y;}I=c.getStyle("fontSize");var X=c.get("className").split(" ");B.each(X,function(d){if(d!==""&&(d.substr(0,4)!=="yui_")){S.push(d);}});G=A.FILTER_RGB(c.getStyle("color"));var V=A.FILTER_RGB(c.getStyle("backgroundColor"));if(V!=="transparent"){T=V;}});Q.dompath=E;Q.classNames=S;Q.commands=L;if(!Q.fontFamily){Q.fontFamily=P;}if(!Q.fontSize){Q.fontSize=I;}if(!Q.fontColor){Q.fontColor=G;}if(!Q.backgroundColor){Q.backgroundColor=T;}},getDomPath:function(C){var E=[],D=this.frame.getInstance();while(C!==null){if(C.test("html")||C.test("doc")||!C.get("tagName")){C=null;break;}if(!C.inDoc()){C=null;break;}if(C.get("nodeName")&&C.get("nodeType")&&(C.get("nodeType")==1)){E.push(D.Node.getDOMNode(C));}if(C.test("body")){C=null;break;}C=C.get("parentNode");}if(E.length===0){E[0]=D.config.doc.body;}return D.all(E.reverse());},_afterFrameReady:function(){var C=this.frame.getInstance();this.frame.on("mousedown",B.bind(this._onFrameMouseDown,this));this.frame.on("keyup",B.bind(this._onFrameKeyUp,this));this.frame.on("keydown",B.bind(this._onFrameKeyDown,this));this.frame.on("keypress",B.bind(this._onFrameKeyPress,this));C.Selection.filter();},_onFrameMouseDown:function(C){this.fire("nodeChange",{changedNode:C.frameTarget,changedType:"mousedown",changedEvent:C});},_onFrameKeyUp:function(E){var D=this.frame.getInstance(),C=new D.Selection();if(C.anchorNode){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:"keyup",selection:C,changedEvent:E});if(A.NC_KEYS[E.keyCode]){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:A.NC_KEYS[E.keyCode]+"-up",selection:C,changedEvent:E});}}},_onFrameKeyDown:function(E){var D=this.frame.getInstance(),C=new D.Selection();if(C.anchorNode){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:"keydown",changedEvent:E});if(A.NC_KEYS[E.keyCode]){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:A.NC_KEYS[E.keyCode],changedEvent:E});this.fire("nodeChange",{changedNode:C.anchorNode,changedType:A.NC_KEYS[E.keyCode]+"-down",changedEvent:E});}}},_onFrameKeyPress:function(E){var D=this.frame.getInstance(),C=new D.Selection();if(C.anchorNode){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:"keypress",changedEvent:E});if(A.NC_KEYS[E.keyCode]){this.fire("nodeChange",{changedNode:C.anchorNode,changedType:A.NC_KEYS[E.keyCode]+"-press",changedEvent:E});}}},execCommand:function(G,I){var D=this.frame.execCommand(G,I),F=this.frame.getInstance(),E=new F.Selection(),C={},H={changedNode:E.anchorNode,changedType:"execcommand",nodes:D};switch(G){case"forecolor":H.fontColor=I;break;case"backcolor":H.backgroundColor=I;break;case"fontsize":H.fontSize=I;break;case"fontname":H.fontFamily=I;break;}C[G]=1;H.commands=C;this.fire("nodeChange",H);return D;},getInstance:function(){return this.frame.getInstance();},destructor:function(){},render:function(C){this.frame.set("content",this.get("content"));this.frame.render(C);return this;},focus:function(){this.frame.focus();return this;},show:function(){this.frame.show();return this;},hide:function(){this.frame.hide();return this;},getContent:function(){var C="",D=this.getInstance();if(D&&D.Selection){C=D.Selection.unfilter();}C=C.replace(/ _yuid="([^>]*)"/g,"");return C;}},{TABKEY:'<span class="tab">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',FILTER_RGB:function(E){if(E.toLowerCase().indexOf("rgb")!=-1){var H=new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)","gi");var D=E.replace(H,"$1,$2,$3,$4,$5").split(",");if(D.length==5){var G=parseInt(D[1],10).toString(16);var F=parseInt(D[2],10).toString(16);var C=parseInt(D[3],10).toString(16);G=G.length==1?"0"+G:G;F=F.length==1?"0"+F:F;C=C.length==1?"0"+C:C;E="#"+G+F+C;}}return E;},TAG2CMD:{"b":"bold","strong":"bold","i":"italic","em":"italic","u":"underline","sup":"superscript","sub":"subscript","img":"insertimage","a":"createlink","ul":"insertunorderedlist","ol":"insertorderedlist"},NC_KEYS:{8:"backspace",9:"tab",13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",46:"delete"},USE:["substitute","node","selector-css3","selection","stylesheet"],NAME:"editorBase",STRINGS:{title:"Rich Text Editor"},ATTRS:{content:{value:"<br>",setter:function(C){if(C.substr(0,1)==="\n"){C=C.substr(1);
}if(C===""){C="<br>";}return this.frame.set("content",C);},getter:function(){return this.frame.get("content");}},dir:{writeOnce:true,value:"ltr"},extracss:{value:false,setter:function(C){if(this.frame){this.frame.set("extracss",C);}return C;}}}});B.EditorBase=A;},"@VERSION@",{requires:["base","frame","node","exec-command"],skinnable:false});