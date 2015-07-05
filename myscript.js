var list =$(), timeout;

//add custom css

var iconurl = chrome.extension.getURL("split.png");
document.styleSheets[0].insertRule('.resultsSo ~ .split::after {background-image: url('+iconurl+');}', 0);


//allow-scripts
var iframe = $('<iframe id="previewIframeSo" sandbox="allow-forms allow-same-origin"></iframe>');
var previewText = $('<div id="soPreviewTop">').text('Preview');
var wrapper  = $("<div id='soWrapper'>");
var xIcon = $("<span id='xIconSo'>x</span>")
previewText.append(xIcon);
wrapper.append(iframe).append(previewText);

xIcon.click(function(){
	wrapper.stop().fadeOut();		
});

$("body").bind("DOMSubtreeModified", function() {
	clearTimeout(timeout);
	timeout = setTimeout(function(){
		updateDom();
	},400);
}).prepend(wrapper);




// var re = /^(?:https?:\/\/.*stackoverflow.com\/questions\/)/ig;
var re = /^((?:https?:\/\/.*stackoverflow.com\/questions\/\d+)|(?:https?:\/\/.*stackexchange.com\/questions\/\d+))/ig;
updateDom();	



function updateDom(){
	var n = $('#center_col a');
	n = n.filter(function(ele){
		var d= re.test($(this).data("href"));
		var hr= re.test($(this).attr("href"));
		if (d && !hr) $(this).attr("href", $(this).data("href"));
		return hr||d;
	});	
	//filter out double links, google quirks
	n = n.not('.fl');
	n.css({
		'color': 'rgb(255, 255, 255)',
		'padding': '10px 10px',
		'background-color': '#000',
		'display': 'inline-block',
		'font-size': '1rem'
	}).addClass('resultsSo');

	n.parent().siblings('.s').hide();
	fetchLinks(n.not(list));
	list = list.add(n);
}

function openTab (url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function fetchLinks (eles) {
	if (!eles) return;
	eles.mouseover(function(){
		console.log($(this).attr('href'));
	});
	eles.each(function(){
		var html;
		var ele = $(this);
 		var url = ele.attr('href').replace('http:','https://');
		

		$.get(url).done(function(data) {
			var dummy = $('<div>');
			dummy.html(data);
			var votes = $('<div class="votesSo">');
			if (dummy.find('.vote-accepted-on').length>0) votes.addClass('soAccepted');
			votes.text(dummy.find('#question .vote-count-post').text());
    		ele.parent().append(votes);
    		addSplitIcon();
  		});

  		function addSplitIcon() {
  			var line = $('<div class="splitLine">'), splitIcon = $('<div class="split">');

			splitIcon
			.hover(function(){line.show();},function(){line.hide();})
			.click(function(){
				//openTab(url);
				wrapper.stop().fadeIn();
				iframe.attr('src', url);
				iframe.contents().find('#noscript-warning').remove();
			});

			ele.before(line);
			ele.after(splitIcon);
  		}
	});
	
}


