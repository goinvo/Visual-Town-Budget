
<div class="purple-border" id="avb-menubar" >
  <div class="container">

    <div class="homebutton" onclick='window.location = "/"'> 
      
      <div style="font-size:32px;line-height:28px; display:inline-block"> Arlington, MA  </div>
      <img src="/img/logo@High.png" alt="avb-logo" width=24 height=24 />
   </div>

    <div id="navbar-links" style="line-height:30px;"> 

     <div onclick='window.location = "/"' class="entry homebutton"> Town Budget, Visualized </div>

     <div class="entry navbar-margin">
        <span class="menubutton section margin" data-section="revenues"><a href="/revenues">Revenues</a></span>
        <span class="menubutton section margin" data-section="expenses"><a href="/expenses">Expenses</a></span>
        <span class="menubutton section margin" data-section="funds"><a id="navbar-funds" href="/funds">Funds &#38; Reserves</a></span>
    </div>

    <div class="entry" id="navbar-right" style="float:right;">
        <input id="searchbox" type="text" class="margin menubutton margin search" placeholder="Search">
    
        <div class="menubutton margin">
          <span> <i class="icon-th-large"></i> </span>
          <a id="navbar-map" href="javascript:avb.home.hide();switchMode('t'); "> Map view </a>
        </div>
        <div class="menubutton margin">
          <span> <i class="icon-th-list"></i> </span>
          <a id="navbar-table" href="javascript:avb.home.hide();switchMode('l'); "> Tabular view </a>
        </div>

        <ul id="yeardrop" class="nav menubutton">
          <li  id="yeardrop-container" class="dropdown" style="display:none;">
            <a id="yeardrop-label" class="dropdown-toggle" role="button" data-toggle="dropdown" href="#">Dropdown <b class="caret"></b></a>
            <ul id="yeardrop-list" class="dropdown-menu vhscrollable" role="menu">
            </ul>
          </li>
          <li>
          <select id="yeardrop-container-mobile" style="display:none; width:100px; height:28px">
          </select>
        </li>
        </ul>

      </div>
    </div>


  </div>
</div>
