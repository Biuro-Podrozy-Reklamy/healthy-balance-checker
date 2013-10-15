
window.addEventListener('load', function()
{
	var el = document.getElementById('hbc-form'), script = document.getElementById('hbc-js');
	var hasJQuery = (typeof(jQuery) != 'undefined');
	
	if(el && script && script.src)
	{
		var src = script.src, baseURL = src.replace(/\/js\/share\.js$/, '');

		if(hasJQuery && !jQuery.scrollTo)
		{
			var scrollTo = document.createElement('script');
			
			scrollTo.setAttribute('src', baseURL + '/js/jquery.scrollTo.min.js');
			script.parentNode.appendChild(scrollTo);
		}
				
		var iframe = document.createElement('iframe');
		
		iframe.setAttribute('seamless', 'seamless');
		iframe.setAttribute('src', baseURL + '/form/');
		iframe.setAttribute('scrolling', 'no');
		iframe.setAttribute('id', 'hbc-iframe');
		iframe.setAttribute('style', 'width: 100%; height: 900px; border: 0px none');
		
		el.parentNode.insertBefore(iframe, el);
		el.parentNode.removeChild(el);
		
		var onReceive = function(event)
		{
			if(event.data && event.data.height)
			{
				var height = parseInt(event.data.height);
				
				if(!isNaN(height)) iframe.style.height = height + 'px';
				
				if(event.data.scroll && hasJQuery && jQuery.scrollTo)
				  jQuery.scrollTo(iframe, 300);
				
			}
		};
		
		window.addEventListener('message', onReceive, false);
		
	}
	
}, true);


