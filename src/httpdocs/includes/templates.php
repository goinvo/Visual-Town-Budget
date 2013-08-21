<script type="text/html" id="treemap-template">

<div id="information-container" class="span6" style="position:relative; padding-left:5px;">

  <div id="information-cards" >

  <!-- entry title -->
    <div class="title-head" style="height:70px;">
      <div style="display:inline-block;" class="text" > </div>
    </div>

    <div id="info-wrap" >
      <div id="slider-wrap">

        <!-- layer chart legend -->
        <div id="legend-wrap">
          <div class="arrow" style="right:20px;"> 
            <i class="icon-chevron-left"></i>
          </div>
          <div id="legend-container">
            <div id="legend" class="separator">
              <table><tbody></tbody></table>
            </div>
          </div>
        </div>

        <!-- info cards -->
        <div id="cards" >
          <div class="arrow"> 
            <i class="icon-chevron-right"></i>
          </div>
        </div>

      </div>
    </div>

  </div>

  <!-- chart -->
  <div id="chart-wrap" class="row-fluid" > 
    <div id='chart' class="chart"> </div>
  </div>
</div>

<!-- treemap -->
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

<!-- card template -->
<script type="text/html" id="card-template">
  <div class="card {{class}} ">
    <div class="card-img"> </div>
    <div class="card-text">
      <div class="card-value"></div>
      <div class="card-desc"></div>
    </div>
  </div>
</script>

<!-- table template -->
<script type="text/html" id="table-template">
  <div id="table-container" > 
    <div class="tablerow" id="table-header" > <div class="bullet"> </div>
  </div>
</script>

<!-- table header template -->
<script type="text/html" id="table-header-template">
  <div class="tablerow" id="table-header" data-level=0> 
    <div class="bullet"> </div> 
    {{#.}}
      <div class="{{cellClass}} head"> {{title}} </div>
    {{/.}}
  </div>
</script>

<!-- table row template -->
<script type="text/html" id="row-template">
  <div class="tablerow">
    <div class="bullet"> <img class="expand-icon" src="/img/listBullet.png" /> </div>
  </div>
</script>

<!-- year dropdown template -->
<script type="text/html" id="dropdown-template">
  <li role="presentation">
    <a role="menuitem" tabindex="-1" href="#">{{.}}</a>
  </li>
</script>