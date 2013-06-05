    <div class="" id="avb-menubar" >
      <div class="container">
        <div class="row-fluid"> 
          <div id="home-button" class="span2" style="position:relative;">
            <div id="avb-logo">
              <div >
               <img src="/img/logo.png"  width="200" />
             </div>
             <div > Town Budget, Visualized</div>
           </div>
         </div>

         <div class="span1 centered">
          <ul class="nav menubutton ">
            <li  id="yeardrop-container" class="dropdown" style="display:none;">
              <a class="dropdown-toggle" id="yeardrop-label" role="button" data-toggle="dropdown" href="#">Dropdown <b class="caret"></b></a>
              <ul id="yeardrop-list" class="dropdown-menu vhscrollable" role="menu" aria-labelledby="drop4">
              </ul>
            </li>
            <select id="yeardrop-container-mobile" style="display:none; width:100px;">
            </select>
          </ul>
        </div>

        <div class="span3 centered">
            <span class="menubutton"><a href="revenues">Revenues</a></span>
        </div>

        <div class="span5 centered">
            <div class="menubutton margin">
              <span> <i class="icon-th-large"></i> </span>
              <a href="javascript:switchMode('t'); "> Map </a>
            </div>
            <div class="menubutton">
              <span> <i class="icon-th-list"></i> </span>
              <a href="javascript:switchMode('l');"> List </a>
            </div>
        </div>

        <div class="span1">
          <div class="menubutton pull-right">
            <a href="javascript:;" onclick="fby.push(['showForm', '4389']);return false;" >Feedback</a></li>
          </div>
        </div>

      </div>
    </div>
  </div>
