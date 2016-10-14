(function($) {
	$.kw_page = {
		load : function(gp) {
			var module = $.kw.getModule(gp.module);
			if (module == undefined) {
				return undefined;
			}
			var loadding = module.getKwElement("loading");
			if(loadding != undefined){
				loadding.hide();
			}
			var current = gp.current;
			if (current == undefined) {
				gp.current = 1;

			}
			var dataType = gp.dataType;
			if (dataType == undefined) {
				gp.dataType = "text";
			} else if (dataType == "json" || dataType == "jsonp") {
				var rowTemplate = module.getKwElement("row_template");
				if (rowTemplate != undefined) {
					rowTemplate.hide();
					var template = $.template.load(rowTemplate[0]);
					gp.template = template;
				}
			}
			var rows = gp.rows;
			if (rows == undefined) {
				gp.rows = 20;
			}

			var init = gp.init;
			if (init != undefined && $.isFunction(init)) {
				init(module, gp);
			}
			refreshState(module, gp);
			module.setKwData(gp);
			return module;
		},
		gotoPrevPage : gotoPrevPage = function(module) {
			var gp = module.getKwData();
			var total = gp.total;
			var current = gp.current;
			var pageNum = current - 1;
			if(pageNum > total || pageNum < 1){
				return false;
			}
			return gotoPage(module, pageNum, false);
		},
		gotoNextPage : gotoNextPage = function(module) {
			var gp = module.getKwData();
			var total = gp.total;
			var current = gp.current;
			var pageNum = current + 1;
			if(pageNum > total || pageNum < 1){
				return false;
			}
			return gotoPage(module, pageNum, false);
		},
		gotoPage : gotoPage = function(module, pageNum, needInitState) {
			var module = $.kw.getModule(module);
			var running = module.data("running");
			if(running != undefined && running == 1){
				return;
			}else{
				module.data("running", 1);
			}

			var loadding = module.getKwElement("loading");
			if(loadding != undefined){
				loadding.show();
			}
			if(needInitState == undefined){
				needInitState = false;
			}
			var gp = module.getKwData();
			var keyPageNum = "pagenum";
			var keyRows = "rows";
			var keyMapper = gp.keyMapper;
			if (keyMapper != undefined) {
				var customKeyPageNum = keyMapper.pagenum;
				if (customKeyPageNum != undefined) {
					keyPageNum = customKeyPageNum;
				}
				var customKeyRows = keyMapper.rows;
				if (customKeyRows != undefined) {
					keyRows = customKeyRows;
				}
			}
			var inputData = {};
			if (pageNum == undefined || pageNum < 0) {
				inputData[keyPageNum] = gp.current;
			} else {
				inputData[keyPageNum] = pageNum;
			}
			inputData[keyRows] = gp.rows;
			var stateData = undefined;
			var initState = gp.initState;
			if(needInitState && initState != undefined){
				if ($.isFunction(initState)) {
					stateData = initState(module, gp, pageNum);
				} else if (typeof (initState) === "string") {
					stateData = eval('(' + initState + ')');
				}else if (typeof (initState) === "object") {
					stateData = initState;
				}
				if(stateData != undefined){
					gp.finalState = stateData;
					inputData = $.kw.merge(inputData, stateData, true);
				}
			}else{
				var finalState = gp.finalState;
				if(finalState != undefined){
					inputData = $.kw.merge(inputData, finalState, true);
				}
			}
			var url = gp.url;
			var ajaxType = gp.type;
			if(ajaxType == undefined){
				ajaxType = "get";
			}

			var ajaxStruct = {
				"url" : url,
				"data" : inputData,
				"dataType" : gp.dataType,
				"type" : ajaxType,
				"success" : function(resultData) {
					var dataType = gp.dataType;
					var dataSpace = module.getKwElement("data");
					if (dataType == "html") {
						dataSpace.html(resultData);
					} else if (dataType == "json" || dataType == "jsonp") {
						var pageFormat = gp.pageFormat;
						var formatedData = undefined;
						if (pageFormat != undefined && $.isFunction(pageFormat)) {
							formatedData = pageFormat(resultData);
						} else {
							if (resultData.status == "200") {
								formatedData = resultData.data;
							} else {
								alert(resultData.status + ":" + resultData.msg);
							}
						}
						var template = gp.template;
						var rowFormat = gp.rowFormat;
						gp.pages = formatedData.pages;
						gp.total = formatedData.total;
						var html = $.template.drawList(formatedData.list,
								template, rowFormat);
						dataSpace.html(html);
					} else if (dataType == "text") {

					}
					gp.current = pageNum;
					refreshState(module, gp);
					var after = gp.after;
					if (after != undefined && $.isFunction(after)) {
						after(module, gp, resultData);
					}
					return true;
				},
				"error" : function() {
					return false;
				},
				"complete" : function(result) {
					if (loadding != undefined) {
						loadding.hide();
					}
					module.data("running", 0);
				}
			};
			var dataType = gp.dataType;
			if (dataType == "jsonp") {
				ajaxStruct.jsonp = "jpcallback";
			}
			$.ajax(ajaxStruct);
		},
		bindButton : bindButton = function(module, buttonSpace) {
			var btnPanel = buttonSpace.children('[kw_element="btn_panel"]');
			btnPanel.children("a").on("click", function() {
				var kwElementVal = $(this).getKwElementId();
				if (kwElementVal == undefined || kwElementVal.length < 1) {
					return false;
				}
				if (kwElementVal == "btn_prev") {
					return gotoPrevPage(module);
				} else if (kwElementVal == "btn_next") {
					return gotoNextPage(module);
				} else if (kwElementVal == "btn_page") {
					var pageNum = $(this).html();
//			记录		
		setTimeout(function(){
			jumpUrl = 'http://127.0.0.1:8020/radioProject/develop/t_radio/radioSearch.html?searchVal=' + serverValNow+'&isFirstTap='+isFirstTap+'&commendPageNow='+commendPageNow+'&radioPageNow='+radioPageNow+'&programPageNow='+programPageNow+'&t='+parseInt(Math.random()*100);
			$pcApi.pageJumpOther(jumpUrl,false);
		},100);

					if(pageNum != undefined){
						return gotoPage(module, parseInt(pageNum), false);
					}
				} else {
					return false;
				}
			});
		},
		refreshState : refreshState = function(module, gp) {
			var module = $.kw.getModule(module);
			if (module == undefined) {
				return false;
			}
			var stateElement = module.getKwElement("page_state");
			if(stateElement != undefined && stateElement.length > 0){
				var state = stateElement.val();
				if(state != undefined && state.length > 0){
					state = eval('(' + state + ')');
					if (state != undefined) {
						gp = $.kw.merge(gp, state, true);
					}
				}
			}
			if (gp == undefined) {
				return false;
			}
			var pages = gp.pages;
			if (pages == undefined || pages < 1) {
				return false;
			}
			var current = gp.current;
			var rows = gp.rows;
			var btnStyle = gp.buttonStyle;
			if (btnStyle == undefined) {
				btnStyle = "normal";
			}
			var pageHtml = undefined;
			if (btnStyle == undefined || btnStyle == "normal") {
				var pageHtml = normalPage(module, pages, current, rows);
				var buttonSpace = module.getKwElement("button");
				if (buttonSpace != undefined) {
					buttonSpace.html(pageHtml);
					var btnPanel = buttonSpace.getKwElement("btn_panel");
					var prevWidth = 735;
					var pageWidth = btnPanel.width();
					if (pageWidth == 0)
						pageWidth = 254;
					btnPanel.css("margin-left", (prevWidth - pageWidth) / 2
							+ 'px');
					bindButton(module, buttonSpace);
				}
			}
			return true;

			function normalPage(module, pages, current, rows) {
				if (pages < 1) {
					return "";
				}
				var pageHtml = '<div style="margin-left: 474px;" class="page" kw_element="btn_panel">';
				if (current != 1) {
					pageHtml += '<a hidefocus href="javascript:;" class="prev" kw_element="btn_prev"><img src="http://image.kuwo.cn/website/pc/page/prev.png" /></a>';
				} else {
					pageHtml += '<a hidefocus href="javascript:;" class="noprev"><img src="http://image.kuwo.cn/website/pc/page/prev.png" /></a>';
				}
				pageHtml += '<a hidefocus  href="javascript:;" '
						+ (current == 1 ? 'class="current"'
								: 'class="" kw_element="btn_page"') + '>1</a>';
				if (current > 4) {
					pageHtml += '<span class="point">...</span>';
				}
				for (var i = (current >= 4 ? (current - 2) : 2); i <= (current + 2 >= pages ? (pages - 1)
						: (current + 2)); i++) {
					if (current == i) {
						pageHtml += '<a hidefocus href="javascript:;" class="current">'
								+ i + '</a>';
					} else {
						pageHtml += '<a hidefocus href="javascript:;" class="" kw_element="btn_page" >'
								+ i + '</a>';
					}
				}
				if (current + 3 < pages) {
					pageHtml += '<span class="point">...</span>';
				}
				if (pages != 1) {
					pageHtml += '<a hidefocus href="javascript:;" '
							+ (current == pages ? 'class="current"'
									: 'class="" kw_element="btn_page" ') + '>'
							+ pages + '</a>';
				}
				if (current != pages) {
					pageHtml += '<a hidefocus href="javascript:;" class="next" kw_element="btn_next" ><img src="http://image.kuwo.cn/website/pc/page/next.png" /></a>';
				} else {
					pageHtml += '<a hidefocus href="javascript:;" class="nonext"><img src="http://image.kuwo.cn/website/pc/page/next.png" /></a>';
				}
				pageHtml += '</div>';
				return pageHtml;
			}
		}
	};
})(jQuery);
