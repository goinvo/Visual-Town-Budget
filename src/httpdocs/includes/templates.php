<script type="text/html" id="treemap-template">

<div id="information-container" class="span6">

  <div id="information-cards" >

  <div class="title-head" style="height:70px;">
    <div style="display:inline-block;" class="text" > </div>
  </div>
  <div class="row-fluid" id="info-wrap" >
    <div id="cards-wrap" style="position:relative;">
      <div id="legend-wrap" >
        <div id="legend" class="separator" >
          <table>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
      <div id="cards" > </div>
    </div>
  </div>

  </div>

  <div id="chart-wrap" class="row-fluid" > 
    <div id='chart' class="chart"> </div>
  </div>
</div>

<div id="navigation-container" class="span6" >
  <div class="title-head" style="height:70px;">
    <button id="zoombutton" class="btn pull-right">
      <i class="icon-zoom-out"></i> Go back
    </button>
  </div>
  <div id="navigation" >  
  <div id="ie-popover">
    <div class="text"></div>
    <div class="arrow"> </div> 
  </div>
  </div>
  
</div>

  </script>


  <script type="text/html" id="card-template">
    <div class="card {{class}} ">
      <div class="card-img"> </div>
      <div class="card-text">
        <div class="card-value"></div>
        <div class="card-desc"></div>
      </div>
    </div>
  </script>

  
  <script type="text/html" id="table-template">
    <div id="table-container" > 
      <div class="tablerow" id="table-header" > <div class="bullet"> </div>
    </div>
  </script>


  <script type="text/html" id="row-template">
    <div class="tablerow">
      <div class="bullet"> <img class="expand-icon" src="/img/listBullet.png" /> </div>
    </div>
  </script>


