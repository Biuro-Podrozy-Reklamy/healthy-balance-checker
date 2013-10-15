<?php

class HBC_Utils
{
	static function is_num($v)
	{
		return is_int($v) && $v >= 0 || is_string($v) && ctype_digit(trim($v));
	}
	
	static function override_array($target, $source)
	{
		if(!is_array($target)) return NULL;
		if(!is_array($source)) return $target;
				
		foreach(array_keys($target) as $key)
		{
			if(isset($source[$key])) $target[$key] = $source[$key];
		}
		
		return $target;
	}
	
	static function array_has_keys($array, $keys)
	{
		if(!is_array($array)) return false;
	
		$args = is_array($keys) ? $keys : array_slice(func_get_args(), 1);
		for($i = 0; $i < count($args); ++$i)
		{
			if(!isset($array[$args[$i]]))
			  return false;
		}
		
		return true;
	}
	
	
	static function html_to_text($html)
	{
		$text = html_entity_decode(strip_tags($html));
		$text = preg_replace('#\s+#', ' ', $text);
		//$text = preg_replace('#([.,?!])(\p{L})#u', '$1 $2', $text);
		
		return trim($text);
	}
	
	
	static function is_browser_ie8()
	{
		return is_int(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE 8.'));
	}
	
	
	static function is_browser_old_ie()
	{
		if(preg_match('#MSIE (\d+)\.#', $_SERVER['USER_AGENT'], $m))
		{
			return (int) $m[1] < 8;
		}
		
		return FALSE;
	}
}
