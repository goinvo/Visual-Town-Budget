<div class="container" id="avb-body">
	<div class="row-fluid" id="avb-wrap" style="width:auto;">
		<?php
			$pages = array("opendata" => "opendata.php", "glossary" => "glossary.php");
			// add related pages content if needed
			if(array_key_exists($_GET["page"], $pages)) {
				require_once plugin_dir_path(__FILE__) . $pages[$_GET["page"]];
			}
		?>
	</div>
</div>