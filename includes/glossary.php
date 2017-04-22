
<section id="avb-glossary">

<?php
$curpath = getcwd().'/';
// attempt opening glossary file
$glossary_file = "data/glossary.csv";
if (($handle = fopen( $glossary_file, "r")) !== FALSE) {
	$counter = 0;
	while (!feof($handle) ) {
		// first line
		if($counter === 0) {
			//consume line
			$line = fgetcsv($handle,",");
			// update counter and skip printing line
			$counter++;
			continue;
		}
	    $line = fgetcsv($handle,",");
	    echo '<p class="definition">';
	    // title
	    echo '<span class="title">'.$line[0].'</span>';
	    // description
	    echo '<span class="description">'.$line[1].'</span>';
	    echo '</p>';
	   	$counter++;
	}
	// close file
	fclose($handle);
}
?>

</section>