<?php
require('wp-load.php');
require('write-data.php');

$t = HBC_DB::get_all_texts_plain();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<script type="text/javascript">	
	var loadedJsonData=<?php $JSONdata=include('data-json.php');
		echo $jsonDATA;
		?>
</script>
<meta charset="utf-8">
<title>Healthy checker</title>
<link rel="stylesheet" href="styles/main.css" />
<link rel="stylesheet" href="styles/ie8.css" />
<link rel="stylesheet" href="styles/result.css" />
<link rel="stylesheet" href="styles/result-ie8.css" />
<script src="libs/jq.ie8.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
<script src="libs/jquery-ui.js"></script>
<script src="libs/jquery.ui.touch-punch.min.js"></script>
<script src="styles/ie8/PIE.js"></script>
<script src="libs/juqery.redirect.js"></script>
<!--[if IE]><script type="text/javascript">window['isIE'] = true;</script><![endif]-->
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
<script src="libs/result-ie8.js"></script>
</head>
<body>
<div id="app-wrapper">
	<div id="app-header">
	<div id="app-title" class="full-width center"><h1 class="dark-blue">Healthy Balance Checker</h1></div>
		<div id="step-description" class="georgia dark-blue"><?php
				$pregreplaceddescrebottom=preg_replace('#(\\\r)#','<br/>',$t['results_descr_top_ie8']);
				$pregreplaceddescrebottom=preg_replace('#(\\\n)#','',$pregreplaceddescrebottom);
				$pregreplaceddescrebottom=str_replace('\u2019','`',$pregreplaceddescrebottom);
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'"');
				echo $pregreplaceddescrebottom; ?></div>
	</div>
	<div id="steps-container">
		<div id="steps-bar" class="full-width">
			<div class="step-button button inactive" data-substep="1" data-step="1">Step 1 - About you</div><div class="step-button button inactive" data-substep="2" data-step="2">Step 2 - Food Intake</div><div class="step-button button inactive" data-substep="5" data-step="3">Step 3 - Activity</div><div class="step-button button center" style="width: 204px;" data-substep="6" data-step="7">Step 4 - Results</div>
		</div>
		<div id="step-6" data-step="4" class="step step-6 window-1 static-window">
		<div id="tabs">
			<div class="step-button button georgia center" data-tab="0">Food intake
				<img class="tip result" src="img/tip_result.png" />
				</div>
			<div class="step-button button inactive georgia center" data-tab="1">Activity
				<img class="tip result" src="img/tip_result.png" />
			</div>
		</div>
			<div class="tab-pane" data-tab="0">
				<div class="column column-left center plate">
					<div class="step-title center">Your Daily Plate</div>
					<div id="plate-chart-user" style="display:inline-block">
						<table border="0" bordercolor="#fff" style="background-color:#fff" width="250" cellpadding="0" cellspacing="0">
							<tr class="fruit" data-num="0">
								<td><div class="meal-image"></div></td>
								<td class="name">FRUIT</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="vegetables" data-num="1">
								<td><div class="meal-image"></div></td>
								<td class="name">VEGETABLES</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="meat" data-num="2">
								<td><div class="meal-image"></div></td>
								<td class="name">LEAN MEATS +<br />ALTERNATIVES</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="milk" data-num="3">
								<td><div class="meal-image"></div></td>
								<td class="name">MILK, YOGHURT,<br />CHEESE</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="cereals" data-num="4">
								<td><div class="meal-image"></div></td>
								<td class="name">GRAINS, CEREALS</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="discret" data-num="5">
								<td><div class="meal-image"></div></td>
								<td class="name">DISCRETIONARY<br />FOODS</td>
								<td class="value-field">0</td>
							</tr>
						</table>
					</div>
				</div>
				<div class="column column-right center plate">
					<div class="step-title center">Recommended Daily Plate</div>
					<div id="plate-chart-recommended" style="display:inline-block">
						<table border="0" bordercolor="#fff" style="background-color:#fff" width="250" cellpadding="0" cellspacing="0">
							<tr class="fruit" data-num="0">
								<td><div class="meal-image"></div></td>
								<td class="name">FRUIT</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="vegetables" data-num="1">
								<td><div class="meal-image"></div></td>
								<td class="name">VEGETABLES</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="meat" data-num="2">
								<td><div class="meal-image"></div></td>
								<td class="name">LEAN MEATS +<br />ALTERNATIVES</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="milk" data-num="3">
								<td><div class="meal-image"></div></td>
								<td class="name">MILK, YOGHURT,<br />CHEESE</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="cereals" data-num="4">
								<td><div class="meal-image"></div></td>
								<td class="name">GRAINS, CEREALS</td>
								<td class="value-field">0</td>
							</tr>
							<tr class="discret" data-num="5">
								<td><div class="meal-image"></div></td>
								<td class="name">DISCRETIONARY<br />FOODS</td>
								<td class="value-field">0</td>
							</tr>
						</table>
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
		<a id="a_fb" href="" target="_blank"><img alt="share on facebook" src="img/fb.jpg" /></a>
		<a id="a_twitter" href="" target="_blank"><img alt="share on twitter" src="img/twitter.jpg" /></a>
		<a id="a_mail" href="" target="_blank"><img alt="share with mail" src="img/mail.jpg" /></a>
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

</body>
</html>
