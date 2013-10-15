<?php
defined('ABSPATH') or die();

require_once(dirname(__FILE__) . '/lib/utils.php');

class HBC_Site
{
	private static $_instance;
	
		
	static function instance()
	{
		if(!self::$_instance)
		{
			self::$_instance = new HBC_Site;
		}
		
		return self::$_instance;
	}
	
	
	private function __construct()
	{
		add_shortcode('hbc_iframe', array($this, 'do_sc_iframe'));
		add_action('wp_head', array($this, '_a_render_extra_scripts'));
		add_action('wp_enqueue_scripts', array($this, '_a_enqueue_things'));
	}
	
	/* akcje */
	
	function _a_render_extra_scripts()
	{
		?>
		<script>
		function hbc_resizeIFrame(extraSpace, scroll)
		{
			var iframe = document.getElementById('hbc-iframe');
			if(iframe)
			{
				//alert('resize ' + iframe.contentWindow.document.body.offsetHeight);
				extraSpace = typeof(extraSpace) == 'number' ? extraSpace : 0;
				
				if(scroll && typeof(jQuery) !== undefined && jQuery.scrollTo)
				  jQuery.scrollTo(iframe, 300);
				
				iframe.style.height = (iframe.contentWindow.document.body.offsetHeight + extraSpace) + 'px';
				
			}
		}
		</script>
		<?php
	}
	
	
	function _a_enqueue_things()
	{
		wp_register_script('jquery-scrollto', plugins_url() . '/healthy-balance-checker/js/jquery.scrollTo.min.js', array('jquery'));
		wp_enqueue_script('jquery-scrollto');
	}
	
	
	/* shortcody */
	
	function do_sc_iframe($args, $content = '')
	{
		$default_args = array(
		  'width' => '100%',
		  'url' => plugins_url() . '/healthy-balance-checker/form/',
		  'height' => 900,
		  'scrolling' => FALSE
		  );
		
		$args = HBC_Utils::override_array($default_args, $args);
		
		if(HBC_Utils::is_num($args['width'])) $args['width'] .= 'px';
		if(HBC_Utils::is_num($args['height'])) $args['height'] .= 'px';
		
		echo '<iframe frameBorder="0" seamless id="hbc-iframe" scrolling="', ($args['scrolling'] ? 'yes' : 'no'), '"',
		  'style="border: 0px none; width: ', htmlspecialchars($args['width']), '; height: ', htmlspecialchars($args['height']), '" ',
		  'src="', htmlspecialchars($args['url']), '"></iframe>';
	}
	
}

HBC_Site::instance();



