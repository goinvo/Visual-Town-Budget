<!DOCTYPE HTML>
<meta charset="utf-8">

<html>
<head>


  <?php
  //$includePath = ( '/includes');
  ?>

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="css/lib/bootstrap/bootstrap.css" rel="stylesheet">
    <link href="css/lib/checkbox/checkbox.css" rel="stylesheet">
  <script src="js/lib/mustache/mustache.js"></script>
  <link rel="stylesheet" type="text/css" href="css/global.css">
  <link rel="stylesheet" media="print" type="text/css" href="css/print.css">
  <script src ="js/lib/d3/d3.js"></script>
  <script src ="js/lib/jquery/jquery-1.9.1.min.js"></script>
  <script src ="js/lib/bootstrap.min.js"></script>
  <script src ="js/lib/detectmobilebrowser.js"></script>
  <script src ="js/navigation.js"></script>
  <script src ="js/chart.js"></script>
  <script src ="js/cards.js"></script>
  <script src ="js/avb.js"></script>
  <script src ="js/navbar.js"></script>
  <script src ="js/lib/simplemodal/jquery.simplemodal.js"></script>


  <script>
  $(document).ready(function(){

    avb.navbar.initialize();

    // direct url load
    <?php
    $sections  = array("revenues");
    if(isset($_GET["page"])) {
      if(in_array($_GET["page"], $sections)) {
        echo 'avb_init("'.$_GET["page"].'")';
      } else {
        echo 'loadthumbails();';
      }
    } else {
      echo 'loadthumbails();';
    }
    ?>
  });

  </script>



  <body>



    <?php
    //require_once $includePath.'/navbar.php';
    require_once 'includes/navbar.php';
    $sections  = array("revenues");

    if(isset($_GET["page"])) {
      if(!in_array($_GET["page"], $sections)) {
        //require_once $includePath.'/homescreen.php';
        require_once 'includes/homescreen.php';
      }
    } else {
      //require_once $includePath.'/homescreen.php';
      require_once 'includes/homescreen.php';
    }
    
    //require_once $includePath.'/content.php';
    require_once 'includes/content.php';
    ?>


  </body>

  </html>