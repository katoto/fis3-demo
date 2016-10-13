(function($) {
	$.kw = {
		getModule : getModule = function(moduleName) {
			var module = undefined;
			if (typeof (moduleName) === "string") {
				module = $("#" + moduleName);
			} else if (typeof (moduleName) === "object") {
				module = moduleName;
			} else {
				return undefined;
			}
			return module;
		},
		getElement : function(moduleName, elementName) {
			var module = getmodule(moduleName);
			if (module == undefined) {
				return undefined;
			}
			return module.find("[kw_element='" + elementName + "']");
		},
		merge : function(baseObj, customObj, type){
			if(customObj == undefined || customObj.length < 1){
				return baseObj;
			}
			if (type == undefined) {
				type = true;
			}
			if(type){
				if(baseObj == undefined){
					return customObj;
				}
				for (var key in customObj) {
					baseObj[key] = customObj[key];
				}
			}else{
				if(baseObj == undefined){
					return baseObj;
				}
				for (var key in customObj) {
					if(baseObj[key] != undefined){
						continue;
					}
					baseObj[key] = customObj[key];
				}
			}
			return baseObj;
		}
		/*
		toObject : function(value, params){
			if ($.isFunction(value)) {
				return paramter(module, gp, pageNum);
			} else if (typeof (value) === "string") {
				return eval('(' + initData + ')');
			} else if (typeof (value) === "object") {
				return value;
			}else{
				return undefined;
			}
		}*/
	};
	$.template = {
			load : function(id){
				var element = undefined;
				if (typeof (id) === "string") {
					element = document.querySelector(id);
				} else if (typeof (id) === "object") {
					element = id;
				}
				if(!element){
					return;
				}
				var templateHtml = element.innerHTML;
				if(!templateHtml){
					return;
				}
				var regex = /\{\[\w+\]\}/g;

				var htmlArg = templateHtml.split(regex);
				var paramArg = templateHtml.match(regex);

				for(var paramIndex in paramArg){
					var param = paramArg[paramIndex];
					paramArg[paramIndex] = param.substring(2, param.length - 2);
					htmlArg.splice(paramIndex * 2 + 1 , 0, "");
				}
				var templateData = {};
				//templateData["id"] = id;
				templateData["template"] = htmlArg;
				templateData["params"] = paramArg;

				return templateData;
			},
			draw : draw = function (json, templateArg, paramArg){
				var entityArg = templateArg.concat();
				for(var index in paramArg){
					var finalParam = paramArg[index];
					entityArg[index * 2 + 1] = json[finalParam];
				}
				return entityArg.join("");
			},
			drawList : drawList = function (listJson, templateData, dataformat){
				var templateArg = templateData["template"];
				var paramArg = templateData["params"];
				var htmlArg = [];
				var dataformatFunction = eval(dataformat);
				if(dataformatFunction && typeof(dataformatFunction)=="function"){
					for(var row in listJson){
						var rowJson = dataformatFunction(listJson[row]);
						htmlArg[row] = draw(rowJson, templateArg, paramArg);
					}
				}else{
					for(var row in listJson){
						htmlArg[row] = draw(listJson[row], templateArg, paramArg);
					}
				}
				return htmlArg.join("");
			}
	};
	$.fn.getKwElement = function(elementName) {
		return $(this).find("[kw_element='" + elementName + "']");
	};
	$.fn.getKwElementId = function() {
		return $(this).attr("kw_element");
	};
	$.fn.setKwData = function(data) {
		$(this).data("kw_data", data);
	};
	$.fn.getKwData = function() {
		return $(this).data("kw_data");
	};
	$.fn.getModuleId = function() {
		return $(this).attr("kw_element");
	};
	$.fn.getInitData = function() {
		return $(this).attr("kw_init_data");
	};
	$.fn.getInitObject = function() {
		var initData = $(this).attr("kw_init_data");
		if(initData == undefined || initData.length < 1){
			return undefined;
		}
		return eval('(' + initData + ')');
	};
})(jQuery);
