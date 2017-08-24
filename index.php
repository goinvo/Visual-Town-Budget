<?php
  global $selected_budget;

  $d = dirname(__FILE__) . '/';

  # Variables used through the site
  // $siteName = "Portland Maine Visual budget";
  // $siteURL = "http://www.portlandmaine.gov/201/Budget-Financial-Documents";
  // $municipalURL = "http://www.portlandmaine.gov/201/Budget-Financial-Documents";
  // $feedbackEmail = "theportlandbudget@gmail.com";
  // $shortName = "Portland";
  // $longName = "Portland";
  // $state = "Maine";
  // $stateAbbreviation = "ME";
  // $gaKey = "";


  # App Path
  $app_dir = plugins_url('visgov_wp') .  '/';

?>
<script>
  var app_path = '<?php echo $app_dir; ?>';
  var budget_settings = <?php echo json_encode($selected_budget -> meta); ?>;
</script>



<?php
  require_once $d . 'includes/home.php';
  require_once $d . 'includes/container.php';
  require_once $d . 'includes/templates.php';
  require_once $d . "includes/datafiles.php";
?>
