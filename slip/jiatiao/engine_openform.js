$(function(){
	//表单初始化时执行
	//if($("#WF_CurrentNodeid").val()!=""||$("#WF_DocStatus").val()=="Draft"){
		InitUserAndNode(); //初始化流程的处理单
	//}
	InitAttachmentList();//获得附件列表
	formonload(); //调用自定义的表单onload事件

	//解锁文档
	var url="r?wf_num=R_S003_B053&DocUnid="+$("#WF_DocUnid").val();
	$(window).unload(function(){$.get(url,function(data){})});
	
	//选择框改为复选或单选框  20181126 李文波
//	$("div[name='WF_NodeOption_Div']").find("input").on("click", checkOptionUser);
	$("div[name='WF_NodeOption_Div']").on("click", "input", function() {
		var selected = [];
//		$("div[name='WF_NodeOption_Div']").parent().find("select option:selected").each(function(k,v) {
//			selected.push($(this).val());
//		});
		var type = $(this).attr("type");
		if(type == "checkbox") {
			$("div[name='WF_NodeOption_Div']").find("input:checkbox:checked").each(function(k,v) {
				selected.push($(this).val());
			});
		}else if(type == "radio") {
			$("div[name='WF_NodeOption_Div']").find("input:radio:checked").each(function(k,v) {
				selected.push($(this).val());
			});
		}
		var value = $(this).val();
		$("div[name='WF_NodeOption_Div']").parent().find("select").val(selected);
	});
	
	//关注并订阅消息通知的事件绑定
	$("#linkeyform").on("click", ".follow-modal-close", function() {
		$("#linkeyform .follow-modal-box").remove();
	}).on("click", ".follow-modal-footer .btn-ok", function() {
		var channels = [];
		$("#linkeyform .follow-modal-body li>div.active").each(function(k, v) {
			channels.push($(this).attr("channel"));
		});
		
		var url="rule?wf_num=R_S003_B056&DocUnid="+$("#WF_DocUnid").val()+"&channels="+channels.join(",");
		$.ajax({
			url: url,
			type: 'post',
			success: function(rs) {
				$("#linkeyform .follow-modal-box").remove();
				rs = JSON.parse(rs);
				var isNewDoc = $("#WF_NewDocFlag").val();
				if(isNewDoc) {
					alert("设置成功,提交后关注才能生效！");
				}else {
					alert(rs.msg);
				}
			}
		});
	}).on("click", ".follow-modal-footer .btn-cannel", function() {
		$("#linkeyform .follow-modal-box").remove();
	}).on("click", ".follow-modal-body li", function() {
		if($(this).find(".active").length>0) {
			$(this).find("div").removeClass("active");
		}else {
			$(this).find("div").addClass("active");
		}
	});
	
});

//WF_Action为引擎动作id,WF_Params为post时的附加参数,msg为提示消息
function SaveDocument(WF_Action,msg,WF_Params){
	if(WF_Action==undefined || WF_Action==""){WF_Action="EndUserTask";}
 	if(GetRemarkStr()==false){return;}
	
	var formData="";
	var checkBoxData=getNoCheckedBoxValue();
	if(checkBoxData!=""){formData=checkBoxData;} //单选复选框提交
	var textShowStr=getFieldTextShowData();
	if(textShowStr!=""){formData+="&"+textShowStr;} //_show字段的内容
	if(WF_Action){formData+="&WF_Action="+WF_Action;} //要提交的动作，默认为EndUserTask办理完成
	var copyUserList=$("#WF_SelCopyUser").val();
	if(copyUserList!="" && copyUserList!=undefined){
		formData+="&WF_CopyUserList="+encodeURIComponent($("#WF_SelCopyUser").val()); //要抄送的用户列表
	}
	
	if($("#WF_SelSendSms").val()!=undefined&&$("#WF_SelSendSms").is(':checked')){
		formData+="&WF_SendSms="+$("#WF_SelSendSms").val();  //1表示手机短信发送标记
	}
	if(WF_Params!=undefined && WF_Params!=""){
		formData+="&"+WF_Params; //传入的附加post参数,传入的WF_Params要进行utf-8编码
	}

	//开始表单验证
	var isValid = $("#linkeyform").form('validate');
	if (isValid){
		if($("#signCount").length>0) {
			var saveRS = SaveToServer();
			alert(saveRS);
			saveRS = JSON.parse(saveRS);
			if(saveRS.success==false) {
				alert("签名信息保存失败，请重试！");
				return false;
			}
		}
		var r=formonsubmit();
		if(typeof(r)=="boolean" && r==false){return;}
		else if(typeof(r) == "string"){formData+="&"+r;} //如果返回的时字符串则作为提交的附加数据
		r=validReadFieldIsNull();
		if(r==false){return false;} //检测只读的字段是否有必填选项
 	}else{
		alert(lang.eo_SaveDocument_msg);return;
 	}

	//序列号表单字段
	formData+="&"+$("#linkeyform").serialize();

	//显示提示消息
	//if(msg!="" && msg!=undefined){if(!confirm(msg)){return false;}}
    
	try{ //解决重复提交
		if($("#BU1001").length>0){
			$("#BU1001").linkbutton('disable');
		}
		if($("BU1010").length>0){
			$("BU1010").linkbutton('disable');
		}
	}catch(e){}

	//开始提交  刘军伟 解决教育局APP表单关闭后不能正常返回的问题
	mask();
	var url="r?wf_num=R_S003_B035";
	$.post(url,formData,function(data){
    		unmask();
			//if(isMobile()){alert(rs.msg);location.replace("r?wf_num=P_S023_004");//李文波修改，在手机端集成事务中心后的问题
    		if(isMobile()){ 
    			var rs  = JSON.parse(data);
    			alert(rs.msg);
    			
    		/*	//liwenbo  解决从消息或其他应用跳入这里，并没有后退的问题
    			if(window.history && window.history.length>1) {
    				window.history.back();
    			}else {//不能回退的情况，直接关闭
    				var ua = navigator.userAgent.toLowerCase();  
    				var isWeixin = ua.indexOf('micromessenger') != -1;  
    				if (isWeixin) { //判断是否是微信 
    					WeixinJSBridge.invoke('closeWindow',{},function(res){
    						
        				});
    				}else {
    					window.close();
    				}
    				
    			}*/
                closeWindows();
			  
			}else{
				var rs = JSON.parse(data);
				SaveDocumentCallBack(WF_Action,rs);
			}
  	});

}

function GetRemarkStr(){
	//保存办理意见
    var RemarkStr="";
	var obj=$("#WF_TmpRemark");
	if(obj.length>0){RemarkStr=obj.val();if(obj.attr("IsNull")=="2" && RemarkStr==""){alert(lang.eo_GetRemarkStr_msg);return false;}}
	RemarkStr=RemarkStr.replace(/(\r\n)/gi,"<br>");
	$("#WF_Remark").val(RemarkStr);
}

function GoToNextNode(){ 
	//提交到下一环节
	var NodeList=""; //获得选中的节点
	$('input[name="WF_NextNodeSelect"]:checked').each(function(){
		if(NodeList==""){NodeList=$(this).val();}
		else{NodeList+=","+$(this).val();}
	});

	if($('input[name="WF_NextNodeSelect"]').length>0){ //看是否可以选择环节
		if(NodeList==""){alert(lang.eo_GoToNextNode_msg01);return false;}
		//获得审批用户列表
		var UserList="";
		var NodeArray=NodeList.split(",");
		for(var i=0;i<NodeArray.length;i++)
		{
			var Nodeid=NodeArray[i];
			var obj=$("#WF_"+Nodeid);
			if(obj.length>0)
			{
				var NodeName=obj.attr("NodeName");
				var MaxUserNum=obj.attr("MaxUserNum")-0;
				var MinUserNum=obj.attr("MinUserNum")-0;
				var userList=obj.val()+"";
				var UserArray=userList.split(",");
				if(UserArray.length>MaxUserNum && MaxUserNum!=0){alert(lang.eo_GoToNextNode_msg02.replace('{0}',NodeName));return false;}
				if((userList=="null" || userList.trim() =="") && MinUserNum!=0)
				{
					alert(lang.eo_GoToNextNode_msg03.replace("{0}",NodeName));
					return false;
				}
				if(UserArray.length<MinUserNum){alert(lang.eo_GoToNextNode_msg04.replace("{0}",NodeName)); return false;}
				for(var j=0;j<UserArray.length;j++)
				{
					if(UserArray[j]!=""){
						if(UserList==""){UserList=UserArray[j]+"$"+Nodeid;}else{UserList+=","+UserArray[j]+"$"+Nodeid;}
					}
				}
			}
		}
		$("#WF_NextNodeid").val(NodeList);
		$("#WF_NextUserList").val(UserList);
	}
	SaveDocument("EndUserTask",lang.eo_GoToNextNode_msg05);
}

function ShowSendToOtherUser(CheckBoxObj) //显示转他人处理的相关字段
{
	//控制按扭和人员选择的显示和权限
	if($("#SpanSendToOtherUser").css("display")!="none")
	{
		$("#SpanSendToOtherUser").css("display","none");
		$("#BU1002").linkbutton('disable'); //转他人处理按扭
		$("#BU1001").linkbutton('enable');   //提交下一环节按扭
		$("#BU1003").linkbutton('enable'); //回退上一用户
		$("#BU1004").linkbutton('enable');   //回退上一环节按扭
		$("#BU1005").linkbutton('enable');   //回退首环节按扭
		$("#BU1008").linkbutton('enable');   //回退任意环节
	}else
	{
		$("#SpanSendToOtherUser").css("display","");
		$("#BU1002").linkbutton('enable'); //转他人处理按扭
		$("#BU1001").linkbutton('disable');  //提交下一环节按扭
		$("#BU1004").linkbutton('disable');  //回退上一环节按扭
		$("#BU1003").linkbutton('disable');  //回退上一用户
		$("#BU1005").linkbutton('disable');  //回退首环节按扭
		$("#BU1008").linkbutton('disable');   //回退任意环节
	}
	//隐藏和显示路由选择以及人员选择
	var TableObj=$("#ApprovalTable");
	if(CheckBoxObj.checked)
	{
		for(var i=0;i<TableObj[0].rows.length;i++)
		{
			if(TableObj[0].rows[i].id.indexOf("UserTr_")!=-1)
			{
				TableObj[0].rows[i].style.display="none";
			}
		}
	}else{TableObj[0].rows[0].style.display="";ShowRouterUser();}

}


function InitUserAndNode(){
	$(function(){
		if(!isMobile()){
			ShowToolbar();
		}
		
	});
	HiddenButton();
	ShowRouterUser();
	
}
function HiddenButton(){
	//隐藏相应的按扭
	if($("#WF_IsFirstNodeFlag").val()=="1"){
		try{$("#BU1005").css("display","none");}catch(e){} //如果已经是首环节则隐藏
	}
	if($("#TrOtherUser").length==0){
		try{$("#BU1002").css("display","none");}catch(e){alert(e.message);} //如果没有转他人处理功能，则隐藏
	}
}
function ShowRouterUser(){
	//显示路由用户选择
	var Nodeid="",x;
	var obj=$("[name='WF_NextNodeSelect']");
	if(obj.length==0) return;
	if(obj.length>1) //有多个路由选项
	{
		for(var i=0;i<obj.length;i++)
		{
			Nodeid=obj[i].value;
			var tmpArray=Nodeid.split(",");
			for(x=0;x<tmpArray.length;x++)
			{
				var UserObj=$("#UserTr_"+tmpArray[x]);
				if(UserObj.length>0)
				{
					if(obj[i].checked==true){UserObj.css("display","");}else{UserObj.css("display","none");}
				}
			}
		}
	}else{//只有一个路由选项
		obj[0].checked=true; //只有一个路由选项时默认选中
		Nodeid=obj.val();
		var tmpArray=Nodeid.split(",");
		for(x=0;x<tmpArray.length;x++)
		{
				var UserObj=$("#UserTr_"+tmpArray[x]);
				if(UserObj.length>0)
				{
					if(obj.is(':checked')){UserObj.css("display","");}else{UserObj.css("display","none");}
				}
		}
	}
}

function GoToArchived(){
	if($("#WF_TmpRemark").val().trim()==""){alert(lang.eo_GoToArchived_msg01);return false;}
	SaveDocument("GoToArchived",lang.eo_GoToArchived_msg01);
}

function GoToPrvNode(){
	if($("#WF_TmpRemark").val().trim()==""){alert(lang.eo_GoToPrvNode_msg01);return false;}
	SaveDocument("GoToPrevNode",lang.eo_GoToPrvNode_msg02);
}

function GoToPrvUser(){
	if($("#WF_TmpRemark").val().trim()==""){alert(lang.eo_GoToPrvUser_msg01);return false;}
	SaveDocument("GoToPrevUser",lang.eo_GoToPrvUser_msg02);
}

function GoToNextParallelUser(IsAgree){//提交给下一会签用户
    if(IsAgree==undefined || IsAgree==""){IsAgree="Y";}
	SaveDocument("GoToNextParallelUser",lang.eo_GoToNextNode_msg05,"WF_IsAgree="+IsAgree);
}

function GoToNextSerialUser(){//提交给下一串行审批用户
	SaveDocument("GoToNextSerialUser",lang.eo_GoToNextNode_msg05);
}

function GoToFirstNode(){
	if($("#WF_TmpRemark").val().trim()==""){alert(lang.eo_GoToFirstNode_msg01);return false;}
	$('#win').dialog({
		title: lang.eo_GoToFirstNode_msg02,
		width: 350,
		height: 150,
		closed: false,
		cache: false,
		modal: true,
		href:'r?wf_num=R_S003_B040&WF_Action=GoToFirstNode',
		buttons: [{text: lang.eo_submit_msg,iconCls: 'icon-ok',handler: function() {var v=$('input[name="IsBackFlag"]:checked').val();SaveDocument("GoToFirstNode","","WF_IsBackFlag="+v);
		}},{text: lang.eo_cancel_msg,iconCls: 'icon-remove', handler: function() {$('#win').dialog('close');}}]
	});
}

function ReturnToAnyNode(){
	//回退任意环节
	if($("#WF_TmpRemark").val().trim()==""){alert(lang.eo_ReturnToAnyNode_msg01);return false;}
	$('#win').dialog({
		title: lang.eo_back_msg,
		width: 350,
		height: 210,
		closed: false,
		cache: false,
		modal: true,
		href:'r?wf_num=R_S003_B040&WF_Action=ReturnToAnyNode&WF_CurrentNodeid='+$("#WF_CurrentNodeid").val()+'&WF_DocUnid='+$("#WF_DocUnid").val(),
		buttons: [{text: lang.eo_submit_msg,iconCls: 'icon-ok',handler: function() {
			var returnNodeid=$("#WF_ReturnNodeid").val();
			if(returnNodeid==""){alert(lang.eo_ReturnToAnyNode_msg02);return;}
			var returnUserid=$("#WF_ReturnUserid").val();
			if(returnUserid==""){alert(lang.eo_ReturnToAnyNode_msg03);return;}
			$("#WF_NextNodeid").val(returnNodeid);
			$("#WF_NextUserList").val(returnUserid);
			var v=$('input[name="IsBackFlag"]:checked').val();
			SaveDocument("ReturnToAnyNode","","WF_IsBackFlag="+v);
		}},{text: lang.eo_cancel_msg,iconCls: 'icon-remove', handler: function() {$('#win').dialog('close');}}]
	});
}

function getReturnAnyNodeUser(){
	//根据选择回退环节获得可回退的用户列表
	var userid=$("#WF_ReturnNodeid option:selected").attr("userid");
	var userName=$("#WF_ReturnNodeid option:selected").attr("userName");
	$("#WF_ReturnUserid").val(userid);
	$("#WF_ReturnUserid_show").text(userName);
}

function GoToSaveDoc(){
//	//提交到下一环节
//	var NodeList=""; //获得选中的节点
//	$('input[name="WF_NextNodeSelect"]:checked').each(function(){
//		if(NodeList==""){NodeList=$(this).val();}
//		else{NodeList+=","+$(this).val();}
//	});
//
//	if($('input[name="WF_NextNodeSelect"]').length>0){ //看是否可以选择环节
//		if(NodeList==""){alert(lang.eo_GoToNextNode_msg01);return false;}
//		//获得审批用户列表
//		var UserList="";
//		var NodeArray=NodeList.split(",");
//		for(var i=0;i<NodeArray.length;i++)
//		{
//			var Nodeid=NodeArray[i];
//			var obj=$("#WF_"+Nodeid);
//			if(obj.length>0)
//			{
//				var NodeName=obj.attr("NodeName");
//				var MaxUserNum=obj.attr("MaxUserNum")-0;
//				var MinUserNum=obj.attr("MinUserNum")-0;
//				var userList=obj.val()+"";
//				var UserArray=userList.split(",");
//				if(UserArray.length>MaxUserNum && MaxUserNum!=0){alert(lang.eo_GoToNextNode_msg02.replace('{0}',NodeName));return false;}
//				if((userList=="null" || userList=="") && MinUserNum!=0)
//				{
//					alert(lang.eo_GoToNextNode_msg03.replace("{0}",NodeName));
//					return false;
//				}
//				if(UserArray.length<MinUserNum){alert(lang.eo_GoToNextNode_msg04.replace("{0}",NodeName)); return false;}
//				for(var j=0;j<UserArray.length;j++)
//				{
//					if(UserArray[j]!=""){
//						if(UserList==""){UserList=UserArray[j]+"$"+Nodeid;}else{UserList+=","+UserArray[j]+"$"+Nodeid;}
//					}
//				}
//			}
//		}
//		$("#WF_NextNodeid").val(NodeList);
//		$("#WF_NextUserList").val(UserList);
//	}
	  $("#WF_Remark").val($("#WF_TmpRemark").val());
	  var formData=$("form").serialize();
	  var checkBoxData=getNoCheckedBoxValue();
	  if(checkBoxData!=""){formData+="&"+checkBoxData;}
	  var textShowStr=getFieldTextShowData();
	  if(textShowStr!=""){formData+="&"+textShowStr;} //_show字段的内容
	  var r=formonsubmit();
	  if(typeof(r)=="boolean" && r==false){return;}
	  else if(typeof(r) == "string"){formData+="&"+r;} //如果返回的时字符串则作为提交的附加数据
	  var url="r?wf_num=R_S003_B031";
	  if(!confirm(lang.eo_GoToSaveDoc_msg)){return false;}
	  mask();
	  $.post(url,formData,function(data){unmask();alert("保存草稿成功！");window.close();});
}

function CopyToDraftDoc()
{
	  var formData=$("form").serialize();
	  var checkBoxData=getNoCheckedBoxValue();
	  if(checkBoxData!=""){formData+="&"+checkBoxData;}
	  var textShowStr=getFieldTextShowData();
	  if(textShowStr!=""){formData+="&"+textShowStr;} //_show字段的内容
	  var r=formonsubmit();
	  if(typeof(r)=="boolean" && r==false){return;}
	  else if(typeof(r) == "string"){formData+="&"+r;} //如果返回的时字符串则作为提交的附加数据
	  var url="r?wf_num=R_S003_B069";
	  if(!confirm(lang.eo_CopyToDraftDoc_msg)){return false;}
	  mask();
	  $.post(url,formData,function(data){unmask();});
}

function GoToReassignment(){
	//转交给其他用户
	var UserList=$("#WF_OtherUserList").val();
	if(UserList=="" || UserList==null){alert(lang.eo_GoToReassignment_msg01);return false;}
	$("#WF_NextUserList").val(UserList);
	var ReassignmentFlag="1"; //转发后不需要返回
	var backobj=$("#WF_SendToOtherUserAndBack");
	if(backobj.length>0){if(backobj[0].checked==true){ReassignmentFlag="2";}}//转发后需要返回
	SaveDocument("GoToOthers",lang.eo_GoToReassignment_msg02,"WF_ReassignmentFlag="+ReassignmentFlag);
}

function ReturnToPrevUser(){
	//转交给其他用户
	SaveDocument("BackToDeliver",lang.eo_ReturnToPrevUser_msg);
}

function BackToReturnUser(){
	//返回给回退者
	SaveDocument("BackToReturnUser",lang.eo_BackToReturnUser_msg);
}

function SelectRemark(obj){
	//常用意见选择
	$("#WF_TmpRemark").val(obj.value);
}
function AddToMyRemark(){
	//加入常用办理意见中
	var url="rule?wf_num=R_S003_B037";
	if($("#WF_TmpRemark").val()==""){alert(lang.eo_AddToMyRemark_msg);return;}
	$.post(url,{Remark:$("#WF_TmpRemark").val()},function(data){
		data=JSON.parse(data);
		alert(data.msg);
	});
}

function ShowWorkflow(processid,docUnid){
	var url="rule?wf_num=R_S003_B066&Processid="+processid+"&DocUnid="+docUnid;
	OpenUrl(url);
}

function ShowRemark(processid,docUnid){
	var url="page?wf_num=P_S003_001&Processid="+processid+"&DocUnid="+docUnid;
	if(isMobile()){
		url="page?wf_num=P_S003_002&Processid="+processid+"&DocUnid="+docUnid;
	}
	OpenUrl(url,200,200);
}

function WF_OpenAttachmentLog(){
    $('#win').window({width:750,height:450,modal:true,title:lang.eo_OpenAttachmentLog_msg});
    $('#win').html("<iframe height='400px' width='100%' frameborder='0' src='view?wf_num=V_S003_G002&DocUnid="+$("#WF_DocUnid").val()+"'></iframe>");
}

function WF_SystemTools(){
   var url="page?wf_num=P_S014_002&DocUnid="+$("#WF_DocUnid").val()+"&Processid="+$("#WF_Processid").val();
   OpenUrl(url,100,100);
}


function AddToFavorites(){
	
	var url="rule?wf_num=R_S003_B056&DocUnid="+$("#WF_DocUnid").val();
	$.ajax({
		url: url,
		type: 'get',
		success: function(rs) {
			rs = JSON.parse(rs);
			var li = "";
			for(var i=0;i<rs.length;i++) {
				var data = rs[i];
				var enableStatus = data.enable;
				console.log(data.tb);
//				var channelPng = "linkey/bpm/images/process/msg-"+data.zdId+".png";
				var channelPng = data.tb;
				li += "<li><div class='"+(enableStatus==1?'active':'')+"' channel='"+data.zdId+"'>"+"<img src='"+channelPng+"' onerror='this.src=\"linkey/bpm/images/process/msg-default.png\";this.onerror=null' />"+"</div></li>";
			}
			
			var modalHtml = "<div id='follow-modal' class='follow-modal-box'><div class='follow-modal-content'><div class='follow-modal-header'><span class='follow-modal-title'>提醒设置</span><span class='follow-modal-close'>X</span></div><div class='follow-modal-body'><p class='top-tips'>请选择消息提醒渠道，可多选。</p><ul>"+li+"</ul><p class='foot-tips'>提示：为保证微信消息成功接收，请关注对应的公众号。</p></div><div class='follow-modal-footer'><button type='button' class='btn-primary btn-ok'>确 定</button><button type='button' class='btn-cannel'>取 消</button></div></div></div>";
			
			$(modalHtml).appendTo("#linkeyform");
			
		}
	});
	
	//旧方式
	/*mask();
	$.post(url,function(data){
		data=JSON.parse(data);
		alert(data.msg);
		unmask();
	})*/
}

//折叠指定子表单13-04-08
function ExpandSubForm(spanobj)
{
	if(spanobj.className=="CollapseSubForm"){
		spanobj.className="ExpandSubForm";
	}else{
		spanobj.className="CollapseSubForm";
	}
	//隐藏或显示内容
	var subformObj=$("#SUBFORM_"+spanobj.id)[0];
	if(subformObj.style.display=="none"){subformObj.style.display="";}else{subformObj.style.display="none";}
}

//折叠或显示子表单的内容
function ExpandSubFormBody(spanobj)
{
	if(spanobj.className=="CollapseSubForm"){
		spanobj.className="ExpandSubForm";
	}else{
		spanobj.className="CollapseSubForm";
	}
	//隐藏或显示内容
	var subformObj=$("#SUBFORM_"+spanobj.id)[0];
	if(subformObj.innerHTML==""){
		subformObj.innerHTML="<iframe id='subframe_"+spanobj.id+"' src='rule?wf_num=R_S003_B061&OrUnid="+spanobj.id+"' width='100%' height='100px' frameborder='0' ></iframe>";
	}
	if(spanobj.className=="ExpandSubForm"){
		subformObj.style.display="";
	}else{
		subformObj.style.display="none";
	}

}

//折叠处理单
function ExpandApprovalForm(spanobj)
{
	if(spanobj.className=="CollapseSubForm"){
		spanobj.className="ExpandSubForm";
	}else{
		spanobj.className="CollapseSubForm";
	}
	var formObj=$("#ApprovalTable")[0];
	if(formObj.style.display=="none"){formObj.style.display="";}else{formObj.style.display="none";}
}
//打印处理单  
function PrintForm(){  
      
    var LODOP=getLodop();  
    LODOP.PRINT_INIT("流程处理单打印");  
    LODOP.ADD_PRINT_URL(0,0,"100%","100%","/rule?wf_num=R_formprint_B001&wf_docunid="+$("#WF_DocUnid").val());  
    LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Auto-Width");
    LODOP.PREVIEW();  
   
} 
/*//打印处理单
function PrintForm(){
//	var url="rule?wf_num=R_S005_B004&wf_action=read&DocUnid="+$("#WF_DocUnid").val();
//	OpenUrl(url);
	var url="rule?wf_num=R_S005_B004&wf_action=read&DocUnid="+$("#WF_DocUnid").val();  

	$.ajax({ 
		url:url, 
		type:'GET', 
		data:'', 
		dataType:'text', 
		success:function(data){ 
			var LODOP;  
			LODOP = getLodop();  
			LODOP.PRINT_INIT("打印");  
			LODOP.SET_SHOW_MODE("NP_NO_RESULT",true);  
			LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4");  
			LODOP.ADD_PRINT_HTM("25.4mm","0","100%","100%",data);  
			LODOP.PREVIEW();    
		}, 
			error:function(XMLHttpRequest, textStatus, errorThrown){ 
		} 
	});         
	//OpenUrl(url);  
}*/

//附件模板卓正
function OpenAttTemplate(fileName,docUnid){
	if(docUnid=="" || docUnid==undefined){alert(lang.eo_OpenAttTemplate_msg);return false;}
		if(CanOpenPageOffice()=="1"){
		var url="jsp/pageoffice/Word.jsp?Processid="+$("#WF_Processid").val()+"&DocUnid="+$("#WF_DocUnid").val()+"&Nodeid="+$("#WF_CurrentNodeid").val()+"&IsFirstNodeFlag="+$("#WF_IsFirstNodeFlag").val()+"&IsNewDocFlag="+$("#WF_NewDocFlag").val()+"&oType=0&TemplateDocUnid="+docUnid+"&Userid="+$("#WF_UserName").val()+"&dc="+Math.random();
		if( fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()=="pdf"){url= "jsp/pageoffice/PDF.jsp?TemplateDocUnid="+docUnid;};
		OpenUrl(url);
	}else{
		var url="jsp/pageoffice/Word_pob.jsp?Processid="+$("#WF_Processid").val()+"&DocUnid="+$("#WF_DocUnid").val()+"&Nodeid="+$("#WF_CurrentNodeid").val()+"&IsFirstNodeFlag="+$("#WF_IsFirstNodeFlag").val()+"&IsNewDocFlag="+$("#WF_NewDocFlag").val()+"&oType=0&TemplateDocUnid="+docUnid+"&Userid="+$("#WF_UserName").val()+"&dc="+Math.random();
		 if( fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()=="pdf"){url= "jsp/pageoffice/PDF_pob.jsp?TemplateDocUnid="+docUnid;};
		 POBrowser.openWindowModeless(url,'width=1200px;height=860px;top=50px;resizable=yes');
		}
}
//Word正文卓正
function OpenWordDoc(fileName)
{ if(!fileName){fileName="正文.doc";}
var TemplateDocUnid=$('#TemplateDocUnid').length==0?"":$('#TemplateDocUnid').combotree('tree').tree('getSelected').id;
	if(CanOpenPageOffice()=="1"){
		var url="jsp/pageoffice/Word.jsp?Processid="+$("#WF_Processid").val()+"&DocUnid="+$("#WF_DocUnid").val()+"&Nodeid="+$("#WF_CurrentNodeid").val()+"&IsFirstNodeFlag="+$("#WF_IsFirstNodeFlag").val()+"&IsNewDocFlag="+$("#WF_NewDocFlag").val()+"&oType=1"+"&Userid="+$("#WF_UserName").val()+"&TemplateDocUnid="+TemplateDocUnid+"&dc="+Math.random();
		OpenUrl(url);
		
/*		$.ajax({   
		     type: "POST",   
		     url: url,   
		     data: {},   
		     success: function(str_response) {   
		        var obj = window.open("about:blank");   
		        obj.document.write(str_response);   
		     }   
		 });  */
		
	}else{
		 var url="jsp/pageoffice/Word_pob.jsp?Processid="+$("#WF_Processid").val()+"&DocUnid="+$("#WF_DocUnid").val()+"&Nodeid="+$("#WF_CurrentNodeid").val()+"&IsFirstNodeFlag="+$("#WF_IsFirstNodeFlag").val()+"&IsNewDocFlag="+$("#WF_NewDocFlag").val()+"&oType=1"+"&Userid="+$("#WF_UserName").val()+"&TemplateDocUnid="+TemplateDocUnid+"&dc="+Math.random();
		 POBrowser.openWindowModeless(url,'width=1200px;height=860px;top=50px;resizable=yes');
		}
	
}

//Word正文副本
function OpenWordDocCopey(fileName)
{
	if(!fileName){fileName="正文(副本).doc";}
	//alert(encodeURIComponent(fileName));
	var url="form?wf_num=F_S024_A004&Processid="+$("#WF_Processid").val()+"&DocUnid="+$("#WF_DocUnid").val()+"&Nodeid="+$("#WF_CurrentNodeid").val()+"&IsFirstNodeFlag="+$("#WF_IsFirstNodeFlag").val()+"&IsNewDocFlag="+$("#WF_NewDocFlag")+"&FileName="+encodeURIComponent(fileName);
	OpenUrl(url);
}
//选择文号
function SelWenHao(obj){
    $('#win').window({
        width:600,
        height:300,
        modal:true,
        title:lang.eo_SelWenHao_msg
    });
    $('#win').html("<iframe height='200px' width='100%' frameborder='0' src='form?wf_num=F_S005_A016&obj="+obj.id+"'></iframe>");
}

/*//比如从页面获得用户名如下(中英文均可)
var userName = $("#userName").val();
//然后进行base64加密
var userNameBase64=encodeBase64(userName); 
//最后将加密后的userNameBase64传到后台即可

//加密方法。没有过滤首尾空格，即没有trim.  
//加密可以加密N次，对应解密N次就可以获取明文  
 function encodeBase64(mingwen,times){  
    var code="";  
    var num=1;  
    if(typeof times=='undefined'||times==null||times==""){  
       num=1;  
    }else{  
       var vt=times+"";  
       num=parseInt(vt);  
    }  
    if(typeof mingwen=='undefined'||mingwen==null||mingwen==""){  
    }else{  
    	$.base64.utf8encode = true;  
        code=mingwen;  
        for(var i=0;i<num;i++){  
           code=$.base64.btoa(code);  
        }  
    }  
    return code;  
 };
*/
/*移动终端函数 start */
function MobileDeleteNodeUser(nodeid,userid){
//	$("#U_"+nodeid+"_"+userid).html("");
	$("a[id='U_"+nodeid+"_"+userid+"']").remove();
	var userList=$("#WF_"+nodeid).val();
	var userArray=userList.split(",");
	var newUserList="";
	for(var i=0;i<userArray.length;i++){
		if(userArray[i]!=userid){
			if(newUserList==""){newUserList=userArray[i];}
			else{newUserList+=","+userArray[i];}
		}
	}
	$("#WF_"+nodeid).val(newUserList);
}

/*移动终端函数 end */



/*弹出窗口处理专用代码开始**********************************************/
function ShowToolbar(){
	$("body").css("margin-top","46px");

	var HtmlStr="<div id='bar_v4'><div class=\"topbar\"> <div class=\"leftbar\">";
	//开始增加操作按扭
	//if(document.all.ApprovalForm)

	var ly_WF_CurrentProcessUNID = $("input[name=WF_Processid]").val();
	var ly_WF_DocUNID = $("input[name=WF_DocUnid]").val();
	HtmlStr+="<a href='' class=\"flowmap\" onclick=\"ShowWorkflow(\'"+ly_WF_CurrentProcessUNID+"\',\'"+ly_WF_DocUNID+"\');return false;\">查看流程图</a>";
	HtmlStr+="<a href='' class=\"flowhistroy\" onclick=\"ShowRemark(\'"+ly_WF_CurrentProcessUNID+"\',\'"+ly_WF_DocUNID+"\');return false;\">查看流转记录</a>";
//	HtmlStr+="<a href='' class=\"flowhistroy\" style='padding-left:20px;' onclick=\"OpenWordDoc();return false;\">打开正文</a>";
//	HtmlStr+="<a href='' class=\"flowhistroy\" style='padding-left:20px;' onclick=\"PrintForm();return false;\">打印</a>";
	HtmlStr+="</div><div class=\"rightbar\">";	
	HtmlStr+="<a href='' onclick=\"window.close();return false;\">关闭</a>";
	HtmlStr+="<span>";
	if(document.getElementById("ApprovalForm"))
	{
		//只有在有权显示处理单时才增加处理文档按扭
		
		HtmlStr+="<a class=\"submitbtn\" onclick=\"prepareSubmit();return false;\">办理</a>";
		
	}
	HtmlStr+="</span>";
	//增加结束


	HtmlStr+="</div></div></div><table width=100% height=37px ><tr><td></td></tr></table>";

	 //document.all.TopToolBar.innerHTML=HtmlStr;
	 //document.getElementById("TopToolBar").innerHTML=HtmlStr;
//	 $("#TopFormTable").hide();
	
	 $("body").append(HtmlStr);
	 window.onscroll=fixtoolbar;
	 window.onresize=fixtoolbar;
	 setTimeout("fixtoolbar();",200);
		try{
			 $(document).ready(function() {
				if(location.href.indexOf("R_S003_B036")==-1||location.href.indexOf("mobile")!=-1){return false;} //只有在流程处理单中打开时才执行，如果是在已归档中打开则退出
				// 弹出层对话框初始化开始
				$('#ApprovalForm').dialog({
				  closed: true,  // 不自动打开
				  modal:true,    // 模拟模态窗口
				  width: 700,
				  draggable:true,   // 可拖动，IE9下无效
				  resizable:true,   // 可改变大小，IE9下无效
				  title:"处理文档"
				});

			});
		}catch(e){}
}

/**
 * 李文波加入，为了在用户点击 “处理流程” 之前做一些JS方面的操作
 */
function prepareSubmit() {
	try {
		if(typeof(onPrepareSubmit)=="function") {
			onPrepareSubmit.call();
		}
	}catch(e) {
		
	}
	
	$('#ApprovalForm').window('open');
}

function fixtoolbar()
{
	//var a=$(document).scrollTop()+$("#bar_v4").offset().top;
	//$("#bar_v4").css({bottom:a,visibility:""});
	$("#bar_v4").css({
		top : 0,
		visibility : ""
	})
	//bar_v4.style.bottom = a;
	//bar_v4.style.visibility="";
}
/*弹出窗口处理专用代码结束**************************************************/