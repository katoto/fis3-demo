/**
 * Created by Luger on 2016/6/28.
 */
// SERVER_URL = "http://60.29.226.189:9001";
SERVER_URL = "http://www.kuwo.cn";
// SERVER_URL = "http://172.17.70.9:8080";
(function (window) {
    var api = {};
    var albumName = "";//专辑名字用于iplay全部播放
    var userStateString = "";
    var version = "";

    api.callClient =function(call){
        try{
            return window.external.callkwmusic(call);
        }catch(e){
            return 0;
        }
    }

    function getUserStateString(){
        return api.callClient("UserState?src=user")
    }

    function webLog(s){
        api.callClient("Log?msg="+encodeURIComponent(s));
    }

    // 获取某个字符串中 key对应的value getValue("xxx?a=b","a")=b
    api.getValue = function(url,key){
        url = url.toString();
        if(url.indexOf('#')>=0){
            url = url.substring(0,url.length-1);
        }
        var value='';
        var begin = url.indexOf(key + '=');
        if(begin>=0){
            var tmp = url.substring(begin + key.length + 1);
            var eqIdx = tmp.indexOf('=');
            var end = 0;
            if(eqIdx>=0){
                tmp = tmp.substring(0,eqIdx);
                end = tmp.lastIndexOf('&');
            }else{
                end = tmp.length;
            }
            if(end>=0){
                try{
                    value = decodeURIComponent(tmp.substring(0,end));
                }catch(e){
                    value = tmp.substring(0,end);
                }
            }else{
                try{
                    value = decodeURIComponent(tmp);
                }catch(e){
                    value = tmp;
                }
            }
        }
        return value;
    }

    api.getUid = function(){
        var uid = api.getValue(getUserStateString(),"uid");
        if(uid == ""){
            uid = 0;
        }
        return uid;
    };
    api.getKid = function(){
        var kid = api.getValue(getUserStateString(),"devid");
        console.log(kid)
        if(kid == ""){
            kid = 0;
        }
        return kid;
    };
    api.getSid = function(){
        var sid = api.getValue(getUserStateString(),"sid");
        if(sid == ""){
            sid = 0;
        }
        return sid;
    };

    api.getUname = function () {
        var uName = api.getValue(getUserStateString(),"name");
        return uName;
    };

    api.getNickName = function () {
        var nickName = api.getValue(getUserStateString(),"showname");
        return nickName;
    };

    api.getPwd = function () {
        var pwd = api.getValue(getUserStateString(),"pwd");
        return pwd;
    };

    api.getVersion = function(){
        if(version==""){
            version = api.callClient("GetVer");
        }
        return version;
    };
    api.getUserPlaylist = function(){
        return api.callClient("UserPlayList");
    };
    /**
     * 保存数据到客户端
     * @param key
     * @param value
     * @param outTime
     */
    api.save2Cache = function (key, value, outTime) {
        api.callClient("SetCache?key="+encodeURIComponent(key)+"&time="+outTime+"\r\n"+value);
    };
    /**
     * 从客户端缓存中取数据
     * @param key
     * @returns {*}
     */
    api.getFromCache = function (key) {
        var cacheValue = api.callClient("GetCache?key="+encodeURIComponent(key));
        if(typeof(cacheValue)!="undefined" && cacheValue!=""){
            return cacheValue;
        }
        return "";
    };

    /**
     * 读取配置文件中配置项的方法
     * @param section
     * @param key
     * @returns {string}
     */
    api.getDataByConfig = function (section,key){
        if(typeof(section)=="undefined"||section==""||section==null){
            section='optionPre';
        }
        var configValue = api.callClient("GetConfig?Section="+encodeURIComponent(section)+"&key="+encodeURIComponent(key));
        var data = "";
        if(typeof(configValue)!="undefined" && configValue!=""){
            try{
                data = configValue;
            }catch(e){
                webLog("getDataByConfig:"+e.message+":"+e.name);
            }
        }
        return data;
    };

    api.setData2Config = function (section,key,dataValue){
        try{
            if(typeof(section)=="undefined"||section==""||section==null){
                section='optionPre';
            }
            if(typeof(dataValue)!="undefined"&&dataValue!=null){
                api.callClient("SetConfig?Section="+encodeURIComponent(section)+"&Key="+encodeURIComponent(key)+"&Value="+encodeURIComponent(dataValue));
            }
        }catch(e){
            webLog("setDataToConfig:"+e.message);
        }
    };

    /**
     * 调用系统默认浏览器打开url
     * @param url
     */
    api.open = function(url){
        if(url.indexOf("http://")<0){
            url = "http://" + url;
        }
        var backstr = api.callClient("OpenBrowser?browser=default&url="+encodeURIComponent(url));
        if(backstr!=1){
            window.open(url);
        }
    };

    /**
     * 播放歌曲
     * musicParams是个list每个item的格式为(String类型)：
     * 歌手
     *
     * 上面的信息用tab（\t）分割开
     * @param musicSize
     * @param musicParam
     */

    api.playMusics = function(musicParamArr){
        var musicSize = musicParamArr.length;
        var musicParams='';
        for(var i = 0; i < musicSize; i++){
            musicParams += '&s' + (i+1)+ '=' + musicParamArr[i];
        }
        api.callClient("Play?mv=0&n=" + musicSize + musicParams);
    };

    /**
     * 播放单曲
     * @param musicParam
     */
    api.playMusic = function(musicParam){

        musicParam = decodeURIComponent(musicParam);
        api.callClient("Play?mv=0&n=1" + "&s1=" + encodeURIComponent(musicParam));
    };

    /**
     * adds
     * @param musicParam
     */
    api.addMusic = function(musicParamArr){

        var musicSize = musicParamArr.length;
        var musicParams='';
        for(var i = 0; i < musicSize; i++){
            musicParams += '&s' + (i+1)+ '=' + musicParamArr[i];
        }
        api.callClient("AddTo?mv=0&n=" + musicSize + musicParams);
    };

    /**
     * add   添加单曲
     * @param musicParam
     */
    api.addMusicSingle = function(musicParam){
        musicParam = decodeURIComponent(musicParam);
        api.callClient("AddTo?mv=0&n=1" + "&s1=" + encodeURIComponent(musicParam));
       
    };
    
    /**
     * downloads
     * @param musicParam
     */
    api.downMusic = function(musicParamArr){
        var musicSize = musicParamArr.length;
        var musicParams='';
        for(var i = 0; i < musicSize; i++){
            musicParams += '&s' + (i+1)+ '=' + musicParamArr[i];
        }
        api.callClient("Down?mv=0&n=" + musicSize + musicParams);
    };
    
    /**
     * download  下载单曲
     * @param musicParam
     */	
    api.downMusicSingle = function(musicParam){
        musicParam = decodeURIComponent(musicParam);
        api.callClient("Down?mv=0&n=1" + "&s1=" + encodeURIComponent(musicParam));
       
    };
    /**
     * 更多操作   显示更多等信息
     * @param musicParam
     */	     
     api.moreOperation = function(musicParam){
        musicParam = decodeURIComponent(musicParam);
        api.callClient("ShowOperation?song="+ encodeURIComponent(musicParam));
       
    };   


    
    
    api.jump2MyPage = function(uid,vuid){
        if(!vuid){
            vuid = uid;
        }
        var url = SERVER_URL+'/pc/my/index?uid=' + uid + '&vuid='+vuid;
        api.callClient('Jump?channel=my&url=' + encodeURIComponent(url) );
    };

    api.pageJumpOther = function( url,flag){

        if(typeof(flag)==="undefined"||flag===null|| flag===''){
            flag='true';
        }
        var param = '';
        param={'souces':'myhomepage'};
        var channelInfo ='my';
        channelInfo = 'ch:3;name:myhomepage;';
        var call = "PageJump?param="+encodeURIComponent(param) + ";" + encodeURIComponent(channelInfo)+ ";" +encodeURIComponent('url:'+url)+'&calljump='+flag;
        api.callClient(call);
    };

    api.jump2MyOtherPage = function(url){
        api.callClient('Jump?channel=my&url=' + encodeURIComponent(url) );
    };

    /**
     * 跳转曲库歌手页
     * @param  type:ALBUM,ARTIST id:sourceid artist:歌手名 albumName:专辑名字
     */
    api.jump2QuKuPage = function(type,id,artist,albumName){
        if(!id||id==0) {
            id="client";
        }
        var p = '';
        var channelInfo = "('ch:10003;name:artist;')";
        var src ='';
        var info = '';
        if(type=="ALBUM") {
            var name = encodeURIComponent(artist+'|'+albumName);
            info = 'source=13&sourceid='+id+'&name='+name+'&id=13&other="|psrc=歌手->|bread=-2,4,歌手,0"';
            src = 'content_album.html?'+info;
            p = 'Jump?channel=artist&param={\'source\':\'13\',\'sourceid\':\''+id+'\',\'name\':\''+name+'\',\'id\':\'13\'};' + encodeURIComponent('url:${netsong}'+src) + ';' + encodeURIComponent('jump:'+channelInfo);
        }else if(type=="ARTIST") {
            info = 'source=4&sourceid='+id+'&name='+name+'&id=13&other="|psrc=歌手->|bread=-2,4,歌手,0"';
            src = 'content_artist.html?'+info;
            p = 'Jump?channel=artist&param={\'source\':\'4\',\'sourceid\':\''+id+'\',\'name\':\''+name+'\',\'id\':\'13\'};' + encodeURIComponent('url:${netsong}'+src) + ';' + encodeURIComponent('jump:'+channelInfo);
        }else if(type == "index"){
            channelInfo = "ch:2;name:songlib;";
            p = 'Jump?channel=songlib&param={\'source\':\'0\',\'qkback\':\'true\'};' + encodeURIComponent('url:${netsong}quku.html') + ';' + encodeURIComponent('jump:'+channelInfo);
        }
        if(p){api.callClient(p);}
    };


    /**
     * 读取配置文件中配置项的方法
     * @param  Section-->配置文件里的[config] key-->对应[config]里要取的key
     */
    api.getDataByConfig = function(Section,key){
        var configValue = api.callClient("GetConfig?Section="+encodeURIComponent(Section)+"&key="+encodeURIComponent(key));
        var data = "";
        if(typeof(configValue)!="undefined" && configValue!=""){
            try{
                data = configValue;
            }catch(e){
                webLog("getDataByConfig:"+e.message+":"+e.name);
            }
        }
        return data;
    }


    api.iPlayPSRC = '';//psrc
    api.MUSICLISTOBJ = {};//用于存储歌曲信息
    /**
     * 专辑iplay播放
     * @param evt 事件对象，sourceid 资源id，obj 当前对象
     */
    api.iPlay = function(evt,sourceid, obj) {
        var iplaynum = 100;
        api.iPlayPSRC = obj.getAttribute("data-ipsrc");
        var url = "http://search.kuwo.cn/r.s?stype=albuminfo&albumid=" + sourceid + "&show_copyright_off=1&alflac=1&vipver="+api.getVersion();
        request(url,'jsonp',playAlbumMusic);
        evt.stopPropagation();
    }

    /**
     * ajax二次请求封装
     * @param url 地址，type 请求类型，callback 回调函数，options 回调参数
     */
    function request(url,type,callback,options){
        $.ajax({
            url:url,
            dataType:type,
            success:function(data){
                if(options){
                    callback(data,options);
                }else{
                    callback(data);
                }
            }
        });
    }

    /**
     * iplay播放专辑回调
     * @param jsondata 数据
     */

    function playAlbumMusic(jsondata) {
        var data = jsondata;
        if (typeof (data) == "undefined" || data == null || typeof (data.musiclist) == "undefined") {
            return;
        }
        var musicList = data.musiclist;
        var musicSize = musicList.length;
        var artistid = data.artistid;
        var albumid = data.albumid;
        albumName = data.name;
        for (var i = 0; i < musicSize; i++) {
            musicList[i].artistid = artistid;
            musicList[i].albumid = albumid;
        }
        var bigString = "";
        bigString = getAlbumMusicInfo(musicList);
        api.callClient("Play?mv=0&n=" + musicSize + bigString);
    }

    /**
     * 获取专辑歌曲信息
     * @param objs 数据
     */
    function getAlbumMusicInfo(objs) {
        var musicList = objs;
        var musicSize = musicList.length;
        var bigString = "";
        var bigarray = [];
        var someObj;
        var musicString="";
        var sarray;
        var si;
        for (var i = 0; i < musicSize; i++) {
            someObj = musicList[i];
            musicString = api.getAlbumMusicInfo(someObj);
            // musicString = api.getMusicInfoNew(someObj.id);

            sarray = [];
            si = 0;
            sarray[si++] = '&s';
            sarray[si++] = (i + 1);
            sarray[si++] = '=';
            sarray[si++] = musicString;
            bigarray[bigarray.length] = sarray.join('');
            sarray = null;
        }

        bigString = bigarray.join('');

        musicList = null;
        return bigString;
    }

    /**
     * 获取歌曲信息 并存MUSICLISTOBJ歌曲信息对象
     * @param obj 数据
     */
    api.getAlbumMusicInfo = function(obj){
        var psrc = '个人主页->上传的->';
        psrc = encodeURIComponent(psrc);
        var param = obj.param;
        param = returnSpecialChar(param);
        var paramArray = param.split(";");
        var childArray = [];
        var childi = 0;
        childArray[childi++] = encodeURIComponent(returnSpecialChar(obj.name));
        childArray[childi++] = encodeURIComponent(returnSpecialChar(obj.artist));
        childArray[childi++] = encodeURIComponent(returnSpecialChar(albumName));;
        for(var j=3;j<paramArray.length;j++){
            childArray[childi++] = paramArray[j];
        }
        var musicString = childArray.join('\t');
        childArray = null;
        var musicstringarray = [];
        musicstringarray[musicstringarray.length] = musicString;
        musicstringarray[musicstringarray.length] = psrc;
        musicstringarray[musicstringarray.length] = obj.formats;
        musicstringarray[musicstringarray.length] = obj.muti_ver;
        musicstringarray[musicstringarray.length] = obj.is_point;
        musicstringarray[musicstringarray.length] = obj.pay;
        musicstringarray[musicstringarray.length] = obj.artistid||0;
        musicstringarray[musicstringarray.length] = obj.albumid||0;
        musicString = musicstringarray.join('\t');
        musicstringarray = null;
        musicString = encodeURIComponent(musicString);
        api.MUSICLISTOBJ[obj.rid] = musicString;
        return musicString;
    };
    //   统计pv 和uv
    api.picLog = function (clickFlag){
        window.setTimeout(function(){
            var playclick = new Image();
            playclick.src="http://webstat.kuwo.cn/logtjsj/commsj/commjstj/www2016/" + clickFlag + ".jpg";
        },300);
    };

    api.getMusicInfo = function(musicid){
        var psrc = '个人主页->上传的->';
        psrc = encodeURIComponent(psrc);
        if(!api.MUSICLISTOBJ[musicid]){
            $.ajax({
                url:"http://www.kuwo.cn/music/pcPlayParam?musicId="+musicid+"&psrc="+psrc,
                dataType:"jsonp",
                jsonp:"jpcallback",
                jonpCallback:"getInfo",
                success:function(jsondata){
                    api.MUSICLISTOBJ[musicid] = jsondata.data.pcPlayParam;
                }
            });
        }
    };

    /**
     * 删除客户端列表信息
     * @param name 需要删除的列表名字
     *@returns   ok  删除成功   error  删除失败
     * */
    api.deletePlayList = function (name) {
        return api.callClient("DeletePlayList?name="+name);
    };

    /**
     * 修改客户端列表信息
     * @param name 列表名字  pic  inf   tag  newname 修改的列表名
     *@returns   ok  删除成功   error  删除失败
     * */

    api.editPlayList = function (name,pic,newName,inf,tag) {
        return api.callClient("EditPlayList?name="+name+"&pic="+pic+"&newname="+newName+"&inf="+inf+"&tag="+tag+"\r\n");
    };
        // str +='&pic='+plpic+'&inf='+info+'&tag='+tags+'\r\n'+pl;
//		EditPlayList?name=xxx&pic=xx & newname=xxx&inf=XXXX&tag=XX;XX;XX\r\n
    // 更新客户端
	
    /**
     * 歌曲音质选择    选择音质
     * @param 歌曲串  musicStr  编码格式 mdcode 
     * @returns  
     * */	
	api.selQuality = function(playSting, mdcode){
		if(mdcode && playSting){
			console.log(111);
			return api.callClient("SelQuality?mv=0&n=1&s1="+playSting+"&mediacode="+mdcode+"&play=1")			
		}

	}
	
    /**
     * 在网页中显示字符串中的特殊字符
     * @param s 需要处理的字符串
     */
    function returnSpecialChar(s){
        s = ''+s;
        return s.replace(/\&amp;/g,"&").replace(/\&nbsp;/g," ").replace(/\&apos;/g,"'").replace(/\&quot;/g,"\"").replace(/\%26apos\%3B/g,"'").replace(/\%26quot\%3B/g,"\"").replace(/\%26amp\%3B/g,"&");
    }

    window.$pcApi = api;
})(window);
