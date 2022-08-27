/** ****************************动态表单*********************************** */


var dynamicTableRow = 1; //动态表单行数

/**
 * 移动端移除一行
 * @param param 需要加载的列
 */
function removeRowByMobile(param) {
  if (dynamicTableRow > 1) {
    for (var i = 0; i <= param.length; i++) {
      $("#dynamicTable").children("tr:last-child").remove();
    }
    dynamicTableRow--;
  } else {
    return;
  }
}

/**
 * PC端移除一行
 * @param param 需要加载的列
 */
function removeRowByPC() {
  if (dynamicTableRow > 1) {
    $("#dynamicTable").children("tr:last-child").remove();
    dynamicTableRow--;
  } else {
    return;
  }
}

/**
 * 移动端增加一行
 * @param param 需要加载的列
 * @param itemName 项目名称，展示在动态表单头部，如：临时人员
 */
function addTableByMobile(param, itemName) {
   
  //未通过验证的不可以新增
  /*if ($('.validatebox-invalid').length != 0) {
    alert("请通过验证再添加");
    return;
  }*/


  var tab = $("#dynamicTable");
  var trStr = ' <tr>' +
    '<td  colspan="2" style="text-align: center;background: #f9f9f9;">' + itemName + dynamicTableRow + '<br/></td>' +
    '</tr>';

  for (var i = 0; i < param.length; i++) {
    var obj = param[i];
    trStr += ' <tr>' +
      '            <td style="text-align: right;"><span >' + obj.name + '</span></td>';

    //判断是否是是选择框
    if (obj.type === undefined || obj.type === null || obj.type === '') {
      obj.type = 'input';
    }

    if (obj.type === 'select') {
      trStr += '<td ><select name="' + obj.id + '_' + dynamicTableRow + '" id="' + obj.id + '_' + dynamicTableRow + '"    ' + (obj.required ? ' data-options="required:true"  missingMessage="' + obj.name + '必须选择" ' : '') + '">';
      //添加选项
      for (var index = 0; index < obj.options.length; index++) {
        trStr += ' <option value="' + obj.options[index].value + '">' + obj.options[index].text + '</option>';
      }
      trStr += '</select> </td></tr>';

      //输入框
    } else {
      trStr += '<td ><input name="' + obj.id + '_' + dynamicTableRow + '" id="' + obj.id + '_' + dynamicTableRow + '" value="" size="' + obj.size + '"  ';

      //判断是否是日期框
      if (obj.type === 'date') {
        trStr += ' class="easyui-datebox"  editable="fasle"'
      }

      //判断是否是时间框
      if (obj.type === 'time') {
        trStr += ' class="easyui-datetimebox"  editable="fasle"'
      }


      //判断是否必选
      if (obj.required) {
        trStr += ' data-options="required:true"  missingMessage="' + obj.name + '必须填写" ';
      }


      //如果绑定选择器，则隐藏控件
      if (obj.select != '' && obj.select != null && obj.select != undefined) {
        trStr += ' style="display:none"  ';
      }

      //回调函数
      if (obj.callback !== "" && obj.callback !== null && obj.callback !== undefined) {
        var callFunction = obj.callback;
        var callHtml = ' callback="'+callFunction+'" ';
        trStr +=callHtml;
      }


      //判断是否有验证
      if (obj.validateType != '' && obj.validateType != null && obj.validateType != undefined) {
        trStr += ' data-options="validType:\'' + obj.validateType + '\'"  ';
      }
      trStr += '  class="easyui-validatebox"/> ';

      //判断是否绑定选择器
      if (obj.select != '' && obj.select != null && obj.select != undefined) {

        if (obj.select === 'user') {
          trStr += '<span id="' + (obj.id + '_' + dynamicTableRow) + '_show"></span>';
          trStr += '<a href="#" class="easyui-linkbutton l-btn l-btn-plain" plain="true" data-options="iconCls:\'icon-userbtn\'" onclick="seluser(\'' + (obj.id + '_' + dynamicTableRow) + '\',\'1\');return false;"  group="" id=""><span class="l-btn-left"></span></a>';
        } else if (obj.select === 'department') {
          trStr += '<span id="' + (obj.id + '_' + dynamicTableRow) + '_show"></span>';
          trStr += '<a href="#" class="easyui-linkbutton l-btn l-btn-plain" plain="true" data-options="iconCls:\'icon-pkg\'" onclick="seldept(\'' + (obj.id + '_' + dynamicTableRow) + '\',false);return false;" group=""  id=""><span class="l-btn-left"></span></a>';
        }

      }
      trStr += obj.otherContent + '</td>' +
        '        </tr>';
    }
  }


  tab.append(trStr);
  $.parser.parse('#dynamicTable');
  dynamicTableRow++; //指向第几行（当前行）
}

/**
 * PC端增加一行
 * @param param 需要加载的列
 * @param itemName 项目名称，展示在动态表单头部，如：临时人员
 */
function addTableByPC(param) {

  //未通过验证的不可以新增
  /*if ($('.validatebox-invalid').length != 0) {
    alert("请通过验证再添加");
    return;
  }*/


  var tab = $("#dynamicTable");
  var trStr = ' <tr>';

  for (var i = 0; i < param.length; i++) {
    var obj = param[i];
    trStr += '<td colspan="' + obj.colspan + '" style="text-align: center" >';
    //判断是否是是选择框
    if (obj.type === undefined || obj.type === null || obj.type === '') {
      obj.type = 'input';
    }
    if (obj.type === 'select') {
      trStr += '<select name="' + obj.id + '_' + dynamicTableRow + '" id="' + obj.id + '_' + dynamicTableRow + '"    ' + (obj.required ? ' data-options="required:true"  missingMessage="' + obj.name + '必须选择" ' : '') + '">';
      //添加选项
      for (var index = 0; index < obj.options.length; index++) {
        trStr += ' <option value="' + obj.options[index].value + '">' + obj.options[index].text + '</option>';
      }
      trStr += '</select>';

      //输入框
    } else if (obj.type === 'input' || obj.type === 'date' || obj.type === 'time') {
      trStr += '<input name="' + obj.id + '_' + dynamicTableRow + '" id="' + obj.id + '_' + dynamicTableRow + '" value="" size="' + obj.size + '"  ';


      //判断是否是日期框
      if (obj.type === 'date') {
        trStr += ' class="easyui-datebox"  editable="fasle"'
      }

      //判断是否是时间框
      if (obj.type === 'time') {
        trStr += ' class="easyui-datetimebox"  editable="fasle"'
      }

       debugger;
      //判断是否必选
      if (obj.required) {
        trStr += ' data-options="required:true" ' + (!obj.select ? 'missingMessage="' + obj.name + '必须填写" ' : ' ');
      }

      //如果绑定选择器，则隐藏控件
      if (obj.select) {
        trStr += ' style="display:none"  ';
      }

      //回调函数
      if (obj.callback !== "" && obj.callback !== null && obj.callback !== undefined) {
        var callFunction = obj.callback;
        var callHtml = ' callback="'+callFunction+'" ';
        trStr +=callHtml;
      }

      //判断是否有验证
      if (obj.validateType != '' && obj.validateType != null && obj.validateType != undefined) {
        trStr += ' data-options="validType:\'' + obj.validateType + '\'"  ';
      }
      trStr += '  class="easyui-validatebox"/> ';
      //判断是否绑定选择器
      if (obj.select != '' && obj.select != null && obj.select != undefined) {

        if (obj.select === 'user') {
          trStr += '<span id="' + (obj.id + '_' + dynamicTableRow) + '_show"></span>';
          trStr += '<a href="#" class="easyui-linkbutton l-btn l-btn-plain" plain="true" data-options="iconCls:\'icon-userbtn\'" onclick="seluser(\'' + (obj.id + '_' + dynamicTableRow) + '\',\'1\');return false;" group=""  id=""><span class="l-btn-left"></span></a>';
        } else if (obj.select === 'department') {
          trStr += '<span id="' + (obj.id + '_' + dynamicTableRow) + '_show"></span>';
          trStr += '<a href="#" class="easyui-linkbutton l-btn l-btn-plain" plain="true" data-options="iconCls:\'icon-pkg\'" onclick="seldept(\'' + (obj.id + '_' + dynamicTableRow) + '\',false);return false;" group=""  id=""><span class="l-btn-left"></span></a>';
        }

      }
      trStr += obj.otherContent + '</td>';
    }

  }
  trStr += '</tr>';
  tab.append(trStr);
  $.parser.parse('#dynamicTable');
  dynamicTableRow++; //指向第几行（当前行）
}

/**
 * 动态移动端数据加载
 * @param param 需要加载的列
 */
function initTableByMobile(param, itemName) {


  var jsondata = $.parseJSON($("#xdoc").text()).allItems;
  var tab = $("#dynamicTable");

  var trStr;


  for (var key in jsondata) {
    //判断含有多少和成员
    if (key.indexOf('_' + dynamicTableRow) > -1) {
      trStr += ' <tr>' +
        '<td  colspan="2" style="text-align: center;background: #f9f9f9;">' + itemName + dynamicTableRow + '<br/></td>' +
        '</tr>';
      //加载成员
      for (var i = 0; i < param.length; i++) {

        var obj = param[i];

        if (obj.type === 'select') {
          var text = '';
          for (var index = 0; index < obj.options.length; index++) {
            if (obj.options[index].value === jsondata[obj.id + '_' + dynamicTableRow]) {
              text = obj.options[index].text;
              break;
            }
          }
          trStr += ' <tr><td style="text-align: right;"><span >' + obj.name + '</span></td><td >' + text + ' </td></tr>';
        } else {
          trStr += ' <tr><td style="text-align: right;"><span >' + obj.name + '</span></td><td >' + jsondata[obj.id + '_' + dynamicTableRow] + ' </td></tr>';
        }

      }
      dynamicTableRow++;
    }
  }

  //添加至表单
  tab.append(trStr);


}

/**
 * 动态PC端数据加载
 * @param param 需要加载的列
 */
function initTablePC(param) {


  var jsondata = $.parseJSON($("#xdoc").text()).allItems;

  var tab = $("#dynamicTable");

  var trStr = '';


  for (var key in jsondata) {
    //判断含有多少和成员
    if (key.indexOf('_' + dynamicTableRow) > -1) {
      trStr += ' <tr>';
      //加载成员
      for (var i = 0; i < param.length; i++) {
        var obj = param[i];
        if (obj.type === 'select') {
          var text = '';
          for (var index = 0; index < obj.options.length; index++) {
            if (obj.options[index].value === jsondata[obj.id + '_' + dynamicTableRow]) {
              text = obj.options[index].text;
              break;
            }
          }
          trStr += '<td  colspan="' + obj.colspan + '" style="text-align: center">' + text + ' </td>';
        } else if (obj.select !== "" && obj.select !== undefined){
          trStr += '<td  colspan="' + obj.colspan + '" style="text-align: center">' + jsondata[obj.id + '_' + dynamicTableRow+'_show'] + ' </td>';
        }else {
          trStr += '<td  colspan="' + obj.colspan + '" style="text-align: center">' + jsondata[obj.id + '_' + dynamicTableRow] + ' </td>';
        }

      }
      dynamicTableRow++;
    }
  }
  //添加至表单
  trStr += '</tr>';
  tab.append(trStr);


}

/**
 * 回退重新加载移动端表单
 * @param param 要添加列
 */
function callbackByMobileTable(param, itemName) {

  var jsondata = $.parseJSON($("#xdoc").text()).allItems;
  var tab = $("#dynamicTable");
  var trStr = '';

  var members = 0; //成员数

  //获取成员数
  for (var key in jsondata) {
    //判断含有多少和成员
    if (key.indexOf('_' + (members + 1)) > -1) {
      members++;
    }
  }


  for (var j = 1; j <= members; j++) {

    trStr += ' <tr>' +
      '<td  colspan="2" style="text-align: center;background: #f9f9f9;">' + itemName + j + '<br/></td>' +
      '</tr>';
    //加载成员
    for (var i = 0; i < param.length; i++) {
      var obj = param[i];
      trStr += ' <tr>' +
        '            <td style="text-align: right;"><span >' + obj.name + '</span></td>';

      //判断是否是是选择框
      if (obj.type === undefined || obj.type === null || obj.type === '') {
        obj.type = 'input';
      }

      if (obj.type === 'select') {
        trStr += '<td ><select name="' + obj.id + '_' + dynamicTableRow + '" id="' + obj.id + '_' + dynamicTableRow + '"    ' + (obj.required ? ' required="true"  missingMessage="' + obj.name + '必须选择" ' : '') + '">';
        //添加选项
        for (var index = 0 ;  index <  obj.options.length ; index++) {
          trStr += ' <option value="' + obj.options[index].value + '" ' + (jsondata[obj.id + '_' + j] === obj.options[index].value ? 'selected = "selected"' : '') + '>' + obj.options[index].text + '</option>';
        }
        trStr += '</select> </td></tr>';

        //输入框
      } else {
        trStr += '<td ><input name="' + obj.id + '_' + dynamicTableRow + '" id="' + obj.id + '_' + dynamicTableRow + '" value="' + jsondata[obj.id + '_' + j] + '"  size="' + obj.size + '"  ';

        //判断是否是日期框
        if (obj.type === 'date') {
          trStr += ' class="easyui-datebox"  editable="fasle"'
        }

        //判断是否是时间框
        if (obj.type === 'time') {
          trStr += ' class="easyui-datetimebox"  editable="fasle"'
        }


        //判断是否必选
        if (obj.required) {
          trStr += ' required="true"  missingMessage="' + obj.name + '必须填写" ';
        }


        //如果绑定选择器，则隐藏控件
        if (obj.select != '' && obj.select != null && obj.select != undefined) {
          trStr += ' style="display:none"  ';
        }


        //判断是否有验证
        if (obj.validateType != '' && obj.validateType != null && obj.validateType != undefined) {
          trStr += ' data-options="validType:\'' + obj.validateType + '\'"  ';
        }
        trStr += '  class="easyui-validatebox"/> ';

        //判断是否绑定选择器
        if (obj.select != '' && obj.select != null && obj.select != undefined) {
          if (obj.select === 'user') {
            trStr += '<span id="' + (obj.id + '_' + dynamicTableRow) + '_show">' + jsondata[obj.id + '_' + j+'_show'] + '</span>';
            trStr += '<a href="#" class="easyui-linkbutton l-btn l-btn-plain" plain="true" data-options="iconCls:\'icon-userbtn\'" onclick="seluser(\'' + (obj.id + '_' + dynamicTableRow) + '\',\'1\');return false;" group="" id=""><span class="l-btn-left"></span></a>';
          } else if (obj.select === 'department') {
            trStr += '<span id="' + (obj.id + '_' + dynamicTableRow) + '_show">' + jsondata[obj.id + '_' + j+'_show'] + '</span>';
            trStr += '<a href="#" class="easyui-linkbutton l-btn l-btn-plain" plain="true" data-options="iconCls:\'icon-pkg\'" onclick="seldept(\'' + (obj.id + '_' + dynamicTableRow) + '\',false);return false;" group="" id=""><span class="l-btn-left"></span></a>';
          }

        }
        trStr += obj.otherContent + '</td>' +
          '        </tr>';
      }
    }
    dynamicTableRow++;

  }
  tab.append(trStr);
  $.parser.parse('#dynamicTable');
}

/**
 * 回退重新加载移PC表单
 * @param param 要添加列
 */
function callbackByPCTable(param) {

  var jsondata = $.parseJSON($("#xdoc").text()).allItems;
  var tab = $("#dynamicTable");
  var trStr = '';

  var members = 0; //成员数

  //获取成员数
  for (var key in jsondata) {
    //判断含有多少和成员
    if (key.indexOf('_' + (members + 1)) > -1) {
      members++;
    }
  }


  for (var j = 1; j <= members; j++) {

    trStr += '<tr>';
    //加载成员
    for (var i = 0; i < param.length; i++) {

      var obj = param[i];
      trStr += '<td colspan="' + obj.colspan + '" style="text-align: center" >';
      //判断是否是是选择框
      if (obj.type === undefined || obj.type === null || obj.type === '') {
        obj.type = 'input';
      }
      if (obj.type === 'select') {
        trStr += '<select name="' + obj.id + '_' + dynamicTableRow + '" id="' + obj.id + '_' + dynamicTableRow + '"     ' + (obj.required ? ' required="true"  missingMessage="' + obj.name + '必须选择" ' : '') + '">';
        //添加选项
        for (var index = 0; index < obj.options.length; index++) {
          trStr += ' <option value="' + obj.options[index].value + '"  ' + (jsondata[obj.id + '_' + j] === obj.options[index].value ? 'selected = "selected"' : '') + '>' + obj.options[index].text + '</option>';
        }
        trStr += '</select>';

        //输入框
      } else if (obj.type === 'input' || obj.type === 'date' || obj.type === 'time') {
        trStr += '<input name="' + obj.id + '_' + dynamicTableRow + '" id="' + obj.id + '_' + dynamicTableRow + '" value="' + jsondata[obj.id + '_' + j] + '" size="' + obj.size + '"  ';


        //判断是否是日期框
        if (obj.type === 'date') {
          trStr += ' class="easyui-datebox"  editable="fasle"'
        }

        //判断是否是时间框
        if (obj.type === 'time') {
          trStr += ' class="easyui-datetimebox"  editable="fasle"'
        }


        //判断是否必选
        if (obj.required) {
          trStr += ' data-options="required:true"  missingMessage="' + obj.name + '必须填写" ';
        }

        //如果绑定选择器，则隐藏控件
        if (obj.select != '' && obj.select != null && obj.select != undefined) {
          trStr += ' style="display:none"  ';
        }

        //判断是否有验证
        if (obj.validateType != '' && obj.validateType != null && obj.validateType != undefined) {
          trStr += ' data-options="validType:\'' + obj.validateType + '\'"  ';
        }
        trStr += '  class="easyui-validatebox"/> ';
        //判断是否绑定选择器
        if (obj.select != '' && obj.select != null && obj.select != undefined) {
          if (obj.select === 'user') {
            trStr += '<span id="' + (obj.id + '_' + dynamicTableRow) + '_show">' + jsondata[obj.id + '_' + j+'_show'] + '</span>';
            trStr += '<a href="#" class="easyui-linkbutton l-btn l-btn-plain" plain="true" data-options="iconCls:\'icon-userbtn\'" onclick="seluser(\'' + (obj.id + '_' + dynamicTableRow) + '\',\'1\');return false;" group="" id=""><span class="l-btn-left"></span></a>';
          } else if (obj.select === 'department') {
            trStr += '<span id="' + (obj.id + '_' + dynamicTableRow) + '_show">' + jsondata[obj.id + '_' + j+'_show'] + '</span>';
            trStr += '<a href="#" class="easyui-linkbutton l-btn l-btn-plain" plain="true" data-options="iconCls:\'icon-pkg\'" onclick="seldept(\'' + (obj.id + '_' + dynamicTableRow) + '\',false);return false;" group="" id=""><span class="l-btn-left"></span></a>';
          }

        }
        trStr += obj.otherContent + '</td>';
      }
    }
    dynamicTableRow++;

  }
  trStr += '</tr>';
  tab.append(trStr);
  $.parser.parse('#dynamicTable');
}

/**
 * PC端初始化表头
 */
function initTableHeaderByPc(param){
  var html = "<tr class=\"tr_body\" style=\"text-align:center;\">";

  for(var i = 0 ; i <param.length; i++){
    html+="<td valign=\"middle\" rowspan=\"\" colspan=\""+param[i].colspan+"\" style=\"word-break: break-all;\" class=\"\">"+param[i].name+"</td>";
  }

  html+="</td></tr>";
  var header = $("#addBtn").parents("tr");
  header.after(html);


}


/**
 * 整合动态表单
 * @param startNodeId  流程的第一个节点ID
 * @param itemName  项目名称，展示在动态表单头部，如：临时人员
 * @param param   要添加列
 * @param isPc   是否PC端:    true  false
 * @constructor
 */
function mobileDynamicTable(startNodeId, itemName, param) {
  var isPc = !isMobile();

  if(isPc){
    initTableHeaderByPc(param)
  }else{
    $("#dynamicTable tr.firstRow td").attr("colspan","2");
  }
  if ($("#WF_CurrentNodeid").val() == startNodeId) {
    if (isPc) {
      callbackByPCTable(param);
    } else {
      callbackByMobileTable(param, itemName);
    }

    $("#addBtn").on("click", function () {
      if (isPc) {
        addTableByPC(param)
      } else {
        addTableByMobile(param, itemName);
      }

    });
    $("#deleteBtn").on("click", function () {

      if (isPc) {
        removeRowByPC();
      } else {
        removeRowByMobile(param);
      }

    });
  } else {
    $("#addBtn").hide();
    $("#deleteBtn").hide();
    if (isPc) {
      initTablePC(param)
    } else {
      initTableByMobile(param, itemName);
    }

  }

}
