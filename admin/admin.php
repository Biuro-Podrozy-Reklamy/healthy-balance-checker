<?php

define('HBC_CAPABILITY', 'edit_pages');

require_once(dirname(__FILE__) . '/../lib/db.php');
require_once(ABSPATH . 'wp-includes/pluggable.php');

class HBC_Admin
{
	private static $_instance;
	
	private $_page = NULL;
	private $_notices;
	
	
	static function instance()
	{
		if(!self::$_instance)
		{
			self::$_instance = new HBC_Admin;
		}
		
		return self::$_instance;
	}
	
	
	private function __construct()
	{
		$this->_notices = array();
		
		$page = isset($_GET['page']) && current_user_can(HBC_CAPABILITY) ? $_GET['page'] : '';
		
		if($page && substr($page, 0, 4) == 'hbc-')
		{
			$page = str_replace('-', '_', substr($page, 4));
			if(method_exists($this, '_page_' . $page))
			  $this->_page = $page;
		}
		
		add_action('admin_menu', array($this, '_a_extend_menu'));
						
		if($this->_page)
		{
			add_action('admin_notices', array($this, '_a_print_notices'));
			add_action('admin_init', array($this, '_a_handle_task'));
		}
	}
	
	
	function add_notice($text, $is_error = false)
	{
		$this->_notices[] = array($is_error, $text);
	}
	
	
	private static function _verify_nonce($task)
	{
		return isset($_POST['wp_nonce']) && wp_verify_nonce($_POST['wp_nonce'], 'hbc_' . $task);
	}
	
	
	/* akcje, filtry */
	
	function _a_print_notices()
	{
		foreach($this->_notices as $message)
		{
			echo '<div class="', ($message[0] ? 'error' : 'updated'), '"><p>',
			  $message[1], '</p></div>';
		}
	}
	
	
	function _a_extend_menu()
	{
		add_menu_page('Healthy Balance Checker', 'Healthy Balance Checker', HBC_CAPABILITY, 
		  'hbc-texts', array($this, '_page_texts'), NULL, 29);
		
		add_submenu_page('hbc-texts', 'HBC editable texts', 'Editable texts', HBC_CAPABILITY, 
		  'hbc-texts', array($this, '_page_texts'));
		
		//add_submenu_page('hbc-texts', 'HBC settings', 'Settings', HBC_CAPABILITY, 
		//  'hbc-settings', array($this, '_page_settings'));
		  
		/* ukryte */
		
		add_submenu_page(NULL, 'Edit text', 'Edit text', HBC_CAPABILITY, 
		  'hbc-edit-text', array($this, '_page_edit_text'));
		
		add_submenu_page(NULL, 'Edit texts', 'Edit texts', HBC_CAPABILITY, 
		  'hbc-edit-subtexts', array($this, '_page_edit_subtexts'));
	}
	
	
	function _a_handle_task()
	{
		$task = isset($_REQUEST['task']) ? $_REQUEST['task'] : '';
		
		if(method_exists($this, '_task_' . $task)) 
		  call_user_func(array($this, '_task_' . $task));
	}
	
	
	/* podstrony */
	
	function _page_texts()
	{
		$texts = HBC_DB::get_all_texts(TRUE);
		
		include(dirname(__FILE__) . '/pages/texts.php');
	}
	
	
	function _page_edit_text()
	{
		$key = isset($_REQUEST['text']) ? $_REQUEST['text'] : NULL;
		$text = HBC_DB::get_single_text($key);
		
		if(!$text) return;
		
		include(dirname(__FILE__) . '/pages/edit-text.php');
		
	}
	
	
	function _page_edit_subtexts()
	{
		$key = isset($_REQUEST['text']) ? $_REQUEST['text'] : NULL;
		$text = HBC_DB::get_single_text($key);
		
		if(!$text || !$text['has_subtexts']) return;
		
		$subtexts = HBC_DB::get_subtexts($key);
		
		include(dirname(__FILE__) . '/pages/edit-subtexts.php');
	}
	
	
	function _page_settings()
	{
	
	}
	
	
	/* zadania */
	
	function _task_update_text()
	{
		if(!self::_verify_nonce('update_text')) return;
		
		if(!isset($_REQUEST['text']) || !isset($_POST['text_content']))
		  return;
		  
		if(HBC_DB::update_text($_REQUEST['text'], stripslashes($_POST['text_content'])))
		{
			HBC_DB::register_text_update($_REQUEST['text']);
			$this->add_notice('Text has been modified.');
		}
		else
		  $this->add_notice('No changes have been written!', TRUE);
	}
	
	
	function _task_update_subtexts()
	{
		if(!self::_verify_nonce('update_subtexts')) return;
		
		$key = isset($_REQUEST['text']) ? $_REQUEST['text'] : NULL;
		$new = isset($_POST['new']) && is_array($_POST['new']) ? $_POST['new'] : array();
		$delete = isset($_POST['delete']) && is_array($_POST['delete']) ? $_POST['delete'] : array();
		$subtexts = isset($_POST['subtexts']) && is_array($_POST['subtexts']) ? $_POST['subtexts'] : array();
		
		$text = HBC_DB::get_single_text($key);
		if(!$text || !$text['has_subtexts']) return;
		
		$c = 0;
		
		foreach($new as $item)
		{
			$item = trim(stripslashes($item));
			
			if($item && HBC_DB::add_subtext($key, $item)) ++$c;
		}
		
		foreach($delete as $id)
		{
			if(HBC_DB::delete_subtext($id, $key)) ++$c;
		}
		
		foreach($subtexts as $id => $item)
		{
			if(HBC_DB::update_subtext($id, trim(stripslashes($item)), $key)) ++$c;
		}
		
		if($c) 
		{
			$this->add_notice('Changes saved.');
			HBC_DB::register_text_update($key);
		}
	}
}

HBC_Admin::instance();
