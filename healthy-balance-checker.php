<?php
/*
Plugin Name: Healthy Balance Checker
*/

defined('ABSPATH') or die();

$doing_ajax = defined('DOING_AJAX') && DOING_AJAX;

if(is_admin() && !$doing_ajax)
{
	register_activation_hook(__FILE__, '_hbc_on_activate_plugin');
	//register_uninstall_hook(__FILE__, '_hbc_on_uninstall_plugin');
	//register_deactivation_hook(__FILE__, '_hbc_on_uninstall_plugin');
	
	require(dirname(__FILE__) . '/admin/admin.php');
}
else
{
	require(dirname(__FILE__) . '/site.php');
}


function _hbc_on_activate_plugin()
{
	include(dirname(__FILE__) . '/install.php');
}


function _hbc_on_uninstall_plugin()
{
	global $wpdb;
	
	foreach(array('texts', 'subtexts', 'data', 'email_addresses') as $table)
	{
		$query = 'DROP TABLE `' . $wpdb->prefix . 'hbc_' . $table . '`';
		$wpdb->query($query);
	}
}
