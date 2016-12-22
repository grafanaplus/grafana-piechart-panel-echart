'use strict';

System.register(['lodash', 'jquery', 'jquery.flot', 'jquery.flot.pie'], function (_export, _context) {
  "use strict";

  var _, $, eChart, theData;

  function link(scope, elem, attrs, ctrl) {
    var data, panel;
    elem = elem.find('.piechart-panel-echart');
    var $tooltip = $('<div id="tooltip-echart">');

    ctrl.events.on('render', function () {
      render();
      ctrl.renderingCompleted();
    });
    ctrl.events.on('data-received', function(data){
      theData = data;
      if(eChart){
        eChart.setOption(getSeries(theData));
      }
    });

    function setElementHeight() {
      try {
        var height = ctrl.height || panel.height || ctrl.row.height;
        if (_.isString(height)) {
          height = parseInt(height.replace('px', ''), 10);
        }

        height -= 5; // padding
        height -= panel.title ? 24 : 9; // subtract panel title bar

        elem.css('height', height + 'px');

        return true;
      } catch (e) {
        // IE throws errors sometimes
        return false;
      }
    }

    function formatter(label, slice) {
      return "<div style='font-size:" + ctrl.panel.fontSize + ";text-align:center;padding:2px;color:" + slice.color + ";'>" + label + "<br/>" + Math.round(slice.percent) + "%</div>";
    }

    function addPieChart() {
      var width = elem.width();
      var height = elem.height();

      var size = Math.min(width, height);

      var plotCanvas = $('<div></div>');
      var plotCss = {
        top: '10px',
        margin: 'auto',
        position: 'relative',
        height: size - 20 + 'px'
      };

      plotCanvas.css(plotCss);

      var $panelContainer = elem.parents('.panel-container');
      var backgroundColor = $panelContainer.css('background-color');

      var options = {
        legend: {
          show: false
        },
        series: {
          pie: {
            show: true,
            stroke: {
              color: backgroundColor,
              width: parseFloat(ctrl.panel.strokeWidth).toFixed(1)
            },
            label: {
              show: ctrl.panel.legend.show && ctrl.panel.legendType === 'On graph',
              formatter: formatter
            },
            highlight: {
              opacity: 0.0
            },
            combine: {
              threshold: ctrl.panel.combine.threshold,
              label: ctrl.panel.combine.label
            }
          }
        },
        grid: {
          hoverable: true,
          clickable: false
        }
      };

      if (panel.pieType === 'donut') {
        options.series.pie.innerRadius = 0.5;
      }

      elem.html(plotCanvas);

      $.plot(plotCanvas, ctrl.data, options);
      plotCanvas.bind("plothover", function (event, pos, item) {
        if (!item) {
          $tooltip.detach();
          return;
        }

        var body;
        var percent = parseFloat(item.series.percent).toFixed(2);
        var formatted = ctrl.formatValue(item.series.data[0][1]);

        body = '<div class="graph-tooltip-small"><div class="graph-tooltip-time">';
        body += '<div class="graph-tooltip-value">' + item.series.label + ': ' + formatted;
        body += " (" + percent + "%)" + '</div>';
        body += "</div></div>";

        $tooltip.html(body).place_tt(pos.pageX + 20, pos.pageY);
      });
    }

    /*function render() {
      if (!ctrl.data) {
        return;
      }

      data = ctrl.data;
      panel = ctrl.panel;

      if (setElementHeight()) {
        addPieChart();
      }
  }*/
  function loadOptions(){
    return {
          tooltip : {
              trigger: 'item',
              formatter: "{b} : {c} ({d}%)"
          },
          visualMap: {
              show: false,
              min: 80,
              max: 600,
              inRange: {
                  colorLightness: [0, 1]
              }
          },
          series : [
              {
                  type:'pie',
                  data:[
                      {value:100, name:'Oooops!'}
                  ],
              }
          ]
      };
   }
   function getElementHeight() {
      try {
        var height = ctrl.height || panel.height || ctrl.row.height;
        if (_.isString(height)) {
          height = parseInt(height.replace('px', ''), 10);
        }

        height -= 5; // padding
        height -= panel.title ? 24 : 9; // subtract panel title bar

        return height;
      } catch (e) {
        console.error(e);
        // IE throws errors sometimes
        return 100;
      }
    }
    function getSeries(theData){
      var series = theData["0"].datapoints
        .map(function(arr, i){ return {name: "Series-" + i, value: arr[0].toString().substring(0, 5)}});
      
      return {
        series : [
          {
            data:
              /*Object.keys(theData).map(function(key){ 
                return { 
                  name: theData[key].target, 
                  value: theData[key].datapoints[0][0] 
              }})*/
              // Test
              series
          }
        ]
      };
    }
   function render(){
      if (!ctrl.data) {
        return;
      }

      data = ctrl.data;
      panel = ctrl.panel;
      
      eChart = echarts.init(elem[0], null, {height:getElementHeight()});
      eChart.setOption(loadOptions());
      if(theData)
        eChart.setOption(getSeries(theData));     
   }
  }

  _export('default', link);

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_jqueryFlot) {}, function (_jqueryFlotPie) {}],
    execute: function () {}
  };
});
//# sourceMappingURL=rendering.js.map
