<?php
	foreach($dataSections as $section){
		echo '<script id="data-'.$section.'" type="application/json">';
		require_once ABSPATH . 'data/'.$section.'.json';
		echo '</script>';
	}
?>

<script id="data-home" type="application/json"> 
  <?php require_once ABSPATH . "data/home.json";?>
</script>

