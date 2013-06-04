 var avb = avb || {};

 avb.table = function(){

   var indent = 25;
   var stats = [];
   var growthScale = d3.scale.linear().clamp(true).domain([-10,10]).range(["rgb(29,118,162)",'rgb(167, 103, 108)']);
   var amountScale = d3.scale.linear().clamp(true).range(["#aaa", "#333"]);
   var impactScale = d3.scale.linear().clamp(true).domain([0,100]).range(["#aaa", "#333"]);

   var initialize = function(data){
    var table = $('#table-container'),
        header = $('#table-header').data('level',0);
    stats = tables[section];

    $.each(stats, function(){
      var newcell = $('<div class="' + this.cellClass + ' head"> </div>').appendTo(header);
      newcell.text(this.title);
    })

    amountScale.domain([0,data.values[yearIndex].val*0.5]);

    renderNode(data, 0, table).trigger('click');

  },

  alignRows = function(){
    // could do this using a stack
    var maxLevel = 0;
    $('.tablerow').each(function(){
      if($(this).data('level') > maxLevel) maxLevel = $(this).data('level');
    })
    $('.tablerow').each(function(){
      $(this).find('.name').animate({'margin-right' : (maxLevel - $(this).data('level'))*indent}, 250);
    });
  },

  rowClick = function (){
    var row = $(this);
    var node = row.data();
    if(row.hasClass('atomic')) return;

    if(row.hasClass('expanded')) {
      //collapse
      var child = row.data('childDiv');
      child.slideUp(250, function() {
       $(this).remove();
       alignRows();
     })
      row.find('.expand-icon').animate({'-webkit-transform' : 'rotate(90deg)'})
      row.removeClass('expanded');
    } else {
      // expand

      // sort by amount
      node.sub.sort(function(a,b) {
        return a.values[yearIndex].val < b.values[0].val;
      })

      // container
      var childDiv = $('<div class="group"></div>').insertAfter(row);

      // append children
      for(var i=0; i<node.sub.length; i++){
        renderNode(node.sub[i], row.data('level') + 1, childDiv);
        row.data('childDiv', childDiv);
      }

      row.addClass('expanded');

      // animate
      alignRows();
      childDiv.slideDown(250);
    }
  },



  renderNode = function (node, level, container){
    var template = $('#row-template');
    var rendered = container.append(Mustache.render(template.html(), node)).children().last();

    rendered.addClass((node.sub === undefined || node.sub.length === 0) ? 'atomic' : '');
    rendered.data(node);
    rendered.data('level', level);

    rendered.css({'padding-left' : level*indent});

    $.each(stats, function(){
      var newcell = $('<div class="' + this.cellClass + '"> </div>').appendTo(rendered);
      if(this.cellFunction) {
        this.cellFunction(node, newcell.get(0));
      } else {
        newcell.text(this.value(node));
      }
    })

    rendered.click(rowClick);

    return rendered;
  },

  renderSparkline = function(node, cell){

    var width = $(cell).width(),
    height = $(cell).parent().height();

    var sparkline = d3.select(cell).append('svg')
    .attr('width', width).attr('height', height);

    var xscale = d3.scale.linear().range([0, width])
    .domain([firstYear, lastYear]);
    var yscale = d3.scale.linear().range([height-2, 2])
    .domain([0,d3.max(node.values, function(d) {return d.val})]);

    var line = d3.svg.line().interpolate("monotone")
    .x(function(d) { return xscale(d.year); })
    .y(function(d) { return yscale(d.val); });

    sparkline.append('g').append("svg:path").classed("line", true)
    .attr("d", line(node.values)).style("stroke", 'black');

    sparkline.append('g').append("svg:circle").attr("r", 2)
    .attr("cx", xscale(node.values[yearIndex].year))
    .attr("cy", yscale(node.values[yearIndex].val));

  },

  renderGrowth = function(data, cell){
     var previous = (data.values[yearIndex-1]) ? data.values[yearIndex-1].val : 0;
     var perc = Math.round(100 * 100 * (data.values[yearIndex].val - previous) / data.values[yearIndex].val)/100;
     $(cell).css({"color" : growthScale(perc)});
     $(cell).text(formatPercentage(perc));

  }

  renderAmount = function(data, cell){
    var amount = (data.values[yearIndex].val);
    $(cell).css({"color" : amountScale(amount)});
    $(cell).text(formatCurrencyExact(amount));
  },

  renderImpact = function(data, cell){
    var impact = Math.max(0.01,(Math.round(data.values[yearIndex].val*100*100/root.values[yearIndex].val)/100));
    $(cell).css({"color" : impactScale(impact)});
    $(cell).text(impact + ' %');
  },

  open = function() {

  };

  return{
    initialize : initialize,
    renderSparkline : renderSparkline,
    renderGrowth : renderGrowth,
    renderAmount : renderAmount,
    renderImpact : renderImpact,
    open : open
  }
}();
