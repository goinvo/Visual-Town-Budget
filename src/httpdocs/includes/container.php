  <div class="container" id="avb-body">
    <div class="row-fluid" id="avb-wrap" style="width:auto;">
      <?php
          // add related pages content if needed
          if(array_key_exists($_GET["page"], $relatedPages)) {
             require_once 'includes/'.$relatedPages[$_GET["page"]];
          }
     ?>
   </div>
 </div>