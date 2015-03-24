<?php
  # Variables used throughout the site
  $siteName = "Arlington Visual Budget"; // determines site title and the title on top left of pages (used to be "Arlington, MA")
  $siteURL = "arlingtonvisualbudget.org";
  $municipalURL = "http://town.arlington.ma.us";
  $feedbackEmail = "arlington-internal@goinvo.com";
  $shortName = "Arlington";
  $longName = "Town of Arlington";
  $state = "Massachusetts";
  $stateAbbreviation = "MA";
  $gaKey = "UA-10273473-12";

  // An array of links to budget sections within the site 
  // TODO: NOT IMPLEMENTED YET
  $menuMain = array(
    (object)array("label" => "Expenses", "url" => "/expenses", "description" => "All uses of money for expenses"),
    (object)array("label" => "Revenues", "url" => "/revenues", "description" => "All uses of money for rev"),
    (object)array("label" => "Funds & Reserves", "url" => "/funds", "description" => "All uses of money in funds")
  );

  // An array of links to other budget pages.
  $menuExternal = (object)array(
    "title" => "Other Budgets",
    "links" => array(
      (object)array("label" => "Example 1", "url" => "http://www.example.com"),
      (object)array("label" => "Example 2", "url" => "http://www.example.org"),
      (object)array("label" => "Example 3", "url" => "http://www.bleh.org")
    )
  );

  // Home screen vars
  $homeShow = true;
  $homeTitle = "See the Arlington budget";
  $homeText1 = "Big p";
  $homeText2 = "small p";
  $valuePrompt = "Your tax cont.";

  // Label for user contribution in statistics card
  $valueLabel = "Your prop tax last year";
  
  # Variables for update.php
  $user = 'admin';
  $pass = 'pass';
?>
