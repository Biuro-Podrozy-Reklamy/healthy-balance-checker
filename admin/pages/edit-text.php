<?php

$editor_args = array(
  'textarea_name' => 'text_content'
  );

?>
<style scoped>
.wrap h2 em
{
	color: #999;
	font-family: Georgia, serif;
}

</style>
<div class="wrap">
	<div id="icon-edit-pages" class="icon32 icon32-posts-page"></div>
	<h2>
		Edit text: 
		<em><?= htmlspecialchars(preg_replace('#^\d+\.\s*#', '', $text['group']) . ' > ' . $text['label']) ?></em>
	</h2>
	<p class="clear info">
		Enter desired text below:
	</p>
	<form method="post" action="?page=hbc-edit-text&amp;text=<?= $text['key'] ?>">
		<?php wp_editor($text['text'], 'hbc-text', $editor_args); ?>
		<p>
			<input type="submit" class="button button-primary" value="Save changes" />
			&nbsp;or&nbsp;
			<a href="?page=hbc-texts">Back to the list</a>
		</p>
		<input type="hidden" name="task" value="update_text" />
		<?php wp_nonce_field('hbc_update_text', 'wp_nonce'); ?>
	</form>
	
</div>
