<?php
defined('ABSPATH') or die();

$queries = array();

$queries[] = '
  CREATE TABLE IF NOT EXISTS `###hbc_data` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(64) NOT NULL,
  `data` text NOT NULL,
  `time_submitted` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`)
  ) DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci';

$queries[] = '
  CREATE TABLE IF NOT EXISTS `###hbc_email_addresses` (
  `email` varchar(128) NOT NULL,
  `results_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`email`),
  UNIQUE KEY `results_id` (`results_id`)
  ) DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci';
  

$queries[] = '
  CREATE TABLE IF NOT EXISTS `###hbc_subtexts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_key` varchar(64) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_key` (`parent_key`)
  ) DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci';

$queries[] = '
  CREATE TABLE IF NOT EXISTS `###hbc_texts` (
  `key` varchar(64) NOT NULL,
  `label` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `last_modified` datetime NOT NULL,
  `group` varchar(64) NOT NULL,
  `has_subtexts` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`key`)
  ) DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci';

global $wpdb;

foreach($queries as $query)
{
	$query = str_replace('###', $wpdb->prefix, $query);
	$wpdb->query($query);
}

$default_texts = <<<QwErTy

('activity_descr_middle', 'Description - middle', 'How many hours per week for each activity?', NOW(), '4. Activity', 0),
('activity_overlay_moderate', 'About moderate activity', 'Moderate-intensity activity will cause a slight, but noticeable, increase in your breathing and heart rate. A good guide is an activity where you are able to comfortably talk but not sing. Examples include a brisk walk, mowing the lawn, digging in the garden, or medium paced swimming or cycling.', NOW(), '4. Activity', 0),
('activity_overlay_high', 'About high activity', 'High intensity activities will make you huff and puff! These include vigorous activities like football, netball, soccer, running, aerobics, fast paced cycling or training for sport.', NOW(), '4. Activity', 0),
('activity_descr_top', 'Description - top', '\r\n<p>You’ve given us an idea of what you’re eating and drinking patterns look like - now tell us about your physical activity levels! Select the number of hours you spend doing low, medium, or high intensity exercise in a <em><span style="text-decoration: underline;"><strong>typical week</strong></span></em>. This includes organised sport or gym sessions, but also incidental exercise like working in the house or garden, or walking to school or work.</p>\r\n', NOW(), '4. Activity', 0),
('activity_info_if_pregnant', 'Info if pregnant', 'If you are pregnant, speak with your doctor about what physical activities are recommended for you and your baby. Regular exercise should be low impact options such as walking, swimming, yoga or pilates.', NOW(), '4. Activity', 0),
('food_descr_middle_water', 'Description - water (middle)', 'How many glasses do you drink each day?', NOW(), '2. Food Intake', 0),
('food_descr_top', 'Description - top', '\r\n<p>Drag the icons from the different food groups onto your plate to reflect how many serves of each you eat on a typical day. Don’t forget to think about foods that may be ingredients in dishes or meals you eat. For example, if your lasagna recipe had pasta, meat, cheese and zucchini, make sure you add the portions to each food group.</p>\r\n', NOW(), '2. Food Intake', 0),
('food_descr_top_fats', 'Description - fats (top)', 'What fats, oils, and spreads do you use on a regular basis?<br />Select the ones below that you use.', NOW(), '2. Food Intake', 0),
('food_descr_top_water', 'Description - water (top)', 'How many glasses of water do you drink each day? Add the number of glasses you drink on a typical day.', NOW(), '2. Food Intake', 0),
('food_info_dairy', 'About dairy', 'This includes products made from cow’s milk, soy, cereal or nut milk. A serve of milk, yoghurt or cheese is:<ul><li>2 slices of reduced-fat hard cheese</li><li>½ cup ricotta cheese</li><li>a small tub of reduced fat yoghurt</li><li>1 cup of milk or 1 cup of soy milk</li></ul>', NOW(), '2. Food Intake', 0),
('food_info_discretionary', 'About discretionary foods', 'Discretionary food and drinks are those that contain high amounts of saturated fat, added salt, added sugars or alcohol. Many of these foods are also high in energy. How many of these foods can fit into your diet, while maintaining energy balance, will depend on how tall and/or how active you are. Eat these foods sometimes, and in small amounts.', NOW(), '2. Food Intake', 0),
('food_info_fats', 'Info on fats', '\r\n<p>We all know that fats, oils and spreads are best taken in small amounts. Where possible, choose polyunsaturated and monounsaturated fats instead of saturated fats such as in butter. Polyunsaturated fats include sunflower and safflower oils, and margarine spreads and dressings based on these, and nuts such as walnuts and pinenuts. Monounsaturated fats include olive and canola oils, and margarine spreads and dressings based on these, avocado and nuts such as macadamia, hazelnuts, and almonds.</p>\r\n', NOW(), '2. Food Intake', 0),
('food_info_fruit', 'About fruit', 'A serve of fruit is:<ul><li>1 medium-sized fresh fruit (e.g. a whole apple, banana, or pear)</li><li>2 small-sized  fresh fruits (e.g. apricots, kiwis or plums)</li><li>1 cup of chopped or canned fruit</li><li>½ cup of no added sugar fruit juice</li></ul>', NOW(), '2. Food Intake', 0),
('food_info_grains', 'About grains & cereals', 'Serving examples include:<ul><li>1 slice of bread</li><li>½ roll or flatbread</li><li>½ cup of cooked rice, pasta or noodles</li><li>½ cup cooked porridge</li><li>⅔ cup wheat cereal flakes</li><li>¼ cup muesli</li></ul>', NOW(), '2. Food Intake', 0),
('food_info_meat', 'About meat & alternatives', 'Serving examples include:<ul><li>65g of cooked lean meats</li><li>½ cup of cooked lean mince</li><li>80g of cooked poultry like chicken</li><li>100g of cooked fish fillet or a small can of fish</li><li>2 large eggs</li><li>1 cup cooked dried beans, lentils, chick peas, split peas or canned beans</li><li>1 cup  tofu</li><li>30g (a small handful) of unsalted nuts</li></ul>', NOW(), '2. Food Intake', 0),
('food_info_vegs', 'About vegetables', '\r\n<p>A serve of vegetables is approximately 75g, for example:</p>\r\n<ul>\r\n	<li>½ cup of raw or cooked vegetables</li>\r\n	<li>½ cup of cooked or canned dried beans, peas or lentils</li>\r\n	<li>1 cup of salad vegetables</li>\r\n	<li>1 medium tomato or carrot</li>\r\n	<li>1 small or ½ a medium potato</li>\r\n</ul>\r\n', NOW(), '2. Food Intake', 0),
('food_info_water', 'Info on water', 'Water is so good for you, so drink plenty each day. To increase your intake of water, try drinking a glass of water with every meal. If you work at a desk, keep a glass or bottle of water nearby that you can drink as you work.', NOW(), '2. Food Intake', 0),
('intro_descr_bottom', 'Description - bottom', 'The Healthy Balance Checker provides general information only. It is based on Australian Government guidelines for healthy eating and exercise requirements, and should not be considered an alternative to a consultation with a doctor, dietitian or other health professional. If you have any concerns or require further advice, please consult your health professional.', NOW(), '0. Introduction', 0),
('intro_descr_middle', 'Description - middle', '', NOW(), '0. Introduction', 0),
('intro_descr_top', 'Description - top', '\r\n<p>Energy balance is the balance of kilojoules we eat and drink with the kilojoules we burn through physical activity. A great place to start your journey towards energy balance is to make sure you’re meeting the Australian Guide to Healthy Eating and getting your recommended physical activity each day.</p>\r\n', NOW(), '0. Introduction', 0),
('profile_descr_top', 'Description - top', '\r\n', NOW(), '1. Profile', 0),
('profile_if_pregnant', 'Info if pregnant', 'If you are pregnant, speak to your healthcare professional about what eating plan is best for you and your baby. For example, the dietary guidelines suggest pregnant women eat more protein (3.5 serves of foods such as lean meat and vegetarian alternatives), and more grains and cereals (8.5 serves).', NOW(), '1. Profile', 0),
('profile_if_under_12', 'Comment if under 12', 'Are you under 12? Check your Energy Balance <a href="https://www.eatforhealth.gov.au/nutrition-calculators/food-balance" target="_BLANK">here</a>', NOW(), '1. Profile', 0),
('results_descr_top', 'Description - top', 'You’re done! See below for your results. Compare your daily plate with the recommended daily plate, and see some great tips tailored to help you meet the Australian Guide to Healthy Eating and get your recommended physical activity each day.', NOW(), '5. Results', 0),
('tips_activity_12_18_inc', 'Tips - activity, 12-18, increase', '', NOW(), '5. Results', 1),
('tips_activity_12_18_ok', 'Tips - activity, 12-18, sufficient', '', NOW(), '5. Results', 1),
('tips_activity_19_50_inc', 'Tips - activity, 19-50, increase', '', NOW(), '5. Results', 1),
('tips_activity_19_50_ok', 'Tips - activity, 19-50, sufficient', '', NOW(), '5. Results', 1),
('tips_activity_51_70_inc', 'Tips - activity, 51-70, increase', '', NOW(), '5. Results', 1),
('tips_activity_51_70_ok', 'Tips - activity, 51-70, sufficient', '', NOW(), '5. Results', 1),
('tips_activity_71plus_inc', 'Tips - activity, 71+, increase', '', NOW(), '5. Results', 1),
('tips_activity_71plus_ok', 'Tips - activity, 71+, sufficient', '', NOW(), '5. Results', 1),
('tips_activity_general_inc', 'General tips - activity, insufficient', '\r\n<p>Most Australians are recommended to include 30 minutes of moderate activity into their day, or 60 minutes if you are under 18 years of age. You have a little way to go to reach this goal. Remember, your 30 minutes can be accumulated by combining short bouts of around 10 to 15 minutes each.</p>\r\n', NOW(), '5. Results', 0),
('tips_activity_general_ok', 'General tips - activity, sufficient', '\r\n<p>Most Australians are recommended 30 minutes of moderate activity each day, or 60 minutes if you are under 18 years of age. You''re doing a great job in meeting this recommendation. Remember, different physical activities will stretch and strengthen different muscles, increase your coordination skills and balance, and add to your overall fitness.</p>\r\n', NOW(), '5. Results', 0),
('tips_activity_general_pregnant', 'General tips - activity, for pregnant', '\r\n<p>If you are pregnant, speak with your doctor about what physical activities are recommended for you and your baby. Regular exercise should be low impact options such as walking, swimming, yoga or pilates.</p>\r\n', NOW(), '5. Results', 0),
('tips_food_dairy_dec', 'Tips - food, dairy, decrease', '', NOW(), '5. Results', 1),
('tips_food_dairy_inc', 'Tips - food, dairy, increase', '', NOW(), '5. Results', 1),
('tips_food_discr_dec', 'Tips - food, discretionary, decrease', '', NOW(), '5. Results', 1),
('tips_food_discr_inc', 'Tips - food, discretionary, increase', '', NOW(), '5. Results', 1),
('tips_food_fruit_dec', 'Tips - food, fruit, decrease', '', NOW(), '5. Results', 1),
('tips_food_fruit_inc', 'Tips - food, fruit, increase', '', NOW(), '5. Results', 1),
('tips_food_general_bad', 'General tips - food, not satisfactory', '\r\n<p>By comparing the two plates above, you can see that you might benefit from some small changes to your eating pattern. To help achieve and maintain energy balance, it is important to enjoy a wide variety of nutritious foods from these food groups every day.</p>\r\n', NOW(), '5. Results', 0),
('tips_food_general_ok', 'General tips - food, satisfactory', '\r\n<p>By comparing the two plates above, you can see that you are doing a great job of meeting the recommended food groups. Remember to enjoy a wide variety of nutritious foods from these food groups every day.</p>\r\n', NOW(), '5. Results', 0),
('tips_food_grains_dec', 'Tips - food, grains, decrease', '', NOW(), '5. Results', 1),
('tips_food_grains_inc', 'Tips - food, grains, increase', '', NOW(), '5. Results', 1),
('tips_food_meat_dec', 'Tips - food, meat, decrease', '', NOW(), '5. Results', 1),
('tips_food_meat_inc', 'Tips - food, meat, increase', '', NOW(), '5. Results', 1),
('tips_food_vegs_dec', 'Tips - food, vegs, decrease', '', NOW(), '5. Results', 1),
('tips_food_vegs_inc', 'Tips - food, vegs, increase', '', NOW(), '5. Results', 1)

QwErTy;

$default_subtexts = <<<QwErTy

('tips_food_fruit_inc', 'Increase your fruit intake by keeping your fruit bowl full, so you can grab an apple or an orange on your way out the door.'),
('tips_food_fruit_inc', 'Choose fruits that are in season – they will be tastier, and more appealing for you to eat.'),
('tips_food_fruit_inc', 'Increase your fruit intake by whipping up a fruit salad for a healthy dessert – you can even have the recommended servings in one go this way.'),
('tips_food_fruit_dec', 'You’re getting plenty of fruit each day! The key to healthy eating is balance, so make sure you’re not neglecting foods from the other food groups.'),
('tips_food_vegs_inc', 'Include more vegetables into your favourite meals – try eggplant in spaghetti bolognaise, or pumpkin in your lasagne.'),
('tips_food_vegs_inc', 'Prepare veggie snacks for yourself and your family the day before work or school. Carrot and celery sticks are a favourite – especially with some low fat dip.'),
('tips_food_vegs_inc', 'Soups and salads as an entrée are a great way of increasing your vegetable intake and ensuring you fill up on the good stuff!'),
('tips_food_vegs_dec', 'You’re getting plenty of vegetables each day! The key to healthy eating is balance, so make sure you’re not neglecting foods from the other food groups.'),
('tips_food_meat_inc', 'Eggs are a great source of protein. Whip up an omelette, frittata, or classic scrambled eggs on toast for breakfast, lunch or dinner!'),
('tips_food_meat_inc', 'Legumes are so nutritious and a good source of protein. Why not toss some chickpeas into your salad?'),
('tips_food_meat_dec', 'You’re getting plenty of serves of meat or alternatives each day! The key to healthy eating is balance, so make sure you’re not neglecting foods from the other food groups.'),
('tips_food_dairy_inc', 'Kick off your day with dairy. Have cereal with low fat or reduced fat milk, or fresh fruit topped with low-fat plain or fruit yogurt.'),
('tips_food_dairy_inc', 'Top your favourite dinner recipes with a small portion of grated cheese – pasta dishes, salads and even soups.'),
('tips_food_dairy_inc', 'Increase your dairy intake by having a glass of reduced fat milk or a glass of reduced fat flavoured milk.'),
('tips_food_dairy_dec', 'You’re getting plenty of dairy each day! The key to healthy eating is balance, so make sure you’re not neglecting foods from the other food groups.'),
('tips_food_grains_inc', 'Rice is a very versatile ingredient. Look for low GI, as well as brown and wild rice varieties for a fibre boost!'),
('tips_food_grains_inc', 'Fixing yourself some toast or a sandwich? Reach for a wholegrain or wholemeal bread instead of white to boost the fibre content in your diet.'),
('tips_food_grains_dec', 'You’re getting plenty of grains and cereals each day! The key to healthy eating is balance, so make sure you’re not neglecting foods from the other food groups.'),
('tips_food_discr_dec', 'Many Australians would benefit from eating smaller amounts of discretionary foods. These foods are high in saturated fats, added salt or added sugars, and are best eaten only sometimes and in small amounts.'),
('tips_food_discr_inc', 'Be sincere with yourself. Sometimes you just need a cookie!!'),
('tips_activity_12_18_inc', 'Try to introduce moderate activity to every day, like walking the dog, bike riding, skateboarding, and dancing.'),
('tips_activity_12_18_inc', 'Try to do 20 minutes of higher intensity activity 3–4 days a week. That means exercise that really gets your heart pumping. Try training for a sport like soccer or netball, running or swimming laps.'),
('tips_activity_12_18_ok', 'Try adding some variety to your regular exercise regime. This can be a new team sport, or one-off sporting adventures like horse rising, rock climbing or ice skating.'),
('tips_activity_19_50_inc', 'Try to introduce moderate activity into your day - something that will increase your breathing and heart rate. This can be brisk walking, or medium paced swimming or cycling. Even mowing the lawn, gardening or house cleaning can do the trick.'),
('tips_activity_19_50_inc', 'Try to include in your week some vigorous exercise for extra health and fitness. Why not take up jogging, skipping, or higher intensity swimming or cycling?'),
('tips_activity_19_50_inc', 'If you are recommencing physical activity, or are starting a new physical activity, make sure you start at a level that is easily manageable and gradually build up the recommended amount, type and frequency of activity.'),
('tips_activity_19_50_ok', 'To build on your current exercise routine, try a new team sport or gym class, or one-off sporting adventures like a hike, a marathon, or a kayaking trip.'),
('tips_activity_19_50_ok', 'Try to incorporate more exercise into your daily schedule, like walking or bike riding to the train station instead of driving, hopping off the bus one stop early, or parking your car further away to walk the rest of the way.'),
('tips_activity_19_50_ok', 'If you are increasing your intensity or starting a new physical activity, make sure you start at a level that is easily manageable, and gradually build up the recommended amount, type and frequency of activity.'),
('tips_activity_51_70_inc', 'Try to introduce moderate activity into your day - something that will increase your breathing and heart rate. This can be walking, or even gardening or house cleaning.'),
('tips_activity_51_70_ok', 'Try a new regular exercise commitment like yoga, pilates or a gym class, or one-off sporting adventures like a bush walk, a bike ride, or low impact aerobics.'),
('tips_activity_51_70_ok', 'Try to incorporate more exercise into your daily schedule, like walking or bike riding to the train station instead of driving, hopping off the bus one stop early, or parking your car further away to walk the rest of the way.'),
('tips_activity_51_70_ok', 'If you are increasing your intensity or starting a new physical activity, make sure you start at a level that is easily manageable, and gradually build up the recommended amount, type and frequency of activity.'),
('tips_activity_71plus_inc', 'Try to introduce moderate activity into your day - something that will increase your breathing and heart rate. This can be walking, or even gardening or house cleaning.'),
('tips_activity_71plus_inc', 'Try to undertake a higher intensity activity occasionally, for example tennis, power walking, or chasing after the grandchildren.'),
('tips_activity_71plus_inc', 'If you are recommencing physical activity, or are starting a new physical activity, make sure you start at a level that is easily manageable and gradually build up the recommended amount, type and frequency of activity.'),
('tips_activity_71plus_ok', 'Why not try a new regular exercise commitment like aqua aerobics, tai chi, bowls, a low impact gym class, or one-off sporting adventures like a bush walk?'),
('tips_activity_71plus_ok', 'If you are increasing your intensity or starting a new physical activity, make sure you start at a level that is easily manageable, and gradually build up the recommended amount, type and frequency of activity.'),
('tips_activity_51_70_inc', 'Try to undertake a higher intensity activity occasionally, for example tennis, power walking, or chasing after the grandchildren.'),
('tips_activity_51_70_inc', 'If you are recommencing physical activity, or are starting a new physical activity, make sure you start at a level that is easily manageable and gradually build up the recommended amount, type and frequency of activity.');


QwErTy;

if($wpdb->get_var('SELECT COUNT(*) FROM `' . $wpdb->prefix . 'hbc_texts`') === '0'
  && $wpdb->get_var('SELECT COUNT(*) FROM `' . $wpdb->prefix . 'hbc_subtexts`') === '0')
{
	$query = 'INSERT INTO `' . $wpdb->prefix . 'hbc_texts` (`key`, `label`, `text`, `last_modified`, `group`, `has_subtexts`)
	  VALUES ' . $default_texts;
	  
	$wpdb->query($query);
	
	$query = 'INSERT INTO `' . $wpdb->prefix . 'hbc_subtexts` (`parent_key`, `text`)
	  VALUES ' . $default_subtexts;
	  
	$wpdb->query($query);
}




