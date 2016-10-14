var serverValNow ="" ;
var isFirstTap = 'true';
//  在完成中回调
var isProgramComplice = false;
var isRadioComplice = false;
/**
 *  拿取url上的数据
 *  @return {}.+数据
 */
var urlData = (function () {
    var obj = {},
    	deseg = decodeURIComponent(window.location.search),
        seg = deseg.replace(/^\?/, '').split('&'),
        len = seg.length, i = 0, s;
    for (; i < len; i++) {
        if (!seg[i]) {
            continue;
        }
        s = seg[i].split('=');
        obj[s[0]] = s[1];
    }
    return obj;
})();

console.log(urlData);
if(urlData.isFirstTap != undefined){
	isFirstTap = urlData.isFirstTap;	
}





$(function () {
//	搜索
   $.kw_page.load({
        module : "recommend",
        url : "http://www.kuwo.cn/pc/radio/recommend",
        dataType : "jsonp",
        rows : 9,
        type : "get",
        keyMapper:{pagenum : "currPage"},
        init : function(module, gp, pageNum){
        },
        after : function(module, gp, data){
			if(data && data.data.pv && data.data.pv!='undefined'){
				$('#searchNum').html(data.data.pv);
			}
        },
        pageFormat:function(result){
        	console.log(result);
			if(result && result.data && result.data!=null){
				var formatData = {};
				for(var i=0,resultLen=result.data.radioResult.datas.length; i< resultLen ;i++ ){
					result.data.radioResult.datas[i].oldName = result.data.radioResult.datas[i].name;					
				}
				
				if(result.data.radioResult){
					formatData.list = result.data.radioResult.datas;					
				}
				formatData.pages = result.data.radioTotal;
				formatData.total = result.data.radioCnt;
				return formatData;				
			}else{
//				点击刷新
				window.location.reload();
			}
		}
    });
    
   $.kw_page.load({
        module : "radio_search",
        url : "http://www.kuwo.cn/pc/radio/searchRadio",
        dataType : "jsonp",
        rows : 9,
        type : "get",
        initState : function(module, gp, pageNum){
			var words = $("#inp").val();
			return {words:words};
        },
        after : function(module, gp, data){	      	
			if(data && data.data.pv && data.data.pv!='undefined'){
				$('#searchNum').html(data.data.pv);
			}
			$("#radioCnt").html("搜索电台("+gp.total+")");
		//			显示空电台

				
			if(parseInt(gp.total) <= 9){
				$('#radioSearchPage').hide();
			}else{
				$('#radioSearchPage').show();
			}
				
			isRadioComplice = true;
			if(isRadioComplice && isProgramComplice ){
//				处理显示情况
//				请求结束函数
				getRadioDataComFn();				
			}
			
//			if( !gp.total ){
//	                // 隐藏                
//				if($('#radioCnt').hasClass('active')){					
//					$(".searchNoneBox").show();												
//				}else{		
//					$('.choseProgram li').length > 0?$("#program_search").show():$(".searchNoneBox").show();
//				}
//			}else{
//				if($('#radioCnt').hasClass('active')){
//					$("#radio_search").show();
//				}else{
//					$("#program_search").show();
//				}
//				
//			}
	
			
        },
        pageFormat:function(result){        	
			if(result && result.data!=null   ){
				var formatData = {};
				if( result.data.radioResult.datas && result.data.radioResult.datas !=undefined ){
					for(var i=0,resultLen=result.data.radioResult.datas.length; i< resultLen ;i++ ){
						result.data.radioResult.datas[i].oldName = result.data.radioResult.datas[i].name;
						
						result.data.radioResult.datas[i].name = searchReplaceAll(result.data.radioResult.datas[i].name);

						
					}				
				}
				formatData.list = result.data.radioResult.datas;
				formatData.pages = result.data.radioTotal;
				formatData.total = result.data.radioCnt;
				return formatData;				
			}else{
//				点击刷新
				window.location.reload();				
			}
		}
    });
    
   $.kw_page.load({
        module : "program_search",
        url : "http://www.kuwo.cn/pc/radio/searchProgram",
        dataType : "jsonp",
        rows : 9,
        type : "get",
        initState : function(module, gp, pageNum){
			var words = $("#inp").val();
			return {words:words};
        },
        after : function(module, gp, data){
			$("#programCnt").html("搜索节目("+gp.total+")");	
			if(parseInt(gp.total) < 9){
				$('#programSearchPage').hide();
			}else{
				$('#programSearchPage').show();
			}

			isProgramComplice = true;
			if(isRadioComplice && isProgramComplice){
				getRadioDataComFn();
			}

        },
        pageFormat:function(result){  

			if(result && result.data!=null){
				var formatData = {};	
				if(result.data.programResult.datas&& result.data.programResult.datas!=undefined ){
					for(var i=0,resultLen=result.data.programResult.datas.length; i< resultLen ;i++ ){			
						result.data.programResult.datas[i].oldName = result.data.programResult.datas[i].name;
						
						result.data.programResult.datas[i].name = searchReplaceAll(result.data.programResult.datas[i].name)

						result.data.programResult.datas[i].radioName = searchReplaceAll(result.data.programResult.datas[i].radioName)
					}					
				}
				formatData.list = result.data.programResult.datas;
				formatData.pages = result.data.programTotal;
				formatData.total = result.data.programCnt;
				return formatData;			
			}else{
	//				点击刷新
					window.location.reload();				
			}
		}
    });

//  绑定事件
	setEventFn();
//  带值过来的情况

    if( urlData.searchVal && decodeURIComponent(urlData.searchVal)!='' ){
		$("#inp").val(decodeURIComponent(urlData.searchVal));	
 
    		initBox();
			$.kw_page.gotoPage("radio_search", 1, true);
			$.kw_page.gotoPage("program_search", 1, true);	

    }else{
//  	走推荐
		$.kw_page.gotoPage("recommend", 1, true);
    	
    }

});

/**
 *   电台和节目请求结束处理
 * 
 */
function getRadioDataComFn(){
	initBox();
	$(".navTab").show();
	
	if(isFirstTap=='true'){
		$($('.navTab a').get(0)).addClass('active');
		$("#radio_search").show();
		if($('.choseStation li').length<=0){
			$(".searchNoneBox").show();
		}

	}else{
		$("#program_search").show();
		$($('.navTab a').get(1)).addClass('active');
		if($('.choseProgram li').length<=0){
			$(".searchNoneBox").show();
		}
	}


		

}


/**
 *   跳转界面
 * 
 */
function radioJumpPage(url){
    $pcApi.pageJumpOther(url);
}


/**
 * 事件处理函数
 * 
 */
function setEventFn(){
	//	按键事件
	$('#inp').on('keyup', function (ev) {
        var ev = ev || event;
        if (ev && ev.keyCode == 13) {
        	$("#searchBtnClick").click();
        }
    });

 	$("#searchBtnClick").on('click',function(){	
		var inpVal = document.getElementById('inp').value;
//		默认显示第一个
		serverValNow = inpVal;
		initBox();

		if(inpVal.length <= 0){
//			显示推荐页				
			if($('.recommendOl li').length=='undefined' || $('.recommendOl li').length < 1  ){
				$.kw_page.gotoPage("recommend", 1, true);
			}				
			$("#recommend").show();							
		}else{			
			$.kw_page.gotoPage("radio_search", 1, true);
			$.kw_page.gotoPage("program_search", 1, true);								

		}
		
			jumpUrl = 'http://127.0.0.1:8020/radioProject/develop/t_radio/radioSearch.html?searchVal=' + serverValNow+'&isFirstTap='+isFirstTap+'&t='+Math.random();
			$pcApi.pageJumpOther(jumpUrl,false);
	})
	
	   // tab 切换
    $('.navTab a').on('click',function () {
		var inpVal = document.getElementById('inp').value;
//		默认显示第一个
		serverValNow = inpVal;
		
    	var jumpUrl = '';
    	initBox();
        $(".navTab").show();
        if($(this).index()){
//      	节目
			isFirstTap = 'false';
			jumpUrl = 'http://127.0.0.1:8020/radioProject/develop/t_radio/radioSearch.html?searchVal=' + serverValNow+'&isFirstTap='+isFirstTap+'&t='+Math.random();
			$pcApi.pageJumpOther(jumpUrl,false);
			$("#program_search").show();
			if($('.choseProgram li').length<=0){
				$(".searchNoneBox").show();
			}

	
        }else{
        	isFirstTap = 'true';
//      	电台
			jumpUrl = 'http://127.0.0.1:8020/radioProject/develop/t_radio/radioSearch.html?searchVal=' + serverValNow+'&isFirstTap='+isFirstTap+'&t='+Math.random();
			$pcApi.pageJumpOther(jumpUrl,false);
			$("#radio_search").show();
			if($('.choseStation li').length<=0){
				$(".searchNoneBox").show();
        	}
        }
        $(this).addClass('active');
    });
}

/**
 *    初始化函数  全部隐藏
 */
function initBox(){
	$("#radio_search").hide();
	$(".searchNoneBox").hide();
	$("#program_search").hide();
	$("#recommend").hide();
	$(".navTab").hide();	
	$('.navTab a').removeClass('active');
}

/**
 *    返回顶部按钮
 */

function returnTop() {
    $("body").animate({scrollTop: 0}, 500);
}

$(window).scroll(function () {
    var $backTop = $('.backTop');
    if ($('body').scrollTop() >= 150) {
        $backTop.show();
    } else {
        $backTop.hide();
    }
});


/**
 * 刷新页面
 */
function OnRefresh(param) {
    window.location.reload();
}

/**
 * 图片加载失败显示默认图片
 */
function errorimg(obj,defimg){
    obj.src="http://image.kuwo.cn/mpage/html5/2016/default.png";
}

/**
 * 文字高亮
 */

function searchReplaceAll(s){
	var searchKey = $('#inp').val() ||'',
		returndata = s,
		keys,
		sss,
		skey;

	if(searchKey.indexOf("\\")>-1){
		return returndata;
	}else{
		keys = searchKey.split(' ');
		sss = "(";
		skey;
		for(var i=0,len=keys.length;i<len;i++){
		    skey = keys[i];
		    skey = skey.replace(/\(/g,"\\(").replace(/\)/g,"\\)");
			if(skey!=''){
				sss +=(skey+"|");
			}
		}
		sss = sss.substr(0,sss.length-1);
		sss += ")";

		try{
			returndata = returndata.replace(new RegExp(sss,"gi"),"<em>$1</em>");
		}catch(e){
			
		}		
		return returndata;
	}
}

/**
 *   加载失败时显示error页面
 */
function loadErrorPage(){
    $("body").css("background-color","#fafafa");
    $("body").html('');
    $("body").html('<div id="l_loadfail" style="display:block; height:100%; padding:0; top:0; "><div class="loaderror"><img src="../static/img/t_radio/jiazai.jpg" /><p>网络似乎有点问题 , <a hidefocus href="###" onclick="window.location.reload();return false;">点此刷新页面</a></p></div></div>');
}

