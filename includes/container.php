<?php
	require_once dirname(__FILE__) . '/navbar.php';
?>

<div id="avb-app">
	<?php
		$pages = array("opendata" => "opendata.php", "glossary" => "glossary.php");
		// add related pages content if needed
		if(array_key_exists($_GET["page"], $pages)) {
			require_once plugin_dir_path(__FILE__) . $pages[$_GET["page"]];
		}
	?>
</div>
