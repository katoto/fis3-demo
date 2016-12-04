'use strict';

//fis.set('project.ignore', ['node_modules/**','.*','*.json','fis-conf.js','*.md']);
//
//fis.match('::package',{
//	spriter:fis.plugin('csssprites')
//})
//fis.match('registerPage.css',{
//	useSprite:true
//});
//
//
//fis.match('**.{js}',{
//	release:'/js/$0'
//});
//
//
////fis-conf.js
//fis.match('*.html', {
//  useMap: true
//})
//
////  加 md5
//fis.match('*.css',{
//	useHash:false
//})
////  js  css png  压缩
//fis.match('*.js',{
//	optimizer:fis.plugin('uglify-js')
//});
//fis.match('*.css',{
//	optimizer:fis.plugin('clean-css')
//});
//fis.match('*.png',{
//	optimizer:fis.plugin('png-compressor')
//});
////精灵图构建   前提css 中 路径要带上 ？__sprite 
//fis.match('::package',{
//	spriter:fis.plugin('csssprites')
//});
//fis.match('*.css',{
//	useSprite:true
//});
//
////开发阶段   解除所有过程  fis3 release debug -d ..
//fis.media('debug').match('*.{js,css,png}',{
//	useHash:false,
//	useSprite:false,
//	optimizer:null
//})
//
//
//// npm install -g fis-parser-less-2.x
//fis.match('**/*.less', {
//  rExt: '.css', // from .less to .css
//  parser: fis.plugin('less-2.x', {
//      // fis-parser-less-2.x option
//  })
//});
//
////npm install -g fis-parser-node-sass
//fis.match('**/*.scss', {
//  rExt: '.css', // from .scss to .css
//  parser: fis.plugin('node-sass', {
//      //fis-parser-node-sass option
//  })
//});



//启动服务  fis3 server open 

//内容嵌入    （目的减少请求）
//?__inline 来实现

//不匹配的文件  ??

fis.set('project.ignore',['node_module/**','.gitignore','fis-conf.js','fis_bar_conf.js'])

//fis 中的文件路径都是以 / 开头的，所以编写规则时，请尽量严格的以 / 开头
//   匹配js
fis.match('/{static,node_module}/**/(*.js)',{
	useHash:true,
	optimizer:fis.plugin('uglify-js'),
	release:'/static/js/$1',
	url:'/pc/tmpl/static/js/$1'
})
//   匹配 less  编译  less
   .match('/static/**/(*.less)',{
   	rExt:'.css',
   	parser:fis.plugin('less-2.x',{
// 		fis-parser-less-2.x option
   	}),
   	release:'/static/css/$1',
   	url:'/pc/tmpl/static/css/$1'
})
//   匹配 sass 编译  scss
// .match('/static/**/(*.scss)',{
// 	release:'/static/css/$1'
//})
//   匹配css
////精灵图构建   前提css 中 路径要带上 ？__sprite 
.match('::package',{
	spriter:fis.plugin('csssprites')
})
   .match('/static/**/(*.css)',{
   	useSprite:true,
   	useHash:true,
   	optimizer:fis.plugin('clean-css'),
	release:'/static/css/$1',
	url:'/pc/tmpl/static/css/$1'
})

   
//   匹配img 
//  扩展image 的格式
//fis.set('project.fileType.image', 'raw,bpg')
// 图片压缩
.match('/static/**/(*.{png,img})',{
	optimezer:fis.plugin('png-compressor'),
	release:'/static/img/$1',
	url:'/pc/tmpl/static/img/$1'
})


// .match('::image',{
// 	  optimizer:fis.plugin('png-compressor'),
//    release:'/static/img/$0'	
//})
   
   
//   匹配html
   .match('**/*.html',{
		useMap:true
   })



//对匹配到的文件 进行合并输出 aio.css  打包用的    demo 
//fis.match('*.{less,css}', {
//packTo: '/static/aio.css'
//});

//粗暴打包     demo
//fis.match('::package', {
//postpackager: fis.plugin('loader', {
//  allInOne: true
//})
//});

//生成zip 压缩包  all.zip  
//前提  : npm install -g  fis3-deploy-zip  

//fis.match('**', {
//deploy: [
//  fis.plugin('zip'),
//  fis.plugin('local-deliver', {
////  	这是生成到的目录
//    to: '../docs/tmpl/'
//  })
//]
//})




fis.config.set('settings.spriter.csssprites', {
    //图之间的边距
    margin: 10
});

//开发阶段   解除所有过程     fis3 release debug -d ..
fis.media('debug').match('*.{js,css,png}',{
	useHash:false,
	useSprite:false,
	optimizer:null
})