<!DOCTYPE HTML>
<html>
<head>

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta charset="utf-8">
  <title>Arlington Visual Budget</title>
  <meta name="description" content="An interactive tool to learn more about the town of Arlington, Massachusetts." />

 
  <?php
    require_once 'includes/imports.php';
  ?>

<script>
$(document).ready(initialize);
</script>

</head>

<body>

  <?php
    require_once 'includes/home.php';
    require_once 'includes/navbar.php';
    require_once 'includes/container.php';
    require_once "includes/footer.php";
    require_once 'includes/templates.php';
    require_once "includes/datafiles.php";
  ?>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-10273473-12', 'arlingtonvisualbudget.org');
  ga('send', 'pageview');
</script>

</body>

</html>
