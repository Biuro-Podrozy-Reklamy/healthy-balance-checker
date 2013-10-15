function requestIFrameResize(extraSpace, scroll)
{
	if(window.parent)
	{
		if(window.parent.hbc_resizeIFrame)
		{
			window.parent.hbc_resizeIFrame(extraSpace, scroll);
		}
		else if(window.parent.postMessage)
		{
			window.parent.postMessage({ 
			  height: $('body').outerHeight() + parseInt(extraSpace), 
			  scroll: scroll 
			  }, '*');
		}
	}
}

firstMeal=true;
var currentStep=0;
var maxSteps=1;
var stepsInited=[];
var loadedData;
/*@cc_on
	(function(f){
 window.setTimeout =f(window.setTimeout);
 window.setInterval =f(window.setInterval);
})(function(f){return function(c,t){var a=[].slice.call(arguments,2);return f(function(){c.apply(this,a)},t)}});
@*/

function intToHours(p){
	var m=p%60=='0'?'00':p%60;
	var h=(p-p%60)/60;
	return h+':'+m;
}

var baseTitle=document.title;
function toBool(p){
	if(typeof p=="boolean")
	{
		return p;
	}else if(typeof p=="string")
	{
		if(p.toLowerCase()=="true")
			return true;
		else
			return false;
	}
}
/*function setURL(){
	collectedData.url=currentStep;
	var address;
	if(window.location.href.indexOf("?")>-1)
		address=window.location.href.substring(window.location.href.lastIndexOf("/") + 1, window.location.href.indexOf("?"))+'?step-'+currentStep;
	else
		address=window.location.href.substr(window.location.href.lastIndexOf("/") + 1)+'?step-'+currentStep;
	window.history.pushState(collectedData,baseTitle+' - '+currentStep, address);
}
window.onpopstate = function(event) {
	console.log('--');
	console.log(event.state);
	if(event.state==null){
		currentStep=1;
		initApp(data);
	}else{
		currentStep=event.state.url;
		initApp(data);
	}
}*/

/*function parseSVG(s) {
	var div= document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';
	var frag= document.createDocumentFragment();
	while (div.firstChild.firstChild)
		frag.appendChild(div.firstChild.firstChild);
	return frag;
}*/

function nonZeroMin(){
    var args = Array.prototype.slice.call(arguments);
    args.sort(function(a, b){
        if(a === null || isNaN(a) || a === 0) return 1;
        if(b === null || isNaN(b) || b === 0) return -1
        return a-b;
    });
    return args[0];
}

var askIcon='<svg class="askIcon" fill="#959595" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="21.25px" height="21.364px" viewBox="0 0 21.25 21.364" enable-background="new 0 0 21.25 21.364" xml:space="preserve"><path d="M10.5,1C5.25,1,1,5.25,1,10.5S5.25,20,10.5,20s9.5-4.25,9.5-9.5S15.75,1,10.5,1z M10.5,18.5 c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S14.91,18.5,10.5,18.5z"/><path d="M10.983,15.017H9.575v-1.475h1.408V15.017z M10.949,12.908h-1.34v-0.47c0-0.243,0.024-0.466,0.071-0.662 c0.049-0.199,0.124-0.387,0.224-0.56c0.099-0.169,0.239-0.357,0.417-0.559c0.094-0.113,0.262-0.286,0.508-0.525 c0.235-0.228,0.397-0.397,0.482-0.503c0.123-0.147,0.212-0.292,0.267-0.431c0.055-0.137,0.083-0.295,0.083-0.471 c0-0.366-0.109-0.65-0.334-0.868c-0.223-0.216-0.539-0.326-0.938-0.326c-0.418,0-0.737,0.125-0.975,0.382 c-0.239,0.257-0.37,0.687-0.388,1.277L9.021,9.337H7.688L7.686,9.19C7.67,8.325,7.914,7.625,8.411,7.11 c0.498-0.515,1.172-0.776,2.006-0.776c0.511,0,0.975,0.1,1.378,0.296c0.41,0.2,0.729,0.493,0.947,0.87 c0.217,0.373,0.327,0.782,0.327,1.216c0,0.279-0.043,0.532-0.128,0.751c-0.083,0.216-0.198,0.415-0.341,0.591 c-0.137,0.17-0.355,0.396-0.666,0.687c-0.294,0.276-0.511,0.503-0.645,0.676c-0.127,0.165-0.216,0.325-0.266,0.477 c-0.049,0.152-0.074,0.341-0.074,0.562V12.908z"/></svg>';

var w = 400;
var h = 400;
var r = 169;
var ir = 0;

var tweenDuration = 250;
var amountChangerTransform=20;
var circlePadding=-50;

//OBJECTS TO BE POPULATED WITH DATA LATER
var amountChangers, valueLabels, nameLabels;
var pieData = [];    
var oldPieData = [];
var filteredPieData = [];
var inters=[];
var mealsQuantity=[];

var stepsdata;
var step1data;
var step2data;
var step2mealdata;

var collectedData={};
var nextButton;
var overlay=false;

function SVG(tag)
{
   return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function toggleStep(p){
	nextButton.fadeOut(200);
	$('#steps-container').delay(200).fadeOut(300, function(){
		$('#step-'+currentStep).hide();
		currentStep=p;
		$('#step-'+currentStep).show();
		$('#steps-container').fadeIn(300)
		nextButton.delay(100).fadeIn(300);
		setStepBar(currentStep);
		enableNext();
	})
}

function nextStep(p){
	//nextButton.fadeOut(200);
	nextButton.addClass('disabled');
	if(typeof p=="undefined"){
		//console.log('going to next step: '+(currentStep+1));
		$('#overlay-fade').delay(200).fadeIn(300, function(){
		//$('#steps-container').delay(200).fadeOut(300, function(){
			$('#step-'+currentStep).hide();
			currentStep++;
			initStep(currentStep);
		})
	}else{
		//console.log('going to step: '+(p));
		//nextButton.fadeOut(200);
		$('#overlay-fade').delay(200).fadeIn(300, function(){
			$('#step-'+currentStep).hide();
			currentStep=p;
			initStep(currentStep);
		})
	}
}

function enableNext(p){
	nextButton.removeClass('disabled');
	nextButton.unbind('click');
	if(typeof p=="undefined"){
		nextButton.on('click',function(){
			if($(this).hasClass('disabled')==false) nextStep();
		});
	}else{
		if(p=='submit'){
			nextButton.unbind('click');
			nextButton.on('click',function(){
				var ts='';
				for(var ele in collectedData.oils)
				ts+=collectedData.oils[ele]=='true'?'1,':'0,';
				collectedData.oils=ts.slice(0, - 1);
				$().redirect('receive-ie8.php', collectedData);
			});
		}
		if(p=='disable'){
				nextButton.addClass('disabled');
				nextButton.unbind('click');
		}
		if(p=="overlay"){
			switch(currentStep){
				case 1:
					nextButton.on('click',function(){
						nextButton.unbind('click');
						if ((collectedData.pregnant) && !overlay){
							$('#step-1-overlay').fadeIn(300);
							overlay=true;
							$('#step-1-overlay .button.close').on('click',function(){
								$('#step-1-overlay').fadeOut(300);
								$('#step-1-overlay .button.close').unbind('click');
								nextButton.unbind('click');
								overlay=false;
								nextButton.on('click',function(){
									$('#step-1-overlay').fadeOut(300);
									nextButton.unbind('click');
									overlay=false;
									nextStep();
								});
							});
							nextButton.on('click',function(){
								$('#step-1-overlay').fadeOut(300);
								nextButton.unbind('click');
								overlay=false;
								nextStep();
							});
							return;
						} else {
							nextStep();
						}
					})
				break;
				case 3:
					nextButton.on('click',function(){
						nextButton.unbind('click');
						if (!overlay){
							$('#step-3-overlay').fadeIn(300);
							overlay=true;
							$('#step-3-overlay .button.close').on('click',function(){
								$('#step-3-overlay').fadeOut(300);
								$('#step-3-overlay .button.close').unbind('click');
								nextButton.unbind('click');
								overlay=false;
								nextButton.on('click',function(){
									$('#step-3-overlay').fadeOut(300);
									nextButton.unbind('click');
									overlay=false;
									nextStep();
								});
							});
							nextButton.on('click',function(){
								$('#step-3-overlay').fadeOut(300);
								nextButton.unbind('click');
								overlay=false;
								nextStep();
							});
							return;
						} else {
							nextStep();
						}
					});
				break;
				case 4:
					nextButton.on('click',function(){
						nextButton.unbind('click');
						if (!overlay){
							$('#step-4-overlay').fadeIn(300);
							overlay=true;
							$('#step-4-overlay .button.close').on('click',function(){
								$('#step-4-overlay').fadeOut(300);
								$('#step-4-overlay .button.close').unbind('click');
								nextButton.unbind('click');
								overlay=false;
								nextButton.on('click',function(){
									$('#step-4-overlay').fadeOut(300);
									nextButton.unbind('click');
									overlay=false;
									nextStep();
								});
							});
							nextButton.on('click',function(){
								$('#step-4-overlay').fadeOut(300);
								nextButton.unbind('click');
								overlay=false;
								nextStep();
							});
							return;
						} else {
							nextStep();
						}
					});
				break;
			}
		}
	}
}

function ageSelect(){
	var tVal=parseInt($('#age-value-preview').text());
	if(tVal>=12)
	{
		if(tVal<=18) collectedData.age="12-18";
		if(tVal>=19 && tVal<=50) collectedData.age="19-50";
		if(tVal>=51 && tVal<=70) collectedData.age="51-70";
		if(tVal>=71) collectedData.age="71+";
	}
}

function checkStep(){
	switch(currentStep)
	{
		case 1:
			var tVal=parseInt($('#age-value-preview').text());
			if(collectedData.gender&&tVal>=12)
			{
				enableNext();
			}else{
				enableNext('disable');
			}
		break;
		case 2:
		break;
		case 3:
		var toil=false;
			for(elem in collectedData.oils)	if(!toil&&collectedData.oils==='true'){toil=true; return false;}
			if(toil)
				enableNext();
			else
				enableNext('overlay');
		break;
	}
}

function setStepBar(number){
	if(currentStep>0)
	{
	maxSteps=Math.max(maxSteps, number);
	
	$('#steps-bar .step-button').addClass('inactive');
	$('#steps-bar .step-button[data-step="'+stepsdata['step-'+currentStep].step_number+'"]').removeClass('inactive');
	$('#steps-bar .step-button').filter(function() {
		return $(this).attr("data-step") > maxSteps;
	}).fadeOut(100);
	$('#steps-bar .step-button').filter(function() {
		return ($(this).attr("data-step") <= number && $(this).css("display") == 'none');
	}).css({'opacity':0,'display':'inline-block'}).animate({'opacity':1},100);
	}
}
$( document ).ready( function(){
	//$.getJSON('data-json.php', initApp)
	/*$.ajax({
		type: 'GET',
		url: 'data-json-ie8.json?_='+new Date().getTime(),
		dataType: 'json',
		contentType: 'application/json',
		success: function(data){initApp(data)},
		error: function(data){console.log(data)}
	});*/
	//$.getJSON('data-json-ie8.json?_='+new Date().getTime()+Math.round(Math.random()*1000), function(data){
      initApp(loadedJsonData);
	/*var xdr = new XDomainRequest();
	xdr.open("get", 'data-json-ie8.json?_='+new Date().getTime());
	xdr.onload = function() {
		var json = 'loadedData = '+xdr.responseText; // the string now looks like..  json = { ... };
		eval(json); // json is now a regular JSON object
		parse(json); // parse using same function as for jQuery's success event
		alert(loadedData);
	  //initApp(parse(eval('json = '+xdr.responseText)));
	}
	xdr.send();
	setInterval(function(){
		console.log(loadedData);
		console.log(xdr.responseText);
	}, 300);*/
});
	
	
	function initApp(data){
		loadedData=data;
		nextButton=$('#next-button');
		stepsdata=data.steps;
		step1data=data.steps["step-1"];
		step2data=data.steps["step-2"];
		step2mealdata=data.steps["step-2"].meal;
		for(elem in stepsdata){
			if(stepsdata[elem].type!="no-step-bar")
				$('#steps-bar').append('<div class="step-button button inactive" data-substep="'+stepsdata[elem].substep_number+'" data-step="'+stepsdata[elem].step_number+'">'+stepsdata[elem].title+'</div>')
		}
/*		$('#steps-bar .step-button').on('click',function(){
			toggleStep(parseInt($(this).attr('data-substep')))
})*/
		
		initStep(currentStep);
	}
	function initStep(p){
		if(navigator.userAgent.indexOf('Firefox')>-1) $('#app-wrapper').addClass('ff');
		$('#app-wrapper')
			.removeClass('step0')
			.removeClass('step1')
			.removeClass('step2')
			.removeClass('step3')
			.removeClass('step4')
			.removeClass('step5')
			.removeClass('step6')
			.removeClass('step7')
			.addClass('step'+p);
			
		if(p>0) nextButton.delay(500).css({'opacity':0, 'display':'inline-block'}).animate({'opacity':1},300);
		else $('#start-button').on('click',function(){
			setTimeout(function(){
				$('div.intro.spacer').remove();
			},300);
				nextStep();$('#steps-bar').delay(300).fadeIn(300)
			});
		if(p<6) setStepBar();
		$('#step-description').css({'height':$('#step-description').height()})
		$('#step-description').animate({opacity:0}, 300, function(){
			//$('#step-description').css({'height':'auto'})
			$('#step-description').empty().html(stepsdata['step-'+p].description);
			if($('#step-description').text().length>1)
				$('#step-description').animate({opacity:1, 'height':$(this)[0].scrollHeight}, 300, function() {
					requestIFrameResize(50, p > 0);
				});
			else
				$('#step-description').animate({opacity:1, 'height':0}, 300, function() {
					requestIFrameResize(50, p > 0);
				});
				
			setTimeout(function(){
				requestIFrameResize(50, false);
				setTimeout(function(){
					requestIFrameResize(50, false);
				},300);
			},300);
		});
		
		$('#step-'+p).css({'opacity':1, 'display':'block'});
		$('#steps-container').fadeIn(300);
		$('#overlay-fade').delay(500).fadeOut(300);
		if(stepsInited[p]){
			enableNext();
		}else{
		stepsInited[p]='true';
		switch(p){
		case 1:
		{
			setStepBar(1);
			$('.gender_img').on('click', function(){
				if(!$(this).hasClass('inactive'))
					if($(this).hasClass('active')){
						$('.gender_img').removeClass('active').removeClass('inactive');
						delete collectedData.breastfeeding;
						delete collectedData.pregnant;
						delete collectedData.gender;
						$('#female-options').css('visibility','hidden');
						$('#female-options .tickBox').css('visibility','hidden');
						$('#female-options .tick').css('visibility','hidden');
						enableNext('disable');
					}else{
						$('.gender_img').addClass('inactive')
						$(this).removeClass('inactive').addClass('active');
						if($(this).attr('data-gender')=="female"){
							$('#female-options').css('visibility','visible');
							$('#female-options .tick').css('visibility','visible');
							$('#female-options .tickBox').css('visibility','visible');
						}
						collectedData.gender=$(this).attr('data-gender');
						
						if($('#age-slider').attr('data-val')>=12)
							{
								enableNext();
							}else{
								enableNext('disable');
							}
						
					}
			});
			$('#female-options .tick').on('click',function(e){
				//e.stopImmediatePropagation();
				$('.tickBox', this).toggleClass('checked');
				//attr('data-checked',!toBool($(this).attr('data-checked')));
				//$(this).attr('data-checked',!toBool($(this).attr('data-checked')));
			});
			if(window.isIE){
				$('#age-value-preview .tip').css('bottom','-9px');
				$('#age-under-twelve .tip').css('top','-14px');
			}
			for(var elem=0; elem<101; elem++){
					if(elem%10==0 && elem<71) $('#age-slider-labels').append('<div class="label" data-point="'+elem+'">'+elem+'</div>');
			}
			
			$('#age-slider .knob').css('left',18*4.22);
			$('#age-value-preview').css('left',177);
			$('#age-value-preview .value').text(18);
			setTimeout(function(){
				$('#age-slider .indicator').css('width',18*4.22+20)
			},100);
			$('#age-slider .knob').draggable({
				axis: 'x',
				containment: "#age-slider",
				revert:false,
				start: function(event, ui) {
					$('#age-value-preview').stop().fadeIn(200);
					ageSelect(parseInt($('#age-value-preview').text()))
				},
				drag: function(event, ui) {
					if($('div#step-1').hasClass('overlay-visible'))
							return false;
					else{
						var tVal=Math.min(100,Math.round($('#age-slider .knob').position().left/4.22));
						
							$('#age-value-preview').css('left',$('#age-slider').position().left+$(this).position().left-$('#age-value-preview').width()/2-3);
							$('#age-value-preview .value').attr('data-val',tVal);
							$('#age-value-preview .value').text(Math.min(tVal,71)==71?'71+':tVal);
							$('#age-slider .indicator').css('width',$(this).position().left+$(this).width()/2)
							if(tVal<12)
							{
								$('#age-under-twelve').fadeIn(300);
							}else{
								$('#age-under-twelve').fadeOut(300);
							}
							ageSelect(parseInt(tVal))
							$('#age-slider').attr('data-val',tVal);
						}
					},
				stop: function() {
					var tVal=Math.round($('#age-slider .knob').position().left/4.22);
					$('#age-value-preview').animate({'left':$('#age-slider').position().left+$(this).position().left-$('#age-value-preview').width()/2-3},10);
					$('#age-slider .indicator').animate({'width':$(this).position().left+$(this).width()/2},10);
					$('#age-slider').attr('data-val',tVal);
					ageSelect();
					if(tVal<12)
							{
								$('#age-under-twelve').fadeIn(200);
								enableNext('disable');
							}else{
								if(typeof collectedData.gender!="undefined") enableNext();
								else enableNext('disable');
								$('#age-under-twelve').fadeOut(200);
							}
					setTimeout(function(){
						$('#age-value-preview .value').attr('data-val',Math.round($('#age-slider .knob').position().left/4.22));
					},300);
					}
			});
			ageSelect();
		}
	break;
	case 2:
		{
			collectedData.meals=[0,0,0,0,0,0];
			setStepBar(2);
			for(elem in step2mealdata){ inters.push(0); mealsQuantity.push(0);}
			function showStep2overlay(numbero)
			{
				var tdat=step2mealdata[numbero];
				if(!$('#step-2').hasClass('overlay-visible'))
				{
					enableNext();
				}
					
				$('#step-2 div.step-overlay').fadeIn(500,0);
				$('#step-2-overlay .overlay-title').empty().append(tdat.name.replace('*',' '));
					$('#step-2-overlay .overlay-content').empty().append(tdat.content+'<br />'+((typeof tdat.link=='undefined')?'':'<a href="'+tdat.link+'" target="_BLANK">Read more about '+tdat.name.replace('*',' '))+'</a><br /><div class="button close">CLOSE</div>');
					
					$('#step-2').addClass('overlay-visible');
					$('.meal-btn.menu-item').unbind('click').on('click',function(){
						var tdat=step2mealdata[$(this).attr('data-meal')-1];
						$('#step-2-overlay .overlay-title').empty().append(tdat.name.replace('*',' '));
						$('#step-2-overlay .overlay-content').empty().append(tdat.content+'<br />'+((typeof tdat.link=='undefined')?'':'<a href="'+tdat.link+'" target="_BLANK">Read more about '+tdat.name.replace('*',' '))+'</a><br /><div class="button close">CLOSE</div>');
					});
					$('#step-2-overlay').delegate('.button.close','click',function(){
						$(this).unbind('click');
						$('#step-2 div.step-overlay').fadeOut(500,0);
						$('#step-2').removeClass('overlay-visible');
						$('.meal-btn.menu-item').unbind('click');
					})
				////
			}
			
			$('#step-2 .change-amount-button, #step-2 .meal-image').on('click',function(){
				if($(this).hasClass('plus-button')){
					collectedData.meals[parseInt($(this).parent().parent().attr('data-num'))]=Math.max(0,Math.min(9,collectedData.meals[parseInt($(this).parent().parent().attr('data-num'))]+1));
				}
				if($(this).hasClass('meal-image')){
					if($('#step-2').hasClass('overlay-visible'))
						showStep2overlay(parseInt($(this).parent().parent().attr('data-num')));
					else
						collectedData.meals[parseInt($(this).parent().parent().attr('data-num'))]=Math.max(0,Math.min(9,collectedData.meals[parseInt($(this).parent().parent().attr('data-num'))]+1));
				}
				if($(this).hasClass('minus-button')){
					collectedData.meals[parseInt($(this).parent().parent().attr('data-num'))]=Math.max(0,Math.min(9,collectedData.meals[parseInt($(this).parent().parent().attr('data-num'))]-1));
				}
				$(this).parent().siblings('.value-field').text(collectedData.meals[parseInt($(this).parent().parent().attr('data-num'))]);
			
				if(firstMeal){
					firstMeal=false;
					showStep2overlay(parseInt($(this).parent().parent().attr('data-num')))
				}
			
			});

			$('#step-2 .ask-sign').on('click',function(){
				firstMeal=false;
				showStep2overlay(parseInt($(this).parent().parent().attr('data-num')));
			});
		}
		break;
		case 3:
		{
			enableNext();
			collectedData.oils={};
			for(elem in stepsdata['step-'+(currentStep)].oils){
				collectedData.oils[stepsdata['step-'+(currentStep)].oils[elem].replace(' ','-')]='false';
				$('#oils-selection').append('<div class="tick" data-value="'+stepsdata['step-'+(currentStep)].oils[elem].replace(' ','-')+'"><div class="tickBox" data-checked="false"></div>'+stepsdata['step-'+(currentStep)].oils[elem]+'</div>');
			}
			$('#oils-selection .tick').on('click',function(e){
				$('.tickBox', this).toggleClass('checked');
				collectedData.oils[$(this).attr('data-value')]=$('.tickBox', this).hasClass('checked')?1:0;
				checkStep();
			});
		}
		break;
		case 4:
		{
			enableNext('overlay');
			for(var iter=0; iter<=12; iter++){
				$('#water-images').append('<img src="img/water.jpg" data-number="'+(iter+1)+'" class="float-center"/>');
			}
			collectedData.water=2;
			$('#water-images>img[data-number="1"], #water-images>img[data-number="2"]').delay(600).fadeIn(300);
			$('#step-4 .sign-plus-minus').on('click', function(){
				var btnval=$(this).attr('data-value')=="1"
				var val=
				Math.min($(this).parent().attr('data-max'),
				Math.max($(this).parent().attr('data-min'),
				collectedData[$(this).attr('data-property')]+parseInt($(this).attr('data-value'))));
				collectedData[$(this).attr('data-property')]=val;
				collectedData.water=val;
				if(val<9)
					enableNext('overlay');
				else
					enableNext();
				$('div[data-role="value"]', $(this).parent()).text(val);
				$({twidth:$('#water-images>img').width()}).animate({twidth:570/val}, {
					start: function(){
						//console.log(btnval);
						if(btnval)
							$('#water-images>img[data-number="'+val+'"]').fadeIn(200);
						else
							$('#water-images>img[data-number="'+(val+1)+'"]').fadeOut(150);
					},
					step: function(value) {
						if(!window.isIE){
						$('#water-images>img').attr('width',Math.min(104,value));
						$('#water-images>img').attr('height',(Math.min(104,value)*194)/104);
						}else{
							//$('#water-images>img').css('zoom',(Math.min(104,value)*1)/104);
							//$('#water-images>img').attr('height',(Math.min(104,value)*194)/104);
						}
						//$('#water-images>img').css('width',Math.min(104,value));
						//$('#water-images>img').css('height',104/Math.min(104,value)*194);
					}
				})
			});
		}
		break;
		case 5:
		{
			enableNext('submit');
			setStepBar(3);
			var tdat=stepsdata['step-'+(currentStep)].activities;
			var tstr="";
			for(elem in tdat){
				tstr+='<div class="activity activity-'+tdat[elem].title.toLowerCase()+'"><div class="step-title subtitle"><div class="title">'+tdat[elem].title+
				'</div><div class="actAskImg" data-attr="'+elem+'"></div>'
				+'</div>';
				tstr+='<div class="activity-image"><img src="img/'+tdat[elem].icon+'.jpg"/></div><ul class="activities-list georgia dark-blue">';
					for(eleme in tdat[elem].examples)
					tstr+='<li>'+tdat[elem].examples[eleme]+'</li>';
				tstr+='</ul><div class="activity-time-selector" data-min="0" data-max="2880">'
				+		'<div data-role="change" data-property="'+tdat[elem].title.toLowerCase()+'" data-value="-30" class="activity-time-selector-button less-time"></div>'
				+		'<div data-role="value" data-type="hour" class="dark-blue georgia">'+intToHours(tdat[elem].init)+'</div>'
				+		'<div data-role="change" data-property="'+tdat[elem].title.toLowerCase()+'" data-value="+30" class="activity-time-selector-button more-time"></div>'
				+	'</div>'
				+'</div>';
				collectedData['activity-'+tdat[elem].title.toLowerCase()]=parseInt(tdat[elem].init);
				$('#step-5-overlay').append('<div alt="information" class="ask-sign ask-act-img img-'+(elem==0?'act-bike':'act-lift')+'" data-img="'+elem+'"></div>');
			}
			$('#activities').append(tstr);
			$('#activities-total div[data-role="value"]').html(intToHours(collectedData['activity-moderate']+collectedData['activity-high']));
			
			$('.activity-time-selector div[data-role="change"]').on('click',function(){
				collectedData['activity-'+$(this).attr('data-property')]=
					Math.min(parseInt($(this).parent().attr('data-max')),Math.max(parseInt($(this).parent().attr('data-min')),collectedData['activity-'+$(this).attr('data-property')]+parseInt($(this).attr('data-value'))))
					$(this).parent().find('div[data-role="value"]').html(intToHours(collectedData['activity-'+$(this).attr('data-property')]));
					$('#activities-total div[data-role="value"]').html(intToHours(collectedData['activity-moderate']+collectedData['activity-high']));
				})
				
			$('.actAskImg').on('click',function(){
				$('#step-5').addClass('overlay-visible');
				$('#step-5-overlay').fadeIn(300);
				$('#step-5-overlay .overlay-title').html(stepsdata['step-'+(currentStep)].activities[parseInt($(this).attr('data-attr'))].title.toUpperCase()+' ACTIVITY');
				$('.ask-act-img').each(function(){
					$(this).removeClass('active');
				})
				$('.ask-act-img[data-img="'+$(this).attr('data-attr')+'"]').addClass('active');
				$('#step-5-overlay .overlay-content').html(stepsdata['step-'+(currentStep)].activities[parseInt($(this).attr('data-attr'))].description+'<br><div class="button close">CLOSE</div>');
				$('#step-5-overlay .button.close').on('click',function(){
					$('#step-5-overlay').fadeOut(300);
					$('#step-5').removeClass('overlay-visible');
				})
			})
			$('.ask-act-img').on('click',
				function(){
					$('.ask-act-img').each(function(){
						$(this).removeClass('active');
					})
					$(this).addClass('active');
					$('#step-5-overlay .overlay-title').html(stepsdata['step-'+(currentStep)].activities[parseInt($(this).attr('data-img'))].title.toUpperCase()+' ACTIVITY');
					$('#step-5-overlay .overlay-content').html(stepsdata['step-'+(currentStep)].activities[parseInt($(this).attr('data-img'))].description+'<br><div class="button close">CLOSE</div>');
					$('#step-5-overlay .button.close').on('click',function(){
						$('#step-5-overlay').fadeOut(300);
						$('#step-5').removeClass('overlay-visible');
					})
				}
			);
		}
		break;
	}
}
}