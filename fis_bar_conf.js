'use strict';

fis.set('project.ignore', ['node_modules/**','.*','*.json','fis-conf.js','*.md']);


fis.match('*', {//默认不添加hash
        useHash:false
    })
    .match("src/**",{
        useHash:false,
        release:true
    })
    .match('::package',{
      spriter: fis.plugin('csssprites'),
      postpackager: fis.plugin('loader')
    })
    .match("static/admin/**", {
        useHash:false,
        release:true
    })
    .match('static/js/**.js', {
        useHash:false,
        optimizer: fis.plugin('uglify-js'),
        release:'$0',
        domain:"//js.360shouji.com",
        url:'/static/js/$0'
    })
    //css
    .match('www/static/{css,font}/**.{css,less}',{
        useHash:false,
        useSprite: true,
        optimizer: fis.plugin('clean-css'),
        release:'$0',
        domain:"//css.360shouji.com",
        url:'/static/css/$0'
    })
    //文件中的域名引用其实没有替换
    .match('view/**/*.html',{
        isHtmlLike:true,
        //optimizer:fis.plugin('htmlmin'),
        release:"$0"
    })
    //加载前缀域名
    .match('static/{upload,img,video}/**.{png,jpg,gif,jpeg,mp4,webm,ogv}',{
        useHash:false,
        domain:'//res.360shouji.com',
        release:'$0',
        url:'/static/$0'
    })
    //发布到本地
    .match('*', {
        deploy: fis.plugin('local-deliver', {
            to: '/output2'
        })
    })