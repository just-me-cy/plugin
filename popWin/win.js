/**
 * Created by chenyao on 15/11/14.
 */
(function () {
    var win = function () {
        //默认配置
        this.cfg = {
            title:"提示",
            body:"",
            width:300,
            height:200,
            alertText:"alert",
            confirmText:'confirm',
            cancelText:'cancel',
            promptText:'prompt',
            inputItems:[{
                isPassWord:false,
                label:"用户名"
            },{
                isPassWord:true,
                label:"密码"
            }],
            closeBtn:true,
            draggable:false,//默认不可拖动
            handler4alert:null,
            handler4confirm:null,
            handler4prompt:null,
            handler4cancel:null,
            handler4close:null
        };
    }

    inherit(win,window.Widget);

    win.prototype.renderUI = function () {
        //遮罩层
        this._maskDiv = createEL("div","win_mask","");
        //容器
        this.winBox = createEL("div","win_wrap","");
        //标题
        this._ptitle = createEL("p","",this.cfg.title);
        //关闭
        this._closeBtn =  createEL("span","win_closeBtn","X");
        //主体
        var body =  createEL("div","win_body",this.cfg.body);
        //下方按钮
        var footer = createEL("div","window_footer","");

        switch (this.cfg.winType){
            case "alert":
                this._alertBtn = createEL("input_button","window_alertBtn", this.cfg.alertText);
                footer.appendChild(this._alertBtn);
                break;
            case "confirm":
                this._confirmBtn = createEL("input_button","window_confirmBtn", this.cfg.confirmText);
                footer.appendChild(this._confirmBtn);
                this._comCancelBtn = createEL("input_button","window_cancelBtn", this.cfg.cancelText);
                footer.appendChild( this._comCancelBtn);
                break;
            case "prompt":
                for(var i= 0,len=this.cfg.inputItems.length;i<len;i++){
                    var inputItem = this.cfg.inputItems[i];
                    var promptInput = createEL("input_"+(inputItem.isPassWord?"pass":"text"),"window_input"+i, inputItem.label);
                    body.appendChild(promptInput);
                }
                this._promptBtn = createEL("input_button","window_promptBtn", this.cfg.promptText);
                footer.appendChild(this._promptBtn);
                this._promptCancel = createEL("input_button","window_cancelBtn", this.cfg.cancelText);
                footer.appendChild( this._promptCancel);
                break;
        }

        if(this.cfg.winType !== "common"){

            this.cfg.title && this.winBox.appendChild(this._ptitle);
            this.winBox.appendChild(body);
            this.winBox.appendChild(footer);
        }else{
            this.cfg.closeBtn && this.winBox.appendChild(this._closeBtn);
            this.winBox.appendChild(body);
        }
        document.body.insertBefore(this.winBox,document.body.firstChild);
        document.body.insertBefore(this._maskDiv,document.body.firstChild);
    }

    win.prototype.bindUI = function () {
        var that = this;
        this.winBox.onclick = function (event) {
            var event = window.event || event;
            var el = event.target;
            switch (el.className){
                case "window_alertBtn":
                    that.fire('alert');
                    that.destory();
                    break;
                case "window_confirmBtn":
                    that.fire("confirm");
                    that.destory();
                    break;
                case "window_cancelBtn":
                    that.fire("cancel");
                    that.destory();
                    break;
                case "window_promptBtn":
                    that.fire("prompt",{
                        name:document.getElementById("window_input0").value,
                        pass:document.getElementById("window_input1").value
                    });
                    that.destory();
                    break;
                case "win_closeBtn":
                    that.fire("close");
                    that.destory();
                    break;
                default :

            }
        }

        if(this.cfg.handler4alert){
            this.on('alert',this.cfg.handler4alert);
        }
        if(this.cfg.handler4confirm){
            this.on('confirm',this.cfg.handler4confirm);
        }
        if(this.cfg.handler4prompt){
            this.on('prompt',this.cfg.handler4prompt);
        }
        if(this.cfg.handler4cancel){
            this.on('cancel',this.cfg.handler4cancel);
        }
        if(this.cfg.handler4close){
            this.on('close',this.cfg.handler4close);
        }
        //拖动处理
        var canDrag = false;
        var diffX = 0,diffY = 0;
        if(this.cfg.draggable){
            this._ptitle.onmousedown = function (event) {
                event = window.event || event;
                canDrag = true;
                diffX = event.clientX - that.winBox.offsetLeft;
                diffY = event.clientY - that.winBox.offsetTop;
            }
            this._ptitle.onmouseup = function () {
                canDrag = false;
            }
            this._ptitle.onmousemove = function (event) {
                event = window.event || event;
                if(canDrag){
                    that.winBox.style.left = (event.clientX - diffX) +'px';
                    that.winBox.style.marginLeft = 0;
                    that.winBox.style.top =(event.clientY - diffY) +'px';
                    that.winBox.style.marginTop = 0;
                }
            }
        }
    }

    win.prototype.initUI = function () {
        this.winBox.style.width = this.cfg.width+"px";
        this.winBox.style.height = this.cfg.height+'px';
        this.winBox.style.marginLeft = -(this.cfg.width/2)+'px';
        this.winBox.style.marginTop = -(this.cfg.height/2)+'px';
    }
    win.prototype.destructor = function () {
        this._maskDiv.parentNode.removeChild(this._maskDiv);
    }

    win.prototype.alert = function (cfg) {
        extend(this.cfg,cfg);
        this.cfg.winType = 'alert';
        this.render();
        return this;
    }
    win.prototype.confirm = function (cfg) {
        extend(this.cfg,cfg);
        this.cfg.winType = 'confirm';
        this.render();
        return this;
    }
    win.prototype.prompt = function (cfg) {
        extend(this.cfg,cfg);
        this.cfg.winType = 'prompt';
        this.render();
        return this;
    }
    win.prototype.common = function (cfg) {
        extend(this.cfg,cfg);
        this.cfg.winType = 'common';
        this.render();
        return this;
    }

    function extend(target,source){
        for(var item in source){
            target[item] = source[item];
        }
    }

    function inherit(sub,sup){
        var obj = Object(sup.prototype);
        obj.constructor = sub;
        sub.prototype = obj;
    }

    function createEL(elType,className,txt){
        var arr = elType.split("_");
        var el = document.createElement(arr[0]);
        el.className = className;
        if(elType === "input_text"){
            el.placeholder = txt;
            el.type = "text";
            el.id = className;
        }else if(elType === "input_pass"){
            el.placeholder = txt;
            el.type = "password";
            el.id = className;
        }else if(elType === "input_button"){
            el.value = txt;
            el.type = "button";
        }else{
            el.innerHTML = txt;
        }
        return el;
    }

    window.win = win;
})();