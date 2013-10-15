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

function parseSVG(s) {
	var div= document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
	div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';
	var frag= document.createDocumentFragment();
	while (div.firstChild.firstChild)
		frag.appendChild(div.firstChild.firstChild);
	return frag;
}

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
	nextButton.fadeOut(200);
	nextButton.addClass('disabled');
	if(typeof p=="undefined"){
		//console.log('going to next step: '+(currentStep+1));
		$('#steps-container').delay(200).fadeOut(300, function(){
			$('#step-'+currentStep).hide();
			currentStep++;
			initStep(currentStep);
		})
	}else{
		//console.log('going to step: '+(p));
		nextButton.fadeOut(200);
		$('#steps-container').delay(200).fadeOut(300, function(){
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
			nextStep();
		});
	}else{
		if(p=='submit'){
			nextButton.unbind('click');
			nextButton.on('click',function(){
				var ts='';
				for(var ele in collectedData.oils)
				ts+=collectedData.oils[ele]=='true'?'1,':'0,';
				collectedData.oils=ts.slice(0, - 1);
				$().redirect('receive.php', collectedData);
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
	$.getJSON('data-json.php', initApp)
	
	
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
});
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
		});
		
		$('#step-'+p).css({'opacity':1, 'display':'block'});
		$('#steps-container').delay(500).fadeIn(300);
		if(stepsInited[p]){
			enableNext();
		}else{
		stepsInited[p]='true';
		switch(p){
		case 1:
		{
			setStepBar(1);
			$.ajax({
				url: "img/svg/genders.svg",
				dataType: "text",
			}).done(function(response) {
				var svg = $('#genders-svg');
				$('#genders').append(parseSVG(response));
				$('#genders path').on('click', function(){
					if($(this).attr('data-selected')!='true'){
					//if(!collectedData.gender){
						$(this).attr('data-selected','true');
						$('#genders path').not(this).animate({'fill-opacity':0},300,function(){$(this).hide()});
						$(this).css({'fill':'#ed4d21'});
						collectedData.gender=$(this).attr('id');
						checkStep();
						if(collectedData.gender=='female')
							$('#female-options').delay(300).fadeIn(300,function(){
								$('#female-options .tick').on('click',function(){
									if($('.tickBox', this).attr('data-checked')=='true')
										$('.tickBox', this).attr('data-checked','false')
									else
										$('.tickBox', this).attr('data-checked','true')
									collectedData[$(this).attr('data-value')]=toBool($('.tickBox', this).attr('data-checked'));
									checkStep();
								})
							})
					}else{
						$(this).attr('data-selected','false');
						$('#genders path').not(this).show().animate({'fill-opacity':1},300);
						$(this).css({'fill':'#1A3B42'});
						$('#female-options .tick').unbind('click');
						if(collectedData.gender=='female')
							$('#female-options').fadeOut(300);
						$('#female-options .tickBox').attr('data-checked',toBool(false));
						delete collectedData.breastfeeding;
						delete collectedData.pregnant;
						delete collectedData.gender;
						checkStep();
					}
				})
			})
			if(window.isIE){
				$('#age-value-preview .tip').css('bottom','-9px');
				$('#age-under-twelve .tip').css('top','-14px');
			}
			for(var elem=0; elem<101; elem++){
					/*var n=step1data.slider.length;
					var tpt=$('<div class="point" data-point="'+elem+'"></div>').appendTo('#age-slider .points');
					if(elem==0)$(tpt).css('margin-left','5px');
					if(elem==n)$(tpt).css('margin-right','5px');
					if(elem<n-1)$(tpt).css('margin-right',(460 - 10 - n*9)/(n-1));*/
					if(elem%10==0 && elem<71) $('#age-slider-labels').append('<div class="label" data-point="'+elem+'">'+elem+'</div>');
			}
			$('#age-slider-labels .label').on('click',function(){
				/*var tval=parseInt($(this).attr('data-point'));
				$('#age-slider .knob').animate({'left':tval*4.22},300);
				$('#age-slider .indicator').animate({'width':tval*4.22+20},300);
				collectedData.age=step1data.slider[(parseInt($(this).attr('data-point')))];
				checkStep();*/
			});
			
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
								$('#age-under-twelve').fadeIn(200);
							}else{
								$('#age-under-twelve').fadeOut(200);
							}
							ageSelect(parseInt(tVal))
						}
					},
				stop: function() {
					var tVal=Math.round($('#age-slider .knob').position().left/4.22);
					if(tVal<12)
							{
								$('#age-under-twelve').fadeIn(200);
								enableNext('disable');
							}else{
								if(typeof collectedData.gender!="undefined") enableNext();
								else enableNext('disable');
								$('#age-under-twelve').fadeOut(200);
							}
/*						var tval=$('#age-slider .point[data-point="'+(Math.round(($(this).position().left)*(step1data.slider.length-1)/434))+'"]').position().left;
						$('#age-slider .indicator').animate({'width':tval},300);
						$(this).animate({'left': (tval-$(this).width()/2)+'px'},300);
						$(this).attr("data-point",(Math.round((tval-$(this).width()/2)*(step1data.slider.length-1)/434)+1));
						collectedData.age=step1data.slider[$('#age-slider .knob').attr('data-point')-1];
checkStep();*/
					}
			});
		}
	break;
	case 2:
		{
			setStepBar(2);
			for(elem in step2mealdata){ inters.push(0); mealsQuantity.push(0);}
			for(var iter=0; iter<step2mealdata.length; iter++){
				var t=iter;
				$('.plate-menu.float-left.menu').append('<div data-meal="'+(t+1)+'" class="meal-btn menu-item"></div>');
				var twolines=false;
				if(step2mealdata[iter].name.indexOf('*')>-1)twolines=true;
				var obj=$('div.meal-btn[data-meal="'+(iter+1)+'"]');
				obj	.append(askIcon)
					.attr('data-meal',iter+1);
				$('svg',obj)
					.unbind('click')
					.on('click',function(e){
							//var iter=0;
							e.stopPropagation();
							$('#step-2 div.step-overlay').fadeIn(500,0);
							var tdat=step2mealdata[$(this).parent().attr('data-meal')-1];
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
						})
						
				obj.append('<div class="meal-btn-drag float-left" data-meal="'+(iter+1)+'"></div>');
				$('div.meal-btn[data-meal="'+(iter+1)+'"] div.meal-btn-drag')
					.append('<img src="img/svg/'+step2mealdata[iter]['short']+'_big.svg" />');
			$('div.meal-btn[data-meal="'+(iter+1)+'"] div.meal-btn-drag').parent().append('<div class="meal-btn-label '+(twolines?'twolines':'')+'">'+step2mealdata[iter].name.replace('*','<br />')+'</div>');				
			};

			$('.meal-btn-drag').on('click',function(e){

					if(!$('#step-2').hasClass('overlay-visible'))
					{
						mealsQuantity[$(this).attr("data-meal")-1]=Math.min(mealsQuantity[$(this).attr("data-meal")-1]+1,9);
						collectedData.meals=mealsQuantity;
						update();
						enableNext();
						setTimeout(function(){
							update();
						},100)
						setTimeout(function(){
							update();
						},300)
						setTimeout(function(){
							update();
						},500)
						setTimeout(function(){
							update();
						},1000)
						setTimeout(function(){
							update();
						},1500)
					}
					
					if(firstMeal){
						firstMeal=false;
						
						////
						
						e.stopPropagation();
							$('#step-2 div.step-overlay').fadeIn(500,0);
							var tdat=step2mealdata[$(this).attr('data-meal')-1];
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
				});
			$('.meal-btn-drag').draggable({revert:true, drag: function(event, ui) { if($('div#step-2').hasClass('overlay-visible')) return false; }});
			$('#plate-chart').droppable({ accept: ".meal-btn-drag",
			 drop: function( event, ui ) {
					/*mealsQuantity[ui.draggable.attr("data-meal")-1]++;
					collectedData.meals=mealsQuantity;
					//console.log('dropping: '+(ui.draggable.attr("data-meal")-1))
					update();
					enableNext();
					setTimeout(function(){
						update();
					},100)*/
				 }
			});

			var mealGroups=d3.select("#plate-chart").append('div').attr('id','mealGroups')
			//D3 helper function to populate pie slice parameters from array data
			var donut = d3.layout.pie().sort(null).value(function(d){
			  return d.mealTotalCount;
			});

			//D3 helper function to draw arcs, populates parameter "d" in path object
			var arc = d3.svg.arc()
			  .startAngle(function(d){ return d.startAngle; })
			  .endAngle(function(d){ return d.endAngle; })
			  .innerRadius(ir)
			  .outerRadius(r);

			///////////////////////////////////////////////////////////
			// GENERATE FAKE DATA /////////////////////////////////////
			///////////////////////////////////////////////////////////

			var arrayRange = 100; //range of potential values for each item
			var arraySize;
			var streakerDataAdded;

			function fillArray() {
			  return {
				port: "port",
				mealTotalCount: Math.ceil(Math.random()*(arrayRange))
			  };
			}

			///////////////////////////////////////////////////////////
			// CREATE VIS & GROUPS ////////////////////////////////////
			///////////////////////////////////////////////////////////

			var vis = d3.select("#plate-chart > svg")

			//GROUP FOR ARCS/PATHS
			var arc_group = vis.append("svg:g")
			  .attr("class", "arc")
			  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

			//GROUP FOR LABELS
			var label_group = vis.append("svg:g")
			  .attr("class", "label_group")
			  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

			//GROUP FOR CENTER TEXT  
			var center_group = vis.append("svg:g")
			  .attr("class", "center_group")
			  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

			///////////////////////////////////////////////////////////
			// STREAKER CONNECTION ////////////////////////////////////
			///////////////////////////////////////////////////////////


			// to run each time data is generated
			function update() {
			  arraySize = Math.ceil(Math.random()*5);
			  streakerDataAdded = d3.range(step2mealdata.length).map(
				function(a){return {mealTotalCount: mealsQuantity[a], port: step2mealdata[a].name}}
			);

			  if(mealsQuantity.reduce(function(a, b) { return a + b; }, 0)==0)
				{
					odlPieData=[];
				}else{
			  oldPieData = filteredPieData;
			  pieData = donut(streakerDataAdded);
				}

			  var totalmeals = 0;
			  filteredPieData = pieData.filter(filterData);
			  function filterData(element, index, array) {
				element.name = streakerDataAdded[index].port;
				element.value = streakerDataAdded[index].mealTotalCount;
				element.mealIndex = index;
				totalmeals += element.value;
				return (element.value > -1);
			  }

			  if(filteredPieData.length > -1 && oldPieData.length > -1){

				//REMOVE PLACEHOLDER CIRCLE
				arc_group.selectAll("circle").remove();

				//DRAW ARC PATHS
				paths = arc_group.selectAll("path").data(filteredPieData);
				paths.enter().append("svg:path")
					.attr("data-role","chartPath")
					.attr("data-meal",function(d){
						return d.mealIndex; })
					.transition()
					.duration(tweenDuration)
					.attrTween("d", pieTween);
				paths
				  .transition()
					.duration(tweenDuration)
					.attrTween("d", pieTween);
				paths.exit()
				  .transition()
					.duration(tweenDuration)
					.attrTween("d", removePieTween)
				  .remove();


				//DRAW TICK MARK amountChangers FOR LABELS
				mealGroups.selectAll("div").data(function(){
					var tempAr=[];
					for(var iter=0; iter<step2mealdata.length; iter++)tempAr.push(iter);
						return tempAr;
					}).enter()
					.append('div')
					.attr('id',function(d,e){return 'mealGroup'+e})
					.attr('class','mealGroup')
					.attr('data-meal',function(e){return e});
				mealGroups.selectAll("div.mealGroup").selectAll('div').data(['mealSign','minusSign','plusSign','quantityLabel']).enter()
					.append('div')
					.attr('class',function(d,e){
					return d;})
					.html(function(d,e){
						switch(d){
							case 'minusSign':
								return '-';
							case 'plusSign':
								return '+';
							case 'mealSign':
								return '<img src=img/svg/'+step2mealdata[$(this).parent().attr('data-meal')].short+'_small.svg />';
							}
						});
				
				mealGroups.selectAll(".quantityLabel").data(filteredPieData).text(function(d){
					return d.value;
				  });

				amountChangers = label_group.selectAll(".amountChanger").data(filteredPieData);
				
				amountChangers.enter().append("svg:circle")
				.attr("data-meal",function(d) {return d.mealIndex; })
				.attr("class",'amountChanger mealLabel')
				.attr("cx", 0).attr("cy",circlePadding)
					.attr("r", 0)
					.attr("transform", function(d,e) {
						return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
					});
				
				amountChangers.style('display',function(d, e){
					if(mealsQuantity[e]>0||mealsQuantity[e-mealsQuantity.length]>0){
						if($('#mealGroup'+e).css('display')=='none')
						$('#mealGroup'+e).css({
							'top':-1*$('#mealGroup'+e).height()/2+$('.step-2-wrapper').position().top+340+35,
							'left':-1*$('#mealGroup'+e).width()/2+$('.step-2-wrapper').position().left+450
						})
						$('#mealGroup'+e).fadeIn(300,0);
						return 'block';
					}else{
						$('#mealGroup'+e).css('display','none');
						return 'none';
					}
				})
				
				
				
				var allMeals=0;
				var smallestMeal=50;
				for(var item in mealsQuantity){
					allMeals+=mealsQuantity[item];
					if(mealsQuantity[item]>0)
						smallestMeal=Math.min(smallestMeal,mealsQuantity[item]);
				}
				//console.log('all: '+allMeals+', smallest: '+smallestMeal);
				if(allMeals==smallestMeal){
					circlePadding=0;
				}else{
					if(allMeals/smallestMeal>1) circlePadding=-45;
					if(allMeals/smallestMeal>2) circlePadding=-55;
					if(allMeals/smallestMeal>3) circlePadding=-55;
					if(allMeals/smallestMeal>4) circlePadding=-70;
					if(allMeals/smallestMeal>5) circlePadding=-100;
					if(allMeals/smallestMeal>6) circlePadding=-120;
					if(allMeals/smallestMeal>7) circlePadding=-130;
				}
				function calculateCirclePadding(val){
					var allMeals=0;
					var smallestMeal=50;
					for(var item in mealsQuantity){
						allMeals+=mealsQuantity[item];
						if(mealsQuantity[item]>0) smallestMeal=Math.min(smallestMeal,mealsQuantity[item]);
					}
					if(allMeals==smallestMeal){
					return 0;
					}else{
						if(val==0)return 0;
						var tval=allMeals/val;
							if(tval<1) return -45;
							if(tval>1&&tval<=2) return -55;
							if(tval>2&&tval<=3) return -55;
							if(tval>3&&tval<=4) return -65;
							if(tval>4&&tval<=5) return -75;
							if(tval>5&&tval<=6) return -85;
							if(tval>6&&tval<=7) return -95;
							if(tval>7&&tval<=8) return -105;
							if(tval>8) return -115;
					}
				}
				
				function updateLabels(e,f){
					var tx=Math.cos(Math.PI/2+(e.startAngle+e.endAngle)/2  )*circlePadding;
					var ty=Math.sin(Math.PI/2+(e.startAngle+e.endAngle)/2  )*circlePadding;
					$('#mealGroup'+f).animate({
						'opacity':1,
						'top':-1*$('#mealGroup'+f).height()/2+$('.step-2-wrapper').position().top+340+35+ty,
						'left':-1*$('#mealGroup'+f).width()/2+$('.step-2-wrapper').position().left+450+tx
					},{'duration':300, 'easing':'easeOutCubic', 'queue':false});
				}
				
				amountChangers.transition()
				.each('start',function(e,f){
					if(inters[f]==0)
						inters[f]=setInterval(updateLabels,40,e,f);
				})
				.each('end',function(e,f){
					clearTimeout(inters[f]);
					inters[f]=0;
				})
				  .duration(tweenDuration)
						.attr("cx", 0).attr("cy",
							function(e,f){
								return calculateCirclePadding(e.value)
								})
						.attr("transform", function(d,e) {
					return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
				  })
				amountChangers.exit().remove();
				
				/*
				if(window.isIE)
				$('.mealGroup').on('mouseover',function(){
					$('.plusSign',$(this)).show();
					$('.minusSign',$(this)).show();
				})
				if(window.isIE)
				$('.mealGroup').on('mouseout',function(){
					$('.plusSign',$(this)).hide();
					$('.minusSign',$(this)).hide();
				})*/

				$('.mealGroup .minusSign').unbind('click').click(function(){
					mealsQuantity[$(this).parent('.mealGroup').attr('data-meal')]=Math.max(0,mealsQuantity[$(this).parent('.mealGroup').attr('data-meal')]-1);
					collectedData.meals=mealsQuantity;
					if(mealsQuantity.reduce(function(a, b) { return a + b })==0)enableNext('disable');
					update()
				})
				$('.mealGroup .plusSign').unbind('click').click(function(){
					mealsQuantity[$(this).parent('.mealGroup').attr('data-meal')]=Math.min(9,mealsQuantity[$(this).parent('.mealGroup').attr('data-meal')]+1);
					collectedData.meals=mealsQuantity;
					update()
				})
			  }  
			}

			///////////////////////////////////////////////////////////
			// FUNCTIONS //////////////////////////////////////////////
			///////////////////////////////////////////////////////////

			// Interpolate the arcs in data space.
			function pieTween(d, i) {
			if(mealsQuantity.reduce(function(a, b) { return a + b; }, 0)==0)
				{
					oldPieData=[];
					$('g.arc').fadeOut(300,0);
					return;}
			else
				$('g.arc').fadeIn(300,0);
			  var s0;
			  var e0;
			  if(oldPieData[i]){
				s0 = oldPieData[i].startAngle;
				e0 = oldPieData[i].endAngle;
			  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
				s0 = oldPieData[i-1].endAngle;
				e0 = oldPieData[i-1].endAngle;
			  } else if(!(oldPieData[i-1]) && oldPieData.length > 0){
				s0 = oldPieData[oldPieData.length-1].endAngle;
				e0 = oldPieData[oldPieData.length-1].endAngle;
			  } else {
				s0 = 0;
				e0 = 0;
			  }
			  var i = d3.interpolate({startAngle: s0, endAngle: e0}, {startAngle: d.startAngle, endAngle: d.endAngle});
			  return function(t) {
				var b = i(t);
				return arc(b);
			  };
			}

			function removePieTween(d, i) {
			  s0 = 2 * Math.PI;
			  e0 = 2 * Math.PI;
			  var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
			  return function(t) {
				var b = i(t);
				return arc(b);
			  };
			}

			function textTween(d, i) {
			  var a;
			  if(oldPieData[i]){
				a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI)/2;
			  } else if (!(oldPieData[i]) && oldPieData[i-1]) {
				a = (oldPieData[i-1].startAngle + oldPieData[i-1].endAngle - Math.PI)/2;
			  } else if(!(oldPieData[i-1]) && oldPieData.length > 0) {
				a = (oldPieData[oldPieData.length-1].startAngle + oldPieData[oldPieData.length-1].endAngle - Math.PI)/2;
			  } else {
				a = 0;
			  }
			  var b = (d.startAngle + d.endAngle - Math.PI)/2;

			  var fn = d3.interpolateNumber(a, b);
			  return function(t) {
				var val = fn(t);
				return "translate(" + Math.cos(val) * (r+textOffset) + "," + Math.sin(val) * (r+textOffset) + ")";
			  };
			}
		}
		break;
		case 3:
		{
			enableNext();
			collectedData.oils={};
			for(elem in stepsdata['step-'+(currentStep)].oils){
				collectedData.oils[stepsdata['step-'+(currentStep)].oils[elem].replace(' ','-')]='false';
				$('#oils-selection').append('<div class="tick" data-value="'+stepsdata['step-'+(currentStep)].oils[elem].replace(' ','-')+'"><div class="tickBox dark-gray-bck"><div class="checked"></div></div>'+stepsdata['step-'+(currentStep)].oils[elem]+'</div>');
			}
			$('#oils-selection .tick').on('click',function(){
				if($('.tickBox', this).attr('data-checked')=='true')
					$('.tickBox', this).attr('data-checked','false')
				else
					$('.tickBox', this).attr('data-checked','true')
				collectedData.oils[$(this).attr('data-value')]=$('.tickBox', this).attr('data-checked');
				checkStep();
			})
		}
		break;
		case 4:
		{
			enableNext('overlay');
			for(var iter=0; iter<=12; iter++){
				$('#water-images').append('<img src="img/svg/water.svg" data-number="'+(iter+1)+'" class="float-center"/>');
			}
			collectedData.water=2;
			$('#water-images>img[data-number="1"], #water-images>img[data-number="2"]').delay(600).fadeIn(300);
			$('#step-4 .water-button').on('click', function(){
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
						$('#water-images>img').animate({'margin-top':val>5?(val-5)*20:0},200,'linear');
					},
					step: function(value) {
						if(!window.isIE){
						$('#water-images>img').attr('width',Math.min(104,value));
						$('#water-images>img').attr('height',(Math.min(104,value)*194)/104);
						}else{
							$('#water-images>img').css('zoom',(Math.min(104,value)*1)/104);
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
				tstr+='<div class="activity activity-'+tdat[elem].title.toLowerCase()+'"><p class="step-title subtitle">'+tdat[elem].title+
				'<img class="actAskImg" src="img/svg/ask_act.svg" data-attr="'+elem+'"/>'
				+'</p>';
				tstr+='<div class="activity-image"><img height="70" src="img/svg/'+tdat[elem].icon+'.svg"/></div><ul class="activities-list georgia dark-blue">';
					for(eleme in tdat[elem].examples)
					tstr+='<li>'+tdat[elem].examples[eleme]+'</li>';
				tstr+='</ul><div class="activity-time-selector" data-min="0" data-max="2880">'
				+		'<div data-role="change" data-property="'+tdat[elem].title.toLowerCase()+'" data-value="-30" class="activity-button round-button dark smaller"><img src="img/svg/minus_sign.svg" /></div>'
				+		'<div data-role="value" data-type="hour" class="dark-blue georgia">'+intToHours(tdat[elem].init)+'</div>'
				+		'<div data-role="change" data-property="'+tdat[elem].title.toLowerCase()+'" data-value="+30" class="activity-button round-button bright smaller"><img src="img/svg/plus_sign.svg" /></div>'
				+	'</div>'
				+'</div>';
				collectedData['activity-'+tdat[elem].title.toLowerCase()]=parseInt(tdat[elem].init);
				$('#step-5-overlay').append('<img alt="information" class="ask-sign ask-act-img" data-img="'+elem+'" src="img/svg/'+(elem==0?'ask_bike':'ask_lifting')+'.svg" width="90" height="90"/>');
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
					$(this).attr('src',$(this).attr('src').replace('_hover.svg','.svg'))
				})
				$('.ask-act-img[data-img="'+$(this).attr('data-attr')+'"]').attr('src',$('.ask-act-img[data-img="'+$(this).attr('data-attr')+'"]').attr('src').replace('.svg','_hover.svg'))
				$('#step-5-overlay .overlay-content').html(stepsdata['step-'+(currentStep)].activities[parseInt($(this).attr('data-attr'))].description+'<br><div class="button close">CLOSE</div>');
				$('#step-5-overlay .button.close').on('click',function(){
					$('#step-5-overlay').fadeOut(300);
					$('#step-5').removeClass('overlay-visible');
				})
			})
			$('.actAskImg').hover(
				function(){
					$(this).attr('src','img/svg/ask_act_hover.svg');
				},
				function(){
					$(this).attr('src','img/svg/ask_act.svg');
				}
			);
			$('.ask-act-img').on('click',
				function(){
					$('.ask-act-img').each(function(){
						$(this).attr('src',$(this).attr('src').replace('_hover.svg','.svg'))
					})
					$(this).attr('src',$(this).attr('src').replace('.svg','_hover.svg'))
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
