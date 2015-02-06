//Remove line duplicates tool

$(function() {

	//Parameters
	//var seperatorI;
	//var newCode;
	var newCodeArray = [];
	//var inputSep;
	//var outputSep;
	var theSep;
	
	//Natural sorting function from Jim Palmer - check out the URL below...
	
	/*
	 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
	 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
	 * More info: http://www.overset.com/2008/09/01/javascript-natural-sort-algorithm-with-unicode-support/
	 */
	 function naturalSort (a, b) {
	    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
	        sre = /(^[ ]*|[ ]*$)/g,
	        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
	        hre = /^0x[0-9a-f]+$/i,
	        ore = /^0/,
	        i = function(s) { return naturalSort.insensitive && (''+s).toLowerCase() || ''+s },
	        // convert all to strings strip whitespace
	        x = i(a).replace(sre, '') || '',
	        y = i(b).replace(sre, '') || '',
	        // chunk/tokenize
	        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
	        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
	        // numeric, hex or date detection
	        xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x)),
	        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
	        oFxNcL, oFyNcL;
	    // first try and sort Hex codes or Dates
	    if (yD)
	        if ( xD < yD ) return -1;
	        else if ( xD > yD ) return 1;
	    // natural sorting through split numeric strings and default strings
	    for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
	        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
	        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
	        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
	        // handle numeric vs string comparison - number < string - (Kyle Adams)
	        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
	        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
	        else if (typeof oFxNcL !== typeof oFyNcL) {
	            oFxNcL += '';
	            oFyNcL += '';
	        }
	        if (oFxNcL < oFyNcL) return -1;
	        if (oFxNcL > oFyNcL) return 1;
	    }
	    return 0;
	}
        
        	

	//listener - select modified text
	$("#newCode").click(function() {
		this.form.newCode.focus();this.form.newCode.select();
	});
	
	//reverse sort listener (if reverse sort checked then nosort must change to alphabetical)
	$("#reverseSort").click(function() {
		if($('input:checkbox[name=reverseSort]:checked').val() == 'reverse'){
			if($('input:radio[name=sortType]:checked').val() == 'sortNone'){
				var $radios = $('input:radio[name=sortType]');
				$radios.filter('[value=alphabetical]').prop('checked', true);
			}
		}
	});
	// sortNone listener (if sortNone then uncheck reverseSort)
	$("#sortNone").click(function() {
		if($('input:radio[name=sortType]:checked').val() == 'sortNone'){
			$('input:checkbox[name=reverseSort]').prop('checked', false);
		}
	});


	$("#duplicate-lines").click(function() {
		newCode = $('#oldText').val();
		newCode = $.trim(newCode);
		var match = /\r\n/.test(newCode);
		if (match == -1){
			//windows line breaks
			theSep = "\r\n";
			newCode = newCode.replace(/\r\n+/g,"\r\n");
		}else{
			//unix line breaks
			theSep = "\n";
			newCode = newCode.replace(/\r/g,"\n");
			newCode = newCode.replace(/\n+/g,"\n");
			
		}
		
		
		//Create array
		newCodeArray = newCode.split(theSep);
		for(var i=0;i<newCodeArray.length;i++){
			newCodeArray[i] = $.trim(newCodeArray[i]);
		}
	
		
		
		//Remove duplicates
		var i = newCodeArray.length-1;
		while(i > -1){
			var ii = newCodeArray.length-1;
			while(ii > -1){
				if(i != ii){
					if (newCodeArray[i] == newCodeArray[ii]){
						newCodeArray.splice (ii, 1);
					}
				}
			ii--;
			}
		i--;
		}
		
		
		if($('input:radio[name=sortType]:checked').val() != 'sortNone'){
			//Do some sorting
			//Using the default sort helps with grouping capitals first - Ban, ban, Can, can, etc.
			newCodeArray.sort();
			
			//Natural sorting
			if($('input:radio[name=sortType]:checked').val() == 'alphabetical'){
				naturalSort.insensitive = true;
				newCodeArray.sort(naturalSort); 
			}
			
			if($('input:checkbox[name=reverseSort]:checked').val() == 'reverse'){
				newCodeArray.reverse();
			}
			
		}
		
		
		
		//Assemble the lines back together
		newCode = newCodeArray.join(theSep);
		
		//Put new code in place
		$('#newCode').val(newCode);
		
	});
	
	


	
});
