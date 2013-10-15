<?php
require('wp-load.php');

if(isset($_POST['url']) && isset($_POST['mail']) && is_email($_POST['mail']))
{
	if($_POST['url'] == 'add') HBC_DB::register_email($_POST['mail']);
	else HBC_DB::register_email($_POST['mail'], $_POST['url']);
}

