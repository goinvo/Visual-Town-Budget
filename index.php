<!DOCTYPE HTML>
<meta charset="utf-8">

<html>
<head>


  <?php
  $includePath = realpath($_SERVER['DOCUMENT_ROOT'] . '/includes');
  ?>

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/css/lib/bootstrap/bootstrap.css" rel="stylesheet">
  <script src="/js/lib/mustache/mustache.js"></script>
  <link rel="stylesheet" type="text/css" href="/css/look.css">
  <link rel="stylesheet" type="text/css" href="/css/home.css">
  <script src ="/js/lib/d3/d3.js"></script>
  <script src ="/js/lib/jquery/jquery-1.9.1.min.js"></script>
  <script src ="/js/lib/bootstrap.min.js"></script>
  <script src ="/js/navigation.js"></script>
  <script src ="/js/chart.js"></script>
  <script src ="/js/cards.js"></script>
  <script src ="/js/avb.js"></script>
  <script src ="/js/menubuttons.js"></script>
  <script src ="/js/legend.js"></script>


  <script>
  $(document).ready(function(){
    // var stateObj = {page : '/'};
    // history.pushState(stateObj, null, '');

    home_init(); 
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



  <body >

    <?php
    require_once $includePath.'/navbar.php';
    $sections  = array("revenues");

    if(isset($_GET["page"])) {
      if(!in_array($_GET["page"], $sections)) {
        require_once $includePath.'/homescreen.php';
      }
    } else {
      require_once $includePath.'/homescreen.php';
    }
    
    require_once $includePath.'/content.php';
    ?>


  </body>

  </html>