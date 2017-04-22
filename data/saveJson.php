<?php

	$config = array(
		"allowedFiles" => array("expenses.json", "revenues.json", "funds.json")
	);
	

	// LOAD, DECODE AND VALIDATE REQUEST
	$json = file_get_contents('php://input');
	$obj = json_decode($json);

	if(!isset($obj -> fileName)) exit("Missing fileName.");
	$fileName = $obj -> fileName;
	if(in_array($fileName, $allowedFiles) === false) 
		exit("Target file must be expenses.json, revenues.json or funds.json");



	// IF THERE'S NEW DATA, OVERWRITE TARGETTED DATA FILE
	if(isset($obj -> newContents)) {
		$newContents = $obj -> newContents;
		file_put_contents( $fileName, $newContents);
	}



	// RETURN NEWLY UPDATED CONTENTS
	include($fileName);