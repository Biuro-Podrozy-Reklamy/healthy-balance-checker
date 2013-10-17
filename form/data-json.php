<?php
require('wp-load.php');

$t = HBC_DB::get_all_texts_plain(TRUE);
$st = HBC_DB::get_all_subtexts_plain(TRUE);

$food_descr_top=$t['food_descr_top'];

if($ie8==true){
	$food_descr_top=$t['food_descr_top_ie8'];	
}

?>

{
	"steps": {
		"step-0": {
			"substep_number":"0",
			"type":"no-step-bar",
			"description":<?= $t['intro_descr_top'] ?>
		},
		"step-1": {
			"substep_number":"1",
			"step_number":"1",
			"type":"step-bar",
			"title":"Step 1 - About you",
			"description":<?= $t['profile_descr_top'] ?>,
			"slider": ["12-18","19-50","51-70","71+"],
			"sliderInitialValue":"2"
		},
		"step-2": {
			"substep_number":"2",
			"step_number":"2",
			"type":"step-bar",
			"title":"Step 2 - Food Intake",
			"description":<?= $food_descr_top ?>,
			"meal": [
				{
					"name":"fruit",
					"short":"apple",
					"icons":["apple","cherry","strawberry"],
					"content":<?= $t['food_info_fruit'] ?>,
					"link":"http://www.eatforhealth.gov.au/food-essentials/five-food-groups/fruit"
				},{
					"name":"vegetables",
					"short":"carrot",
					"icons":["carrot","tomato","peas"],
					"content":<?= $t['food_info_vegs'] ?>,
					"link":"http://www.eatforhealth.gov.au/food-essentials/five-food-groups/vegetables-and-legumes-beans"
				},{			
					"name":"lean meats +*alternatives",
					"short":"meat",
					"content":<?= $t['food_info_meat'] ?>,
					"link":"http://www.eatforhealth.gov.au/food-essentials/five-food-groups/lean-meat-and-poultry-fish-eggs-tofu-nuts-and-seeds-and"
				},{			
					"name":"milk, yoghurt,*cheese",
					"short":"milk",
					"icons":["milk","cheese"],
					"content":<?= $t['food_info_dairy'] ?>,
					"link":"http://www.eatforhealth.gov.au/food-essentials/five-food-groups/milk-yoghurt-cheese-andor-their-alternatives-mostly-reduced-fat"
				},{			
					"name":"grains, cereals",
					"short":"cereals",
					"content":<?= $t['food_info_grains'] ?>,
					"link":"http://www.eatforhealth.gov.au/food-essentials/five-food-groups/grain-cereal-foods-mostly-wholegrain-and-or-high-cereal-fibre"
				},{
					"name":"discretionary*foods",
					"short":"discret",
					"content": <?= $t['food_info_discretionary'] ?>,
					"link":"http://www.eatforhealth.gov.au/food-essentials/discretionary-food-and-drink-choices"
				}
			]
		},
		"step-3": {
			"substep_number":"3",
			"step_number":"2",
			"type":"no-step-bar",
			"title":"Fats, oils and spreads intake",
			"description": <?= $t['food_descr_top_fats'] ?>,
			"oils":["Olive Oil","Canola oil","vegetable oil","butter","margarine","dairy blend"]
		},
		"step-4": {
			"substep_number":"4",
			"step_number":"2",
			"type":"no-step-bar",
			"title":"Glasses of water",
			"description": <?= $t['food_descr_top_water'] ?>
		},
		"step-5": {
			"substep_number":"5",
			"step_number":"3",
			"type":"step-bar",
			"title":"Step 3 - Activity",
			"description":<?= $t['activity_descr_top'] ?>,
			"activities":[
				{
					"title":"Moderate",
					"icon":"bicycle",
					"init":"0",
					"examples":["Biking","Swimming", "Brisk walking"],
					"description":<?= $t['activity_overlay_moderate'] ?>
				},
				{
					"title":"High",
					"icon":"lifting",
					"init":"0",
					"examples":["Gym class","Running", "Competitive sports"],
					"description":<?= $t['activity_overlay_high'] ?>
				}
			]
		}
	},
	"results":{
		"food":{
			"foods":["fruit","vegetables","lean_meats","milk","cereals","discretionary"],
			"general":{
				"satisfactory":<?= $t['tips_food_general_ok'] ?>,
				"increase":<?= $t['tips_food_general_bad'] ?>
			},
			"fruit":{
				"increase":[<?= implode(', ', $st['tips_food_fruit_inc']) ?>],
				"decrease":[<?= implode(', ', $st['tips_food_fruit_dec']) ?>]
			},
			"vegetables":{
				"increase":[<?= implode(', ', $st['tips_food_vegs_inc']) ?>],
				"decrease":[<?= implode(', ', $st['tips_food_vegs_dec']) ?>]
			},
			"lean_meats":{
				"increase":[<?= implode(', ', $st['tips_food_meat_inc']) ?>],
				"decrease":[<?= implode(', ', $st['tips_food_meat_dec']) ?>]
			},
			"milk":{
				"increase":[<?= implode(', ', $st['tips_food_dairy_inc']) ?>],
				"decrease":[<?= implode(', ', $st['tips_food_dairy_dec']) ?>]
			},
			"cereals":{
				"increase":[<?= implode(', ', $st['tips_food_grains_inc']) ?>],
				"decrease":[<?= implode(', ', $st['tips_food_grains_dec']) ?>]
			},
			"discretionary":{
				"increase":[<?= implode(', ', $st['tips_food_discr_inc']) ?>],
				"decrease":[<?= implode(', ', $st['tips_food_discr_dec']) ?>]
			}
		},
		"activity":{
			"general":{
				"satisfactory":<?= $t['tips_activity_general_ok'] ?>,
				"increase":<?= $t['tips_activity_general_inc'] ?>,
				"pregnant":<?= $t['tips_activity_general_pregnant'] ?>
			},
			"age-12-18":{
				"increase":[<?= implode(', ', $st['tips_activity_12_18_inc']) ?>],
				"satisfactory":[<?= implode(', ', $st['tips_activity_12_18_ok']) ?>]
			},
			"age-19-50":{
				"increase":[<?= implode(', ', $st['tips_activity_19_50_inc']) ?>],
				"satisfactory":[<?= implode(', ', $st['tips_activity_19_50_ok']) ?>]
			},
			"age-51-70":{
				"increase":[<?= implode(', ', $st['tips_activity_51_70_inc']) ?>],
				"satisfactory":[<?= implode(', ', $st['tips_activity_51_70_ok']) ?>]
			},
			"age-71+":{
				"increase":[<?= implode(', ', $st['tips_activity_71plus_inc']) ?>],
				"satisfactory":[<?= implode(', ', $st['tips_activity_71plus_ok']) ?>]
			}
		}
	},
	"recommendations":{
		"male":{
			"age-12-18":{
				"fruit":[2,4],
				"fruit-r":2,
				"vegetables":[5,7],
				"vegetables-r":5.5,
				"lean_meats":[2,3],
				"lean_meats-r":2.5,
				"milk":[3,4],
				"milk-r":3.5,
				"cereals":[6,7],
				"cereals-r":7,
				"discretionary":0,
				"activity":420
			},
			"age-19-50":{
				"fruit":[2,4],
				"fruit-r":2,
				"vegetables":[5,7],
				"vegetables-r":6,
				"lean_meats":[2,3],
				"lean_meats-r":3,
				"milk":[2,3],
				"milk-r":2.5,
				"cereals":[6,7],
				"cereals-r":6,
				"discretionary":0,
				"activity":210
			},
			"age-51-70":{
				"fruit":[2,4],
				"fruit-r":2,
				"vegetables":[5,7],
				"vegetables-r":5.5,
				"lean_meats":[2,3],
				"lean_meats-r":2.5,
				"milk":[2,3],
				"milk-r":2.5,
				"cereals":[6,7],
				"cereals-r":6,
				"discretionary":0,
				"activity":210
			},
			"age-71+":{
				"fruit":[2,4],
				"fruit-r":2,
				"vegetables":[5,7],
				"vegetables-r":5,
				"lean_meats":[2,3],
				"lean_meats-r":2.5,
				"milk":[3,4],
				"milk-r":3.5,
				"cereals":[3,5],
				"cereals-r":4.5,
				"discretionary":0,
				"activity":210
			}
		},
		"female":{
			"age-12-18":{
				"fruit":[2,4],
				"fruit-r":2,
				"vegetables":[5,7],
				"vegetables-r":5,
				"lean_meats":[2,3],
				"lean_meats-r":2.5,
				"milk":[3,4],
				"milk-r":3.5,
				"cereals":[6,7],
				"cereals-r":7,
				"discretionary":0,
				"activity":420
			},
			"age-19-50":{
				"fruit":[2,4],
				"fruit-r":2,
				"vegetables":[5,7],
				"vegetables-r":5,
				"lean_meats":[2,3],
				"lean_meats-r":2.5,
				"milk":[2,3],
				"milk-r":2.5,
				"cereals":[6,7],
				"cereals-r":6,
				"discretionary":0,
				"activity":210
			},
			"age-51-70":{
				"fruit":[2,4],
				"fruit-r":2,
				"vegetables":[5,7],
				"vegetables-r":5,
				"lean_meats":[2,3],
				"lean_meats-r":2,
				"milk":4,
				"cereals":[3,5],
				"cereals-r":4,
				"discretionary":0,
				"activity":210
			},
			"age-71+":{
				"fruit":[2,4],
				"fruit-r":2,
				"vegetables":[5,7],
				"vegetables-r":5,
				"lean_meats":[2,3],
				"lean_meats-r":2,
				"milk":4,
				"cereals":[3,5],
				"cereals-r":3,
				"discretionary":0,
				"activity":210
			}
		},	
		"pregnant":{
			"fruit":[2,4],
			"fruit-r":2,
			"vegetables":[5,7],
			"vegetables-r":5,
			"lean_meats":[3,4],
			"lean_meats-r":3.5,
			"milk":[2,3],
			"milk-r":2.5,
			"cereals":[8,9],
			"cereals-r":8.5,
			"discretionary":0,
			"activity":"Special copy for pregnant Women."
		},
		"breastfeeding":{
			"fruit":[2,4],
			"fruit-r":2,
			"vegetables":[5,7],
			"vegetables-r":7.5,
			"lean_meats":[2,3],
			"lean_meats-r":2.5,
			"milk":[2,3],
			"milk-r":2.5,
			"cereals":[8,9],
			"cereals-r":9,
			"discretionary":0
		}
	}
}
