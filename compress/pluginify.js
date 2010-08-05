// usage: 
// js steal\scripts\pluginify.js funcunit/functional -destination funcunit/dist/funcunit.js
// js steal\scripts\pluginify.js jquery/controller
// js steal\scripts\pluginify.js jquery/event/drag -exclude jquery/lang/vector/vector.js jquery/event/livehack/livehack.js
load("steal/rhino/steal.js");

steal("//steal/compress/compress",function(steal){
	var plugin = _args.shift(),
		opts = steal.opts(_args,{
			"destination" : 1,
			"exclude" : -1,
			"nojquery" : 0,
			"packagejquery" : 0
		}),
		destination = plugin+".js";
	
	rhinoLoader = {
		callback : function(s){
			s.plugin(plugin)
		}
	}
	window.build_in_progress = true;
	
	var pageSteal = steal.scripts("steal/rhino/empty.html").steal,
		out = [], 
		str, 
		i,
		inExclude = function(path){
			for(var i =0; i < opts.exclude.length; i++){
				if(opts.exclude[i].indexOf(path) == -1){
					return true
				}
			}
			return false;
		};
		
	for(i = 0 ; i < pageSteal.total.length; i++){
	    if(typeof pageSteal.total[i].func == "function"){
			filePath = pageSteal.total[i].path;
			if ( inExclude(filePath) ) {
				print("including "+filePath)
				file = readFile(filePath);
				match = file.match(/\.then\(\s*function\s*\([^\)]*\)\s*\{([\s\S]*)\}\s*\)\s*;*\s*/im)
				str = "// "+filePath+"\n\n"
				str += "(function($){\n"+steal.compress.clean(match[1])+"\n})("+(includeJQ? "jQuery": "")+");\n\n"
				out.push(str);
			}
		}
	}
	print("saving to "+destination);
	new steal.File(destination).save(out.join(""));
	print("pluginified "+plugin)
})