/**
 * Created by Turbo on 2016/9/19.
 */

playStringArr = [];
RADIO_param = [];

isReqRadioStation = 0;
isReqRadioList = 0;
/**
 *  拿取url上的数据  去<em></em>标签
 *  @return {}.+数据
 */
var urlData = (function () {
    var obj = {},
    	deseg = decodeURIComponent(window.location.search),
    	deseg = deseg.replace(/<em>/g,'').replace(/<\/em>/g,''),
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


;$(function () {		
//	时间列表
	getDate();
	
   $('.contentList li').on('mouseenter',function () {
       $('.contentList li').removeClass('active');
       $(this).addClass('active')
   }).on('mouseleave',function () {
       $('.contentList li').removeClass('active');
   })
   
    $('#sel').on('change',function(){
		RADIO_param = $('#sel').val().split(' ');
   		getRadioList(RADIO_param[0],RADIO_param[1]);
   		$('#radio_selectOPTime').val(RADIO_param[1]);
   })  	
   	
   $('#radio_selectOPTime').on('change',function(){
   		RADIO_param = $('#sel').val().split(' ');
		getRadioList(RADIO_param[0],$('#radio_selectOPTime').val());  	
   })
   
   	$('.allPlay').on('click',function(){  		
		$pcApi.playMusics(playStringArr);  
		
   	})
   	$('.allAdd').on('click',function(){  		
		$pcApi.addMusic(playStringArr);  
		
   	})
	
//	弹窗事件
	$('#shadowClose').on('click',function(){
		$(this).parent().parent().hide();
	});
	$('.textBtn').on('click',function(){
		$(this).parent().parent().hide();
	});		
	
//  跳转节目台
	document.getElementById('searchBtn').onclick = function() {

		var searchVal = document.querySelector('.searchBox input').value,
			url = 'http://www.kuwo.cn/pc/tmpl/t_radio/radioSearch.html?searchVal=' + searchVal+'&t='+Math.random();
//			url = 'http://127.0.0.1:8020/radioProject/develop/t_radio/radioSearch.html?searchVal=' + searchVal+'&t='+Math.random();
		$pcApi.pageJumpOther(url);
	};
	document.querySelector('.searchBox input').onkeydown = function(e) {

		if(e.keyCode === 13) {
			var searchVal = document.querySelector('.searchBox input').value,
			url = 'http://www.kuwo.cn/pc/tmpl/t_radio/radioSearch.html?searchVal=' + searchVal+'&t='+Math.random();
//			url = 'http://127.0.0.1:8020/radioProject/develop/t_radio/radioSearch.html?searchVal=' + searchVal+'&t='+Math.random();
			$pcApi.pageJumpOther(url);
		}
	};
		
// 	电台列表数据  推荐电台数据
   	getRadioStation(); 
   
});

/**
 *   跳转界面
 */
function radioJumpPage(url){
    $pcApi.pageJumpOther(url);
}

/**
 *    获取  地点电台  数据
 */
function getRadioStation(){
	isReqRadioStation = isReqRadioStation+1;
	var url = "http://www.kuwo.cn/pc/radio/radioList";
	$.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        jsonp: "jpcallback",
        timeout:5000,
        jsonpCallback: "radio_Station",
    	success: function (data) {
//  		console.log(data);
    		$('.selectBox').show();
    		var StationStr = '';
    		if(data && data.status ===200 &&  data.data && data.data.radioResult !=null){

    			if(data.data.city=='' || data.data.city=='undefined'){
    				data.data.city = data.data.province;
    			}
//  			名字过长 处理
//				入口跳转
				if( urlData.goRadioName!=undefined && urlData.goRadioId!=undefined ){					
					StationStr +='<option value="'+urlData.goRadioId +' '+$('#radio_selectOPTime').val()+'">'+urlData.goRadioName +'</option>';    		
				}				
								
//				电台跳转
				if( urlData.id!=undefined && urlData.name!=undefined && urlData.dateTime!=undefined ){
					urlData.name = decodeURIComponent(urlData.name);
					StationStr +='<option value="'+urlData.id +' '+urlData.dateTime+'">'+urlData.name +'</option>';    		
					
				}
//				节目跳转				
				if(urlData.dateTime!=undefined && urlData.radioId!=undefined && urlData.radioName!=undefined && urlData.programName !=undefined ){
					urlData.radioName = decodeURIComponent(urlData.radioName);
					urlData.programName = decodeURIComponent(urlData.programName);
					StationStr +='<option value="'+urlData.radioId +' '+urlData.dateTime+'">'+urlData.radioName +'</option>';    		
				}

    			for (var i=0,len =data.data.radioResult.datas.length; i< len ; i++ ){
					if(urlData.goRadioName!=undefined){
	     				if(data.data.radioResult.datas[i].name==urlData.goRadioName){
	    					continue;
	    				}   										
					}
					
					if(urlData.name!=undefined){
	     				if(data.data.radioResult.datas[i].name==urlData.name){
	    					continue;
	    				} 						
					}

					if(urlData.radioName!=undefined){
	     				if(data.data.radioResult.datas[i].name==urlData.radioName){
	    					continue;
	    				}   						
					}

		            StationStr += '<option value="'+data.data.radioResult.datas[i].id +' '+data.data.radioResult.datas[i].dateTime+'">'+data.data.radioResult.datas[i].name +'</option>';    				
    			}   			
    			$('#sel').html(StationStr);
				$('#radio_Station').html(data.data.city);
  

				RADIO_param = $('#sel').val().split(' ');				
				getRadioList(RADIO_param[0],RADIO_param[1]);
  
    		}else{
    			console.log("getRadioStation error");
				$('.selectBox').hide();
    		}
    	},
    	error:function(){

    		console.log("getRadioStation error");
    		$('.selectBox').hide();

	    	if(isReqRadioStation<2){
		      	setTimeout(function(){
		    		getRadioStation(); 		
		    	},0);  		
	    	}else{
	    		loadErrorPage();    		
	    	}

    	}
   })
}



/**
 *    获取  radio list 数据
 * 还有一个判断条件  日期选择
 */
function getRadioList(radioId ,time){
	isReqRadioList = isReqRadioList+1;
	playStringArr = [];
var defaultHead = '<div class="content_1"><h3>00:00-音乐欣赏</h3><ul class="contentList clearfix">';
var defaultBoot = '</ul><div class="roller"></div></div></div>';
var url = 'http://www.kuwo.cn/pc/radio/plist?radioId='+radioId+'&time='+time;
    $.ajax({
        url: url,
        type: "get",
        dataType: "jsonp",
        jsonp: "jpcallback",
        jsonpCallback: "radio_List",
        timeout:5000,
    	success: function (data) {
//  		console.log(data);
   		
        if (data.status == 200) {
            var judge = true;
            var html = defaultHead;
            if(!data.data)data.data={};
            var programSongs = data.data.programSongs||[];

			var programLen =  programSongs.length;
			
            if (programLen == 0) {//无数据
//          	无电台如何处理

				console.log('无电台');
				
//				隐藏loading 显示弹框
				$('.noresult').show();
				$('#programList').hide();
				$('.loading').hide();
            }else{            	
                 
            var flag = true,
            	j = 0,
            	i,
            	oldcompare = "";
        
            for (i = 0; i < programLen; i++) {

            	var playString = createPlayString(programSongs[i]);
				playStringArr.push(playString);
            	
				var programSong = programSongs[i];
         
                if (programSong.type == "1") {
                    if (flag) {
                        var compare = programSong.compare.trim();
                        if (oldcompare == compare) {
                            if (i == (programSongs.length - 1)) {
                                flag = false;
                                html = html + defaultBoot;
                                break;
                            } else {
                                continue;
                            }
                        }
                        oldcompare = compare;
                        
                        judge = false;
                        var pay = 0;
                        var programSongFormat = programSongs[i].formats;

                        if (programSong.pay != null && programSong.pay != "") {
                            pay = programSong.pay;
                        }

                        html = html + '<li ondblclick="window.$pcApi.playMusic(\''+ playString +'\');">';
                        html = html + '<div class="name"><a title='+returnSpecialChar(programSongs[i].songName)+' href="javascript:;" onclick="window.$pcApi.playMusic(\''+ playString +'\')"><span class="time">'+programSongs[i].bTime.substring(11, programSongs[i].bTime.length-3)+'</span>'+returnSpecialChar(programSongs[i].songName)+'</a></div>';
                        html = html + '<div class="artist"><a title='+returnSpecialChar(programSongs[i].artist)+' onclick="$pcApi.jump2QuKuPage(\'ARTIST\',\''+programSong.artistId+'\', \''+programSong.artist +'\' ,\'\')" href="javascript:;">'+returnSpecialChar(programSongs[i].artist)+'</a></div>';
                        html = html + ' <div class="tools"><a title="添加歌曲" href="javascript:;" onclick="window.$pcApi.addMusicSingle(\''+ playString +'\')" class="add"></a>';
                        
                        if(pay != 0){
                        	html = html + '<a title="下载歌曲" class="down pay" href="javascript:;" onclick="window.$pcApi.downMusicSingle(\''+ playString +'\')"></a>';               	
                        }else{
                        	html = html + '<a title="下载歌曲" class="down" href="javascript:;" onclick="window.$pcApi.downMusicSingle(\''+ playString +'\')"></a>';   
                        }
                      	if(programSongFormat == null ){
                      		programSongFormat='';
                      	}
                        html = html + '<a class="more" title="更多操作" href="javascript:;" onclick="window.$pcApi.moreOperation(\''+ playString +'\')" ></a>';

                        if( programSongFormat && programSongFormat !='undefined' && programSongFormat && programSongFormat.indexOf('AL')>=0 ){                        	
                        	html = html + '</div><a title="选择试听音质" onclick="$pcApi.selQuality(\''+playString+'\' , \''+ programSongFormat +'\' );" href="javascript:;" class="musicTap" style="color:#e68b16;border:1px solid #e68b16">无损</a></li>';                       	
                        }else if(programSongFormat && programSongFormat.indexOf('MP3H') >=0 || programSongFormat.indexOf('MP3192') >=0  ){
                        	html = html + '</div ><a title="选择试听音质" onclick="$pcApi.selQuality(\''+playString+'\' , \''+ programSongFormat +'\' );" href="javascript:;" class="musicTap" style="color:#3ca7ee;border:1px solid #3ca7ee">超品</a></li>';
                        }else if( programSongFormat && programSongFormat.indexOf('WMA128') >=0){
                        	html = html + '</div ><a title="选择试听音质" onclick="$pcApi.selQuality(\''+playString+'\' , \''+ programSongFormat +'\' );" href="javascript:;" class="musicTap" style="color:#747474;border:1px solid #747474">高品</a></li>';
                        	
                        }else{
                        	html = html + '</div><a title="选择试听音质" onclick="$pcApi.selQuality(\''+playString+'\' , \''+ programSongFormat +'\' );" href="javascript:;" class="musicTap" style="color:#747474;border:1px solid #747474">流畅</a></li>';
                        }

                        if (i == (programSongs.length - 1)) {
                            flag = false;
                            html = html + defaultBoot;
                            break;
                        } else {
                            continue;
                        }
                    }
                }
                
                if (programSong.type == "0") {

                    j = 0;
                    if (flag) {

                        flag = false;
                        html = html + defaultBoot;
                    }
                    html = html + '<div class="content_1">';
                    html = html + '<h3>' + programSong.bTime + "-" + programSong.programName + '</h3>';
                    html = html + '<ul class="contentList clearfix">';
                }
                               
                ++i;
                for (; i < programLen; i++) {

				playString = createPlayString(programSongs[i]);			
				playStringArr.push(playString);
            	programSong = programSongs[i];               	
                    if (programSong.type == "1") {
                        var compare = programSong.compare.trim();
                        if (oldcompare == compare) {

                            continue;
                        }
                        oldcompare = compare;
                        judge = false;
                        var pay = 0;
                        var programSongFormat = programSongs[i].formats || "";

                        if (programSong.pay != null && programSong.pay != "") {
                            pay = programSong.pay;
                        }
                        
                        html = html + '<li ondblclick="window.$pcApi.playMusic(\''+ playString +'\');">';
                        html = html + '<div class="name"><a title='+returnSpecialChar(programSongs[i].songName)+' href="javascript:;" onclick="window.$pcApi.playMusic(\''+ playString +'\')"><span class="time">'+programSongs[i].bTime.substring(11, programSongs[i].bTime.length-3)+'</span>'+returnSpecialChar( programSongs[i].songName)+'</a></div>';
                        html = html + '<div class="artist"><a title='+returnSpecialChar( programSongs[i].artist)+' onclick="$pcApi.jump2QuKuPage(\'ARTIST\',\''+programSong.artistId+'\', \''+programSong.artist +'\' ,\'\')" href="javascript:;">'+returnSpecialChar( programSongs[i].artist)+'</a></div>';
                        html = html + ' <div class="tools" data-music=""><a title="添加歌曲" href="javascript:;" onclick="window.$pcApi.addMusicSingle(\''+ playString +'\')" class="add"></a>';
                        
                        if(pay != 0){

                        	html = html + '<a title="下载歌曲" class="down pay" href="javascript:;" onclick="window.$pcApi.downMusicSingle(\''+ playString +'\')"></a>';               	
                        }else{
                        	html = html + '<a title="下载歌曲" class="down" href="javascript:;" onclick="window.$pcApi.downMusicSingle(\''+ playString +'\')"></a>';   
                        }
                      
                        html = html + '<a title="更多操作" class="more" href="javascript:;" onclick="window.$pcApi.moreOperation(\''+ playString +'\')" ></a>';
                        
                        if( programSongFormat !='undefined' && programSongFormat.indexOf('AL')>=0 ){                        	
                        	html = html + '</div><a title="选择试听音质" onclick="$pcApi.selQuality(\''+playString+'\' , \''+ programSongFormat +'\' );" href="javascript:;" class="musicTap" style="color:#e68b16;border:1px solid #e68b16">无损</a></li>';                       	
                        }else if(programSongFormat.indexOf('MP3H') >=0 || programSongFormat.indexOf('MP3192') >=0  ){
                        	html = html + '</div ><a title="选择试听音质" onclick="$pcApi.selQuality(\''+playString+'\' , \''+ programSongFormat +'\' );" href="javascript:;" class="musicTap" style="color:#3ca7ee;border:1px solid #3ca7ee">超品</a></li>';
                        }else if(programSongFormat.indexOf('WMA128') >=0){
                        	html = html + '</div ><a title="选择试听音质" onclick="$pcApi.selQuality(\''+playString+'\' , \''+ programSongFormat +'\' );" href="javascript:;" class="musicTap" style="color:#747474;border:1px solid #747474">高品</a></li>';
                        	
                        }else{
                        	html = html + '</div><a title="选择试听音质" onclick="$pcApi.selQuality(\''+playString+'\' , \''+ programSongFormat +'\' );" href="javascript:;" class="musicTap" style="color:#747474;border:1px solid #747474">流畅</a></li>';
                        }
                        
                        j++;
                    } else {
                        --i;
                        oldcompare = "";
                        break;
                    }
                }
                html = html + '</ul>';
                html = html + '<div class="roller"></div></div>';
                html = html + '</div>';
            }
			$('#programList').show();
			$('#programList').html(html);   
			$('.noresult').hide();

            //添加左侧轴线

            $('.radio_content').find('ul').each(function () {
                var lineNum = Math.round($(this).children().length );	

				if( lineNum==0 ){
					$(this).parent().remove();
					
				}
				var $rollerDom =  $(this).parent().find('.roller');
                for (var i = 0; i < lineNum ; i++) {
                    $rollerDom.append('<div class="roller_line"></div><div class="roller_point"></div>');
                }
                $(this).parent().find('.roller_point').remove('.roller_point:last-child');
            });

			$('.loading').hide();

   			}
//          长度的if          
			setTimeout(function(){
				if( urlData.radioId!=undefined && urlData.radioName!=undefined && urlData.programName !=undefined ){
					triggerPoint(urlData.programName );

				}
				
			},0)
            
        } else {
            console.log("服务器异常");
        }        
    },
    error:function(){
    	if(isReqRadioList<2){
	      	setTimeout(function(){
	    		getRadioList(radioId ,time)   		
	    	},2);  		
    	}else{
    		loadErrorPage();    		
    	}


    },
	complete:function(){
	   $('.contentList li').on('mouseenter',function () {
	       $('.contentList li').removeClass('active');
	       $(this).addClass('active')
	   }).on('mouseleave',function () {
	       $('.contentList li').removeClass('active');
	   })
    }
})
    
    
}

function musicNowPlaying(){
	
}

/**
 *    获取本地日期数据 时间列表数据
 */


function getDate(){
	var getDateStr = '',
		oDate = new Date(),
		oYear = oDate.getFullYear(),
		oMonth = oDate.getMonth()+1,
		oDay = oDate.getDate(),
		i,
		iDay,iYear,iMonth,formateTime;
		

	for( i=0;i<=6;i++){
		 iDay = getYesterDay(oDate,i);
	     iYear = iDay.getFullYear();    
	     iMonth = iDay.getMonth()+1;
	     iDay = iDay.getDate();
	     formateTime = iYear+'-'+toDouble(iMonth)+'-'+toDouble(iDay);	
	getDateStr +='<option value="'+iYear+'-'+toDouble(iMonth)+'-'+toDouble(iDay)+'">'+iYear+'年'+toDouble(iMonth)+'月'+toDouble(iDay)+'日</option>'
	 	
	}
	$('#radio_selectOPTime').html(getDateStr);
}

function getYesterDay(date,n){      
    var yesterday_ms=date.getTime()-1000*60*60*24*n,     
    	yesterday = new Date();       
    yesterday.setTime(yesterday_ms);       
    return yesterday;
} 

function toDouble(num){
	return num<10?'0'+num:num;
}


/**
 *   锚点 fn  通过offset 实现
 */


function triggerPoint(programName) {
//	让url上的数据不再生效
	urlData = '';
	
    if (programName == "radio") {
        return;
    }
    var len = $('.content_1').length;
    var tagName = '',
    	program = '';
    for (var i = 0; i < len; i++) {
        var content = $('.content_1').eq(i);
        if (content.is(":hidden"))continue;
        program = content.find("h3").html();
        tagName = program.substring(program.indexOf('-') + 1);
        if (programName == tagName) {
            var pos = content.offset().top - 20;
            $('html,body').animate({scrollTop: pos + 'px'}, 800);
            return;
        } else {
            continue;
        }
    }
    //  弹框处理

	$('#shadowBox').show();
}

/**
 *    在网页中显示字符串中的特殊字符
 */

function returnSpecialChar(s){
    s = ''+s;
	return s.replace(/\&amp;/g,"&").replace(/\&nbsp;/g," ").replace(/\&apos;/g,"'").replace(/\&quot;/g,"\"").replace(/\%26apos\%3B/g,"'").replace(/\%26quot\%3B/g,"\"").replace(/\%26amp\%3B/g,"&").replace(/‘/g,'\'').replace(/，/,',').replace(/ /g,'&nbsp;');
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
 *    刷新页面
 */
function OnRefresh(param) {
//	待测试
	if(!$('.loading').is(':hidden')){
		window.location.reload();
	}

    $("#programList").html('');
	$('.loading').show();
	RADIO_param = $('#sel').val().split(' ');
	getRadioList(RADIO_param[0],$('#radio_selectOPTime').val());
    
}


/**
 * 创建歌曲播放参数   针对广播电台
 *
 * 歌手 专辑 sig1 sig2 歌曲ID mp3sig1 mp3sig2 mp3rid mkvnsig1  mkvnsig2  mkvrid  hasecho
 pscr  format  多版本  弹幕  付费表示  歌手ID  专辑ID  
 */

function createPlayString(song) {
    var paramsArr = [];
    paramsArr[paramsArr.length] = encodeURIComponent(encodeURIComponent(song.songName));
    paramsArr[paramsArr.length] = encodeURIComponent(encodeURIComponent(song.artist));
    paramsArr[paramsArr.length] = encodeURIComponent(encodeURIComponent(song.ablum));
    paramsArr[paramsArr.length] = song.nsig1;
    paramsArr[paramsArr.length] = song.nsig2;
    paramsArr[paramsArr.length] = song.musicId;
    paramsArr[paramsArr.length] = song.mp3Nsig1;
    paramsArr[paramsArr.length] = song.mp3Nsig2;
    paramsArr[paramsArr.length] = song.mp3Rid;
    paramsArr[paramsArr.length] = song.mkvnsig1 || 0;
    paramsArr[paramsArr.length] = song.mkvnsig2 || 0;
    paramsArr[paramsArr.length] = 0;
    paramsArr[paramsArr.length] = song.hasecho || 1;
    paramsArr[paramsArr.length] = '555';
    paramsArr[paramsArr.length] = song.formats;
    paramsArr[paramsArr.length] = song.muti_ver || 0;
    paramsArr[paramsArr.length] = song.is_point || 0;
    paramsArr[paramsArr.length] = song.pay;
    paramsArr[paramsArr.length] = song.artistId;
    paramsArr[paramsArr.length] = song.albumId;
    return paramsArr.join('\t');
}

/**
 *   加载失败时显示error页面
 */

function loadErrorPage(){
    $("body").css("background-color","#fafafa");
    $("body").html('');
    $("body").html('<div id="l_loadfail" style="display:block; height:100%; padding:0; top:0;"><div class="loaderror"><img src="../static/img/t_radio/jiazai.jpg" /><p>网络似乎有点问题 , <a hidefocus href="###" onclick="window.location.reload();return false;">点此刷新页面</a></p></div></div>');
}


