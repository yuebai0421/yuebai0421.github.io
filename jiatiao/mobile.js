var fdName="";

//用户选择
function SelUserForMobile(srcFdName, processId, targetNodeId){
	/*var htmlCode='<div style="margin:5px"> <a href="#" id="btnselok" onclick="selectok();return false;">'+lang.mb_SelUserForMobile_msg02+'</a> <a href="#" id="btnclose" onclick="parent.$(\'#win\').window(\'close\');return false;">'+lang.mb_SelUserForMobile_msg03+'</a>';
	htmlCode+='<hr size=1 style="color:#ccc;width:100%;margin:5px 0px 5px 0px"> ';
	htmlCode+='<input id="UserList" style="display:none"><span id="UserNameList" style="display:none"></span><span id="UserNameAction" style="color:#0033CC"></span>';
	htmlCode+='<hr size=1 style="color:#ccc;width:100%;margin:5px 0px 5px 0px"> ';
	//移动端用户选择样式调整
	htmlCode+='</div><ul id="tree" style="height:480px; overflow-y: scrooll;"></ul>';
    $('#win').html(htmlCode);
	$('#tree').tree({url:'rule?wf_num=R_S023_B012'});
	$('#btnselok').linkbutton({iconCls: 'icon-ok'});
	$('#btnclose').linkbutton({iconCls: 'icon-remove'});

	//初始化js代码 
	fdName=srcFdName;//加入全局变量中
    var userid=window.$("#"+srcFdName).val();
    $("#UserList").val(userid);
    $.post("r?wf_num=R_S023_B013",{userid:userid},function(rs){
        var rs=JSON.parse(rs);
        $("#UserNameList").text(rs.UserName);
        formatUserName();
    })*/
	
	
	fdName=srcFdName;//加入全局变量中
	var htmlCode = '<div class="user_selected easyui-layout" fit="true"><div class="easyui-layout" region="north" style="height:180px;"><div class="top-tool"><a href="#" class="btn_cannel">取消</a><a href="#" class="btn_ok">确认</a></div><div class="search"><input type="input" class="search_box" placeholder="输入用户名或账号" /></div><div class="selected_user"><span class="tip_selected_user">已选择用户：</span></div></div><div id="center_listview" region="center"><ul class="listview_users"></ul></div>';
	$('#win').html(htmlCode);
	$('#win').window({ 
		fit: true,
		modal:true,
		minimizable:false,
		collapsible:false,
		maximizable:false,
        draggable:false,
		title:lang.mb_SelUserForMobile_msg01
	});
	$.parser.parse("#win");
	
	//查询用户列表
	//默认请求最近联系人
//	var url = "r?wf_num=D_RYXZQ_J001&wf_gridnum=V_RYXZQ_G001";
	var url = "r?wf_num=D_S007_J001&processId="+processId+"&targetNodeId="+targetNodeId;
	var params = {page:1,rows:25,sort:'SortNumber',order:'asc'};
	requestUserList(url, params);

	//绑定查询框
	$(".search_box").on("input",function(e) {
		var keyword = e.delegateTarget.value;
		requestUserList(url, {page:1,rows:25,sort:'SortNumber',order:'asc', searchStr: keyword},true);
	});
	
	$("#center_listview").scroll(function() {
		//滚动到底了
		if($("#center_listview").scrollTop()+$("#center_listview").height()>=$("#center_listview")[0].scrollHeight) {
			params.page=params.page+1;
			requestUserList(url, params);
		}
	});

	//初始化之前已选择的用户
	initSelectedUser();
	
	//确认选择按钮
	$(".btn_ok").click(function() {
		var userIds = [];
		var userNames = [];
		$(".selected_user>.user_link").each(function(k,v) {
			var userId = $(this).attr('id');
			var userName = $(this).attr('userName');
			userIds.push(userId);
			userNames.push(userName);
		})
		$("#"+fdName).val(userIds.join(","));
		//如果是流程处理单，需要加删除按钮
	    //如果是流程处理单的用户选择则需要增加删除功能
	    if(fdName.substring(0,3)=="WF_"){
	    	var nodeid=fdName.substring(3);
	    	var htmlCode="";
	    	for(var x=0;x<userIds.length;x++){
	    		var userid = userIds[x];
	    		var userName = userNames[x];
	    		var inputId = "U_" + nodeid + "_" + userid;
	    		//htmlCode+="<a  id=\"U_"+nodeid+"_"+userid+"\" onclick=\"MobileDeleteNodeUser('"+nodeid+"','"+userid+"');return false;\" href='' class=\"fieldShow\" ><img src='linkey/bpm/images/icons/vwicn203.gif'>"+userName+"</a> ";
                htmlCode+="<input  id=\"U_"+nodeid+"_"+userid+"\"  checked type='checkbox' name=\"U_" + nodeid + "_" + userid + "\" onclick='setUserList(this)'/>" + "<span name=\"U_" + nodeid + "_" + userid + "\" onclick='selectUserName(\"" + inputId + "\")'>" + userName + "</span>";
	    	}
	    	$("#"+fdName+"_show").html(htmlCode); 
	    }else {//其他地方打开人员选择器
	    	$("#"+fdName+"_show").text(userNames.join(","));
	    }
	    $("html").removeClass("panel-fit");
        $("body").removeClass("panel-noscroll");
		parent.$('#win').window('close');
        $(".panel").removeClass('panel');
	});
	
	//绑定取消按钮事件
	$(".btn_cannel").click(function() {
        $("html").removeClass("panel-fit");
        $("body").removeClass("panel-noscroll");
		parent.$('#win').window('close');
        $(".panel").removeClass('panel');
	});
}

function requestUserList(url, params,isEmpty) {
	$.post(url,params,function(rs){
        var users=JSON.parse(rs);
        if(isEmpty) {
        	$(".listview_users").empty();
        }
        createListView(users);
    })
}

function createListView(users) {
	var $listview = $(".listview_users");
//	$listview.empty();
	//动态创建列表
	for(var i=0;i<users.rows.length;i++) {
		var user = users.rows[i];
        $listview.append('<li class="user" onClick="bindUserClick(this)"><span style="width: 50%;  height: 40px; text-align: left;  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  float: left;"><input name="checkbox_user" type="checkbox" userId="'+user.Userid+'" userName="'+user.CnName+'" /><span class="text">'+user.CnName+'('+user.Userid+')</span></span><span style="overflow: hidden;  text-overflow: ellipsis;  white-space: nowrap; width: 50%; text-align: right; float:right; margin-right10px">'+user.FolderName+'</span></li>');
	}
	
	// //给复选框绑定选中事件
	// $("input[name='checkbox_user']").unbind("change").bind("change", function() {
	// 	var userId = $(this).attr("userId");
	// 	var userName = $(this).attr("userName");
	// 	if($(this).is(':checked')){
	// 		addUser(userId, userName);
	// 	}else {
	// 		removeUser(userId);
	// 	}
	// });
	//
	// //给行绑定点击事件
	// $(".listview_users>li").click(function() {
	// 	var $ck = $(this).find("input[name='checkbox_user']");
	// 	var userId = $ck.attr("userId");
	// 	var userName = $ck.attr("userName");
	// 	if($ck.is(":checked")) {
	// 		$ck.prop("checked", false);
	// 		removeUser(userId);
	// 	}else {
	// 		$ck.prop("checked", true);
	// 		addUser(userId, userName);
	// 	}
	// });
}

//初始化之前已选的用户
function initSelectedUser() {
	var oldUser=window.$("#"+fdName).val();
	var users = oldUser.split(",");
	var userIds = [];
	for(var i=0;i<users.length;i++) {
		var userId = users[i];
		userIds.push(userId.split("#")[0]);
	}
	$.post("r?wf_num=R_S023_B013",{userid:userIds.join(",")},function(rs){
        var rs=JSON.parse(rs);
        var userNames = rs.UserName.split(",");
        for(var j=0;j<userIds.length;j ++) {
        	var userId = userIds[j];
        	var userName = userNames[j];
        	addUser(userId, userName);
        }
    })
}


function bindUserClick(e){
    var userId = $(e.firstChild.firstChild).attr("userId");
    var userName = $(e.firstChild.firstChild).attr("userName");
    var $ck = $(e.firstChild.firstChild);
    if($ck.is(":checked")) {
        $ck.prop("checked", false);
        removeUser(userId);
    }else {
        $ck.prop("checked", true);
        addUser(userId, userName);
    }

}

//向选择区域添加已选择的用户
function addUser(userId, userName) {
	if(userId!="" && $(".user_link#"+userId).length<1) {
		$('<span class="user_link" userId="'+userId+'" userName="'+userName+'" id="'+userId+'"><a href="#"><img src="linkey/bpm/images/icons/vwicn203.gif" /></a><span>'+userName+'</span></span>').click(function() {
			$(this).remove();
			$("input[userId='"+userId+"']").attr("checked", false);
		}).appendTo(".selected_user");
	}
}

//将已选择的用户移除
function removeUser(userId) {
	if(userId!="")
		$(".user_link#"+userId).remove();
}

//将已选择的用户移除
$(".user_link").click(function() {
	$(this).remove();
});

//点击选择的姓名
function selectUserName(inputId){
	if(!$("#" + inputId).prop("checked")){
        $("#" + inputId).prop("checked","checked");
	}else{
        $("#" + inputId).removeProp("checked");
	}
    setUserList($("#" + inputId)[0]);
}

//重新置当前选择的用户信息
function setUserList(curUserDom){
    var preFix = curUserDom.id.substring(0,8);
    var selectedNode = curUserDom.id.substring(2,8);
    var selectedUserList = $("input[id^='" + preFix + "_']:checked");
    var selectedUserStr = "";
    for (var i = 0; i < selectedUserList.length; i++) {
        selectedUserStr += selectedUserList[i].id.substring((preFix + "_").length);
        if(i !== selectedUserList.length - 1){
            selectedUserStr += ",";
        }
    }
    $("#WF_"+selectedNode).val(selectedUserStr);
}
/***************************************************************/
/************************下面都是以前的代码**************************/
/***************************************************************/

//确定选择
function selectok(){
    window.$("#"+fdName).val($("#UserList").val());
    
    //如果是流程处理单的用户选择则需要增加删除功能
    if(fdName.substring(0,3)=="WF_"){
        var nodeid=fdName.substring(3);
        var userArray=$("#UserList").val().split(",");
        var userNameArray=$("#UserNameList").text().split(",");
        var htmlCode="";
        for(var x=0;x<userArray.length;x++){
            var userid=userArray[x];
            var userName=userNameArray[x];
            if(userName!=""){
                htmlCode+="<a  id=\"U_"+nodeid+"_"+userid+"\" onclick=\"MobileDeleteNodeUser('"+nodeid+"','"+userid+"');return false;\" href='' class=\"fieldShow\" ><img src='linkey/bpm/images/icons/vwicn203.gif'>"+userName+"</a> ";
            }
        }
        window.$("#"+fdName+"_show").html(htmlCode);   
    }else{
        //普通的用户选择字段
        var showobj=window.$("#"+fdName+"_show");
        if(showobj.length>0){
            showobj.text($("#UserNameList").text());
        }
    }
    $("html").removeClass("panel-fit");
    $("body").removeClass("panel-noscroll");
    parent.$('#win').window('close');
    $(".panel").removeClass('panel');
}

function selectUser(userid,userName,obj){
    if(obj.checked==true){
        //英文userid
        var userList= $("#UserList").val();
        var tmpUserList=","+userList+",";
        if(tmpUserList.indexOf(","+userid+",")!=-1){return;} //看是否已存在
        
        if(userList==""){
             $("#UserList").val(userid);
        }else{
            $("#UserList").val(userList+","+userid);
        }  
        
        //中文名称
        if($("#UserNameList").text()==""){
             $("#UserNameList").append(userName);
        }else{
            $("#UserNameList").append(","+userName);
        }
    }else{
        //删除usertext
        var userStr="";
        var userNameArray=$("#UserNameList").text().split(",");
        for(var i=0;i<userNameArray.length;i++){
            if(userNameArray[i]!=userName){
                if(userStr!=""){userStr+=",";}
                userStr+=userNameArray[i];
            }
        }
        $("#UserNameList").text(userStr);
        
        //删除userid
        userStr="";
        var userListArray=$("#UserList").val().split(",");
        for(var i=0;i<userListArray.length;i++){
            if(userListArray[i]!=userid){
                if(userStr!=""){userStr+=",";}
                userStr+=userListArray[i];
            }
        }
        $("#UserList").val(userStr);
        
    }
    formatUserName();
    //$('#'+userid).linkbutton({iconCls: 'icon-remove',plain:true,size:'small'});
}

//格式化中文名为可删除样式
function formatUserName(){
    var userText=$("#UserNameList").text();
    if(userText==""){$("#UserNameAction").html(lang.mb_formatUserName_msg03);return;}
    var userArray=userText.split(",");
    var userHtml="";
    var i=0;
    for(i=0;i<userArray.length;i++){
        userHtml+="<span  id='userAction_"+i+"' style='cursor:pointer' onclick=\"deleteUserItemAction('"+userArray[i]+"',"+i+")\"><img src='linkey/bpm/images/icons/vwicn203.gif'>"+userArray[i]+"</span> ";
    }
    $("#UserNameAction").html(userHtml);
}

//点击用户名时删除用户
function deleteUserItemAction(userName,index){
    $("#userAction_"+index).html("");
    deleteUser(userName);
}

//根据用户名删除userid和username
function deleteUser(userName){
    //删除usertext
    var j=0;
    var userStr="";
    var userNameArray=$("#UserNameList").text().split(",");
    for(var i=0;i<userNameArray.length;i++){
        if(userNameArray[i]!=userName){
            if(userStr!=""){userStr+=",";}
            userStr+=userNameArray[i];
        }else if(userNameArray[i]==userName){
           j=i; //标识删除了第几个
        }
    }
    $("#UserNameList").text(userStr);
    
    //删除userid
    userStr="";
    var userListArray=$("#UserList").val().split(",");
    for(var i=0;i<userListArray.length;i++){
        if(i!=j){
            if(userStr!=""){userStr+=",";}
            userStr+=userListArray[i];
        }
    }
    $("#UserList").val(userStr);
}

