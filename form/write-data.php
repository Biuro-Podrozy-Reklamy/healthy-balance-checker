<?php
defined('ABSPATH') or die();

$rcode = NULL;
$data = _gather_data();

if(!$data) return;

$rcode = HBC_DB::register_results($data);


// walidacja

function _gather_data()
{
	$data = array();
	
	if(isset($_POST['oils']) && preg_match('#^[01]+(?:,[01]+)*$#', $_POST['oils']))
	{
		$data['oils'] = $_POST['oils'];
	}
	else return NULL;
	
	$data['gender'] = isset($_POST['gender']) && $_POST['gender'] === 'male' ? 'M' : 'F';
	$data['pregnant'] = isset($_POST['pregnant']) && $_POST['pregnant'] === 'true' && $data['gender'] == 'F';
	$data['breastfeeding'] = isset($_POST['breastfeeding']) && $_POST['breastfeeding'] === 'true' && $data['gender'] == 'F';
	
	if(isset($_POST['age']) && in_array($_POST['age'], array('12-18', '19-50', '51-70', '71+')))
	  $data['age_group'] = $_POST['age'];
	else return NULL;
	
	foreach(array('activity-low', 'activity-medium', 'activity-high', 'water') as $key)
	{
		if(isset($_POST[$key]))
		{
			if(HBC_Utils::is_num($_POST[$key])) $data[str_replace('-', '_', $key)] = (int) $_POST[$key];
			else return NULL;
		}
		else $data[$key] = 0;
	}
	
	
	if(isset($_POST['meals']) && preg_match('#^\d+(?:,\d+)*$#', $_POST['meals']))
	{
		$data['meals'] = $_POST['meals'];
	}
	else return NULL;
	
	
	return $data;
}

