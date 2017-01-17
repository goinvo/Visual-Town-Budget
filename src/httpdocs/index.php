<!DOCTYPE HTML>
<html>
  <head>
    <?php
      require_once 'includes/localized_variables.php';
    ?>

    <script>
      var longName = "<?php echo $longName; ?>";
      var municipalURL = "<?php echo $municipalURL; ?>";
    </script>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">
    <title><?php echo $siteName; ?></title>
    <meta name="description" content="An interactive tool to learn more about the town of <?php echo $shortName; ?>, <?php echo $state; ?>." />


    <?php
      $dataSections = array('revenues', 'expenses', 'funds');
      require_once 'includes/imports.php';
    ?>

    <script>
      $(document).ready(initialize);
      var pageParams = <?php echo json_encode($_GET); ?>
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

      ga('create', "<?php echo $gaKey; ?>", "<?php echo $siteURL; ?>");
      ga('send', 'pageview');
    </script>
  </body>
</html>
