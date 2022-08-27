//扩展验证
$.extend($.fn.validatebox.defaults.rules, {
		mobiePhone : {
			validator : function(value) {return /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/i.test(value) || /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);},
			message : "请输入正确的手机或固定号码"
		},
		phone : {// 验证固定电话
			validator : function(value) {return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);},
			message : lang.ui_extend_msg01
		},
		CheckboxNotNull:{ //复选框必填
			validator : function(value,param) {
				var chkval=false;
				$('input[name="'+param[0]+'"]:checked').each(function(){chkval=true;});
  				if(chkval==true){
  					$('input[name="'+param[0]+'"]').each(function(){$(this).removeClass("validatebox-invalid");});
  				}
  				return chkval;
    		},
			message : lang.ui_extend_msg02
		},
		RadioNotNull:{ //单选按扭必填
			validator : function(value,param) {
				var chkval=false;
				$('input[name="'+param[0]+'"]:checked').each(function(){chkval=true;});
  				if(chkval==true){
  					$('input[name="'+param[0]+'"]').each(function(){$(this).removeClass("validatebox-invalid");});
  				}
  				return chkval;
    		},
			message : lang.ui_extend_msg03
		},
		integer : {validator : function(value) {return /^[+]?[1-9]+\d*$/i.test(value);},message : lang.ui_extend_msg04},
		intOrFloat : {validator : function(value) {return /^\d+(\.\d+)?$/i.test(value);},message : lang.ui_extend_msg05},
		equalTo: {validator:function(value,param){return $("#"+param[0]).val() == value;},message:lang.ui_extend_msg06},
		english:{validator : function(value) {return /^[A-Za-z]+$/i.test(value);}, message : lang.ui_extend_msg07},
		number:{//取值区间
		validator : function(value, param) {
			
			return value>=param[0]&&value<=param[1];
		},
		message : '您输入的数值有误请输入{0}-{1}之间的数！'
	}
		
});

function validReadFieldIsNull(){
	//验证只读模式的必填字段属性，只检测input类型的具有exttype类型的暂不检测，避开日期控件
	var r=true;
	$("[data-options*='required:true']").each(function(){
		if($(this).css("display")=="none" && $(this).attr("exttype")==undefined&& $(this).attr("comboname")==undefined){
			var jsonStr="{"+$(this).attr("data-options")+"}";
			//Edit By Nine 修改将eval调整成JSON.parse而引起的报错
			//var data=JSON.parse(jsonStr);
			var data = JSON.parse(jsonStr.replace(/([\d\w]+?):/gm, '\"$1\":').replace(/:[\']*([^,\'\"}]+)\'*/gm , ':"$1"'));
			if(data.required==true && $(this).val()=="" ){
				r=false;
				var missingMessage=data.missingMessage;
				if(missingMessage!="" && missingMessage!=undefined){
					alert(data.missingMessage);
				}else{
					alert($(this).attr("id")+lang.ui_extend_msg08);
				}
			}
		}
	});
	return r;
}

$.extend($.fn.validatebox.defaults.rules,{  
    dateValid : {  
        validator : function(value,param) { //参数value为当前文本框的值，也就是endDate  
            startTime = $("#"+param[0]).datetimebox('getValue');//获取起始时间的值  
            var start = new Date(startTime.replace(/-/g,"/"));  
            var end = new Date(value.replace(/-/g,"/"));
            varify = end > start;  
            return varify;  
        },  
        message : '结束时间要大于开始时间!'  
    }  
});  

/******easy ui 函数结束*****/ 