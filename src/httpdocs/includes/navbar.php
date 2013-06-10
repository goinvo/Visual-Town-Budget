

<div class="purple-border" id="avb-menubar" >
  <div class="container">
    <div class="row-fluid" style="height: 50px;"> 
      <div id="home-button" class="span2" style="position:relative;">
        <div id="avb-logo" onclick='window.location = "/"'>
          <div >
           <img src="/img/logo.png" alt="avb-logo" />
         </div>
         <div > Town Budget, Visualized</div>
       </div>
     </div>

     <div class="span5 entry">
      <div class="center-wrap centered">
        <span class="menubutton margin"><a href="/revenues">Revenues</a></span>
        <span class="menubutton margin"><a href="/expenses">Expenses</a></span>
        <span class="menubutton margin"><a href="/funds">Funds</a></span>
      </div>

    </div>

    <div class="span3 entry">
      <div class="center-wrap centered">
        <div class="menubutton margin">
          <span> <i class="icon-th-large"></i> </span>
          <a href="javascript:switchMode('t'); "> Map </a>
        </div>
        <div class="menubutton">
          <span> <i class="icon-th-list"></i> </span>
          <a href="javascript:switchMode('l');"> List </a>
        </div>
      </div>
    </div>

    <div class="span2 entry" >
      <div class="center-wrap" style="position:absolute; bottom:0; right:0;">

        <ul class="nav menubutton ">
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
</div>
