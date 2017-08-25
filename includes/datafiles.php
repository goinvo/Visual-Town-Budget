<?php
	global $selected_budget;
	$budget_slug = $selected_budget -> meta['slug'];

	foreach($selected_budget -> meta['sections'] as $section){
		if($section == "assets") $section = "funds";
		echo '<script id="data-'.$section.'" type="application/json">';
		require_once ABSPATH . "data/budgets/$budget_slug/$section.json";
		echo '</script>';
	}
?>

<script id="data-home" type="application/json">
  <?php require_once ABSPATH . "data/budgets/$budget_slug/home.json";?>
</script>
