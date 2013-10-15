<?php

require_once(dirname(__FILE__) . '/utils.php');

class HBC_DB
{
	static function get_single_text($key)
	{
		if(!is_string($key)) return NULL;
		
		global $wpdb;
		
		$query = 'SELECT * FROM `' . $wpdb->prefix . 'hbc_texts` WHERE `key` = %s';
		$query = $wpdb->prepare($query, $key);
		
		return $wpdb->get_row($query, ARRAY_A);
	}
	
	
	static function get_subtexts($key)
	{
		if(!is_string($key)) return NULL;
		
		global $wpdb;
		
		$query = 'SELECT * FROM `' . $wpdb->prefix . 'hbc_subtexts` WHERE `parent_key` = %s ORDER BY `id`';
		$query = $wpdb->prepare($query, $key);
		
		return $wpdb->get_results($query, ARRAY_A);
	}
	
	
	static function get_all_texts($group = FALSE)
	{
		global $wpdb;
		
		$query = 'SELECT * FROM `' . $wpdb->prefix . 'hbc_texts` WHERE 1 ORDER BY `group` ASC, `label` ASC';
		$rows = $wpdb->get_results($query, ARRAY_A);
		
		if(!$group)
		{
			$texts = array();
			foreach($rows as $row) $texts[$row['key']] = $row;

			return $texts;
		}
		
		if($rows)
		{
			$groups = array();
			
			foreach($rows as $row)
			{
				$g = $row['group'];
				
				if(!isset($groups[$g]))
				  $groups[$g] = array();
				  
				$groups[$g][$row['key']] = $row;
			}
			
			return $groups;
		}
		
		return NULL;
	}
	
	
	static function get_all_texts_plain($json_encode = FALSE)
	{
		global $wpdb;
		
		$query = 'SELECT `key`, `text` FROM `' . $wpdb->prefix . 'hbc_texts` WHERE 1';
		$rows = $wpdb->get_results($query, ARRAY_N);
		
		$texts = array();
		
		foreach($rows as $row)
		{
			$texts[$row[0]] = $json_encode ? json_encode($row[1]) : $row[1];
		}
		
		return $texts;
	}
	
	
	static function get_all_subtexts_plain($json_encode = FALSE)
	{
		global $wpdb;
		
		$query = 'SELECT `parent_key`, `text` FROM `' . $wpdb->prefix . 'hbc_subtexts` WHERE 1';
		$rows = $wpdb->get_results($query, ARRAY_N);
		
		$texts = array();
		
		foreach($rows as $row)
		{
			$texts[$row[0]][] = $json_encode ? json_encode($row[1]) : $row[1];
		}
		
		return $texts;
	}
	
	
	static function update_text($key, $text)
	{
		global $wpdb;
		
		$query = 'UPDATE `' . $wpdb->prefix . 'hbc_texts` SET `text` = %s WHERE `key` = %s';
		$query = $wpdb->prepare($query, $text, $key);
		
		return $wpdb->query($query);
	}
	
	
	static function register_text_update($key)
	{
		global $wpdb;
		
		$query = 'UPDATE `' . $wpdb->prefix . 'hbc_texts` SET `last_modified` = NOW() WHERE `key` = %s';
		return $wpdb->query($wpdb->prepare($query, $key));
	}
	
	
	static function update_subtext($id, $subtext, $key = NULL)
	{
		global $wpdb;
		
		if(!HBC_Utils::is_num($id) || !is_string($subtext)) return FALSE;
		
		$query = 'UPDATE `' . $wpdb->prefix . 'hbc_subtexts` SET `text` = %s WHERE `id` = %s';
		
		if($key) $query .= ' AND `parent_key` = %s';
		
		$query = $wpdb->prepare($query, $subtext, $id, $key);
		
		return $wpdb->query($query);
	}
	
	
	static function delete_subtext($id, $key = NULL)
	{
		global $wpdb;
		
		if(!HBC_Utils::is_num($id)) return FALSE;
		
		$query = 'DELETE FROM `' . $wpdb->prefix . 'hbc_subtexts` WHERE `id` = %s';
		
		if($key) $query .= ' AND `parent_key` = %s';
		
		$query = $wpdb->prepare($query, $id, $key);
		
		return $wpdb->query($query);
	}
	
	
	static function add_subtext($key, $subtext)
	{
		global $wpdb;
		
		$text = self::get_single_text($key);

		if(!$text || !$text['has_subtexts'] || !is_string($subtext)) return FALSE;
		
		$query = 'INSERT INTO `' . $wpdb->prefix . 'hbc_subtexts` (`parent_key`, `text`) VALUES
		  (%s, %s)';
		  
		$query = $wpdb->prepare($query, $key, $subtext);
		
		return $wpdb->query($query);
	}
	
	
	/* data */
	
	static function generate_token()
	{
		global $wpdb;
		
		$query = 'SELECT COUNT(*) FROM `' . $wpdb->prefix . 'hbc_data` WHERE `token` = ';
		
		while(TRUE)
		{
			$token = md5(uniqid(rand(), true));
			$result = $wpdb->get_row($query . '"' . $token . '"', ARRAY_N);
			if((int) $result[0] == 0) break;
		}
		
		return $token;
	}
	
	
	static function register_results($data)
	{
		global $wpdb;
		
		$token = self::generate_token();
		$data = json_encode($data);
		
		$query = 'INSERT INTO `' . $wpdb->prefix . 'hbc_data` (`token`, `data`, `time_submitted`) VALUES (%s, %s, NOW())';
		$query = $wpdb->prepare($query, $token, $data);
		
		if($wpdb->query($query)) return $token;
		
		return NULL;
	}
	
	
	static function get_results($token, $get_row = FALSE)
	{
		global $wpdb;
		
		$query = 'SELECT * FROM `' . $wpdb->prefix . 'hbc_data` WHERE `token` = %s';
		$query = $wpdb->prepare($query, $token);
		$row = $wpdb->get_row($query, ARRAY_A);

		return $row ? ($get_row ? $row : json_decode($row['data'], TRUE)) : NULL;
	}
	
	
	static function register_email($email, $token = NULL)
	{
		global $wpdb;
				
		if($token)
		{
			$results = self::get_results($token, TRUE);
			
			if(!$results) return;
			
			$id = $results['id'];
		}
		else $id = 'NULL';
		
		$query = 'INSERT IGNORE INTO `' . $wpdb->prefix . 'hbc_email_addresses` (`email`, `results_id`)
		  VALUES (%s, ' . $id . ')';
		  
		$query = $wpdb->prepare($query, $email);
		$wpdb->query($query);
	}
	
}
