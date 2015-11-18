/**
 * Created by chenyao on 15/11/18.
 */
(function () {
    var Widget = function () {
        this.winBox = null;//外层容器
        this.handlers = {};
    };
    Widget.prototype = {
        on: function (type, handler) {
            if (typeof this.handlers[type] === "undefined") {
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
            return this;
        },

        fire: function (type, data) {
            if (this.handlers[type] instanceof Array) {
                for (var i = 0, len = this.handlers[type].length; i < len; i++) {
                    this.handlers[type][i](data);
                }
            }
        },

        remove: function (type) {
            if (this.handlers[type] instanceof Array) {
                this.handlers[type] = [];
            }
        },

        renderUI: function () {
            //添加DOM节点
        },

        bindUI: function () {
            //监听事件
        },

        initUI: function () {
            //初始化组件
        },

        render: function (container) {
            this.renderUI();
            this.handlers = {};
            this.bindUI();
            this.initUI();
        },

        destructor: function () {

        },

        destory: function () {
            this.destructor();
            this.winBox.parentNode.removeChild(this.winBox);
            this.handlers = {};
        }
    };

    window.Widget = Widget;
})();