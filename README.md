### popWin
   自定义弹出窗口，支持4种类型弹窗
*alert
 		var alertWin = new window.win();
		alertWin.alert({
			title:"提示",
			body:"我是提示框",
			draggable:true,
			width:300,
			height:150,
			alertText:"确定",
			handler4close: function () {
				alert("alert");
			}
		}).on("close", function () {
			alert("自定义事件");
		})
*confirm
 		var confirmWin = new window.win();
		confirmWin.confirm({
			title:"请确认",
			body:"确定发送此消息？",
			width:300,
			height:150,
			confirmText:"确定",
			handler4confirm: function () {
				alert("confirm");
			},
			cancelText:"取消",
			handler4cancel: function () {
				alert("cancel");
			}
		}).on("confirm", function () {
			alert("自定义");
        });
*prompt
		var promptWin = new window.win();
		promptWin.prompt({
			title:"登录",
			body:"请输入用户名和密码",
			inputItems:[{
				isPassWord:false,
				label:"用户名",
				maxLength:6
			},{
				isPassWord:true,
				label:"密码",
				maxLength:10
			}],
			width:300,
			height:200,
			promptText:"确定",
			handler4prompt: function (data) {

				alert(data.name +":" + data.pass);
			},
			cancelText:"取消",
			handler4cancel: function () {
				alert("cancel");
			}
		}).on("prompt", function () {
			alert("自定义prompt");
		});
*common
		var commonWin = new window.win();
        commonWin.common({
            body:"简单提示框",
            width:300,
            height:100,
        }).on("close", function () {
            alert("关闭");
        });

