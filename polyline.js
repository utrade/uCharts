/**
 * Initialize functions and variable related to 
 * drawing polylines on the chart.
 * @method initPolyline
 * @return 
 */
uChart.prototype.initPolyline = function() {
  var chart = this;
  chart.data.Zooming.inputValue = chart.data.Zooming.Activate;
  chart.data.Zooming.Activate = false
  /* Variables */
  chart.drawnSeries = {};
  chart.Dx = 0;
  chart.Dy = 0;
  var WIDTH = $("#" + chart.data.placeholder).width() * 1,
    HEIGHT = $("#" + chart.data.placeholder).height() * 1,
    xaxisid,
    yaxisid,
    XaxisIndex,
    YaxisIndex,
    boundX1,
    boundX2,
    boundY1,
    boundY2,
    chartX1 = chart.Xlimit1,
    chartX2 = chart.Xlimit2,
    chartY1 = chart.Ylimit1,
    chartY2 = chart.Ylimit2,
    boundcalc = false,
    sidCount = 0,
    seriesID;

  /* Mouse Up Event */
  $("#" + chart.data.placeholder).mouseup(function(event) {

    var mousex1 = event.pageX - $("#" + chart.data.placeholder).offset().left,
      mousey1 = event.pageY - $("#" + chart.data.placeholder).offset().top,
      boundFlag = false,
      xid, yid;

    /*-- Detect X Axis--*/
    for (var i = 0; i < chart.data.XAxis.length; i++) {
      var startX = chart.data.XAxis[i].x * WIDTH * 0.01,
        endX = startX * 1 + (chart.data.XAxis[i].width * WIDTH * 0.01);

      if (startX <= mousex1 && mousex1 <= endX) {
        xid = chart.data.XAxis[i].id;
      }
    }

    /*-- Detect Y Axis --*/
    for (var i = 0; i < chart.data.YAxis.length; i++) {
      var startY = chart.data.YAxis[i].y * HEIGHT * 0.01,
        endY = startY * 1 + (chart.data.YAxis[i].height * HEIGHT * 0.01);

      if (startY <= mousey1 && mousey1 <= endY) {
        yid = chart.data.YAxis[i].id;
      }
    }

    if (chartX1 <= mousex1 && mousex1 <= chartX2 && chartY2 <= mousey1 && mousey1 <= chartY1 && boundcalc == false) {
      XaxisIndex = chart.getAxisById("x", xid),
      YaxisIndex = chart.getAxisById("y", yid);

      boundX1 = chart.data.XAxis[XaxisIndex].x * 0.01 * WIDTH,
      boundX2 = boundX1 + chart.data.XAxis[XaxisIndex].width * 0.01 * WIDTH,
      boundY1 = chart.data.YAxis[YaxisIndex].y * 0.01 * HEIGHT,
      boundY2 = boundY1 + chart.data.YAxis[YaxisIndex].height * 0.01 * HEIGHT;

      /* Creating new series */
      chart.drawnSeries = {
        "id": chart.data.Series.length.toString(),
        "name": "drawing" + chart.data.Series.length,
        "data": [],
        "xaxis": xid,
        "yaxis": yid,
        "drawn": true
      };

      seriesID = chart.data.Series.length.toString();

      boundcalc = true;
      boundFlag = true;
    }

    if (chart.Dx != 0 || chart.Dy != 0) {

      boundFlag = false;

      if (boundX1 <= mousex1 && mousex1 <= boundX2 && boundY1 <= mousey1 && mousey1 <= boundY2) {
        boundFlag = true;
        if (mousex1 >= chart.Dx) chart.paper.path([
          ["M", chart.Dx, chart.Dy],
          ["L", mousex1, mousey1]
        ]).attr({
          stroke: "#00f"
        });
      }
    }

    if (mousex1 >= chart.Dx && boundFlag == true) {
      chart.Dx = mousex1;
      chart.Dy = mousey1;

      var unitvalueX = (maxX[XaxisIndex] - lowX[XaxisIndex]) / (boundX2 - boundX1),
        unitvalueY = (maxY[YaxisIndex] - lowY[YaxisIndex]) / (boundY2 - boundY1);

      var valueX = lowX[XaxisIndex] + (((chart.Dx - boundX1) * unitvalueX).toFixed(0) * 1),
        valueY = lowY[YaxisIndex] + (((boundY2 - chart.Dy) * unitvalueY).toFixed(2) * 1);

      var seriesIndex = chart.getSeriesById(seriesID)
      chart.drawnSeries.data.push([valueX, valueY]);
    }
  });

  /* Mouse Move Event */
  var movingLine;
  $("#" + chart.data.placeholder + " svg").mousemove(function(event) {
    var mousex2 = event.pageX - $("#" + chart.data.placeholder).offset().left,
      mousey2 = event.pageY - $("#" + chart.data.placeholder).offset().top;
    if (movingLine) movingLine.remove();
    if (chart.Dx != 0 || chart.Dy != 0) {
      if (boundX1 <= mousex2 && mousex2 <= boundX2 && boundY1 <= mousey2 && mousey2 <= boundY2) {
        if (mousex2 >= chart.Dx) movingLine = chart.paper.path([
          ['M', chart.Dx, chart.Dy],
          ['L', mousex2, mousey2]
        ]);
      }
    }
  });
}

/* End of initPolyline */

/**
 * Reset Initialize Polyline
 * @method drawPolyline
 * @return 
 */
uChart.prototype.drawPolyline = function() {
  this.Dx = 0, this.Dy = 0;
  this.data.Zooming.Activate = this.data.Zooming.inputValue;
}
