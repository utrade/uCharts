/**
 * Initialize trading functions and calculations
 * @method initTrading
 * @return 
 */
uChart.prototype.initTrading = function() {
  var chart = this;
  if (typeof(chart.trading) == 'undefined') chart.trading = {};
  var hoverYval;

  /**
   * Calculate value on mouse position over the chart.
   * Fill obj.data.currentY with it.
   * @method mousemove
   * @param {Event} event
   * @return 
   */
  chart.data.mousemove = function(event) {
    /* Variables */
    var WIDTH = $("#" + chart.data.placeholder).width() * 1,
      HEIGHT = $("#" + chart.data.placeholder).height() * 1,
      XaxisIndex,
      YaxisIndex,
      boundY1,
      boundY2,
      xid,
      yid,
      chartX1 = chart.Xlimit1,
      chartX2 = chart.Xlimit2,
      chartY1 = chart.Ylimit1,
      chartY2 = chart.Ylimit2,
      r = chart.paper;

    var mousex = event.pageX - $("#" + chart.data.placeholder).offset().left,
      mousey = event.pageY - $("#" + chart.data.placeholder).offset().top;
 
    /*-- Detect Y Axis --*/
    for (var i = 0; i < chart.data.YAxis.length; i++) {
      var startY = chart.data.YAxis[i].y * HEIGHT * 0.01,
        endY = startY * 1 + (chart.data.YAxis[i].height * HEIGHT * 0.01);

      if (startY <= mousey && mousey <= endY) {
        yid = chart.data.YAxis[i].id;
      }
    }
    if (typeof(yid) != 'undefined' && chartX1 <= mousex && mousex <= chartX2 && chartY2 <= mousey && mousey <= chartY1) {
      YaxisIndex = chart.getAxisById("y", yid);
      boundY1 = chart.data.YAxis[YaxisIndex].startY,
      boundY2 = chart.data.YAxis[YaxisIndex].endY;

      var unitvalueY = chart.data.YAxis[YaxisIndex].unitValue;
      valueY = minY[YaxisIndex] + (((boundY2 - mousey) * unitvalueY).toFixed(2) * 1);
      chart.data.currentY = chart.data.YAxis[YaxisIndex].label + " " + (valueY).toFixed(2);
      chart.data.valueY = valueY;

      if (typeof(chart.data.hoverYval) == 'undefined') chart.data.hoverYval = {};
      if (typeof(chart.data.hoverYval.x) == 'undefined') chart.data.hoverYval.x = "10";
      if (typeof(chart.data.hoverYval.y) == 'undefined') chart.data.hoverYval.y = "1";
      if (typeof(chart.data.hoverYval.tsize) == 'undefined') chart.data.hoverYval.tsize = "15";
      if (typeof(chart.data.hoverYval.tcolor) == 'undefined') chart.data.hoverYval.tcolor = "#000";

      if (typeof(chart.data.currentY) != 'undefined') {
        if (hoverYval) hoverYval.remove();
        hoverYval = r.text(chart.data.hoverYval.x * 1 * 0.01 * WIDTH, chart.data.hoverYval.y * 1 * 0.01 * HEIGHT, chart.data.currentY).attr({
          "fill": chart.data.hoverYval.tcolor,
          "font-size": chart.data.hoverYval.tsize,
          "text-anchor": "start"
        });
      }
    }
  }

  /**
   * Draw lines on the chart of orders placed.
   * Functions for drag and click can be added.
   * obj.trading.orderLineMove - dragging
   * obj.trading.orderLineDbclick - double click
   * @method drawOrderLines
   * @param {Object} orderList
   * @param {String} seriesID
   * @return 
   */
  chart.trading.drawOrderLines = function(orderList, seriesID) {
    var r = chart.paper;

    var xIndex = chart.getAxisById('x', chart.data.Series[chart.getSeriesById(seriesID) * 1].xaxis) * 1,
      yIndex = chart.getAxisById('y', chart.data.Series[chart.getSeriesById(seriesID) * 1].yaxis) * 1,
      j = 0;

    if (typeof(chart.trading.orderLineSet) != 'undefined') chart.trading.orderLineSet.remove();
    chart.trading.orderLine = [];
    chart.trading.orderLineSet = r.set();

    $.map(orderList, function(i, v) {
      var yCoord = chart.data.YAxis[yIndex].endY - ((v * 1 - minY[yIndex]) / chart.data.YAxis[yIndex].unitValue),
        xCoord1 = chart.data.XAxis[xIndex].startX,
        xCoord2 = chart.data.XAxis[xIndex].endX,
        orderStatus = (typeof(chart.trading.lineStatusColors) != 'undefined') ? chart.trading.lineStatusColors[i.status.toString()] : 'red';
      /* Draw line */
      if (minY[yIndex] < v && v < maxY[yIndex]) {
        chart.trading.orderLine[j] = r.rect(xCoord1, yCoord, xCoord2 - xCoord1, 1).attr({
          "cursor": "ns-resize",
          "stroke": orderStatus,
          "stroke-width": 1
        });
        chart.trading.orderLine[j].yIndex = yIndex;
        chart.trading.orderLine[j].values = {};
        chart.trading.orderLine[j].values = i;
        chart.trading.orderLine[j].values.price = v;

        /* Hover box  Title */
        var titleVal = "",
          flagFirst = true;
        for (var a in i) {
            if (typeof(i[a]) == 'object' && i[a][0] == 1) {
                if (flagFirst == false) titleVal += "\n";
                titleVal += (a[0].toUpperCase()+a.substring(1)).replace('_',' ') + " : " + i[a][1].toString();
                flagFirst = false;
            }
        }
        chart.trading.orderLine[j].attr('title', titleVal);

        chart.trading.orderLine[j].mousedown(function(e) {
          if (e.button == 0) {
            this.values.prevprice = this.values.price;
            chart.trading.dragLine = this;
          }
        });

        chart.trading.orderLine[j].mouseup(function() {
          if (typeof(chart.trading.dragLine) != 'undefined') delete chart.trading.dragLine;
          /* Storing Price */
          this.values.price = chart.data.valueY.toFixed(2);
          /* Mouse up API function */
          if (typeof(chart.trading.orderLineMove) != 'undefined') this.lineMove = chart.trading.orderLineMove;
          this.lineMove();

        })

        chart.trading.orderLine[j].dblclick(function() {
          /* Double click API function */
          if (typeof(chart.trading.orderLineDbclick) != 'undefined') this.Dbclick = chart.trading.orderLineDbclick;
          this.Dbclick();
        });

        chart.trading.orderLineSet.push(chart.trading.orderLine[j]);
        j++;
      }
    });
  }

  /**
   * Draw post trade symbols on the chart.
   * Display relevant related values in a tooltip on hover
   * @method drawPostTrade
   * @param {Object} postTradeObject
   * @param {String} seriesID
   * @return 
   */
  chart.trading.drawPostTrade = function(postTradeObject, seriesID) {
    var r = chart.paper;

    var xIndex = chart.getAxisById('x', chart.data.Series[chart.getSeriesById(seriesID) * 1].xaxis) * 1,
      yIndex = chart.getAxisById('y', chart.data.Series[chart.getSeriesById(seriesID) * 1].yaxis) * 1,
      j = 0;
    if (typeof(chart.trading.postTradeSet) != 'undefined') chart.trading.postTradeSet.remove();
    chart.trading.postTradeSet = r.set();
    chart.trading.postTrade = [];

    $.map(postTradeObject, function(i, v) {
            var yCoord = chart.data.YAxis[yIndex].endY - ((v * 1 - minY[yIndex]) / chart.data.YAxis[yIndex].unitValue),
                xCoord = $('#bigplaceholder').width() - 30,  // at the edge of the chart
        mmColor = (i.MTM > 0) ? "lime" : "red",
        tDirection = (i.MTM > 0) ? -1 : 1,
        tSize = (typeof(i.tSize) == 'undefined') ? 15 : i.tSize;

      //Draw Triangle
      if (minY[yIndex] < v && v < maxY[yIndex]) {
          // if open_price lies inside the range of chart
          chart.trading.postTrade[j] = r.path("M " + (xCoord - (tSize / 2)) + "," + yCoord + "L " + (xCoord + (tSize / 2)) + "," + yCoord + "L " + xCoord + "," + (yCoord - (tSize * tDirection)) + "L " + (xCoord - (tSize / 2)) + "," + yCoord).attr({
                  "stroke": "no-stroke",
                  "fill": mmColor,
                  "cursor": "context-menu"
              });

          var titleVal = "",
              flagFirst = true;
          for (var a in i) {
              if (i[a][0] == 1) {
                  if (flagFirst == false) titleVal += "\n";
                  titleVal += (a[0].toUpperCase()+a.substring(1)).replace('_',' ') + " : " + i[a][1].toString();
                  flagFirst = false;
              }
          }
          chart.trading.postTrade[j].attr('title', titleVal);
          chart.trading.postTrade[j].values = i;
          chart.trading.postTrade[j].price = v;
          chart.trading.postTrade[j].dblclick(function() {
                  if (typeof(chart.trading.postTradeDbclick) != 'undefined') this.ptDbclick = chart.trading.postTradeDbclick;
                  this.ptDbclick();
              });
          
          chart.trading.postTrade[j].mousedown(function(e) {
                  e.preventDefault();
                  if (e.button == 2) {
                      if (typeof(chart.trading.postTradeRclick) != 'undefined') this.ptRclick = chart.trading.postTradeRclick;
                      this.ptRclick();
                  }
              });
          chart.trading.postTradeSet.push(chart.trading.postTrade[j]);
      }
      j++;
        });
  }

}

/**
 * Delete the initTrading and redraw
 * @method destTrading
 * @return 
 */
uChart.prototype.destTrading = function() {

  if (this.initTrading) delete this.initTrading;
  this.data.Trading = false;
  this.draw();
}
