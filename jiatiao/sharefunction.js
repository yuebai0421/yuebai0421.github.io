//默认初始化函数
$(function() {
	formatLinkeyTable();

	// 开发阶段快速定位
	if (!isMobile()) {
//		 $("body").dblclick(function(){openeditor();});
	}

	// 取消mask效果
	setTimeout(unmask, 250);
});

function formatLinkeyTable() {
	// 格式化linkeytable的表格
	$("table.linkeytable").each(function(i) {
		var tableobj = $(this)[0];
		var rnum = tableobj.rows.length;
		for (var i = 0; i < rnum; i++) {
			var cnum = tableobj.rows[i].cells.length;
			if (cnum > 1) {
				for (var j = 0; j < cnum; j++) {
					if (!(j % 2)) {
						tableobj.rows[i].cells[j].className = "texttd";
					}
				}
			}
		}
	});
}
/** ***初始化结束*********** */

function openeditor() {
	// 快速定位打开设计
	var wf_num = GetUrlArg("wf_num");
	var url = "designer/editor.jsp?wf_elid=" + wf_num;
	var dtype = getElementType(wf_num, true);
	if (dtype != "") {
		url += "&wf_dtype=" + dtype;
		OpenUrl(url);
	}
}

// 获得设计元素的类型
function getElementType(wf_num, isType) {
	var dtype = ""; // 设计类型
	var etype = ""; // 预览类型
	if (/^(P_)\S+(_)/i.test(wf_num)) {
		dtype = "5";
		etype = "page";
	} // 页面
	else if (/^(F_)\S+(_A)/i.test(wf_num)) {
		dtype = "1";
		etype = "form";
	} // 表单
	else if (/^(V_)\S+(_G)/i.test(wf_num)) {
		dtype = "3";
		etype = "view";
	} // data grid
	else if (/^(V_)\S+(_E)/i.test(wf_num)) {
		dtype = "7";
		etype = "editorgrid";
	} // editor grid
	else if (/^(V_)\S+(_T)/i.test(wf_num)) {
		dtype = "8";
		etype = "treegrid";
	} // tree grid
	else if (/^(V_)\S+(_C)/i.test(wf_num)) {
		dtype = "11";
		etype = "categorygrid";
	} // category grid
	else if (/^(V_)\S+(_M)/i.test(wf_num)) {
		dtype = "12";
		etype = "customgrid";
	} // custom grid
	else if (/^(R_)\S+(_B)/i.test(wf_num)) {
		dtype = "4";
		etype = "rule";
	} // rule
	else if (/^(D_)\S+(_J)/i.test(wf_num)) {
		dtype = "2";
		etype = "json";
	} // json data
	else if (/^(T_)\S+(_)/i.test(wf_num)) {
		dtype = "";
		etype = "navtree";
	} // navtree
	if (isType == true) {
		return dtype;
	} else {
		return etype;
	}
}

/** 附件处理函数开始************* */
function InitAttachmentList() {
	$("div.attachmentlist").each(function(i) {
		LoadAttachments($(this).attr("id"));
	});
}
function LoadAttachments(fdName) {
	// 显示指定序号的附件列表
	var url = "rule?wf_num=R_S004_B001&dc=" + Math.random();
	$.post(url, {
		Processid : $("#WF_Processid").val(),
		DocUnid : $("#WF_DocUnid").val(),
		FdName : fdName,
		ReadOnly : $("#" + fdName).attr("readtype")
	}, function(result) {
		$("#" + fdName).html(result);
		try {
			LoadAttachmentsCallBack(fdName, result);
		} catch (e) {
		} // 附件显示成功后的回调函数
	});
}
function OpenAttachment(filenum) {
	// 打开附件
	var url = "rule?wf_num=R_S004_B004&filenum=" + filenum;
	window.open(url);
}
function DelAttachment(filename, docUnid, fdName) {
	// filename要删除的附件名，docUnid要删除的附件记录的WF_OrUnid值
	if (confirm("您确认要删除附件 \"" + filename + "\"吗?")) {
		$.post("rule?wf_num=R_S004_B003", {
			wf_docunid : docUnid
		}, function(result) {
			LoadAttachments(fdName);
		});
	}
}
/** 附件处理函数结束************* */

/** **easy ui 专用函数开始*** */

// 格式化日期选择框
function formatterDate(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
// 格式化日期和时间
function formatterDateTime(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var min = date.getMinutes();
	return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d)
			+ " " + (h < 10 ? ('0' + h) : h) + ":"
			+ (min < 10 ? ('0' + min) : min);
}

function loadWebEditor(fdName, ismin) {
	if (ismin) {
		// 简单的编辑器
		var upath = "linkey/bpm/editor/umeditor/";
		$("<link>").attr({
			rel : "stylesheet",
			type : "text/css",
			href : upath + "themes/default/css/umeditor.css"
		}).appendTo("head");
		$.getScript(upath + 'umeditor.config.js', function() {
			$.getScript(upath + 'umeditor.js', function() {
				$.getScript(upath + 'lang/zh-cn/zh-cn.js', function() {
					initueditor(fdName);
				});
			});
		});
		function initueditor(fdName) {
			var um = UM.getEditor(fdName);
			editor.addListener('contentChange', function(evtName, evt) {
				$("#" + fdName).val(editor.getContent());
			});
		}
	} else {
		// 加载复杂的编辑器
		var upath = "linkey/bpm/editor/ueditor/";
		$.getScript(upath + 'ueditor.config.js', function() {
			$.getScript(upath + 'ueditor.all.js', function() {
				$.getScript(upath + 'lang/zh-cn/zh-cn.js', function() {
					initueditor(fdName);
				});
			});
		});
		function initueditor(fdName) {
			// 初始化编辑器
			var ewidth = $("#" + fdName).width();
			var eheight = $("#" + fdName).height();
			var editorOption = {
				initialFrameWidth : ewidth,
				initialFrameHeight : eheight,
				maximumWords : 10000,
				autoHeightEnabled : false,
				disabledTableInTable : false,
				allowDivTransTop : false,
				UEDITOR_HOME_URL : upath,
				toolbars:[] //隐藏富文本操作按钮
			};
			var editor = new UE.ui.Editor(editorOption);
			editor.render(fdName);
			editor.addListener('contentChange', function(evtName, evt) {
				$("#" + fdName).val(editor.getContent());
			});
		}
	}
}

function mask(msg) {
	if (!msg) {
		msg = "Waiting...";
	}
	$(
			"<div class=\"datagrid-mask\" id='bodymask' style='z-index:100001'></div>")
			.css({
				display : "block",
				width : "100%",
				height : $(window).height()
			}).appendTo("body");
	$(
			"<div class=\"datagrid-mask-msg\" id='bodymask-msg'  style='z-index:100001' ></div>")
			.html(msg).appendTo("body").css({
				display : "block",
				left : ($(document.body).outerWidth(true) - 190) / 2,
				top : ($(window).height() - 45) / 2
			});
}
function unmask() {
	setTimeout('removeMaskid()', 200);
}
function removeMaskid() {
	$('#bodymask-msg').remove();
	$('#bodymask').remove();
}

function setNoCheckedBoxValue(param) {
	// 获得没有选中且只有一个的复选框进行序列化,不然对于单个复选框不能取消
	$("input:checkbox").each(function(i) {
		if ($(this)[0].checked == false) {
			var fdName = $(this).attr("name");
			var ckobj = $("input[name='" + fdName + "']");
			var ischecked = false;
			for (var i = 0; i < ckobj.length; i++) {
				if (ckobj[i].checked == true) {
					ischecked = true;
				}
			}
			if (ischecked == false) {
				eval("param." + fdName + "=''");
			}
		}
	});
}
function getNoCheckedBoxValue() {
	// 获得没有选中且只有一个的复选框进行序列化,不然对于单个复选框不能取消
	var serializeStr = "";
	$("input:checkbox").each(
			function(i) {
				var fdName = $(this).attr("name");
				if ($(this)[0].checked == false && fdName != undefined
						&& fdName != "undefined" && fdName != "") {
					var ckobj = $("input[name='" + fdName + "']");
					var ischecked = false;
					for (var i = 0; i < ckobj.length; i++) {
						if (ckobj[i].checked == true) {
							ischecked = true;
						}
					}
					if (ischecked == false) {
						if (serializeStr == "") {
							serializeStr = fdName + "=";
						} else {
							serializeStr += "&" + fdName + "=";
						}
					}
				}
			});
	return serializeStr;
}
function getFieldTextShowData() {
	// 获得所有span _show的值作为json提交
	var valStr = "";
	$("span[id$='_show']").each(function() {
		var fdName = $(this).attr("id");
		var fdShowValue = $(this).text(); // show字段的值
		var orFdName = fdName.substring(0, fdName.indexOf("_show"));
		var orFdValue = $("#" + orFdName).val();// 源字段的值
		if (orFdValue == "") { // 清空字段显示值
			if (valStr != "") {
				valStr += "&";
			}
			valStr += fdName + "=";
		} else if (fdShowValue != "" && fdShowValue != orFdValue) { // 修改显示字段
			if (valStr != "") {
				valStr += "&";
			}
			valStr += fdName + "=" + encodeURIComponent(fdShowValue)
		}
	});

	$("[class*='easyui-combo']").each(function() {
		var fdValue = $(this).combo('getText');
		var comboValue = $(this).combo('getValue');
		var fdName = $(this).attr("id");
		if (comboValue == "") { // 清空字段显示值
			if (valStr != "") {
				valStr += "&";
			}
			valStr += fdName + "_show=";
		} else if (fdValue != "" && fdValue != comboValue) {
			if (valStr != "") {
				valStr += "&";
			}
			valStr += fdName + "_show=" + encodeURIComponent(fdValue)
		}
	});
	return valStr;
}
function OpenUrl(DocURL, lnum, rnum) {
	var swidth = screen.availWidth;
	var sheight = screen.availHeight;
	if (!lnum)
		lnum = 24;
	if (!rnum)
		rnum = 80;
	var wwidth = swidth - lnum;
	var wheight = sheight - rnum;
	var wleft = (swidth / 2 - 0) - wwidth / 2 - 5;
	var wtop = (sheight / 2 - 0) - wheight / 2 - 25;
	return window
			.open(
					DocURL,
					'',
					'Width='
							+ wwidth
							+ 'px,Height='
							+ wheight
							+ 'px,Left='
							+ wleft
							+ ',Top='
							+ wtop
							+ ',location=no,menubar=no,status=yes,resizable=yes,scrollbars=yes,resezie=no');
}

/** 表单选择器函数开始** */
function seluser(FdName, stype, processId, targetNodeId) {
	// stype为空时表示只选择用户 2表示用户和群组
	if (stype == undefined) {
		stype = "";
	}
	var url = "page?wf_num=P_S007_001&FdName=" + FdName + "&stype=" + stype;
	if (stype == "6") {
		url = "page?wf_num=P_S007_005&FdName=" + FdName;
	}
	url+= "&processId=" + processId + "&targetNodeId=" + targetNodeId;
	var swidth = screen.availWidth;
	var sheight = screen.availHeight;
	var wwidth = 900;
	var wheight = 560;
	var wleft = (swidth / 2 - 0) - wwidth / 2;
	var wtop = (sheight / 2 - 0) - wheight / 2;
	// 看是否是移动终端
	if (isMobile()) {
		SelUserForMobile(FdName, processId, targetNodeId);
	} else {
		window.open(url, 'pwin', 'Width=' + wwidth + 'px,Height=' + wheight
				+ 'px,Left=' + wleft + ',Top=' + wtop
				+ ',status=no,resizable=yes,scrollbars=no,resezie=no');
	}
}

function seldept(FdName, mulFlag) {
	// mulFlag true表示多选 false表示单选
	if (mulFlag == undefined) {
		mulFlag = true;
	}// 默认为多选
	var url = "page?wf_num=P_S007_002&FdName=" + FdName + "&mulFlag=" + mulFlag;
	var swidth = screen.availWidth;
	var sheight = screen.availHeight;
	var wwidth = 450;
	var wheight = 560;
	var wleft = (swidth / 2 - 0) - wwidth / 2;
	var wtop = (sheight / 2 - 0) - wheight / 2;
	window.open(url, 'pwin', 'Width=' + wwidth + 'px,Height=' + wheight
			+ 'px,Left=' + wleft + ',Top=' + wtop
			+ ',status=no,resizable=yes,scrollbars=no,resezie=no');
}
function selwfnodeuser(FdName) {
	var url = "page?wf_num=P_S007_004&FdName=" + FdName + "&Processid="
			+ GetUrlArg("Processid") + "&Nodeid=" + GetUrlArg("Nodeid");
	var swidth = screen.availWidth;
	var sheight = screen.availHeight;
	var wwidth = 900;
	var wheight = 560;
	var wleft = (swidth / 2 - 0) - wwidth / 2;
	var wtop = (sheight / 2 - 0) - wheight / 2;
	window.open(url, 'pwin', 'Width=' + wwidth + 'px,Height=' + wheight
			+ 'px,Left=' + wleft + ',Top=' + wtop
			+ ',status=no,resizable=yes,scrollbars=no,resezie=no');
}
function selprocess(FdName) {
	// stype为空时表示只选择用户 2表示用户和群组
	var url = "page?wf_num=P_S005_003&FdName=" + FdName;
	var swidth = screen.availWidth;
	var sheight = screen.availHeight;
	var wwidth = 900;
	var wheight = 560;
	var wleft = (swidth / 2 - 0) - wwidth / 2;
	var wtop = (sheight / 2 - 0) - wheight / 2;
	window.open(url, 'pwin', 'Width=' + wwidth + 'px,Height=' + wheight
			+ 'px,Left=' + wleft + ',Top=' + wtop
			+ ',status=no,resizable=yes,scrollbars=no,resezie=no');
}
/** 表单选择器函数结束* */

String.prototype.strLeft = function(char) {
	if (this.indexOf(char) != -1)
		return this.substring(0, this.indexOf(char));
	else
		return "";
}
String.prototype.strRight = function(char) {
	if (this.indexOf(char) != -1)
		return this.substring(this.indexOf(char) + 1);
	else
		return "";
}

/**
 * json工具
 */
var JsonUtil = (function() {
	return {
		/**
		 * 获取json中的单个值
		 */
		getValue : function(jsonObject, name) {
			var value = "";
			$.each(jsonObject, function(n, v) {
				if (name == n) {
					value = v;
					return false;
				}
			});
			return value;
		},
		/**
		 * 获取json中的name 以数组形式返回
		 */
		getNames : function(jsonObject) {
			var names = [];
			$.each(jsonObject, function(n, v) {
				names.push(n);
			});
			return names;
		},
		/**
		 * 创建json对象
		 */
		createJsonObject : function() {
			this.jsonObectArr = [];
		}

	}

})();

function GetUrlArg(name) {
	var url = location.href;
	if (url.substring(url.length - 1) == "#") {
		url = url.substring(0, url.length - 1);
	}
	;
	var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
	if (reg.test(url))
		return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
	return "";
};
function isEn(s) {
	var regu = "^[0-9a-zA-Z]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}
function trim(s) {
	return s.replace(/(^\s*)|(\s*$)/gi, "")
}
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
function isMobile() {
	var u = navigator.userAgent.toLowerCase();
	//Edit by Nine 2018-08-17 新增浏览器标识 “Android”
	if (u.indexOf("mobile") != -1 || u.indexOf("android") != -1 ||GetUrlArg("mobile") == "1") {
		return true;
	} else {
		return false;
	}
}

function selectwork(obj) {
	var swidth = screen.availWidth;
	var sheight = screen.availHeight;
	var wwidth = 900;
	var wheight = 560;
	var wleft = (swidth / 2 - 0) - wwidth / 2;
	var wtop = (sheight / 2 - 0) - wheight / 2;
	window.open('page?wf_num=P_XMGL_005&FdName='
			+ obj.id.substring(0, obj.id.indexOf("_")), 'pwin', 'Width='
			+ wwidth + 'px,Height=' + wheight + 'px,Left=' + wleft + ',Top='
			+ wtop + ',status=no,resizable=yes,scrollbars=no,resezie=no');

}

function selectjbd(obj) {
	var swidth = screen.availWidth;
	var sheight = screen.availHeight;
	var wwidth = 900;
	var wheight = 560;
	var wleft = (swidth / 2 - 0) - wwidth / 2;
	var wtop = (sheight / 2 - 0) - wheight / 2;
	window.open('page?wf_num=P_XMGL_006&FdName='
			+ obj.id.substring(0, obj.id.indexOf("_")), 'pwin', 'Width='
			+ wwidth + 'px,Height=' + wheight + 'px,Left=' + wleft + ',Top='
			+ wtop + ',status=no,resizable=yes,scrollbars=no,resezie=no');

}

function g(id) {
	var tagName = $("#" + id)[0].tagName;
	if (tagName == "INPUT") {
		return $("#" + id).val();
	} else {
		return $("#" + id).text();
	}
}

/** ****************************签章JS开始*********************************** */
function AddSecHandSign(positionId) {
	try {
		if (!positionId || positionId == "" || positionId == null) {
			var signRemarkType = $("#signRemarkType").val();
			if (signRemarkType && signRemarkType != "") {
				if ($("span[remarktype='" + signRemarkType + "']").length > 0)
					var positionId = $(
							"span[remarktype='" + signRemarkType + "']").attr(
							"id");
			}
		}

		if (!positionId || positionId == "" || positionId == null) {
			alert("未设置签章位置，请检查节点配置！");
			return false;
		}

		var ntkoobj = document.all("NTKO_SECSIGN_OCX");
		var WebSignInfo = "processid=" + $("#WF_Processid").val() + ";docunid="
				+ $("#WF_DocUnid").val() + "";
		var secSignObj = ntkoobj.AddSecSignOcx("SecHandSignID", 0, 0);// 200,300为印章在网页中的绝对位置,如果设置了印章对其到某个元素，以上2个参数无效
		secSignObj.WebSignInfo = WebSignInfo; // 设置该印章需要验证的文本域的id组成的字符串，如：“合同编号=BianHao;甲方=JiaFang”，其中BianHao为文本域id，合同编号为该文本域代表的意义
		secSignObj.PositionTagId = positionId; // 设置印章对其到页面id为handSignPosDivID1的元素
		secSignObj.ReSetHTMLPosition(); // 设置PositionTagId后，需要调用此方法，重新定位
		ntkoobj.AddSecHandSign(secSignObj, $("#WF_UserName").val());
		document.all("signCount").value = parseInt(document.all("signCount").value) + 1;
	} catch (e) {
		alert(e.name + ": " + e.message);
	}
}

function AddSecSignFromURL(positionId, left, top) {
	try {
		if (!positionId || positionId == "" || positionId == null) {
			var signRemarkType = $("#signRemarkType").val();
			if (signRemarkType && signRemarkType != "") {
				if ($("span[remarktype='" + signRemarkType + "']").length > 0)
					var positionId = $(
							"span[remarktype='" + signRemarkType + "']").attr(
							"id");
			}
		}

		if (!positionId || positionId == "" || positionId == null) {
			alert("未设置签章位置，请检查节点配置！");
			return false;
		}

		var ntkoobj = document.all("NTKO_SECSIGN_OCX");
		var WebSignInfo = "processid=" + $("#WF_Processid").val() + ";docunid="
				+ $("#WF_DocUnid").val() + "";
		var secSignObj = ntkoobj.AddSecSignOcx("SecSignFromURLID", left, top);// left,top为印章在网页中的绝对位置,如果设置了印章对其到某个元素，left，top无效
		secSignObj.WebSignInfo = WebSignInfo; // 设置该印章需要验证的文本域的id组成的字符串，如：“合同编号=BianHao;甲方=JiaFang”，其中BianHao为文本域id，合同编号为该文本域代表的意义
		secSignObj.PositionTagId = positionId; // 设置印章对其到页面id为handSignPosDivID1的元素
		secSignObj.ReSetHTMLPosition(); // 设置PositionTagId后，需要调用此方法，重新定位

		var url = "view?wf_num=V_S013_G006";
		var swidth = screen.availWidth;
		var sheight = screen.availHeight;
		var wwidth = "650";
		var wheight = "450";
		var wleft = (swidth / 2 - 0) - wwidth / 2;
		var wtop = (sheight / 2 - 0) - wheight / 2;
		var features = 'dialogWidth:'
				+ wwidth
				+ 'px;'
				+ 'dialogHeight:'
				+ wheight
				+ 'px;'
				+ 'dialogLeft:'
				+ wleft
				+ ';'
				+ 'dialogTop:'
				+ wtop
				+ ';'
				+ 'directories:no; localtion:no; menubar:no; status=no; toolbar=no;scrollbars:no;Resizeable=no;help:0;';
		var retval = window.showModalDialog(url, " ", features);
		ntkoobj.AddSecSignFromURL(secSignObj, '甲方', retval);
		document.all("signCount").value = parseInt(document.all("signCount").value) + 1;
	} catch (e) {
		alert(e.name + ": " + e.message);
	}
}

function LoadSignData() {
	try {
		var signCount = $("#signCount").val();
		if (signCount && signCount != "0") {
			var ntkoobj = document.all("NTKO_SECSIGN_OCX");
			var url = "rule?wf_num=R_S029_P004&docunid="
					+ $("#WF_DocUnid").val();
			ntkoobj.LoadFromURL(url);
		}

	} catch (e) {
		// alert(e.name + ": " + e.message);
	}
}

function SaveToServer() {
	try {
		var ntkoobj = document.all("NTKO_SECSIGN_OCX");
		document.all("signCount").value = ntkoobj.SignsCount;
		var url = "rule?wf_num=R_S029_P003&docunid=" + $("#WF_DocUnid").val()
				+ "&count=" + document.all("signCount").value;
		var retstr = ntkoobj.SaveToURL(url, "SIGNSFILE", "",
				"ntkowebsigns.info", 0);
		retstr = trim(retstr);
		return retstr;
	} catch (e) {
		alert(e.name + ": " + e.message);
	}
}
function CanOpenPageOffice() {// 判断PageOffice是否能加载
	var agent = navigator.userAgent.toLowerCase();

	var regStr_ie = /msie [\d.]+;/gi;
	var regStr_ff = /firefox\/[\d.]+/gi
	var regStr_chrome = /chrome\/[\d.]+/gi;
	var regStr_saf = /safari\/[\d.]+/gi;
	// IE
	if (agent.indexOf("msie") > 0 || agent.indexOf("trident") > 0) {
		return "1";
	}
	if (agent.indexOf("edge") > 0) {
		return "0";
	}
	// firefox
	if (agent.indexOf("firefox") > 0) {
		var ver = (agent.match(regStr_ff) + "").replace(/[^0-9.]/ig, "");

		/*
		 * if(parseInt(ver.substring(0,ver.indexOf(".")))>52){ return "0";
		 * }else{ return "1"; }
		 */
		return "0";
	}

	// Chrome
	if (agent.indexOf("chrome") > 0) {
		var ver = (agent.match(regStr_chrome) + "").replace(/[^0-9.]/ig, "");
		/*
		 * if(parseInt(ver.substring(0,ver.indexOf(".")))>42){ return "0";
		 * }else{ return "1"; }
		 */
		return "0";
	}

	// Safari
	if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
		return "0";
	}

}

/** ****************************签章JS 结束*********************************** */

//兼容微信关闭窗口方法  Add By Nine 2018-08-17
function closeWindows(){
    // if(typeof(WeixinJSBridge)!="undefined"){
    if(isMobile()) {
        if (typeof window.WeixinJSBridge == "undefined") {
            $(document).on('WeixinJSBridgeReady', function () {
                WeixinJSBridge.invoke('closeWindow', {}, function (res) {
                });
            });
        } else {
            window.close();
        }
    }else{
        window.close();
    }

}

//Add by Nine 2018-09-04 附件图片预览功能
function OpenImag(filenum){
    //打开图片
    var url="rule?wf_num=R_S004_B007&filenum="+filenum;
    window.open(url);
}

function goBack() {
    if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
    	//苹果机
    	try {window.webkit.messageHandlers.iosGoBack.postMessage("");} catch (e) {} 
    }else{
    	 history.back();
    }
}