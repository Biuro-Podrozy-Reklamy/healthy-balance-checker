<?php
require('wp-load.php');

$t = HBC_DB::get_all_texts_plain();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<meta charset="utf-8">
<head>
<script type="text/javascript">
	
	var loadedJsonData=<?php $JSONdata=include('data-json.php');
		//$jsonDATA = trim(preg_replace('/\s\s+/', ' ', $jsonDATA));
		echo $jsonDATA;
		?>
</script>
<script src="libs/jq.ie8.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.js"></script>
<script src="libs/jquery-ui.js"></script>
<script src="libs/jquery.ui.touch-punch.min.js"></script>
<script src="styles/ie8/PIE.js"></script>
<!--[if IE]>
	<script type="text/javascript">window['isIE'] = true;</script>
<![endif]-->
<script type="text/javascript" src="libs/main-ie8.js"></script>
<script src="libs/juqery.redirect.js"></script>
<link rel="stylesheet" href="styles/main.css" />
<link rel="stylesheet" href="styles/ie8.css" />
</head>
<body>
<div id="app-wrapper">
	<div id="overlay-fade"></div>
	<div id="app-header">
	<div id="app-title" class="full-width center"><h1 class="dark-blue">Healthy Balance Checker</h1></div>
		<div id="step-description" class="georgia dark-blue"></div>
	</div>
	<div id="steps-container">
		<div id="steps-bar" class="full-width"></div>
		<div class="intro spacer"></div>
		<div id="step-0" data-step="0" class="step step-0 window-0 static-window center">
			<div class="spacer"></div>
			
			<div id="start-button" class="button next">START</div>
			<script>
				</script>
			<div class="step-title step-subtitle center"><?php
				$pregreplaceddescrebottom=preg_replace('#(\\\r)#','<br/>',$t['intro_descr_bottom']);
				$pregreplaceddescrebottom=preg_replace('#(\\\n)#','',$pregreplaceddescrebottom);
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'"');
				echo $pregreplaceddescrebottom; ?></div>
		</div>
		<div id="step-1" data-step="1" class="step step-1 window-1 static-window">
			<div id="step-1-overlay" class="step-overlay">
				<img class="ask-sign" src="img/ask_big.png" width="90" height="90"/>
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
			<div class="step-title center">Select Your gender</div>
			<div id="genders" class="center">
				<div data-gender="female" class="gender_img" id="gender_female_img"></div>
				<div data-gender="male" class="gender_img" id="gender_male_img"></div>
			</div>
			<div class="step-title center">Select Your age group</div>
			<div id="age-slider-labels" class="dark-blue georgia"></div>
			<div id="age-slider" class="center" data-val="18">
				<div class="indicator"></div>
				<div class="points"></div>
				<div class="axis">
					<div class="knob circle-edges"></div>
				</div>
			</div>
			<div id="age-value-preview" class="center">
				<div class="value">18</div>
				<img class="tip" src="img/tip_oran.png" />
			</div>
			<a href="https://www.eatforhealth.gov.au/nutrition-calculators/food-balance" target="_BLANK" id="age-under-twelve" class="center georgia"></a>
			<div id="female-options" class="dark-blue georgia">
				<p>Are you...</p>
				<div class="tick" data-value="pregnant">
					<div class="tickBox"data-checked="false"></div>Pregnant
				</div>
				<div class="tick" data-value="breastfeeding">
					<div class="tickBox" data-checked="false"></div>Breastfeeding
				</div>
			</div>
		</div>
		<div id="step-2" data-step="2" class="step step-2 window-1 static-window">
			<div id="step-2-overlay" class="step-overlay">
				<div class="overlay-contents">
					<img src="img/ask_big.png" />
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
				<div class="step-title center">How many serves of each food do you eat each day?</div>
				<div id="plate-chart" class="float-left">
					<table border="0" bordercolor="#fff" style="background-color:#fff" width="400" cellpadding="0" cellspacing="0">
						<tr class="fruit" data-num="0">
							<td><div class="ask-sign"></div></td>
							<td><div class="meal-image"></div></td>
							<td class="name">FRUIT</td>
							<td><div class="minus-button change-amount-button"></div></td>
							<td class="value-field">0</td>
							<td><div class="plus-button change-amount-button"></div></td>
						</tr>
						<tr class="vegetables" data-num="1">
							<td><div class="ask-sign"></div></td>
							<td><div class="meal-image"></div></td>
							<td class="name">VEGETABLES</td>
							<td><div class="minus-button change-amount-button"></div></td>
							<td class="value-field">0</td>
							<td><div class="plus-button change-amount-button"></div></td>
						</tr>
						<tr class="meat" data-num="2">
							<td><div class="ask-sign"></div></td>
							<td><div class="meal-image"></div></td>
							<td class="name">LEAN MEATS +<br />ALTERNATIVES</td>
							<td><div class="minus-button change-amount-button"></div></td>
							<td class="value-field">0</td>
							<td><div class="plus-button change-amount-button"></div></td>
						</tr>
						<tr class="milk" data-num="3">
							<td><div class="ask-sign"></div></td>
							<td><div class="meal-image"></div></td>
							<td class="name">MILK, YOGHURT,<br />CHEESE</td>
							<td><div class="minus-button change-amount-button"></div></td>
							<td class="value-field">0</td>
							<td><div class="plus-button change-amount-button"></div></td>
						</tr>
						<tr class="cereals" data-num="4">
							<td><div class="ask-sign"></div></td>
							<td><div class="meal-image"></div></td>
							<td class="name">GRAINS, CEREALS</td>
							<td><div class="minus-button change-amount-button"></div></td>
							<td class="value-field">0</td>
							<td><div class="plus-button change-amount-button"></div></td>
						</tr>
						<tr class="discret" data-num="5">
							<td><div class="ask-sign"></div></td>
							<td><div class="meal-image"></div></td>
							<td class="name">DISCRETIONARY<br />FOODS</td>
							<td><div class="minus-button change-amount-button"></div></td>
							<td class="value-field">0</td>
							<td><div class="plus-button change-amount-button"></div></td>
						</tr>
					</table>


					
					
					
				</div>
			</div>
		</div>
		<div id="step-3" data-step="2" class="step step-1 window-1 static-window">
			<div id="step-3-overlay" class="step-overlay">
				<img class="ask-sign" src="img/ask_huge.png" width="90" height="90"/>
				<div class="overlay-contents">
					<div class="overlay-title">
						Fats, oils and spreads intake
					</div>
					<div class="overlay-content georgia">
						<?php
				$pregreplaceddescrebottom=preg_replace('#(\\\r)#','',$t['food_info_fats']);
				$pregreplaceddescrebottom=preg_replace('#(\\\n)#','',$pregreplaceddescrebottom);
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'"');
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'<\/p>');
				echo $pregreplaceddescrebottom; ?>
						<br />
						<div class="button close">CLOSE</div>
					</div>
				</div>
			</div>
			<div class="spacer"></div>
			<div class="step-title center">Fats, oils and spreads intake</div>
			<!--<div class="step-title subtitle center georgia">Select the oils you have on a regular basis</div>-->
			<img id="oils-image" src="img/oils.jpg" class="float-left"/>
			<div id="oils-selection" class="dark-blue populaire"></div>
		</div>
		<div id="step-4" data-step="2" class="step step-2 window-1 static-window">
			<div id="step-4-overlay" class="step-overlay">
				<img class="ask-sign" src="img/ask_huge.png" width="90" height="90"/>
				<div class="overlay-contents">
					<div class="overlay-title">
						WATER
					</div>
					<div class="overlay-content georgia">
						<?php
				$pregreplaceddescrebottom=preg_replace('#(\\\r)#','<br/>',$t['food_info_water']);
				$pregreplaceddescrebottom=preg_replace('#(\\\n)#','',$pregreplaceddescrebottom);
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'"');
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'<\/p>');
				echo $pregreplaceddescrebottom; ?>
						<br />
						<div class="button close">CLOSE</div>
					</div>
				</div>
			</div>
			<div class="spacer"></div>
			<div class="step-title center">Glasses of water</div>
			<div class="step-title subtitle center georgia"><? $pregreplaceddescrebottom=preg_replace('#(\\\r)#','<br/>',$t['food_descr_middle_water']);
				$pregreplaceddescrebottom=preg_replace('#(\\\n)#','',$pregreplaceddescrebottom);
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'"');
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'<\/p>');
				echo $pregreplaceddescrebottom; ?></div>
			<div id="water-images" class="center full-width"></div>
			<div id="water-quantity" data-min="0" data-max="12" class="center full-width">
				<div id="less-water-btn" data-property="water" data-value="-1" class="sign-plus-minus sign-minus"></div>
				<div data-role="value" class="dark-blue georgia">2</div>
				<div id="more-water-btn" data-property="water" data-value="1" class="sign-plus-minus sign-plus"></div>
			</div>
			<div id="oils-selection" class="dark-blue populaire"></div>
		</div>
		<div id="step-5" data-step="3" class="step step-5 window-1 static-window">
			<div id="step-5-overlay" class="step-overlay">
				<img class="ask-sign" src="img/ask_huge.png" width="90" height="90"/>
				<div class="overlay-contents">
					<div class="overlay-title">
						PREGNANT (exercise)
					</div>
					<div class="overlay-content georgia">						
						<? $pregreplaceddescrebottom=preg_replace('#(\\\r)#','<br/>',$t['activity_info_if_pregnant']);
				$pregreplaceddescrebottom=preg_replace('#(\\\n)#','',$pregreplaceddescrebottom);
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'"');
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'<\/p>');
				echo $pregreplaceddescrebottom; ?>
						<br />
						<div class="button close">CLOSE</div>
					</div>
				</div>
			</div>
			<div class="spacer"></div>
			<div class="step-title center">Activity</div>
			<div class="step-title subtitle center georgia"><? $pregreplaceddescrebottom=preg_replace('#(\\\r)#','<br/>',$t['activity_descr_middle']);
				$pregreplaceddescrebottom=preg_replace('#(\\\n)#','',$pregreplaceddescrebottom);
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'"');
				$pregreplaceddescrebottom=trim($pregreplaceddescrebottom,'<\/p>');
				echo $pregreplaceddescrebottom; ?></div>
			<div id="activities" class="center full-width">
			</div>
		<div id="activities-total" class="georgia center dark-blue">Total: <div data-role="value">0:00</div></div>
		</div>
	</div>
	<div id="next-button" class="button next disabled"></div>
</div>

</body>
</html>
