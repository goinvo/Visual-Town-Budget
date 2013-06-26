/*
File: table.js

Description:
    Table compoent for visual budget application

Authors:
    Ivan DiLernia <ivan@goinvo.com>
    Roger Zhu <roger@goinvo.com>

License:
    Copyright 2013, Involution Studios <http://goinvo.com>

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/


 var avb = avb || {};

 avb.table = function(){

    var indent = 25;
    var stats = [];
    var growthScale = d3.scale.linear().clamp(true).domain([-10,10]).range(["rgb(29,118,162)",'rgb(167, 103, 108)']);
    var amountScale = d3.scale.linear().clamp(true).range(["#aaa", "#333"]);
    var impactScale = d3.scale.linear().clamp(true).domain([0,100]).range(["#aaa", "#333"]);

  var initialize = function(data){

    var table = $('#table-container');
    // clean old rows
    $('.tablerow').remove();

    if (data instanceof Array) {
      stats = tables.search;
      if(data.length === 0) {
        textRow('No results found.', table);
        return;
      }
      addHeader( table);
      $.each(data, function(){
        renderNode(this, 0, table);
      });
    } else {
      stats = tables[section];
      addHeader(table);
      amountScale.domain([0,data.values[yearIndex].val*0.5]);
      renderNode(data, 0, table).trigger('click');
    }
  },

  addHeader = function(table){
    var headerHtml = '<div class="tablerow" id="table-header" > <div class="bullet"> </div>'; 
    var header = $(headerHtml).appendTo(table).data('level',0);
    $.each(stats, function(){
      var newcell = $('<div class="' + this.cellClass + ' head"> </div>').appendTo(header);
      newcell.text(this.title);
    })
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

  textRow = function(msg, table){
    var template = $('#row-template');
    var rendered = table.append(Mustache.render(template.html())).children().last();
    rendered.css({'text-align' : 'center'}).text(msg);
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
      // node.sub.sort(function(a,b) {
      //   return a.values[yearIndex].val < b.values[0].val;
      // })


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

    // append popover
    if(node.descr.length !== 0){
      rendered.find('.long').popover(
        {trigger : 'manual', 
            placement: function (context, source) {
                var position = $(source).position();
                if (position.top < 150){
                    return "bottom";
                } else {
                    return "top";
                }
            },
            content : node.descr
        });
    }

    rendered.mouseenter(function(){
      rendered.find('.long').popover('show');
    });

    rendered.mouseleave(function(){
      rendered.find('.long').popover('hide');
    });


    rendered.click(rowClick);


    return rendered;
  },

  renderSparkline = function(node, cell){

    var width = $(cell).width(),
    height = $(cell).parent().height();

    d3.select(cell).select('svg').remove();

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
     // special delta cases
    if(data.values[yearIndex].val === 0){
      if(previous === 0) {
        perc = 0;
      } else {
        perc = 100;
      }
    } else {
      perc = Math.round(100 * 100 * (data.values[yearIndex].val - previous) / data.values[yearIndex].val)/100;
    }

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

  update = function(data){
    $('.tablerow').each(function(){
      var node = $(this);

      if(node.is('#table-header')) return;

      // assumption. cell order and stats array do not change
      for(var i=0; i<stats.length; i++) {
        var cell = $($(node).find('.value').get(i));
        if(stats[i].cellFunction) {
          stats[i].cellFunction(node.data(), cell.get(0));
        } else {
          cell.text(stats[i].value(node));
        }
      };
    })
  };

  return{
    initialize : initialize,
    renderSparkline : renderSparkline,
    renderGrowth : renderGrowth,
    renderAmount : renderAmount,
    renderImpact : renderImpact,
    open : open,
    update : update
  }
}();
