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


var dataarchs=[];
var dataarchs_r=[];
var mealsDataRecommended=[];
var mealsDataRecommendedPlate=[];
var mealsDataRecommendedPlateR=[];

var w = 300;
var h = 300;
var r = 120;
var ir = 0;
var textOffset = 14;
var tweenDuration = 250;
var amountChangerTransform=20;
var circlePadding=-50;
var mgx=290;
var mgy=330;
var loc=window.location.href.replace('view','receive');
var totalact=0;

var inters_r=[];
var inters_u=[];

var mealsNames=['fruit','vegetables','lean meats + alternatives','milk, yoghurt, cheese','grains, cereals','discretionary foods'];

//OBJECTS TO BE POPULATED WITH DATA LATER
var amountChangers_u;
var amountChangers_r;
var pieData_u = [];    
var pieData_r = [];    
var oldPieData_u = [];
var oldPieData_r = [];
var filteredPieData_u = [];
var filteredPieData_r = [];

var mealGroupsUser=d3.select("#plate-chart-user").append('div').attr('id','mealGroups')
var mealGroupsRecommended=d3.select("#plate-chart-recommended").append('div').attr('id','mealGroupsR')
//D3 helper function to populate pie slice parameters from array data
var donut_u = d3.layout.pie().sort(null).value(function(d){
  return d.mealTotalCount_u;
});
var donut_r = d3.layout.pie().sort(null).value(function(d){
  return d.mealTotalCount_r;
});

//D3 helper function to create colors from an ordinal scale
var color = d3.scale.category20();

//D3 helper function to draw arcs, populates parameter "d" in path object
var arc = d3.svg.arc()
  .startAngle(function(d){ return d.startAngle; })
  .endAngle(function(d){ return d.endAngle; })
  .innerRadius(ir)
  .outerRadius(r);

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

///////////////////////////////////////////////////////////
// GENERATE FAKE DATA /////////////////////////////////////
///////////////////////////////////////////////////////////

var arrayRange = 100; //range of potential values for each item
var arraySize;
var streakerDataAdded_u;
var streakerDataAdded_r;
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
				dt.append('<div class="li" data-meal="'+cname+'"><img onload="this.width/=3/2;this.onload=null;" src="img/svg/'+'apple*carrot*meat*milk*cereals*discret'.split('*')[el]+'_small.svg" />'+tip+'</div>');
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
	
	
	
}

function fillArray() {
  return {
    port: "port",
    mealTotalCount_u: Math.ceil(Math.random()*(arrayRange))
  };
}
$( document ).ready( function(){
	$('#step-6').css({'opacity':1, 'display':'block'});
		$('#steps-container').css({'opacity':0, 'display':'block'});
	$.getJSON('data-json.php', function(data){
///////////////////////////////////////////////////////////
// CREATE VIS & GROUPS ////////////////////////////////////
///////////////////////////////////////////////////////////
plateData=data.steps['step-2'].meal;

buildCriteria(data);

fillDescription(data);

	$('.activity-time-preview[data-role="user"]').html(intToHours(parseInt(act_h)+parseInt(act_m)).replace(':',' : '));
	if(!pregnant)
		$('.activity-time-preview[data-role="recommended"]').html(intToHours(recommendedData.activity).replace(':',' : '));
	else
		$('.activity-time-preview[data-role="recommended"]').addClass('pregnant').text('N/A');

for(elem in mealsDataUser){
	inters_u.push(0);	
}
for(elem in mealsDataRecommended){
	inters_r.push(0);	
}


			var vis_u = d3.select("#plate-chart-user > svg")
			var vis_r = d3.select("#plate-chart-recommended > svg")

			//USER
			//GROUP FOR ARCS/PATHS
			var arc_group_u = vis_u.append("svg:g")
			  .attr("class", "arc")
			  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

			//GROUP FOR LABELS
			var label_group_u = vis_u.append("svg:g")
			  .attr("class", "label_group")
			  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");
			  
			  
			//RECOMMENDED
			var arc_group_r = vis_r.append("svg:g")
			  .attr("class", "arc")
			  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");

			//GROUP FOR LABELS
			var label_group_r = vis_r.append("svg:g")
			  .attr("class", "label_group")
			  .attr("transform", "translate(" + (w/2) + "," + (h/2) + ")");


//////////////////////////////////////////////////////////////////////////////////////////
		
function update_r() {
	streakerDataAdded_r = d3.range(plateData.length).map(
				function(a){return {mealTotalCount_r: mealsDataRecommendedPlateR[a], port: plateData[a].name}}
			);
	
			if(mealsDataRecommendedPlateR.reduce(function(a, b) { return a + b; }, 0)==0)
			{
				oldPieData_r=[];
			}else{
				oldPieData_r = filteredPieData_r;
				pieData_r = donut_r(streakerDataAdded_r);
			}
			

			var totalmeals_u = 0;
			var totalmeals_r = 0;
			filteredPieData_r = pieData_r.filter(filterData_r);
			function filterData_r(element, index, array) {
				element.name = streakerDataAdded_r[index].port;
				element.value = streakerDataAdded_r[index].mealTotalCount_r;
				element.mealIndex = index;
				totalmeals_r += element.value;
				return (element.value > -1);
			}
			filteredPieData_r = pieData_r.filter(filterData_r);
			function filterData_r(element, index, array) {
				element.name = streakerDataAdded_r[index].port;
				element.value = streakerDataAdded_r[index].mealTotalCount_r;
				element.mealIndex = index;
				totalmeals_r += element.value;
				return (element.value > -1);
			}

			  if(filteredPieData_r.length > -1 && oldPieData_r.length > -1){

				//REMOVE PLACEHOLDER CIRCLE
				arc_group_r.selectAll("circle").remove();

				//DRAW ARC paths_r
				paths_r = arc_group_r.selectAll("path").data(filteredPieData_r);
				paths_r.enter().append("svg:path")
					.attr("data-role","chartPath")
					.attr("data-meal",function(d){
						return d.mealIndex; })
					.transition()
					.duration(tweenDuration)
					.attrTween("d", pieTween_r);
				paths_r
				  .transition()
					.duration(tweenDuration)
					.attrTween("d", pieTween_r);
				paths_r.exit()
				  .transition()
					.duration(tweenDuration)
					.attrTween("d", removePieTween_r)
				  .remove();


				//DRAW TICK MARK amountChangers FOR LABELS
				mealGroupsRecommended.selectAll("div").data(function(){
					var tempAr=[];
					for(var iter=0; iter<plateData.length; iter++)
					{
						tempAr.push(iter);
					//	alert(plateData[iter].short);
					}
						return tempAr;
					}).enter()
					.append('div')
					.attr('id',function(d,e){return 'mealGroupR'+e})
					.attr('class','mealGroup')
					.attr('data-meal',function(e){return e});
				mealGroupsRecommended.selectAll("div.mealGroup").selectAll('div').data(['mealSign','quantityLabel']).enter()
					.append('div')
					.attr('class',function(d,e){
					return d;})
				
				mealGroupsRecommended.selectAll(".quantityLabel").data(filteredPieData_r).text(function(d){
					//console.log(mealsNames[d.mealIndex]);
					return d.value;
				  });

				amountChangers_r = label_group_r.selectAll(".amountChanger").data(filteredPieData_r);
				
				amountChangers_r.enter().append("svg:circle")
				.attr("data-meal",function(d) {return d.mealIndex; })
				.attr("class",'amountChanger mealLabel')
					.attr("transform", function(d,e) {
						dataarchs_r.push({'sa':d.startAngle, 'ea':d.endAngle})
						return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
					});
				
				mgx=300;
				 mgy=300;
				var circlePadding_u=-40;
				
				//circlePadding
				//$('<img data-group="" data-sa="" data-ea="" data-image="" width="3" height="3" src=img/svg/apple_small.svg />').appendTo('#mealGroups').css('left',$('#plate-chart-user').position().left+mgx/2).css('top',$('#plate-chart-user').position().top+mgy/2)
				for(var iter=0; iter<6; iter++){
					for(var siter=0; siter<Math.ceil(mealsDataRecommendedPlateR[iter]); siter++){
						var isint=mealsDataRecommendedPlateR[iter]%1!=0;
						var src;
						if(plateData[iter].icons)
							src=plateData[iter].icons[Math.round(Math.random()*(plateData[iter].icons.length-1))];
						else
							src=plateData[iter].short;
						src+='_small'
						if(isint&&siter==Math.ceil(mealsDataRecommendedPlateR[iter])-1)
							src+='_half'
						var t=$('<img data-group="'+iter+'" data-sa="'+dataarchs_r[iter].sa+'" data-ea="'+dataarchs_r[iter].ea+'" data-image="'+siter+'" width="30" height="30" src=img/svg/'+src+'.svg />').appendTo('#mealGroupsR');
						var tx,ty;
						if(Math.ceil(mealsDataRecommendedPlateR[iter])==1){
							//alert(iter);
							tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*2;
							ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*2;
						}
						if(Math.ceil(mealsDataRecommendedPlateR[iter])==2){
							tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*(siter==0?1:2);
							ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*(siter==0?1:2);
						}
						if(Math.ceil(mealsDataRecommendedPlateR[iter])==3){
							if(siter==0){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*.8;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*.8;
							}
							if(siter==1){
								tx=Math.cos(Math.PI/2+((3*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/4  )*circlePadding_u*1.5;
								ty=Math.sin(Math.PI/2+((3*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/4  )*circlePadding_u*1.5;
							}
							if(siter==2){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*3))/4  )*circlePadding_u*1.5;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*3))/4  )*circlePadding_u*1.5;
							}
						}
						if(Math.ceil(mealsDataRecommendedPlateR[iter])==4){
							if(siter==0||siter==3){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*(siter==0?1:2);;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*(siter==0?1:2);;
							}
							if(siter==1){
								tx=Math.cos(Math.PI/2+((3*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/4  )*circlePadding_u*1.5;
								ty=Math.sin(Math.PI/2+((3*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/4  )*circlePadding_u*1.5;
							}
							if(siter==2){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*3))/4  )*circlePadding_u*1.5;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*3))/4  )*circlePadding_u*1.5;
							}
						}
						if(Math.ceil(mealsDataRecommendedPlateR[iter])==5||Math.ceil(mealsDataRecommendedPlateR[iter])==6){
							if(siter==0||siter==3){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*(siter==0?.6:1.6);;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*(siter==0?.6:1.6);;
							}
							if(siter==1){
								tx=Math.cos(Math.PI/2+((5*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/6  )*circlePadding_u*1.2;
								ty=Math.sin(Math.PI/2+((5*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/6  )*circlePadding_u*1.2;
							}
							if(siter==2){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*5))/6  )*circlePadding_u*1.2;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*5))/6  )*circlePadding_u*1.2;
							}
							if(siter==4){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*2))/3 )*circlePadding_u*2;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*2))/3  )*circlePadding_u*2;
							}
							if(siter==5){
								tx=Math.cos(Math.PI/2+((2*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/3  )*circlePadding_u*2;
								ty=Math.sin(Math.PI/2+((2*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/3  )*circlePadding_u*2;
							}
						}
						if(Math.ceil(mealsDataRecommendedPlateR[iter])==7||Math.ceil(mealsDataRecommendedPlateR[iter])==8||Math.ceil(mealsDataRecommendedPlateR[iter])==9){
							var n=Math.ceil(mealsDataRecommendedPlateR[iter])==9?.8:1;
							if(siter==0){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*.8*n;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*circlePadding_u*.8*n;
							}
							if(siter==1){
								tx=Math.cos(Math.PI/2+((3*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/4  )*circlePadding_u*1.5*n;
								ty=Math.sin(Math.PI/2+((3*dataarchs_r[iter].sa)+dataarchs_r[iter].ea)/4  )*circlePadding_u*1.5*n;
							}
							if(siter==2){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*3))/4  )*circlePadding_u*1.5*n;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*3))/4  )*circlePadding_u*1.5*n;
							}
							if(siter==3){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*5))/6  )*circlePadding_u*2.3*n;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*5))/6  )*circlePadding_u*2.3*n;
							}
							if(siter==4){
								tx=Math.cos(Math.PI/2+(5*dataarchs_r[iter].sa+(dataarchs_r[iter].ea))/6  )*circlePadding_u*2.3*n;
								ty=Math.sin(Math.PI/2+(5*dataarchs_r[iter].sa+(dataarchs_r[iter].ea))/6  )*circlePadding_u*2.3*n;
							}
							if(siter==5){
								tx=Math.cos(Math.PI/2+(2*dataarchs_r[iter].sa+(dataarchs_r[iter].ea))/3  )*circlePadding_u*2.3*n;
								ty=Math.sin(Math.PI/2+(2*dataarchs_r[iter].sa+(dataarchs_r[iter].ea))/3  )*circlePadding_u*2.3*n;
							}
							if(siter==6){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*2))/3  )*circlePadding_u*2.3*n;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea*2))/3  )*circlePadding_u*2.3*n;
							}
							if(siter==7){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea))/2  )*circlePadding_u*1.9*(n*(2*n+1)/3);
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea))/2  )*circlePadding_u*1.9*(n*(2*n+1)/3);
							}
							if(siter==8){
								tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea))/2  )*circlePadding_u*2;
								ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+(dataarchs_r[iter].ea))/2  )*circlePadding_u*2;
							}
						}
						t.css({
							'position':'absolute',
							'top':-1*t.height()/2+$('#plate-chart-recommended').position().top+mgy/2+ty,
							'left':-1*t.width()/2+$('#plate-chart-recommended').position().left+mgx/2+tx
						});
					}
					if(Math.ceil(mealsDataRecommendedPlateR[iter])>0){
						tx=Math.cos(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*(-r+15);
						ty=Math.sin(Math.PI/2+(dataarchs_r[iter].sa+dataarchs_r[iter].ea)/2  )*(-r+15);
						$('#mealGroupR'+iter).show().css({
							'top':-1*$('#mealGroupR'+iter).height()/2+$('#plate-chart-recommended').position().top+mgy/2+ty,
							'left':-1*$('#mealGroupR'+iter).width()/2+$('#plate-chart-recommended').position().left+mgx/2+tx
						});
					}else $('#mealGroupR'+iter).hide();
				}
				
				amountChangers_r.style('display',function(d, e){
					if(Math.ceil(mealsDataRecommended[e])>0||Math.ceil(mealsDataRecommendedPlateR[e-mealsDataRecommendedPlateR.length])>0){
						if($('#mealGroupR'+e).css('display')=='none')
						$('#mealGroupR'+e).css({
							//'top':1000,
							//'left':1000
							//'top':-1*$('#mealGroupR'+e).height()/2+$('#plate-chart-recommended').position().top+mgx,
							//'left':-1*$('#mealGroupR'+e).width()/2+$('#plate-chart-recommended').position().left+mgy
						})
						$('#mealGroupR'+e).fadeIn(300,0);
						return 'block';
					}else{
						$('#mealGroupR'+e).css('display','none');
						return 'none';
					}
				})
				
				
				
				var allMeals=0;
				var smallestMeal=50;
				for(var item in mealsDataRecommendedPlateR){
					allMeals+=mealsDataRecommendedPlateR[item];
					if(mealsDataRecommendedPlateR[item]>0)
						smallestMeal=Math.min(smallestMeal,mealsDataRecommendedPlateR[item]);
				}
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
					for(var item in mealsDataRecommendedPlateR){
						allMeals+=mealsDataRecommendedPlateR[item];
						if(mealsDataRecommendedPlateR[item]>0) smallestMeal=Math.min(smallestMeal,mealsDataRecommendedPlateR[item]);
					}
					if(allMeals==smallestMeal){
					return 0;
					}else{
						if(val==0)return 0;
						var tval=allMeals/val;
								if(tval<1) return -45;
							if(tval>1&&tval<=2) return 	-55*.2;
							if(tval>2&&tval<=3) return 	-55*.2;
							if(tval>3&&tval<=4) return 	-65*.2;
							if(tval>4&&tval<=5) return 	-75*.2;
							if(tval>5&&tval<=6) return 	-85*.2;
							if(tval>6&&tval<=7) return 	-95*.2;
							if(tval>7&&tval<=8) return -105*.2;
							if(tval>8) return 		   -115*.2;
					}
				}
				 mgx=300;
				 mgy=300;
				function updateLabels_r(e,f){
					var tx=Math.cos(Math.PI/2+(e.startAngle+e.endAngle)/2  )*circlePadding*.7;
					var ty=Math.sin(Math.PI/2+(e.startAngle+e.endAngle)/2  )*circlePadding*.7;
					/*$('#mealGroupR'+f).animate({
						'opacity':1,
						'top':-15+$('#plate-chart-recommended').position().top+mgy/2+ty,
						'left':-15+$('#plate-chart-recommended').position().left+mgx/2+tx
					},{'duration':300, 'easing':'easeOutCubic', 'queue':false});*/
				}
				
				amountChangers_r.transition()
				.each('start',function(e,f){
					if(inters_r[f]==0)
						inters_r[f]=setInterval(updateLabels_r,40,e,f);
				})
				.each('end',function(e,f){
					clearTimeout(inters_r[f]);
					inters_r[f]=0;
				})
				  .duration(tweenDuration)
						.attr("cx", 0).attr("cy",
							function(e,f){
								return calculateCirclePadding(e.value)
								})
						.attr("transform", function(d,e) {
					return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
				  })
				amountChangers_r.exit().remove();
			  }  
			}

			
			//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// to run each time data is generated
			function update() {
			  streakerDataAdded_u = d3.range(plateData.length).map(
				function(a){return {mealTotalCount_u: mealsDataUser[a], port: plateData[a].name}}
			);
			 streakerDataAdded_r = d3.range(plateData.length).map(
				function(a){return {mealTotalCount_r: mealsDataRecommendedPlateR[a], port: plateData[a].name}}
			);

			if(mealsDataUser.reduce(function(a, b) { return a + b; }, 0)==0)
			{
				odlPieData_u=[];
			}else{
				oldPieData_u = filteredPieData_u;
				pieData_u = donut_u(streakerDataAdded_u);
			}
			

			var totalmeals_u = 0;
			filteredPieData_u = pieData_u.filter(filterData_u);
			function filterData_u(element, index, array) {
				element.name = streakerDataAdded_u[index].port;
				element.value = streakerDataAdded_u[index].mealTotalCount_u;
				element.mealIndex = index;
				totalmeals_u += element.value;
				return (element.value > -1);
			}

			  if(filteredPieData_u.length > -1 && oldPieData_u.length > -1){

				//REMOVE PLACEHOLDER CIRCLE
				arc_group_u.selectAll("circle").remove();

				//DRAW ARC PATHS
				paths_u = arc_group_u.selectAll("path").data(filteredPieData_u);
				paths_u.enter().append("svg:path")
					.attr("data-role","chartPath")
					.attr("data-meal",function(d){
						return d.mealIndex; })
					.transition()
					.duration(tweenDuration)
					.attrTween("d", pieTween_u);
				paths_u
				  .transition()
					.duration(tweenDuration)
					.attrTween("d", pieTween_u);
				paths_u.exit()
				  .transition()
					.duration(tweenDuration)
					.attrTween("d", removePieTween_u)
				  .remove();

				
				//DRAW TICK MARK amountChangers FOR LABELS
				mealGroupsUser.selectAll("div").data(function(){
					var tempAr=[];
					for(var iter=0; iter<plateData.length; iter++)tempAr.push(iter);
						return tempAr;
					}).enter()
					.append('div')
					.attr('id',function(d,e){return 'mealGroup'+e})
					.attr('class','mealGroup')
					.attr('data-meal',function(e){return e});
				mealGroupsUser.selectAll("div.mealGroup").selectAll('div').data(['mealSign','quantityLabel']).enter()
					.append('div')
					.attr('class',function(d,e){
					return d;})
				
				
				
				mealGroupsUser.selectAll(".quantityLabel").data(filteredPieData_u).text(function(d){
					return d.value;
				  });

				//?
				amountChangers_u = label_group_u.selectAll(".amountChanger").data(filteredPieData_u);
				
				//?
				amountChangers_u.enter().append("svg:circle")
					.attr("transform", function(d,e) {
						dataarchs.push({'sa':d.startAngle, 'ea':d.endAngle})
						return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
					});
				 mgx=300;
				 mgy=300;
				var circlePadding_u=-40;
				
				//circlePadding
				//$('<img data-group="" data-sa="" data-ea="" data-image="" width="3" height="3" src=img/svg/apple_small.svg />').appendTo('#mealGroups').css('left',$('#plate-chart-user').position().left+mgx/2).css('top',$('#plate-chart-user').position().top+mgy/2)
				for(var iter=0; iter<6; iter++){
					for(var siter=0; siter<mealsDataUser[iter]; siter++){
						var src;
						if(plateData[iter].icons)
							src=plateData[iter].icons[Math.round(Math.random()*(plateData[iter].icons.length-1))];
						else
							src=plateData[iter].short;
						var t=$('<img data-group="'+iter+'" data-sa="'+dataarchs[iter].sa+'" data-ea="'+dataarchs[iter].ea+'" data-image="'+siter+'" width="30" height="30" src=img/svg/'+src+'_small.svg />').appendTo('#mealGroups');
						var tx,ty;
						if(mealsDataUser[iter]==1){
							//alert(iter);
							tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*2;
							ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*2;
						}
						if(mealsDataUser[iter]==2){
							tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*(siter==0?1:2);
							ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*(siter==0?1:2);
						}
						if(mealsDataUser[iter]==3){
							if(siter==0){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*.8;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*.8;
							}
							if(siter==1){
								tx=Math.cos(Math.PI/2+((3*dataarchs[iter].sa)+dataarchs[iter].ea)/4  )*circlePadding_u*1.5;
								ty=Math.sin(Math.PI/2+((3*dataarchs[iter].sa)+dataarchs[iter].ea)/4  )*circlePadding_u*1.5;
							}
							if(siter==2){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*3))/4  )*circlePadding_u*1.5;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*3))/4  )*circlePadding_u*1.5;
							}
						}
						if(mealsDataUser[iter]==4){
							if(siter==0||siter==3){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*(siter==0?1:2);;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*(siter==0?1:2);;
							}
							if(siter==1){
								tx=Math.cos(Math.PI/2+((3*dataarchs[iter].sa)+dataarchs[iter].ea)/4  )*circlePadding_u*1.5;
								ty=Math.sin(Math.PI/2+((3*dataarchs[iter].sa)+dataarchs[iter].ea)/4  )*circlePadding_u*1.5;
							}
							if(siter==2){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*3))/4  )*circlePadding_u*1.5;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*3))/4  )*circlePadding_u*1.5;
							}
						}
						if(mealsDataUser[iter]==5||mealsDataUser[iter]==6){
							if(siter==0||siter==3){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*(siter==0?.6:1.6);;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*(siter==0?.6:1.6);;
							}
							if(siter==1){
								tx=Math.cos(Math.PI/2+((5*dataarchs[iter].sa)+dataarchs[iter].ea)/6  )*circlePadding_u*1.2;
								ty=Math.sin(Math.PI/2+((5*dataarchs[iter].sa)+dataarchs[iter].ea)/6  )*circlePadding_u*1.2;
							}
							if(siter==2){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*5))/6  )*circlePadding_u*1.2;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*5))/6  )*circlePadding_u*1.2;
							}
							if(siter==4){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*2))/3 )*circlePadding_u*2;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*2))/3  )*circlePadding_u*2;
							}
							if(siter==5){
								tx=Math.cos(Math.PI/2+((2*dataarchs[iter].sa)+dataarchs[iter].ea)/3  )*circlePadding_u*2;
								ty=Math.sin(Math.PI/2+((2*dataarchs[iter].sa)+dataarchs[iter].ea)/3  )*circlePadding_u*2;
							}
						}
						if(mealsDataUser[iter]==7||mealsDataUser[iter]==8||mealsDataUser[iter]==9){
							var n=mealsDataUser[iter]==9?.8:1;
							if(siter==0){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*.8*n;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*circlePadding_u*.8*n;
							}
							if(siter==1){
								tx=Math.cos(Math.PI/2+((3*dataarchs[iter].sa)+dataarchs[iter].ea)/4  )*circlePadding_u*1.5*n;
								ty=Math.sin(Math.PI/2+((3*dataarchs[iter].sa)+dataarchs[iter].ea)/4  )*circlePadding_u*1.5*n;
							}
							if(siter==2){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*3))/4  )*circlePadding_u*1.5*n;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*3))/4  )*circlePadding_u*1.5*n;
							}
							if(siter==3){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*5))/6  )*circlePadding_u*2.3*n;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*5))/6  )*circlePadding_u*2.3*n;
							}
							if(siter==4){
								tx=Math.cos(Math.PI/2+(5*dataarchs[iter].sa+(dataarchs[iter].ea))/6  )*circlePadding_u*2.3*n;
								ty=Math.sin(Math.PI/2+(5*dataarchs[iter].sa+(dataarchs[iter].ea))/6  )*circlePadding_u*2.3*n;
							}
							if(siter==5){
								tx=Math.cos(Math.PI/2+(2*dataarchs[iter].sa+(dataarchs[iter].ea))/3  )*circlePadding_u*2.3*n;
								ty=Math.sin(Math.PI/2+(2*dataarchs[iter].sa+(dataarchs[iter].ea))/3  )*circlePadding_u*2.3*n;
							}
							if(siter==6){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*2))/3  )*circlePadding_u*2.3*n;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea*2))/3  )*circlePadding_u*2.3*n;
							}
							if(siter==7){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea))/2  )*circlePadding_u*1.9*(n*(2*n+1)/3);
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea))/2  )*circlePadding_u*1.9*(n*(2*n+1)/3);
							}
							if(siter==8){
								tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea))/2  )*circlePadding_u*2;
								ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+(dataarchs[iter].ea))/2  )*circlePadding_u*2;
							}
						}
						t.css({
							'position':'absolute',
							'top':-1*t.height()/2+$('#plate-chart-user').position().top+mgy/2+ty,
							'left':-1*t.width()/2+$('#plate-chart-user').position().left+mgx/2+tx
						});
					}
					if(mealsDataUser[iter]>0){
						tx=Math.cos(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*(-r+15);
						ty=Math.sin(Math.PI/2+(dataarchs[iter].sa+dataarchs[iter].ea)/2  )*(-r+15);
						$('#mealGroup'+iter).show().css({
							'top':-1*$('#mealGroup'+iter).height()/2+$('#plate-chart-user').position().top+mgy/2+ty,
							'left':-1*$('#mealGroup'+iter).width()/2+$('#plate-chart-user').position().left+mgx/2+tx
						});
					}else $('#mealGroup'+iter).hide();
				}
				/*$('#mealGroups img').each(function(ind){
					var t=$(this);
					var tx,ty;
					console.log('ar: '+mealsDataUser[t.attr('data-group')]);
					if(parseInt(mealsDataUser[t.attr('data-group')])==1){
						tx=Math.cos(Math.PI/2+(t.attr('data-sa')+t.attr('data-ea'))/2  )*circlePadding;
						ty=Math.sin(Math.PI/2+(t.attr('data-sa')+t.attr('data-ea'))/2  )*circlePadding;
					t.css({
						'top':-1*t.height()/2+$('#plate-chart-user').position().top+mgy/2+ty,
						'left':-1*t.width()/2+$('#plate-chart-user').position().left+mgx/2+tx
					});
					}
					//console.log(t.attr('data-image'));
					//var 
					//var 
				
				})*/
				
				
				
				amountChangers_u.style('display',function(d, e){
					if(mealsDataUser[e]>0||mealsDataUser[e-mealsDataUser.length]>0){
						if($('#mealGroup'+e).css('display')=='none')
						$('#mealGroup'+e).fadeIn(300,0);
						return 'block';
					}else{
						$('#mealGroup'+e).css('display','none');
						return 'none';
					}
				})
				
				
				
				var allMeals=0;
				var smallestMeal=50;
				for(var item in mealsDataUser){
					allMeals+=mealsDataUser[item];
					if(mealsDataUser[item]>0)
						smallestMeal=Math.min(smallestMeal,mealsDataUser[item]);
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
					circlePadding*=.2;
				}
				function calculateCirclePadding(val){
					var allMeals=0;
					var smallestMeal=50;
					for(var item in mealsDataUser){
						allMeals+=mealsDataUser[item];
						if(mealsDataUser[item]>0) smallestMeal=Math.min(smallestMeal,mealsDataUser[item]);
					}
					if(allMeals==smallestMeal){
					return 0;
					}else{
						if(val==0)return 0;
						var tval=allMeals/val;
							if(tval<1) return -45;
							if(tval>1&&tval<=2) return 	-55;
							if(tval>2&&tval<=3) return 	-55;
							if(tval>3&&tval<=4) return 	-65;
							if(tval>4&&tval<=5) return 	-75;
							if(tval>5&&tval<=6) return 	-85;
							if(tval>6&&tval<=7) return 	-95;
							if(tval>7&&tval<=8) return -105;
							if(tval>8) return 		   -115;
					}
				}
				
				function updateLabels(e,f){
					var tx=Math.cos(Math.PI/2+(e.startAngle+e.endAngle)/2  )*circlePadding;
					var ty=Math.sin(Math.PI/2+(e.startAngle+e.endAngle)/2  )*circlePadding;
					/*$('#mealGroup'+f).animate({
						'opacity':1,
						'top':-1*$('#mealGroup'+f).height()/2+$('#plate-chart-user').position().top+mgy/2+ty,
						'left':-1*$('#mealGroup'+f).width()/2+$('#plate-chart-user').position().left+mgx/2+tx
					},{'duration':300, 'easing':'easeOutCubic', 'queue':false});*/
				}
				
				amountChangers_u.transition()
				.each('start',function(e,f){
					if(inters_u[f]==0)
						inters_u[f]=setInterval(updateLabels,40,e,f);
				})
				.each('end',function(e,f){
					clearTimeout(inters_u[f]);
					inters_u[f]=0;
				})
				  .duration(tweenDuration)
						.attr("cx", 0).attr("cy",
							function(e,f){
								return calculateCirclePadding(e.value)
								})
						.attr("transform", function(d,e) {
					return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
				  })
				amountChangers_u.exit().remove();
			  }  
			}

			///////////////////////////////////////////////////////////
			// FUNCTIONS //////////////////////////////////////////////
			///////////////////////////////////////////////////////////

			// Interpolate the arcs in data space.
			function pieTween_u(d, i) {
			if(mealsDataUser.reduce(function(a, b) { return a + b; }, 0)==0)
			{
					oldPieData_u=[];
					$('g.arc').fadeOut(300,0);
					return;}
			else
				$('g.arc').fadeIn(300,0);
				
				
			  var s0;
			  var e0;
			  if(oldPieData_u[i]){
				s0 = oldPieData_u[i].startAngle;
				e0 = oldPieData_u[i].endAngle;
			  } else if (!(oldPieData_u[i]) && oldPieData_u[i-1]) {
				s0 = oldPieData_u[i-1].endAngle;
				e0 = oldPieData_u[i-1].endAngle;
			  } else if(!(oldPieData_u[i-1]) && oldPieData_u.length > 0){
				s0 = oldPieData_u[oldPieData_u.length-1].endAngle;
				e0 = oldPieData_u[oldPieData_u.length-1].endAngle;
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
			
			// Interpolate the arcs in data space.
			function pieTween_r(d, i) {
			if(mealsDataRecommended.reduce(function(a, b) { return a + b; }, 0)==0)
				{
					oldPieData_r=[];
					$('g.arc').fadeOut(300,0);
					return;}
			else
				$('g.arc').fadeIn(300,0);
			  var s0;
			  var e0;
			  
			  if(oldPieData_r[i]){
				s0 = oldPieData_r[i].startAngle;
				e0 = oldPieData_r[i].endAngle;
			  } else if (!(oldPieData_r[i]) && oldPieData_r[i-1]) {
				s0 = oldPieData_r[i-1].endAngle;
				e0 = oldPieData_r[i-1].endAngle;
			  } else if(!(oldPieData_r[i-1]) && oldPieData_r.length > 0){
				s0 = oldPieData_r[oldPieData_r.length-1].endAngle;
				e0 = oldPieData_r[oldPieData_r.length-1].endAngle;
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

			function removePieTween_u(d, i) {
			  s0 = 2 * Math.PI;
			  e0 = 2 * Math.PI;
			  var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
			  return function(t) {
				var b = i(t);
				return arc(b);
			  };
			}
			
			function removePieTween_r(d, i) {
			  s0 = 2 * Math.PI;
			  e0 = 2 * Math.PI;
			  var i = d3.interpolate({startAngle: d.startAngle, endAngle: d.endAngle}, {startAngle: s0, endAngle: e0});
			  return function(t) {
				var b = i(t);
				return arc(b);
			  };
			}
			
			$('#step-description').css({'height':$('#step-description').height()})
		$('#step-description').animate({opacity:0}, 300, function(){
			//$('#step-description').css({'height':'auto'})
			$('#step-description').empty().html('You’re done! See below for your results. Compare your daily plate with the recommended daily plate, and see some great tips tailored for you to help balance your energy levels by what you eat, drink and how active you are.');
			$('#step-description').animate({opacity:1, 'height':$(this)[0].scrollHeight}, 300);
			$('#steps-bar .step-button').css('display','inline-block').fadeIn(300);
		});
		
		
			update();
			update_r();
		$('#steps-container').delay(500).animate({'opacity':1},300,function(){
		requestIFrameResize(50, true);
		});
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