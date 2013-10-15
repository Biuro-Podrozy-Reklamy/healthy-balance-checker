<style scoped>
.wrap h2 em
{
	color: #999;
	font-family: Georgia, serif;
}

ul#hbc-subtext-list li
{
	background: #ECECEC;
	padding: 15px;
	border-radius: 4px;
	position: relative;
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
}

ul#hbc-subtext-list li + li
{
	margin-top: 15px;
}

ul#hbc-subtext-list li a.hbc-delete
{
	display: block;
	position: absolute;
	right: 15px;
	top: 15px;
	font-size: 20px;
	font-weight: bold;
	color: #D00;
	text-decoration: none;
}
</style>

<div class="wrap">
	<div id="icon-edit-pages" class="icon32 icon32-posts-page"></div>
	<h2>
		Edit texts: 
		<em><?= htmlspecialchars(preg_replace('#^\d+\.\s*#', '', $text['group']) . ' > ' . $text['label']) ?></em>
	</h2>
	<form method="post" action="?page=hbc-edit-subtexts&amp;text=<?= $text['key'] ?>">
		<p class="clear info">
			<input id="hbc-add-subtext" type="button" class="button" value="Add text" />
		</p>
		<ul id="hbc-subtext-list">
			<?php foreach($subtexts as $sub) { ?>
			<li data-id="<?= $sub['id'] ?>">
				<textarea rows="3" cols="100" name="subtexts[<?= $sub['id'] ?>]"><?= htmlspecialchars($sub['text']) ?></textarea>
				<a class="hbc-delete" href="#" title="Delete">&times;</a>
			</li>
			<?php } ?>
		</ul>
		<p>
			<input type="submit" class="button button-primary" value="Save changes" />
			&nbsp;or&nbsp;
			<a href="?page=hbc-texts">Back to the list</a>
		</p>
		<input type="hidden" name="task" value="update_subtexts" />
		<?php wp_nonce_field('hbc_update_subtexts', 'wp_nonce'); ?>
	</form>
</div>

<script>
//<![CDATA[
jQuery(document).ready(function($)
{
	var list = $('#hbc-subtext-list'), form = list.parent();
	
	$('#hbc-add-subtext').click(function()
	{
		list.append('<li><textarea rows="3" cols="100" name="new[]"></textarea><a class="hbc-delete" href="#" title="Delete">&times;</a></li>');
	});
	
	$('#hbc-subtext-list').on('click', 'li > .hbc-delete', function(e)
	{
		var li = $(this).parent();
		
		e.preventDefault();
		
		if(li.attr('data-id'))
		  form.append('<input type="hidden" name="delete[]" value="' + li.attr('data-id') + '" />');
		
		li.remove();
	});

});

//]]>
</script>
