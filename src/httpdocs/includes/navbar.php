

<div class="purple-border" id="avb-menubar" >
  <div class="container">

    <div class="homebutton" style="width:200px" onclick='window.location = "/"'> 
      <img src="/img/logo.png" alt="avb-logo" style="position:relative" />
    </div>

    <div style="line-height:25px;"> 

     <div onclick='window.location = "/"' class="entry homebutton"> Town Budget, Visualized </div>

     <div class="entry" style="margin-left: 40px">
        <span class="menubutton section margin"><a href="/revenues">Revenues</a></span>
        <span class="menubutton section margin"><a href="/expenses">Expenses</a></span>
        <span class="menubutton section margin"><a href="/funds">Funds</a></span>
    </div>

    <div class="entry" style="float:right;">
        <input id="searchbox" type="text" class="margin menubutton margin search" placeholder="Search">
    
        <div class="menubutton margin">
          <span> <i class="icon-th-large"></i> </span>
          <a href="javascript:switchMode('t'); "> Map </a>
        </div>
        <div class="menubutton">
          <span> <i class="icon-th-list"></i> </span>
          <a href="javascript:switchMode('l');"> List </a>
        </div>

        <ul class="nav menubutton " data-step="4" data-intro="Interested in seeing a different year? Use this menu." data-position="left">
          <li  id="yeardrop-container" class="dropdown" style="display:none;">
            <a id="yeardrop-label" class="dropdown-toggle" role="button" data-toggle="dropdown" href="#">Dropdown <b class="caret"></b></a>
            <ul id="yeardrop-list" class="dropdown-menu vhscrollable" role="menu">
            </ul>
          </li>
          <li>
          <select id="yeardrop-container-mobile" style="display:none; width:100px;">
          </select>
        </li>
        </ul>

      </div>

    </div>


  </div>
</div>
