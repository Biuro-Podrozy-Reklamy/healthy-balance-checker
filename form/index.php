﻿<?php
require('wp-load.php');

if(HBC_Utils::is_browser_ie8()) 
  //wp_redirect( 'Location: ' . plugins_url() . '/healthy-balance-checker/form/index-ie8.php', 302 );
  //header('Location: ' . plugins_url() . '/healthy-balance-checker/form/index-ie8.php');

$t = HBC_DB::get_all_texts_plain();

?>
<!--[if lt IE 9]>
	<script>
		var a=window.location.href+'index.php';
		a=a.replace('index.phpindex.php','index.php');
		//window.location.href=a.replace('.php','-ie8.php');
		window.navigate(a.replace('.php','-ie8.php'));
	</script>
<![endif]-->
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<meta charset="utf-8">
<title>Healthy checker</title>
<link rel="stylesheet" href="styles/main.css" />
<!--[if IE]><script type="text/javascript">window['isIE'] = true;</script><![endif]-->
<!--<link rel="stylesheet" type="text/css" href="styles/jquery.svg.css"> 
<script type="text/javascript" src="libs/jquery.svg.min.js"></script>
<script type="text/javascript" src="libs/jquery.svgdom.min.js"></script>-->
<!--[if IE]><script type="text/javascript">window['isIE'] = true;</script><![endif]-->
<!--[if gte IE 9]>
	<script src="libs/d3.v3.js"></script>
	<script src="libs/jquery.js"></script>
	<script src="libs/jquery-ui.js"></script>
	<script src="libs/jquery.ui.touch-punch.min.js"></script>
	<script type="text/javascript" src="libs/main.js"></script>
	<script src="libs/juqery.redirect.js"></script>
<![endif]-->
<!--[if !IE]> -->
	<script src="libs/d3.v3.js"></script>
	<script src="libs/jquery.js"></script>
	<script src="libs/jquery-ui.js"></script>
	<script src="libs/jquery.ui.touch-punch.min.js"></script>
	<script type="text/javascript" src="libs/main.js"></script>
	<script src="libs/juqery.redirect.js"></script>
<!-- <![endif]-->
</head>
<body>
<div id="app-wrapper">
	<div id="app-header">
	<div id="app-title" class="full-width center"><h1 class="dark-blue">Healthy Balance Checker</h1></div>
		<div id="step-description" class="georgia dark-blue"></div>
	</div>
	<div id="steps-container">
		<div id="steps-bar" class="full-width"></div>
		<div class="intro spacer"></div>
		<div id="step-0" data-step="0" class="step step-0 window-0 static-window center">
			<div class="step-title center"><?= $t['intro_descr_middle' ] ?></div>
			<div id="start-button" class="button next">START</div>
			<div class="step-title step-subtitle center"><?= $t['intro_descr_bottom'] ?></div>
		</div>
		<div id="step-1" data-step="1" class="step step-1 window-1 static-window">
			<div id="step-1-overlay" class="step-overlay">
				<img alt="information" class="ask-sign" src="img/svg/ask_big.svg" width="90" height="90"/>
				<div class="overlay-contents">
					<div class="overlay-title">
						PREGNANT
					</div>
					<div class="overlay-content georgia">
						<?= $t['profile_if_pregnant'] ?>
						<br />
						<div class="button close">CLOSE</div>
					</div>
				</div>
			</div>
			<div class="spacer"></div>
			<div class="step-title center">Select your gender</div>
			<div id="genders" class="center"></div>
			<div class="step-title center">Select your age</div>
			<div id="age-value-preview" class="center">
				<div class="value">18</div>
				<img class="tip" src="img/svg/tip_oran.svg" />
			</div>
			<div id="age-slider-labels" class="dark-blue georgia"></div>
			<div id="age-slider" class="center">
				<div class="indicator"></div>
				<div class="points"></div>
				<div class="axis">
					<div class="knob circle-edges"></div>
				</div>
			</div>
			<div id="age-under-twelve" class="center georgia"><?= $t['profile_if_under_12'] ?>
				<div class="tip">
					<img src="img/svg/tip_blue.svg" />
				</div>
			</div>
			<div id="female-options" class="dark-blue georgia">
				<p>Are you...</p>
				<div class="tick" data-value="pregnant">
					<div class="tickBox dark-blue-bck"><div class="checked"></div></div>Pregnant
				</div>
				<div class="tick" data-value="breastfeeding">
				<div class="tickBox dark-blue-bck" data-checked="false"><div class="checked"></div></div>Breastfeeding
				</div>
			</div>
		</div>
		<div id="step-2" data-step="2" class="step step-2 window-1 static-window">
			<div id="step-2-overlay" class="step-overlay">
				<div class="overlay-contents">
					<img alt="information" src="img/svg/ask_big.svg" />
					<div class="overlay-title">
						LEAN MEAT + ALTERNATIVES
					</div>
					<div class="overlay-content georgia">
						<br />
						<a href="">Read more about Lean Meat + Alternatives</a>
						<div class="button close">CLOSE</div>
					</div>
				</div>
			</div>
			<div class="step-2-wrapper">
				<div class="spacer"></div>
				<div class="plate-menu dark-blue float-left menu"></div>

				<div id="plate-chart" class="float-left">
					<div class="step-title"><center><strong>How many serves of each food<br />do you eat each day?</strong><br />Drag each serving on to the plate</center></div>
					<svg id="plate-chart-canvas" width="400" height="400">
						<circle fill="#f6f6f6" cx="200" cy="200" r="190"></circle>
						<circle fill="#fff" cx="200" cy="200" r="174"></circle>
						<circle fill="#dfdfdf" cx="200" cy="200" r="169"></circle>
						<text x="170" y="200" >Drag here</text>
						<defs>
							<pattern id="plusPattern" width="100" height="100">
								<image xlink:href="img/plus.png" x="0" y="0" width="18" height="18" />
							</pattern>
							<pattern id="minusPattern" width="100" height="100">
								<image xlink:href="img/minus.png" x="0" y="0" width="18" height="18" />
							</pattern>
						</defs>
					</svg>
				</div>
			</div>
		</div>
		<div id="step-3" data-step="2" class="step step-1 window-1 static-window">
			<div id="step-3-overlay" class="step-overlay">
				<img alt="information" class="ask-sign" src="img/svg/ask_big.svg" width="90" height="90"/>
				<div class="overlay-contents">
					<div class="overlay-title">
						Fats, oils and spreads intake
					</div>
					<div class="overlay-content georgia">
						<?= $t['food_info_fats'] ?>
						<br />
						<div class="button close">CLOSE</div>
					</div>
				</div>
			</div>
			<div class="spacer"></div>
			<div class="step-title center">Fats, oils and spreads intake</div>
			<!--<div class="step-title subtitle center georgia">Select the oils you have on a regular basis</div>-->
			<img alt="Selects oils" id="oils-image" src="img/svg/oils.svg" class="float-left"/>
			<div id="oils-selection" class="dark-blue populaire"></div>
		</div>
		<div id="step-4" data-step="2" class="step step-2 window-1 static-window">
			<div id="step-4-overlay" class="step-overlay">
				<img alt="information" class="ask-sign" src="img/svg/ask_big.svg" width="90" height="90"/>
				<div class="overlay-contents">
					<div class="overlay-title">
						WATER
					</div>
					<div class="overlay-content georgia">
						<?= $t['food_info_water'] ?>
						<br />
						<div class="button close">CLOSE</div>
					</div>
				</div>
			</div>
			<div class="spacer"></div>
			<div class="step-title center">Glasses of water</div>
			<div class="step-title subtitle center georgia"><?= $t['food_descr_middle_water'] ?></div>
			<div id="water-images" class="center full-width"></div>
			<div id="water-quantity" data-min="0" data-max="12" class="center full-width">
				<div id="less-water-btn" data-property="water" data-value="-1" class="water-button round-button dark"><img alt="less water" src="img/svg/minus_sign.svg" /></div>
				<div data-role="value" class="dark-blue georgia">2</div>
				<div id="more-water-btn" data-property="water" data-value="1" class="water-button round-button bright"><img alt="more water" src="img/svg/plus_sign.svg" /></div>
			</div>
		</div>
		<div id="step-5" data-step="3" class="step step-5 window-1 static-window">
			<div id="step-5-overlay" class="step-overlay">
				<div class="overlay-contents">
					<div class="overlay-title">
						activity name
					</div>
					<div class="overlay-content georgia">
						<?= $t['activity_info_if_pregnant'] ?>
						<br />
						<div class="button close">CLOSE</div>
					</div>
				</div>
			</div>
			<div class="spacer"></div>
			<div class="step-title center">Activity</div>
			<div class="step-title subtitle center georgia"><?= $t['activity_descr_middle'] ?></div>
			<div id="activities" class="center full-width">
			</div>
		<div id="activities-total" class="georgia center dark-blue">Total per week: <div data-role="value">0:00</div></div>
		</div>
	</div>
	<div id="next-button" class="button next disabled">NEXT STEP</div>
</div>
<!--[if lt IE 9]>
	<script type="text/javascript">
		window.onload = function() {
			document.getElementById('step-description').innerHTML="Please upgrade your browser to a newer version in order to use the Healthy Balance Checker.";
		};
	</script>
<![endif]-->
</body>
</html>
