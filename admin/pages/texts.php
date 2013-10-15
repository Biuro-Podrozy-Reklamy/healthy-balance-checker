<style scoped>
table.wp-list-table tr:hover td
{
	background-color: #FFFFE0;
}

table.wp-list-table td.excerpt
{
	white-space: nowrap;
}

table.wp-list-table td.excerpt span
{
	display: inline-block;
	width: 80%;
	overflow: hidden;
	text-overflow: ellipsis;
}

</style>

<div class="wrap">
	<div id="icon-edit-pages" class="icon32 icon32-posts-page"></div>
	<h2>Editable texts</h2>
	<div class="tablenav top"></div>
	<table class="wp-list-table widefat fixed">
		<?php foreach($texts as $group => $list) { ?>
		<thead>
			<tr>
				<th colspan="2"><strong><?= htmlspecialchars($group) ?></strong></th>
				<th width="150"><em>Last modified</em></th>
			</tr>
		</thead>
		<?php foreach($list as $text) { ?>
		<tr>
			<td width="300">
				<a href="?page=<?= $text['has_subtexts'] ? 'hbc-edit-subtexts' : 'hbc-edit-text' ?>&amp;text=<?= $text['key'] ?>">
					<strong><?= htmlspecialchars($text['label']) ?></strong>
				</a>
			</td>
			<td class="excerpt">
				<?php if($text['has_subtexts']) { ?>
				<em>[multiple texts]</em>
				<?php } else { ?>
				<span><?= HBC_Utils::html_to_text($text['text']) ?></span>
				<?php } ?>
			</td>
			<td>
				<em><?= $text['last_modified'] ?></em>
			</td>
		</tr>
		<?php } ?>
		<?php } ?>
	</table>
	
</div>
