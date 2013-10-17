<?php
require('wp-load.php');
require('write-data.php');

$t = HBC_DB::get_all_texts_plain();

?>
﻿<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta charset="utf-8">
<title>Healthy checker</title>
<link rel="stylesheet" href="styles/main.css" />
<link rel="stylesheet" href="styles/result.css" />
<script src="libs/d3.v3.js"></script>
<script src="libs/jquery.js"></script>
<script src="libs/jquery-ui.js"></script>
<script src="libs/jquery.ui.touch-punch.min.js"></script>
<script src="libs/juqery.redirect.js"></script>
<!--[if IE]><script type="text/javascript">window['isIE'] = true;</script><![endif]-->
<!--[if lt IE 9]>
	<script type="text/javascript">
		$( document ).ready( function(){
			$('#step-description').append('Please be informed that Internet Explorer version lower than 9 is not supported by this application. Please use other browser, or upgrade your Internet Explorer to 9 or highter.')
		});
	</script>
<![endif]-->
<?php
echo '<script>
var oils="'.$_POST['oils'].'";
var pregnant="'.$_POST['pregnant'].'";
var gender="'.$_POST['gender'].'";
var breastfeeding="'.$_POST['breastfeeding'].'";
var agegroup="'.$_POST['age'].'";
var act_m="'.$_POST['activity-moderate'].'";
var act_h="'.$_POST['activity-high'].'";
var mealsDataUser=['.$_POST['meals'].'];
var resultUrl="'.$rcode.'";
</script>';
?>
<!--<link rel="stylesheet" type="text/css" href="styles/jquery.svg.css"> 
<script type="text/javascript" src="libs/jquery.svg.min.js"></script>
<script type="text/javascript" src="libs/jquery.svgdom.min.js"></script>-->
<script type="text/javascript">
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
$(document).ready(function() {
    setInterval(function() {
        requestIFrameResize(0, false);
    }, 1000);
});
</script>
</head>
<body>
<div id="app-wrapper">
	<div id="app-header">
	<div id="app-title" class="full-width center"><h1 class="dark-blue">Healthy Balance Checker</h1></div>
		<div id="step-description" class="georgia dark-blue"><?= $t['results_descr_top'] ?></div>
	</div>
	<div id="steps-container">
		<div id="steps-bar" class="full-width">
			<div class="step-button button inactive" data-substep="1" data-step="1">Step 1 - About you</div><div class="step-button button inactive" data-substep="2" data-step="2">Step 2 - Food Intake</div><div class="step-button button inactive" data-substep="5" data-step="3">Step 3 - Activity</div><div class="step-button button center" style="width: 204px;" data-substep="6" data-step="7">Step 4 - Results</div>
		</div>
		<div id="step-6" data-step="4" class="step step-6 window-1 static-window">
		<div id="tabs">
			<div class="step-button button georgia center" data-tab="0">Food intake
				<img class="tip result" src="img/svg/tip_result.svg">
				</div>
			<div class="step-button button inactive georgia center" data-tab="1">Activity
				<img class="tip result" src="img/svg/tip_result.svg">
			</div>
		</div>
			<div class="tab-pane" data-tab="0">
				<div class="column column-left center plate">
					<div class="step-title center">Your Daily Plate</div>
					<div id="plate-chart-user" style="display:inline-block">
						<svg width="300" height="300">
							<circle fill="#f6f6f6" cx="150" cy="150" r="134"></circle>
							<circle fill="#fff" cx="150" cy="150" r="124"></circle>
							<circle fill="#dfdfdf" cx="150" cy="150" r="120"></circle>
						</svg>
					</div>
				</div>
				<div class="column column-right center plate">
					<div class="step-title center">Recommended Daily Plate</div>
					<div id="plate-chart-recommended" style="display:inline-block">
						<svg width="300" height="300">
							<circle fill="#f6f6f6" cx="150" cy="150" r="134"></circle>
							<circle fill="#fff" cx="150" cy="150" r="124"></circle>
							<circle fill="#dfdfdf" cx="150" cy="150" r="120"></circle>
						</svg>
					</div>
				</div>
					<div class="clear"></div>
				<div id="tips" class="center full-width">
					<div class="hline center"></div>
						<div class="step-title center">Tips and feedback</div>
					<div class="hline center"></div>
					<div class="clear"></div>
					
					<div class="step-title big-tip tip">Dietary Intake</div>
					<div data-role="dietary-general" class="georgia tip-desc dark-blue"></div>
					
					<div class="clear"></div>
					<div class="">
						<div data-role="dietary-tips-headline" class="step-title med-tip tip">Dietary Intake tips</div>
						<div data-role="dietary-tips" class="georgia tip-desc dark-blue"></div>
					</div>
					
					<div class="clear"></div>
				</div>
			</div>
			<div class="tab-pane activities-pane" data-tab="1">
				<div class="column column-left">
					<div class="step-title center tip">Your weekly activity</div>
					<div class="activity-time-preview center" data-role="user">0:00</div>
				</div>
				<div class="column column-right">
					<div class="step-title center tip">Recommended weekly activity</div>
					<div class="activity-time-preview center" data-role="recommended">0:00</div>
				</div>
				<div class="clear"></div>
				<div id="tips-a" class="center full-width">
					<div class="hline center"></div>
							<div class="step-title center">Tips and feedback</div>
						<div class="hline center"></div>
				
					<div class="clear 40"></div>
					<div class="">
						<div class="step-title big-tip tip">Activity</div>
						<div data-role="activity-general" class="georgia tip-desc dark-blue"></div>
					</div>
					<div class="clear"></div>
					<div class="act-tips">
						<div data-role="activity-tips-headline" class="step-title med-tip tip">Activity tips</div>
						<div data-role="activity-tips" class="georgia tip-desc dark-blue"></div>
					</div>
					
					<div class="clear"></div>
				</div>
			</div>
	</div>
	<div class="column column-left footer georgia dark-blue">
		Did you find this information helpful? Share it on Facebook, Twitter or email so your friends and family can take the quiz too!
		<div class="social-head">Share with your friends</div>
		<div class="social">
		<a id="a_fb" href="" target="_blank"><img alt="share on facebook" src="img/svg/fb.svg" /></a>
		<a id="a_twitter" href="" target="_blank"><img alt="share on twitter" src="img/svg/twitter.svg" /></a>
		<a id="a_mail" href="" target="_blank"><img alt="share with mail" src="img/svg/mail.svg" /></a>
		</div>
	</div>
	<div class="column footer spacer"></div>
	<div class="column column-left footer georgia dark-blue">
		Remember, managing your eating and physical activity levels is an ongoing balancing act. Why not make a few changes to your lifestyle and come back in four weeks to re-take the quiz? Enter your email address below and we will send you a reminder. Good luck!
		<div id="getmail">
			<input type="text" name="email" placeholder="Your email" class="georgia dark-blue"/>
			<div id="mail_added" class="georgia center">email added</div>
			<div id="submit" class="georgia center">Submit</div>
		</div>
	</div>
	<div class="clear spacer"></div>
</div>
<!--[if gte IE 9]>
	<script src="libs/result.js"></script>
<![endif]-->
<!--[if !IE]> -->
	<script src="libs/result.js"></script>
<!-- <![endif]-->
</body>
</html>
