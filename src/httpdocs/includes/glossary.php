<div>
hello
</div>

<?php
$row = 1;
$curpath = getcwd().'/';
if (($handle = fopen( "data/glossary.csv", "r")) !== FALSE) {
	$counter = 0;
	while (!feof($handle) ) {
	    $line_of_text = fgetcsv($handle,",");
	    var_dump($line_of_text);
	    echo '<br>**********<br>';
	        $counter++;
	}
}
?>
