function intToHours(p){
	var m=p%60=='0'?'00':p%60;
	var h=(p-p%60)/60;
	return h+':'+m;
}
﻿function requestIFrameResize(extraSpace, scroll)
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
var data=loadedJsonData;
var loc=window.location.href.replace('view','receive');
var totalact=0;

var inters_r=[];
var inters_u=[];
var mealsDataRecommended=[];
var mealsDataRecommendedPlate=[];
var mealsDataRecommendedPlateR=[];

var mealsNames=['fruit','vegetables','lean meats + alternatives','milk, yoghurt, cheese','grains, cereals','discretionary foods'];

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

pregnant=toBool(pregnant);
breastfeeding=toBool(breastfeeding);

var arraySize;
var recommendedData;
var recommendedDataActivity;

function buildCriteria(data){
	if(!pregnant&&!breastfeeding)
		recommendedData=data.recommendations[gender]['age-'+agegroup];
	else if(pregnant)
		recommendedData=data.recommendations.pregnant;
	else{
		recommendedData=data.recommendations.breastfeeding;
		recommendedData.activity=data.recommendations[gender]['age-'+agegroup].activity;
	}
}

function fillDescription(data){
	var tip;
	var satisfactionaryActivity=recommendedData.activity;
	var appendStr='';
	
	
	for(var el in mealsDataUser)
	{
		var cname=data.results.food.foods[el];
		
		if(typeof mealsDataRecommendedPlate[el]=='undefined')mealsDataRecommendedPlate[el]=[];
		if(typeof recommendedData[cname]!='undefined'){
			if(typeof recommendedData[cname]=='number'){
				mealsDataRecommendedPlate[el][0]=recommendedData[cname];
				mealsDataRecommendedPlate[el][1]=recommendedData[cname];
				mealsDataRecommendedPlateR[el]=recommendedData[cname];
			}else{
				mealsDataRecommendedPlate[el][0]=recommendedData[cname][0];
				mealsDataRecommendedPlate[el][1]=recommendedData[cname][1];
				mealsDataRecommendedPlateR[el]=recommendedData[cname+'-r'];
			}
		}
	}
	
	
	
	var samePlates=true;
	if(samePlates)
		for(var el in mealsDataUser)
		{
			if(samePlates)
			if(mealsDataUser[el]<mealsDataRecommendedPlate[el][0]||mealsDataUser[el]>mealsDataRecommendedPlate[el][1])
			samePlates=false;
		}

	totalact=parseInt(act_m)+parseInt(act_h);

	$('div[data-role="dietary-general"]').empty().append(data.results.food.general[samePlates?'satisfactory':'increase']);
	$('div[data-role="dietary-tips"]').empty().append('<div class="ul"></div>');
	var dt= $('div[data-role="dietary-tips"] div.ul');


	for(var el in mealsDataUser)
	{
		tip=undefined;
		var cname=data.results.food.foods[el];
		
		if(typeof recommendedData[cname]!='undefined'){
			if(typeof recommendedData[cname]=='number'){
				mealsDataRecommended[el]=recommendedData[cname];
				mealsDataRecommendedPlate[el][0]=recommendedData[cname];
				mealsDataRecommendedPlate[el][1]=recommendedData[cname];
				tip=data.results.food[data.results.food.foods[el]][mealsDataUser[el]<recommendedData[cname]?'increase':mealsDataUser[el]>recommendedData[cname]?'decrease':null]			
			}else{
				mealsDataRecommended[el]=(recommendedData[cname][0]+recommendedData[cname][1])/2;
				mealsDataRecommendedPlate[el][0]=recommendedData[cname][0];
				mealsDataRecommendedPlate[el][1]=recommendedData[cname][1];
				//mealsDataRecommended[el]=Math.round((recommendedData[cname][0]+recommendedData[cname][1])/2);
				tip=data.results.food[data.results.food.foods[el]][mealsDataUser[el]<recommendedData[cname][0]?'increase':mealsDataUser[el]>recommendedData[cname][1]?'decrease':null]
			}
			
		}
		if(typeof tip!='undefined'){
			if(typeof tip=='object'){
				var tip2=tip[Math.round(Math.random()*(tip.length-1))];
				tip=tip2;
				dt.append('<div class="li" data-meal="'+cname+'"><img src="img/'+'apple*carrot*meat*milk*cereals*discret'.split('*')[el]+'_small.jpg" />'+tip+'</div>');
				//for(elm in tip)
				//dt.append('<li>'+tip[elm]+'</li>');
			}else if(typeof tip=='string') {
					dt.append('<div>'+tip+'</div>');
			}
		}
	}
	appendStr='';
	
	if(!pregnant){
		$('div[data-role="activity-general"]').empty().append(data.results.activity.general[totalact>=satisfactionaryActivity?'satisfactory':'increase']);
		$('div[data-role="activity-tips"]').empty().append('<ul></ul>');
		var at= $('div[data-role="activity-tips"] ul');
		
		tip=undefined;
		tip=data.results.activity['age-'+agegroup][totalact>=satisfactionaryActivity?'satisfactory':'increase'];
		if(typeof tip!='undefined'){
			if(typeof tip=='object'){
					//var tip2=tip[Math.round(Math.random()*(tip.length-1))];
					//tip=tip2;
					//at.append('<li>'+tip+'</li>');
					for(elm in tip)
					at.append('<li>'+tip[elm]+'</li>');
			}else if(typeof tip=='string'){
					at.append('<li>'+tip+'</li>');
			}
		}
	}else{
		$('div[data-role="activity-general"]').empty().append(data.results.activity.general.pregnant);
		$('div[data-role="activity-tips-headline"]').remove();
		$('div[data-role="activity-tips"]').remove();
	}
	
	
	for(var elmt in mealsDataRecommendedPlateR)
	{
		$('#plate-chart-recommended tr[data-num="'+elmt+'"] .value-field').text(mealsDataRecommendedPlateR[elmt])
	}
	for(var elmat in mealsDataUser)
	{
		$('#plate-chart-user tr[data-num="'+elmat+'"] .value-field').text(mealsDataUser[elmat])
	}
	
	
}

$( document ).ready( function(){
	var data=loadedJsonData;
	$('#step-6').css({'opacity':1, 'display':'block'});
	$('#steps-container').css({'opacity':0, 'display':'block'});
		plateData=data.steps['step-2'].meal;
		buildCriteria(data);
		fillDescription(data);
	$('.activity-time-preview[data-role="user"]').html(intToHours(parseInt(act_h)+parseInt(act_m)).replace(':',' : '));
	if(!pregnant)
		$('.activity-time-preview[data-role="recommended"]').html(intToHours(recommendedData.activity).replace(':',' : '));
	else
		$('.activity-time-preview[data-role="recommended"]').addClass('pregnant').text('N/A');
			
		$('#step-description').css({'height':$('#step-description').height()})
		$('#step-description').animate({opacity:0}, 300, function(){
			//$('#step-description').css({'height':'auto'})
			$('#step-description').empty().html('You’re done! See below for your results. Compare your daily plate with the recommended daily plate, and see some great tips tailored for you to help balance your energy levels by what you eat, drink and how active you are.');
			$('#step-description').animate({opacity:1, 'height':$(this)[0].scrollHeight}, 300);
			$('#steps-bar .step-button').css('display','inline-block').fadeIn(300);
		});

		$('#steps-container').delay(500).animate({'opacity':1},300,function(){
			requestIFrameResize(50, true);
		});

		$('#submit').on('click',function(){
		if($('#getmail input[name="email"]').val().length>0)
			var posting = $.post( 'addmail.php', { url: resultUrl, mail: $('#getmail input[name="email"]').val()})
			.done(function( data ) {
				$('#mail_added').show();
			});
		});
	
		if(window.navigator.userAgent.toLowerCase().indexOf('chrome')>-1||window['isIE'])$('#submit').css('height','40px');

		var shareLink='www.togethercounts.com.au/staging/healthy-balance-calculator/';
		$('#a_mail').attr('href','mailto:?subject='+'Take%20the%20Healthy%20Balance%20Checker%20&body=Hi,%0AI%20just%20took%20the%20Healthy%20Balance%20Checker%20and%20thought%20you%20would%20be%20interested%20in%20trying%20it%20out:%0A'+escape(shareLink));
		$('#a_fb').attr('href','https://www.facebook.com/sharer/sharer.php?u='+shareLink);
		$('#a_twitter').attr('href','https://twitter.com/intent/tweet?&source=tweetbutton&text=Take%20the%20Healthy%20Balance%20Checker%20http://www.togethercounts.com.au/healthy-balance-calculator/%20by%20@TogetherAU&original_referef='+shareLink);
	
		$('#tabs .step-button').on('click',function(){
			$('#tabs .step-button').addClass('inactive');
			$(this).removeClass('inactive');
			$('div.tab-pane').fadeOut(300);
			$('div.tab-pane[data-tab="'+$(this).attr('data-tab')+'"]').delay(400).fadeIn(300);
		})
});