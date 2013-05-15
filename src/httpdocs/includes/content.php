
<div class="container" id="avb-body">

  <div class="row-fluid" id="avb-wrap" style="width:auto;">

    <div id="navigation-container" class="span6">
      <div class="title-head" style="height:70px;">
        <span class="text" > </span>
        <button id="zoombutton" class="btn pull-right">
          <i class="icon-zoom-out"></i> Zoom out
        </button>
      </div>
      <div id="navigation" style="height:88%;width:100%"> </div>
    </div>

    <div id="information-container" class="span6">
      <div style="height:70px; margin-right:3%;">
        <div id="layer-switch" class='pull-right'>
          <div style="display:inline-block; margin-right:5px;"> Layers </div>
          <div class="btn-group">
            <button action="disable" id="zoombutton" class="btn disabled">
              <i class="icon-eye-close"></i> Hide
            </button>
            <button action="enable" id="zoombutton" class="btn">
              <i class="icon-eye-open"></i> Show
            </button>
          </div>

        </div>
      </div>

      <div class="row-fluid" id="info-wrap" >
        <div id="cards-wrap" style="width:100%; position:relative;">
          <div id="legend-wrap" >
            <div id="legend" class="separator separatorb" >
              <table>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
          <div id="cards" > </div>
        </div>

      </div>

      <div id="chart-wrap" class="row-fluid" > 
        <div id='chart' class="chart" style="height:100%; margin-top:10px;"> </div>
      </div>

    </div>
  </div>


  <div id="popover-html" style="display:none;">
    <div id="popover-value"> </div>
  </div>


  <script type="text/html" id="card-template">
  <div class="card {{class}} ">
  <div class="card-img"> </div>
  <div class="card-text">
  <div class="cardvalue"></div>
  <div class="carddesc"></div>
  </div>
  </div>
  </script>