var list =$(), timeout;

$("body").bind("DOMSubtreeModified", function() {
	clearTimeout(timeout);
	timeout = setTimeout(function(){
		updateDom();
	},400);
});

// var re = /^(?:https?:\/\/.*stackoverflow.com\/questions\/)/ig;
var re = /^((?:https?:\/\/.*stackoverflow.com\/questions\/)|(?:https?:\/\/.*stackexchange.com\/questions\/))/ig;
updateDom();	



function updateDom(){
	var n = $('#center_col a');
	n = n.filter(function(ele){
		var d= re.test($(this).data("href"));
		var hr= re.test($(this).attr("href"));
		if (d && !hr) $(this).attr("href", $(this).data("href"));
		return (hr||d) && true;
	});	

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
	console.log(list);
	
}


function fetchLinks (eles) {
	if (!eles) return;
	eles.each(function(){
		var ele = $(this);
		$.get(ele.attr('href').replace('http:','https://')).done(function(data) {
			var dummy = $('<div>');
			dummy.html(data);
			var votes =$('<div class="votesSo">');
			if (dummy.find('.vote-accepted-on').length>0) votes.addClass('soAccepted');
			votes.text(dummy.find('#question .vote-count-post').text());
    		ele.parent().append(votes)
  		});
	});
	
}


