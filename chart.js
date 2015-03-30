 //if (!window.console) console = {log: function () {} };
(function(fn) {
  if (!fn.map)
  /**
   * Function to fix map incompatibility in IE.
   * Defining .map method.
   * @method map
   * @param {} f
   * @return r
   */
    fn.map = function(f) {
      var r = [];
      for (var i = 0; i < this.length; i++) r.push(f(this[i]));
      return r
    }
  if (!fn.filter)
  /**
   * Function to fix filter incompatibility in some browsers
   * @method filter
   * @param {} f
   * @return r
   */
    fn.filter = function(f) {
      var r = [];
      for (var i = 0; i < this.length; i++)
        if (f(this[i])) r.push(this[i]);
      return r
    }
})(Array.prototype);


/**
 * Main class which holds all the data and functions.
 * Provides global access to related methods and variables.
 * @class uChart
 * @param {Object} data
 * @return
 */
function uChart(data) {
  var obj = this;
  this.data = data;
  var defaultColors = ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
    currentColorIndex = 0;

  /**
   * Generates the next color stored in the defaultColors.
   * @return {String} MemberExpression
   */
  getNextColor = function() {
    currentColorIndex = currentColorIndex >= defaultColors.length - 1 ? 0 : currentColorIndex + 1;
    return defaultColors[currentColorIndex];
  }

  /**
   * Converts long numbers to Kilo, Million, Billion, Trillion.
   * Replaces the zeroes with  K, M, B, T
   * @method fromMBT
   * @param {Integer} num
   * @return {Integer} num
   */
  var fromMBT = function(num) {
    if (Math.abs(num) > 1000000000000) {
      num = num / 1000000000000;
      num = ((Math.round(100 * num)) / 100).toString() + "T";
    } else if (Math.abs(num) > 1000000000) {
      num = num / 1000000000;
      num = ((Math.round(100 * num)) / 100).toString() + "B";
    } else if (Math.abs(num) > 1000000) {
      num = num / 1000000;
      num = ((Math.round(100 * num)) / 100).toString() + "M";
    } else if (Math.abs(num) > 1000) {
      num = num / 1000;
      num = ((Math.round(100 * num)) / 100).toString() + "K";
    }
    return num;
  }

  /**
   * Function To Add Commas In Numerical Values Like Quantity ( 18734 --> 18,734)
   * @method Commas
   * @param {Integer} x
   * @return {String} y
   */
  var Commas = function(x) {
    if (x == null || isNaN(x) || x == 'undefined' || x == undefined) {
      return '-';
    }
    var y = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (x.toString().slice(-3) == '.00' && y.slice(-3) != '.00') {
      y += '.00';
    }
    return y;
  }

  /**
   * Size and Mapping Variables.
   * These variables are used to detect zoom position on the chart data.
   * They store the X and y limit coordinates of the chart.
   * CMAP stores the mapping of values and coordinates of all series.
   */
  this.zoomPosition = {};
  this.zoomPosition['start'] = null;
  this.zoomPosition['end'] = null;
  this.Xlimit1 = 0,
  this.Xlimit2 = 0,
  this.Ylimit1 = 0,
  this.Ylimit2 = 0,
  this.CMAP = {};

  var Sx1 = 0,
    Sy1 = 0,
    Sx2 = 0,
    Sy2 = 0,
    Dx1 = 0,
    Dy1 = 0,
    selection = 0,
    mouseStillDown = false,
    Cmap = {},
    SelectionHeight = 0,
    Zx = 0,
    Zy = 0,
    Zx1 = 0,
    Zy1 = 0,
    yLowest = 0,
    seriesIds = [];

  /**
   * Returns the series object whose id is passed.
   * @method seriesById
   * @param {String} id
   * @return {Object}
   */
  this.seriesById = function(id) {
    var i = 0;
    while (obj.data.Series[i]) {
      if (obj.data.Series[i].id == id) return obj.data.Series[i];
      i++;
    }
  }

  /**
   * Return the index of the series whose id is passed
   * @method getSeriesById
   * @param {String} id
   * @return {Integer}
   */
  this.getSeriesById = function(id) {
    var i = 0;
    while (obj.data.Series[i]) {
      if (obj.data.Series[i].id == id) return i * 1;
      i++;
    }
  }
/*
this.seriesById = function(id){
    var i=0;
    while(obj.data.Series[i]){
   if(obj.data.Series[i].id==id) return obj.data.Series[i];
    i++;
    }
   }
*/
 this.get_series_by_id = function(id){
 var i=0;
 while(obj.data.Series[i]){
 if(obj.data.Series[i].id==id) return i*1;
 i++;
}
}


  /**
   * Returns the Y Axis object whose id is passed
   * @method yAxisById
   * @param {String} id
   * @return {Integer}
   */
  this.yAxisById = function(id) {
    var i = 0;
    while (obj.data.YAxis[i]) {
      if (obj.data.YAxis[i].id == id) return obj.data.YAxis[i];
      i++;
    }
  }
  /**
   * Returns the X Axis object whose id is passed
   * @method xAxisById
   * @param {String} id
   * @return {Integer}
   */
  this.xAxisById = function(id) {
    var i = 0;
    while (obj.data.XAxis[i]) {
      if (obj.data.XAxis[i].id == id) return obj.data.XAxis[i];
      i++;
    }
  }
  /**
   * Returns the Axis index whose id is passed.
   * @method getAxisById
   * @param {String} type - 'x'/'y'
   * @param {String} id
   * @return
   */
  this.getAxisById = function(type, id) {
    var i = 0,
      Axis;
    Axis = (type == "x") ? obj.data.XAxis : obj.data.YAxis;
    while (Axis[i]) {
      if (Axis[i].id == id) return i * 1;
      i++;
    }
  }

  /**
   * Returns super set of x values and coords
   * @method xFullMap
   * @return {Object} temp
   */
  var xFullMap = function() {
    var t = 0,
      temp = [];
    temp[0] = [];
    temp[1] = [];
    for (i in obj.data.Series) {
      var t = 0;
      //Creating a super set of X values and coords
      while (Cmap[i]['x'][t]) {
        if ($.inArray(Cmap[i]['x'][t], temp[0]) === -1) {
          temp[0].push(Cmap[i]['x'][t]);
        }
        if ($.inArray(Cmap[i]['xval'][t], temp[1]) === -1) {
          temp[1].push(Cmap[i]['xval'][t]);
        }
        t++;
      }
    }
    temp[0] = temp[0].sort(function(a, b) {
      return a - b;
    });
    temp[1] = temp[1].sort(function(a, b) {
      return a - b;
    });
    return temp;
  }

  /*================================================================
   *===================   Main draw function =======================
   *===============================================================*/

  /**
   * The main function which draws all the charts.
   * Calling it redraws the entire canvas with values from the input object.
   * All values are fetched again and calculations are redone.
   * @method draw
   * @return
   */
  this.draw = function() {

    var wide = $("#" + obj.data.placeholder).width(),
      high = $("#" + obj.data.placeholder).height();

    /*------------------------------------------------------------------------
     *------------- Default values for input config data ---------------------
     *------------------------------------------------------------------------*/

    var emptyData = false;

    /* Animation */
    if (typeof(data.animation) == 'undefined') data.animation = {};
    if (typeof(data.animation.activate) == 'undefined') data.animation.activate = false;
    if (typeof(data.animation.duration) == 'undefined') data.animation.duration = 1000;
    /* Title */
    if (typeof(data.title) == 'undefined') data.title = {};
    if (typeof(data.title.name) == 'undefined') data.title.name = '';
    if (typeof(data.title.style) == 'undefined') data.title.style = {};
    if (typeof(data.title.style['font-size']) == 'undefined') data.title.style['font-size'] = '14px';
    if (typeof(data.title.style['font-family']) == 'undefined') data.title.style['font-family'] = 'Arial';
    if (typeof(data.title.style['font-weight']) == 'undefined') data.title.style['font-weight'] = 'bold';
    if (typeof(data.title.style['fill']) == 'undefined') data.title.style['fill'] = '#444';
    if (typeof(data.title.style['font-size']) == 'undefined') data.title.style['font-size'] = '15px';
    if (typeof(data.title.y) == 'undefined') data.title.y = '1';
    /* Legend */
    if (typeof(data.Legend) == 'undefined') data.Legend = {};
    if (typeof(data.Legend.x) == 'undefined') data.Legend.x = '50';
    if (typeof(data.Legend.y) == 'undefined') data.Legend.y = '90';
    if (typeof(data.Legend.txtsize) == 'undefined') data.Legend.txtsize = '14';
    /* Cursor */
    if (typeof(data.Cursor) == 'undefined') data.Cursor = {};
    if (typeof(data.Cursor.crosshair) == 'undefined') data.Cursor.crosshair = 'y';
    if (typeof(data.Cursor.crosscolor) == 'undefined') data.Cursor.crosscolor = '#aaa';
    if (typeof(data.Cursor.crossopacity) == 'undefined') data.Cursor.crossopacity = '1';
    if (typeof(data.Cursor.crossthick) == 'undefined') data.Cursor.crossthick = '1';
    if (typeof(data.Cursor.pradius) == 'undefined') data.Cursor.pradius = '0';
    if (typeof(data.Cursor.pthickness) == 'undefined') data.Cursor.pthickness = '1';
    if (typeof(data.Cursor.pcolor) == 'undefined') data.Cursor.pcolor = '#aaa';
    if (typeof(data.Cursor.popacity) == 'undefined') data.Cursor.popacity = '1';
    /* Value Tracker */
    if (typeof(data.ValTrack) == 'undefined') data.ValTrack = {};
    if (typeof(data.ValTrack.txtsize) == 'undefined') data.ValTrack.txtsize = '12';
    /* Zooming */
    if (typeof(data.Zooming) == 'undefined') data.Zooming = {};
    if (typeof(data.Zooming.Activate) == 'undefined') data.Zooming.Activate = false;
    if (typeof(data.Zooming.Axis) == 'undefined') data.Zooming.Axis = 'x';
    if (typeof(data.Zooming.id) == 'undefined') data.Zooming.id = '1';
    /* Select Box */
    if (typeof(data.SelectBox) == 'undefined') data.SelectBox = {};
    if (typeof(data.SelectBox.color) == 'undefined') data.SelectBox.color = '#dde';
    if (typeof(data.SelectBox.opacity) == 'undefined') data.SelectBox.opacity = '0.3';
    if (typeof(data.SelectBox.BorderColor) == 'undefined') data.SelectBox.BorderColor = '#bbb';
    if (typeof(data.SelectBox.Borderthick) == 'undefined') data.SelectBox.Borderthick = '1';
    if (typeof(data.SelectBox.BorderOpacity) == 'undefined') data.SelectBox.BorderOpacity = '0.6';

    if (typeof(data.SelectBox) == 'undefined') data.SelectBox = {};
    if (typeof(data.SelectBox.color) == 'undefined') data.SelectBox.color = '#dde';
    /* X Axis */
    if (typeof(data.XAxis) == 'undefined') data.XAxis = [];

    for (var x in data.XAxis) {
      if (typeof(data.XAxis[x]) == 'undefined') data.XAxis[x] = {};
      if (typeof(data.XAxis[x].id) == 'undefined') data.XAxis[x].id = '';
      if (typeof(data.XAxis[x].valtype) == 'undefined') data.XAxis[x].id = '';
      if (typeof(data.XAxis[x].dateFormat) == 'undefined') data.XAxis[x].dateFormat = 'h:MM TT'; 
      if (typeof(data.XAxis[x].x) == 'undefined') data.XAxis[x].x = '10';
      if (typeof(data.XAxis[x].y) == 'undefined') data.XAxis[x].y = '50';
      if (typeof(data.XAxis[x].width) == 'undefined') data.XAxis[x].width = '85';
      if (typeof(data.XAxis[x].axisColor) == 'undefined') data.XAxis[x].axisColor = '#4572A7';
      if (typeof(data.XAxis[x].thickness) == 'undefined') data.XAxis[x].thickness = '2';
      if (typeof(data.XAxis[x].axisOpacity) == 'undefined') data.XAxis[x].axisOpacity = '0.4';
      if (typeof(data.XAxis[x].label) == 'undefined') data.XAxis[x].label = '';
      if (typeof(data.XAxis[x].labelStyle) == 'undefined') data.XAxis[x].labelStyle = {};
      if (typeof(data.XAxis[x].labelStyle.fill) == 'undefined') data.XAxis[x].labelStyle.fill = '#444';
      if (typeof(data.XAxis[x].labelStyle['font-size']) == 'undefined') data.XAxis[x].labelStyle['font-size'] = '15';
      if (typeof(data.XAxis[x].labelStyle['font-weight']) == 'undefined') data.XAxis[x].labelStyle['font-weight'] = 'bold';
      if (typeof(data.XAxis[x].TickColor) == 'undefined') data.XAxis[x].TickColor = '#aaa';
      if (typeof(data.XAxis[x].TickLength) == 'undefined') data.XAxis[x].TickLength = '5';
      if (typeof(data.XAxis[x].TickThick) == 'undefined') data.XAxis[x].TickThick = '2';
      if (typeof(data.XAxis[x].TickNum) == 'undefined') data.XAxis[x].TickNum = '10';
      if (typeof(data.XAxis[x].TickOffset) == 'undefined') data.XAxis[x].TickOffset = '25';
      if (typeof(data.XAxis[x].TickTextStyle) == 'undefined') data.XAxis[x].TickTextStyle = {};
      if (typeof(data.XAxis[x].TickTextStyle.fill) == 'undefined') data.XAxis[x].TickTextStyle.fill = '#fff';
      if (typeof(data.XAxis[x].TickTextStyle['font-size']) == 'undefined') data.XAxis[x].TickTextStyle['font-size'] = '12';
      if (typeof(data.XAxis[x].TickTextStyle['font-weight']) == 'undefined') data.XAxis[x].TickTextStyle['font-weight'] = 'normal';
      if (typeof(data.XAxis[x].TicTexRot) == 'undefined') data.XAxis[x].TicTexRot = 'r0';
      if (typeof(data.XAxis[x].LabelOffset) == 'undefined') data.XAxis[x].LabelOffset = '-60';
      if (typeof(data.XAxis[x].LabelRot) == 'undefined') data.XAxis[x].LabelRot = 'r0';
      if (typeof(data.XAxis[x].type) == 'undefined') data.XAxis[x].type = 'area';
    }

    /* Y Axis */
    if (typeof(data.YAxis) == 'undefined') data.YAxis = [];

    for (var y in data.YAxis) {
      if (typeof(data.YAxis[y]) == 'undefined') data.YAxis[y] = {};
      if (typeof(data.YAxis[y].id) == 'undefined') data.YAxis[y].id = '';
      if (typeof(data.YAxis[y].type) == 'undefined') data.YAxis[y].type = '';
      if (typeof(data.YAxis[y].x) == 'undefined') data.YAxis[y].x = '10';
      if (typeof(data.YAxis[y].y) == 'undefined') data.YAxis[y].y = '5';
      if (typeof(data.YAxis[y].height) == 'undefined') data.YAxis[y].height = '45';
      if (typeof(data.YAxis[y].axisColor) == 'undefined') data.YAxis[y].axisColor = '#aaa';
      if (typeof(data.YAxis[y].thickness) == 'undefined') data.YAxis[y].thickness = '1';
      if (typeof(data.YAxis[y].axisOpacity) == 'undefined') data.YAxis[y].axisOpacity = '0.6';
      if (typeof(data.YAxis[y].label) == 'undefined') data.YAxis[y].label = '';
      if (typeof(data.YAxis[y].labelStyle) == 'undefined') data.YAxis[y].labelStyle = {};
      if (typeof(data.YAxis[y].labelStyle.fill) == 'undefined') data.YAxis[y].labelStyle.fill = '#000';
      if (typeof(data.YAxis[y].labelStyle['font-size']) == 'undefined') data.YAxis[y].labelStyle['font-weight'] = 'bold';
      if (typeof(data.YAxis[y].grid) == 'undefined') data.YAxis[y].grid = true;
      if (typeof(data.YAxis[y].gridColor) == 'undefined') data.YAxis[y].gridColor = '#aaa';
      if (typeof(data.YAxis[y].TickColor) == 'undefined') data.YAxis[y].TickColor = '#eee';
      if (typeof(data.YAxis[y].TickLength) == 'undefined') data.YAxis[y].TickLength = '5';
      if (typeof(data.YAxis[y].TickThick) == 'undefined') data.YAxis[y].TickThick = '1';
      if (typeof(data.YAxis[y].TickNum) == 'undefined') data.YAxis[y].TickNum = '5';
      if (typeof(data.YAxis[y].TickOffset) == 'undefined') data.YAxis[y].TickOffset = '10';
      if (typeof(data.YAxis[y].TickTextStyle) == 'undefined') data.YAxis[y].TickTextStyle = {};
      if (typeof(data.YAxis[y].TickTextStyle.fill) == 'undefined') data.YAxis[y].TickTextStyle.fill = '#000';
      if (typeof(data.YAxis[y].TickTextStyle['font-size']) == 'undefined') data.YAxis[y].TickTextStyle['font-size'] = '12';
      if (typeof(data.YAxis[y].TickTextStyle['font-weight']) == 'undefined') data.YAxis[y].TickTextStyle['font-weight'] = 'normal';
      if (typeof(data.YAxis[y].TicTexRot) == 'undefined') data.YAxis[y].TicTexRot = 'r0';
      if (typeof(data.YAxis[y].LabelOffset) == 'undefined') data.YAxis[y].LabelOffset = '50';
      if (typeof(data.YAxis[y].LabelRot) == 'undefined') data.YAxis[y].LabelRot = 'r-90';
    }

    /* Series */
    if (typeof(data.Series) == 'undefined') data.Series = [];

    for (var s in data.Series) {
      if (typeof(data.Series[s].id) == 'undefined') data.Series[s].id = '';
      if (typeof(data.Series[s].name) == 'undefined') data.Series[s].name = '';
      if (typeof(data.Series[s].type) == 'undefined') data.Series[s].type = 'line';
      if (typeof(data.Series[s].lineWidth) == 'undefined') data.Series[s].lineWidth = '2';
      if (typeof(data.Series[s].barWidth) == 'undefined') data.Series[s].barWidth = '2';
      if (typeof(data.Series[s].boxWidth) == 'undefined') data.Series[s].boxWidth = '2';
      if (typeof(data.Series[s].color) == 'undefined') data.Series[s].color = getNextColor();
      if (typeof(data.Series[s].fillcolor) == 'undefined') data.Series[s].fillcolor = data.Series[s].color;
      if (typeof(data.Series[s].dash) == 'undefined') data.Series[s].dash = '';
      if (typeof(data.Series[s].showInLegend) == 'undefined') data.Series[s].showInLegend = false;
      if (typeof(data.Series[s].datatype) == 'undefined') data.Series[s].datatype = '';
      if (typeof(data.Series[s].data) == 'undefined') data.Series[s].data = [];
      if (typeof(data.Series[s].xaxis) == 'undefined') data.Series[s].xaxis = '1';
      if (typeof(data.Series[s].yaxis) == 'undefined') data.Series[s].yaxis = '1';

      /* Test for empty data */
      if (data.Series[s].data != "") emptyData = true;
    }

    /*------------------------------------------------------------------------*/

    if (emptyData == false) {
      document.getElementById(data.placeholder).innerHTML = "No Data Available";
      return;
    }

    if (typeof(obj.data.Zooming.inputValue) != 'undefined') {
      obj.data.Zooming.Activate = obj.data.Zooming.inputValue;
    }
    var INPUTData = obj.data;
    refAxis = INPUTData.XAxis;
    refAxisIndex = 0;
    var refWidth = (wide * (refAxis[refAxisIndex].width / 100)).toFixed(2) * 1;
    var refLeft = (wide * (refAxis[refAxisIndex].x / 100)).toFixed(2) * 1;

    /*--------------------------------------------------------------
     *--- Set zooming markers according the data being drawn ------- 
     *--- Check and reduce the number of data points if too many ---
     *-------------------------------------------------------------*/
    if (INPUTData.Zooming.Activate) {
      var zoomStart = obj.zoomPosition.start,
        zoomEnd = obj.zoomPosition.start;

      if (zoomStart == null || isNaN(zoomStart)) {
         
         var REFdata = refAxis[refAxisIndex].refData;
         if (REFdata.length < 20){                              //Initially when data is less
            obj.zoomPosition.start = REFdata[0][0];
        
         }
         else 
         {
          obj.zoomPosition.start = REFdata[REFdata.length - 20][0];
         }
        //obj.zoomPosition.start = refAxis[refAxisIndex].refData[0][0];    //Change start zoom
      }

      if (zoomEnd == null || isNaN(zoomEnd)) {
        var REFdata = refAxis[refAxisIndex].refData;
        obj.zoomPosition.end = REFdata[REFdata.length - 1][0];
      }
    }
    var n = 0;
    var dates = [];
    while (obj.data.Series[n]) {
      var xs = obj.zoomPosition.start;
      var xe = obj.zoomPosition.end;
      
      if (xs && xe) {
        var refData1 = refData2 = obj.data.Series[n].data.map(function(i) {
          return i[0] * 1;
        }),
          startDateIndex = refData1.indexOf(xs),
          endDateIndex = refData2.indexOf(xe),
          ptFlag = false;
        if (startDateIndex == -1 && endDateIndex == -1) ptFlag = true;

        if (startDateIndex == -1) {
          refData1.push(xs);
        }
        refData1 = refData1.sort(function(a, b) {
          return a - b;
        });
        startDateIndex = refData1.indexOf(xs);

        if (endDateIndex == -1) {
          refData2.push(xe);
        }
        refData2 = refData2.sort(function(a, b) {
          return a - b;
        });
        endDateIndex = refData2.indexOf(xe) + 1;
        endDateIndex = refData2.indexOf(xe) ;
       if (obj.data.Series[n].data.slice(startDateIndex, endDateIndex).length > 1) {
        obj.data.Series[n].drawData = obj.data.Series[n].data.slice(startDateIndex, endDateIndex);
        }
        if (ptFlag == true && startDateIndex == 0 && endDateIndex == 2) {
          obj.data.Series[n].drawData = [];
        }

        if (obj.data.Series[n].drawData != "") {
          if (obj.data.Series[n].drawData[obj.data.Series[n].drawData.length - 1][0] < obj.zoomPosition.start) {
            obj.data.Series[n].drawData = [];
          }
        }
      } else {
        obj.data.Series[n].drawData = obj.data.Series[n].data;
      }
      var d = obj.data.Series[n].drawData;
      for (di in d)
        if (dates.indexOf(d[di][0]) == -1) dates.push(d[di][0]);
      n++;
    }
    

    /*-----------------------Aggregation Formula--------------------------------
     *---------Combines multiple points to one using different formulas---------
     *---------VWAP for Line/Area, Averaging for Bar, OHLC for candle/ohlc-------
     *--------------------------------------------------------------------------*/
    dates.sort(function(a, b) {
      return a - b;
    });
   
    if (obj.data.averaging != false) {
      var maxpointwidth = 1;
      for (s in obj.data.Series) {
      if (obj.data.Series[s].lineWidth)
          if (obj.data.Series[s].lineWidth > maxpointwidth) maxpointwidth = obj.data.Series[s].lineWidth;
        if (obj.data.Series[s].barWidth)
          if (obj.data.Series[s].barWidth > maxpointwidth) maxpointwidth = obj.data.Series[s].barWidth;
        if (obj.data.Series[s].boxWidth)
          if (obj.data.Series[s].boxWidth > maxpointwidth) maxpointwidth = obj.data.Series[s].boxWidth;
      }
      var aggregationDays = Math.ceil(dates.length * maxpointwidth / refWidth);
      if (aggregationDays > 1) {
        dates = dates.filter(function(d) {
          return (dates.indexOf(d) % aggregationDays == 0)           //aggregates the dates 
        });
        for (s in obj.data.Series) aggregateData(obj.data.Series[s], dates); //Passes aggregated dates to the aggregate data function 
      }

      for (s in obj.data.Series)
        if (s.compare)
          if (s.compare == 'percentage') {
            s.drawData = s.drawData.map(function(d) {
              return [d[0], ((d[1] - s.drawData[0][1]) / s.drawData[0][1]).toFixed(2) * 1]
            });
          }
   }
    

    /**
     *
     * @method aggregateData
     * @param {String} series
     * @param {Array} dates
     * @return
     */
    function aggregateData(s, dates) {
      var newdata = [];
      for (var i = 1; i < dates.length; i++) {
        var r = averagingFormula(s, dates[i - 1], dates[i]);
        if (r.length) newdata.push(r);
      }
      s.drawData = newdata;
    }
    /**
     * Description
     * @method averagingFormula
     * @param {} s
     * @param {} dateStart
     * @param {} dateEnd
     * @return newdata
     */
    function averagingFormula(s, dateStart, dateEnd) {
      var newdata = [];
      /**
       * Description
       * @method sigma
       * @param {} a
       * @return s
       */
      var sigma = function(a) {
        var i, s = 0;
        for (i in a) {
          s += a[i]
        };
        return s
      };
      var week = s.drawData.filter(function(d) {
        return ((d[0] >= dateStart) && (d[0] < dateEnd))
      });
      if (week.length) {
        newdata[0] = dateStart;
        var closeIndex = 1,
          volIndex = null;
        if (!(s.datatype)) {
          var avg = sigma(week.map(function(d) {
            return d[closeIndex] * (volIndex ? d[volIndex] : 1)
          }));
          avg = avg / week.length;
          newdata[1] = 1 * avg.toFixed(2);
        }
        if (s.datatype == 'TPV') {
          closeIndex = 1;
          volIndex = 2
        }
        if (s.datatype == 'TOHLCV') {
          closeIndex = 4;
          volIndex = 5; 
        }
        if (s.datatype == 'TV') {
          closeIndex = null;
          volIndex = 1;
        }

        if ((s.type == "line" || s.type == "area") && (s.datatype == 'TOHLCV' || s.datatype == "TPV" || s.datatype == "TP")) {
         if(s.datatype == 'TOHLCV')
         {
         volIndex = null ;  //Checks if volume is available or not 
         }
         var vwap = sigma(week.map(function(d) {
            return d[closeIndex] * (volIndex ? d[volIndex] : 1)
          }));
          vwap = vwap / (volIndex ? sigma(week.map(function(d) {
            return d[volIndex]
          })) : week.length);
          newdata[1] = 1 * vwap.toFixed(2);
        }
        if (s.type == "bar" || s.datatype == "TV") {
         newdata[volIndex] = (sigma(week.map(function(d) {
         
            return d[volIndex]

          })) / week.length).toFixed(2) * 1;
        }
        if (s.type == "candle" || s.type == "ohlc") {
          newdata[1] = week[0][1];
          newdata[2] = Math.max.apply(null, week.map(function(d) {
            return d[2]
          }));
          newdata[3] = Math.min.apply(null, week.map(function(d) {
            return d[3]
          }));
          newdata[4] = week[week.length - 1][4];
          //newdata[5] = week[week.length - 1][5];  //For volume data
        }
      }
      return newdata;
    }

    /*------ Averging Forumula Ends --------------------------------*/

    /* Axis Map - Store corresponding Y */
    var YinX = [],
      XinS = [];

    var i = 0;
    while (INPUTData.XAxis[i]) {
      YinX.push([]);
      XinS.push([]);
      i++;
    }


    /*-- Check for TOHLCV or TOHLC data if chart type is line or area -- */
    i = 0;
    var a = INPUTData.Series;
    while (a[i]) {
      if (a[i].drawData.length != 0) {
        if ((a[i].type == "line" || a[i].type == "area") || a[i].drawData[0].length == 5 || a[i].drawData[0].length == 6) {
          a[i].drawData = a[i].drawData.map(function(k) {
            return [k[0] * 1, k[4] * 1]
          });
        }
      }
      i++;
    }
    delete a;

    /*-- Clear  previous content in the DIV --*/
    document.getElementById(INPUTData.placeholder).innerHTML = "";

    /*-- Calculating the position of the reference Axis --*/
    var refPosition = refAxis[refAxisIndex].y * 1 + refAxis[refAxisIndex].refOffset * 1 + refAxis[refAxisIndex].refHeight * 1 + 4;

    /*-- Multiplier if above 100 to accommodate objects going out of canvas size --*/
    refPosition = ((refPosition > 100) ? refPosition : 100) / 100; //Change this latert

    /*-- Create the canvas for drawing --*/
    //var r = Raphael(INPUTData.placeholder, wide, high * refPosition);
    var r = Raphael(INPUTData.placeholder, '100%', '100%');
    this.paper = r;

    /*-- Title --*/
    r.text((refLeft + (refWidth / 2)), high * (INPUTData.title.y * 1 / 100), INPUTData.title.name).attr(INPUTData.title.style);


    /*-- Legend --*/
    if (INPUTData.Legend.activate == true) {
      var xposLegend = wide * ((INPUTData.Legend.x * 1) / 100),
        xposText = xposLegend + 10,
        yposLegend = high * ((INPUTData.Legend.y * 1) / 100),
        sizeText = INPUTData.Legend.txtsize,
        inc = sizeText * 1;

      i = 0;
      while (INPUTData.Series[i]) {
        if (INPUTData.Series[i].showInLegend) {
          r.path("M " + xposLegend + " " + yposLegend + " H " + xposText).attr({
            stroke: INPUTData.Series[i].color
          });
          r.text(xposLegend + 20, yposLegend, INPUTData.Series[i].name).attr({
            fill: INPUTData.Series[i].color,
            "font-size": sizeText,
            "text-anchor": "start"
          });
          yposLegend = yposLegend + inc;
        }
        i++;
      }
    }

    /*-----------------------------------------------------
     *------------------- AXIS DRAWING ---------------------
     *------------------------------------------------------*/

    /*-- X Axis --*/
    i = 0;
    minX = [];
    maxX = [];
    while (INPUTData.XAxis[i]) {
      /* Get the minimum and maximum value for this axis */
      minX[i] = Math.min.apply(null, INPUTData.Series.map(function(s) {
        if (obj.getAxisById('x', s.xaxis) == i) {
          return Math.min.apply(null, s.drawData.map(function(k) {
            return k[0] * 1
          }))
        }
      }))
      maxX[i] = Math.max.apply(null, INPUTData.Series.map(function(s) {
        if (obj.getAxisById('x', s.xaxis) == i) {
          return Math.max.apply(null, s.drawData.map(function(k) {
            return k[0] * 1
          }))
        }
      }))

      if (minX[i] == maxX[i]) {
        maxX[i] = maxX[i] + minX[i] * 0.05;
        minX[i] = minX[i] - minX[i] * 0.05;
      }

      var w = INPUTData.XAxis[i].width * 1 / 100, //%age width
        Xx = INPUTData.XAxis[i].x * 1 / 100, //% X coordinate of X axis
        Xy = INPUTData.XAxis[i].y * 1 / 100, //% Y coordinate of X axis
        xX = wide * Xx, // Absolute X coord of X Axis
        xY = high * Xy, // Absolute Y coord of X Axis
        xW = xX + (wide * w); // Width of X Axis  

      var unitValue = (maxX[i] - minX[i]) / (xW - xX);

      /*-- Storing bounds of the Axis --*/
      obj.data.XAxis[i].startY = xY;
      obj.data.XAxis[i].startX = xX;
      obj.data.XAxis[i].endX = xW;
      obj.data.XAxis[i].unitValue = unitValue;


      /*-- Axis Path --*/
      r.path("M " + xX + "," + xY + " L " + xW + "," + xY).attr({
        "stroke": INPUTData.XAxis[i].axisColor,
        "stroke-opacity": INPUTData.XAxis[i].axisOpacity,
        "stroke-width": INPUTData.XAxis[i].thickness
      });
      var Tx = xX,
        Ty1 = (INPUTData.XAxis[i].TickOffset * 1 < 0) ? xY - INPUTData.XAxis[i].TickLength * 1 : xY + INPUTData.XAxis[i].TickLength * 1,
        tickNum = (INPUTData.XAxis[i].TickNum < xW / 30) ? INPUTData.XAxis[i].TickNum : (xW / 30).toFixed(0),
        tickPad = (xW - Tx) / tickNum, //Padding for tick labels
        valDiff = ((maxX[i] + 1) - minX[i]) / tickNum, //Number of ticks
        startVal = minX[i] * 1; //starting value of tick labels
        if(INPUTData.Series[i].drawData.length == 1 ||  INPUTData.Series[i].drawData.length <= 5)    //Handling very Less Data in Intraday
       {tickNum = 2,
        tickPad = (xW - Tx) / tickNum,
         valDiff = ((maxX[i] + 1) - minX[i]) / tickNum;

       }
       if(INPUTData.Series[i].drawData.length > 5 &&  INPUTData.Series[i].drawData.length <= 15)
              {tickNum = 5,
                tickPad = (xW - Tx) / tickNum,
                 valDiff = ((maxX[i] + 1) - minX[i]) / tickNum;
       }

        
      /*-- Label Text --*/
      var labelStyle = INPUTData.XAxis[i].labelStyle;
      labelStyle['text-anchor'] = 'end';
      var Xlabel = r.text(Tx + ((xW - Tx) / 2), xY - INPUTData.XAxis[i].LabelOffset * 1, INPUTData.XAxis[i].label).attr(labelStyle);
      Xlabel.transform(INPUTData.XAxis[i].LabelRot);
      var txt;
      /*-- Draw Ticks and Tick Labels --*/
      while (Tx <= xW) {
        /*--Tick Path--*/
        r.path("M " + Tx + "," + xY + " L " + Tx + "," + Ty1).attr({
          "stroke": INPUTData.XAxis[i].TickColor,
          "stroke-width": INPUTData.XAxis[i].TickThick
        });
        var temp = startVal,
          temp;
        /*--Tick Text--*/
        if (INPUTData.XAxis[i].valtype == "time") {
          temp = new Date(startVal);
          temp = temp.format(INPUTData.XAxis[i].dateFormat);
        } else {
          temp = temp.toFixed(4);
          if (INPUTData.XAxis[i].absTickLabel == false) temp = fromMBT(temp);
        }
        
        if (txt != temp) {
          txt = temp;
          var Ttext = r.text(Tx, xY + INPUTData.XAxis[i].TickOffset * 1, txt).attr(INPUTData.XAxis[i].TickTextStyle);
          Ttext.transform(INPUTData.XAxis[i].TicTexRot);
        }
        Tx = Tx + tickPad;
        startVal = startVal + valDiff;
      }
      i++;
    }

    /*-- Y Axis --*/
    i = 0;
    minY = [];
    maxY = [];
    while (INPUTData.YAxis[i]) {
      var j = 0,
        DataY = [],
        AxiY = [];
      minY[i] = Math.min.apply(null, INPUTData.Series.map(function(s) {
        var sliceTemp = 2;
        if (s.datatype == 'TOHLCV') sliceTemp = 4;
        if (obj.getAxisById('y', s.yaxis) == i) {
          return Math.min.apply(null, s.drawData.map(function(k) {
            return Math.min.apply(null, k.slice(1, sliceTemp))
          }))
        }
      }).filter(function(n) {
        return n != null
      }))
      maxY[i] = Math.max.apply(null, INPUTData.Series.map(function(s) {
        var sliceTemp = 2;
        if (s.datatype == 'TOHLCV') sliceTemp = 4;
        if (obj.getAxisById('y', s.yaxis) == i) {
          return Math.max.apply(null, s.drawData.map(function(k) {
            return Math.max.apply(null, k.slice(1, sliceTemp))
          }))
        }
      }).filter(function(n) {
        return n != null
      }))


      if (minY[i] == maxY[i]) {
        maxY[i] = maxY[i] + minY[i] * 0.05;
        minY[i] = minY[i] - minY[i] * 0.05;
      }

      var h = INPUTData.YAxis[i].height * 1 / 100, //%age height
        Yx = INPUTData.YAxis[i].x * 1 / 100, //X coord of axis in relative decimals
        Yy = INPUTData.YAxis[i].y * 1 / 100, //Y coord of axis in relative decimals
        yX = wide * Yx, // X coord in pixels
        yY = high * Yy, // Y coord in pixels
        yH = yY + (high * h); // Height in pixels

      var unitValue = (maxY[i] - minY[i]) / (yH - yY);

      /*-- Storing bounds of the Axis --*/
      obj.data.YAxis[i].startX = yX;
      obj.data.YAxis[i].startY = yY;
      obj.data.YAxis[i].endY = yH;
      obj.data.YAxis[i].unitValue = unitValue;

      /*-- Axis Path --*/
      r.path("M " + yX + "," + yY + " L " + yX + "," + yH).attr({
        "stroke": INPUTData.YAxis[i].axisColor,
        "stroke-opacity": INPUTData.YAxis[i].axisOpacity,
        "stroke-width": INPUTData.YAxis[i].thickness
      });
      var Ty = yY,
        /*-- Check if ticks need to be inside or outside --*/
        Tx1 = (INPUTData.YAxis[i].TickOffset * 1 > 0) ? yX - INPUTData.YAxis[i].TickLength * 1 : yX + INPUTData.YAxis[i].TickLength * 1, 
        tickNum = (INPUTData.YAxis[i].TickNum < xW / 30) ? INPUTData.YAxis[i].TickNum : (xW / 30).toFixed(0), //Number of ticks
        tickPad = (yH - Ty) / (tickNum - 1), // Padding  
        valDiff = (maxY[i] - minY[i]) / (tickNum - 1), //value difference between ticks
        startVal = maxY[i]; //Starting value of tick labels

      /*-- Label Text --*/
      var labelStyle = INPUTData.YAxis[i].labelStyle
      labelStyle['text-anchor'] = 'end';
      var Ylabel = r.text(yX - INPUTData.YAxis[i].LabelOffset * 1, Ty + ((yH - Ty) / 2), INPUTData.YAxis[i].label).attr(labelStyle);
      Ylabel.transform(INPUTData.YAxis[i].LabelRot);

      if (startVal != null) {
        var txt = 0;
        while (Ty <= Math.ceil(yH)) {
          /*-- Grid Lines --*/
          if (INPUTData.YAxis[i].grid) {
            r.path("M " + yX + "," + Ty + " L " + (yX + refWidth) + "," + Ty).attr({
              "stroke": INPUTData.YAxis[i].gridColor,
              "stroke-width": 0.5
            });
          }
          /*-- Tick Path --*/
          r.path("M " + yX + "," + Ty + " L " + Tx1 + "," + Ty).attr({
            "stroke": INPUTData.YAxis[i].TickColor,
            "stroke-width": INPUTData.YAxis[i].TickThick
          });

          /*-- Tick Text --*/
          var temp = startVal,
          precision = (typeof(INPUTData.YAxis[i].valPrecision) == 'undefined') ? 2 : INPUTData.YAxis[i].valPrecision;

          if (Math.abs(temp) > 1000) {
            temp = temp.toFixed(precision);
            if (INPUTData.YAxis[i].absTickLabel == false) temp = fromMBT(temp);
          } else {
            temp = temp.toFixed(precision);
          }
          if (txt != temp) {
            txt = temp;
            var TickTextStyle = INPUTData.YAxis[i].TickTextStyle;
            TickTextStyle['text-anchor'] = 'end';
            var Ttext = r.text(yX - INPUTData.YAxis[i].TickOffset * 1, Ty, txt).attr(TickTextStyle);
            Ttext.transform(INPUTData.YAxis[i].TicTexRot);
          }
          startVal = startVal - valDiff;
          // tick sized separations
          //startVal = tickcal(startVal, INPUTData.YAxis[i].ticksize);
          Ty = Ty + tickPad;
        }
      }
      i++;
    }
    /*-----------------------Axis Drawing Complete-----------------------*/

    /*--------------------------------------------------------------------
     *--------------------------- SERIES DRAWING --------------------------
     *--------------------------------------------------------------------*/
    i = 0;
    var rparts = [];
    while (INPUTData.Series[i]) { 

      if ($.inArray(INPUTData.Series[i].name, seriesIds) === -1) {
        seriesIds.push(INPUTData.Series[i].id);
      }

      if (INPUTData.Series[i].type && INPUTData.Series[i].xaxis && INPUTData.Series[i].yaxis) {

        var a = INPUTData.Series[i], 
          Xax = obj.getAxisById("x", INPUTData.Series[i].xaxis), // X-Axis Index  
          Yax = obj.getAxisById("y", INPUTData.Series[i].yaxis); // Y-Axis Index

        YinX[Xax].push(Yax); //Axis Map
        var sliceTemp = 2;
        if (a.datatype == 'TOHLCV') sliceTemp = 4;
        var maxXpts = Math.max.apply(null, INPUTData.Series[i].drawData.map(function(pt) {
         return pt[0]
        }).filter(function(n) {
          return n != null
        })),
          maxYpts = Math.max.apply(null, INPUTData.Series[i].drawData.map(function(pt) {
            return Math.max.apply(null, pt.slice(1, sliceTemp))
          }).filter(function(n) {
            return n != null
          })),
          minXpts = Math.min.apply(null, INPUTData.Series[i].drawData.map(function(pt) {
            return pt[0]
          }).filter(function(n) {
            return n != null
          })),
          minYpts = Math.min.apply(null, INPUTData.Series[i].drawData.map(function(pt) {
            return Math.min.apply(null, pt.slice(1, sliceTemp))
          }).filter(function(n) {
            return n != null
          }));

        var W = INPUTData.XAxis[obj.getAxisById("x", INPUTData.Series[i].xaxis)].width * 1 / 100, //Fraction width
          H = INPUTData.YAxis[obj.getAxisById("y", INPUTData.Series[i].yaxis)].height * 1 / 100, //Fraction height
          w = W * (maxXpts - minXpts) / (maxX[Xax] - minX[Xax]),
          h = H * (minYpts - maxYpts) / (minY[Yax] - maxY[Yax]);
        var x1 = (INPUTData.XAxis[obj.getAxisById("x", INPUTData.Series[i].xaxis)].x * 1 / 100) + (W * ((minXpts - minX[Xax]) / (maxX[Xax] - minX[Xax])));
        var y1 = (INPUTData.YAxis[obj.getAxisById("y", INPUTData.Series[i].yaxis)].y * 1 / 100) + (H * ((maxY[Yax] - maxYpts) / (maxY[Yax] - minY[Yax])));


        switch (INPUTData.Series[i].type) { //switch between different types of graphs
          case "area":
          case "spline":
          case "line": 
            rparts[i] = [];
            var lines = r.linechart(
              wide * x1 - 10, //X-Coord of top-left 10
              high * y1 - 10, //Y-Coord of top-left  10
              wide * w + 20, //%age of width of window 20
              high * h + 20, //%age of height of window 20
              INPUTData.Series[i].drawData.map(function(p) {
                return p[0] * 1;
              }), //X Axis
              INPUTData.Series[i].drawData.map(function(p) {
                return p[1] * 1;
              }), //YAxis
              {
                nostroke: false, //Display lines
                axis: "0 0 0 0", //Top-Right-Bottom-Left 
                smooth: (INPUTData.Series[i].type == 'spline' ? true : false) //Lines straight/curved
              }).attr({
              'opacity': 1,
              'stroke-width': INPUTData.Series[i].lineWidth, //Thickness of line
              'stroke': INPUTData.Series[i].color, //Color of the line
              'stroke-dasharray': INPUTData.Series[i].dash //dash of the line
            });
            var thisy = obj.yAxisById(INPUTData.Series[i].yaxis);
            var lowestPoint = high * (1 * thisy.y + 1 * thisy.height) / 100;
            var highestPoint = high * thisy.y / 100;
            var p;
            if (INPUTData.Series[i].type == 'area') {
              p = r.path(lines.lines[0].attrs.path).attr({
                'stroke': INPUTData.Series[i].fillcolor,
                'stroke-opacity': INPUTData.Series[i].fillopacity * 1,
                'fill': INPUTData.Series[i].fillcolor,
                'fill-opacity': INPUTData.Series[i].fillopacity * 1
              });
              p.attrs.path.push(['L', p.attrs.path[p.attrs.path.length - 1][1], lowestPoint]);
              p.attrs.path.push(['L', p.attrs.path[0][1], lowestPoint]);
              p.attr({
                'path': p.attrs.path
              });
            }
            if (INPUTData.animation.activate) {
              var myLinePath = lines.lines[0].attrs.path;

              var lx = Math.min.apply(null, myLinePath.map(function(p) {
                return p[1] * 1
              })),
                ly = highestPoint, 
                lw = Math.max.apply(null, myLinePath.map(function(p) {
                  return p[1] * 1
                })) - lx,
                lh = lowestPoint - ly;
              lines.lines[0].attr({
                'clip-rect': [lx, ly, 0, lh]
              });
              lines.lines[0].animate({
                'clip-rect': [lx, ly, lw, lh]
              }, INPUTData.animation.duration);
              if (p) {
                p.attr({
                  'clip-rect': [lx, ly, 0, lh]
                });
                p.animate({
                  'clip-rect': [lx, ly, lw, lh]
                }, INPUTData.animation.duration);
              }
            }

            //Storing coords in the map
            CmapStore(i, coordx, coordy, INPUTData.Series[i].drawData.map(function(p) {
              return p[0] * 1;
            }), INPUTData.Series[i].drawData.map(function(p) {
              return p[1] * 1;
            }));

            break;

          case "bar": //Bar Chart
            var barW = INPUTData.Series[i].barWidth * 1,
              bcolor = INPUTData.Series[i].fillcolor,
              color = INPUTData.Series[i].color;

            var lines = r.linechart(
              wide * x1 - 10, //X-Coord of top-left
              high * y1 - 10, //Y-Coord of top-left  
              wide * w + 20, // width
              high * h + 20, // height
              INPUTData.Series[i].drawData.map(function(p) {
                return p[0] * 1;
              }), //X Axis
              INPUTData.Series[i].drawData.map(function(p) {
                return p[1] * 1;
              }), //Y Axis
              {
                nostroke: true,
                axis: "0 0 0 0"
              }
            );
            //Storing coords in the map
            CmapStore(i, coordx, coordy, INPUTData.Series[i].drawData.map(function(p) {
              return p[0] * 1;
            }), INPUTData.Series[i].drawData.map(function(p) {
              return p[1] * 1;
            }));
            var cMin = minY[Yax],
              cMax = maxY[Yax];
            //condition for negative values
            var j = 0;
            zeroPosition = (high * y1) + (cMax - (cMin >= 0 ? cMin : 0)) * high * h / (cMax - cMin);
            var drawInterval = 1000 / coordx.length;
            while (coordx[j]) {
              var cX = []; //For storing array of X coordinates
              var barH = 0;
              cX[j] = (coordx[j] * 1).toFixed(0); //Removing decimals
              var barDir = zeroPosition >= coordy[j] ? 1 : -1
              barH = barDir * (zeroPosition - coordy[j])
              var barStartPosition = barDir == 1 ? coordy[j] : coordy[j] - barH;
              var rrect = r.rect(cX[j] - (barW / 2), zeroPosition, barW, 0).attr({
                fill: bcolor,
                stroke: color
              })
              if (INPUTData.animation.activate) {
                rrect.animate({
                  y: barStartPosition,
                  height: barH
                }, 1000);
              } else {
                rrect.attr({
                  y: barStartPosition,
                  height: barH
                });
              }
              j++
            }
            r.path("M " + (wide * x1 - 10) + ' ' + zeroPosition + 'L ' + (wide * (x1 + w) + 10) + ' ' + zeroPosition).attr({
              "stroke-opacity": "0.5",
              "stroke-width": 1
            });
            break;

          case "candle":
          case "ohlc":
            var b = [],
              c = [],
              j = 0;
            var lineW = INPUTData.Series[i].lineWidth * 1,
              fillcolor = INPUTData.Series[i].candlecolor,
              color = INPUTData.Series[i].color,
              boxWidth = INPUTData.Series[i].boxWidth;
            a.drawData.map(function(i) {
              for (j = 1; j < 5; j++) {
                b.push(i[0])
              }
            });
            a.drawData.map(function(i) {
              for (j = 1; j < 5; j++) {
                c.push(i[j])
              }
            });
            var lines1 = r.linechart(
              wide * x1 - 10, //X-Coord of top-left
              high * y1 - 10, //Y-Coord of top-left
              wide * w + 20, //%age width
              high * h + 20, //%age height
              b, //X Axis
              c, //Y Axis
              {
                nostroke: true,
                axis: "0 0 0 0"
              });
            j = 0;
            if (INPUTData.Series[i].type == 'candle') {
              rparts[i] = [];
              rparts[i][0] = [];
              rparts[i][1] = [];
              while (coordx[j]) {
                var c1 = j,
                  c2 = j + 3,
                  cf = fillcolor;
                if (coordy[j] > coordy[j + 3]) {
                  c1 = j + 3;
                  c2 = j;
                  cf = "#FFF";
                }
                rparts[i][0].push(r.path("M " + coordx[j + 1] + " " + coordy[j + 1] + "L " + coordx[c1] + " " + coordy[c1] + "M " + coordx[c2] + " " + coordy[c2] + "L " + coordx[j + 2] + " " + coordy[j + 2]).attr({
                  "stroke-opacity": "1",
                  "stroke-width": lineW,
                  'opacity': 0
                }));
                rparts[i][1].push(r.rect(coordx[c1] - (boxWidth / 2), coordy[c1], boxWidth, coordy[c2] - coordy[c1]).attr({
                  fill: cf,
                  "stroke-width": 1,
                  'stroke-opacity': 1,
                  'opacity': 0
                }));
                j = j + 4;
              }
            } else {
              rparts[i] = [];
              rparts[i][0] = [];
              while (coordx[j]) {
                var cXo = coordx[j] - parseInt(boxWidth / 2),
                  cXc = coordx[j + 3] + parseInt(boxWidth / 2);
                rparts[i][0].push(r.path("M " + coordx[j + 1] + " " + coordy[j + 1] + "L " + coordx[j + 2] + " " + coordy[j + 2] + "M " + coordx[j] + " " + coordy[j] + "L " + cXo + " " + coordy[j] + "M " + coordx[j + 3] + " " + coordy[j + 3] + "L " + cXc + " " + coordy[j + 3]).attr({
                  stroke: color,
                  "stroke-opacity": "1",
                  "stroke-width": lineW,
                  opacity: 0
                }));
                j = j + 4;
              }
            }
            //Storing coords in the map
            CmapStore(i, coordx, coordy, b, c);
            break;

          default:
            break;
        }
      }
      i++;
    }
    /*------------Series animation-------------*/
    i = 0;
    var maxPoints = Math.max.apply(null, rparts.map(function(rseries) {
      return Math.max.apply(null, rseries.map(function(rsubparts) {
        return rsubparts.length
      }))
    }).filter(function(n) {
      return n != null
    }));
    var rj = 0;
    if (INPUTData.animation.activate) {
      var myInterval = setInterval(function() {
        for (rs in rparts) {
          for (rp in rparts[rs]) {
            if (rparts[rs][rp][rj]) {
              rparts[rs][rp][rj].attr({
                opacity: 1
              });
            }
          }
        }
        rj++;
        if (rj >= maxPoints) clearInterval(myInterval);
      }, INPUTData.animation.duration / maxPoints);
    } else {
      for (rs in rparts) {
        for (rp in rparts[rs]) {
          for (rj in rparts[rs][rp]) {
            if (rparts[rs][rp][rj]) {
              rparts[rs][rp][rj].attr({
                opacity: 1
              });
            }
          }
        }
      }
    }
    /*---------- Series Draw function over---------*/

    if (INPUTData.Zooming)
      if (INPUTData.Zooming.Activate == true) {
        drawRefBox();
      } 

    /* Selection Box Calculations */
    var upperY;
    for (i = 0; i < YinX[refAxisIndex].length; i++) {
      upperY = (upperY < INPUTData.YAxis[YinX[refAxisIndex][i]].y * 1) ? upperY : INPUTData.YAxis[YinX[refAxisIndex][i]].y * 1;
    }
    SelectionHeight = (refAxis[refAxisIndex].y * 1) - upperY * 1,
    Zx = refAxis[refAxisIndex].x * 1,
    Zy = refAxis[refAxisIndex].y * 1,
    Zx = Zx * wide / 100,
    Zy = Zy * high / 100,
    Zx1 = Zx + ((refAxis[refAxisIndex].width * 1 / 100) * wide),
    Zy1 = upperY * 1 / 100 * high;

    /* Value Tracker Calculations */
    var crosshairXend = (((refAxis[refAxisIndex].x * 1) + (refAxis[refAxisIndex].width * 1)) * 0.01) * wide,
      crosshairXstart = (refAxis[refAxisIndex].x * 0.01) * wide,
      crosshairYstart = (upperY * 0.01) * high,
      crosshairYend = (refAxis[refAxisIndex].y * 0.01) * high;

    /* Mouse and Value Tracker */
    var mx, my, curs,
      xval,
      displayText = r.set(),
      selection,
      dBox,
      xprev;

    /*------------------------------------------
     *-------- Mouse Tracker -------------------
     *-----------------------------------------*/
    $("#" + INPUTData.placeholder).unbind("mousemove").mousemove(function(e) {
      var j,
        k,
        yAdder = 5, //Adding space to Y so that display of values doesn't overlap
        displayValues = [],
        dCount = 0,
        bboxMultiplier = 2,
        textColors = [],
        m = 0;
      var mouseX = e.pageX - $("#" + INPUTData.placeholder).offset().left,
        mouseY = e.pageY - $("#" + INPUTData.placeholder).offset().top;

      if (mx) mx.remove();
      if (my) my.remove();
      if (curs) curs.remove();
      if (xval) xval.remove();

      /* Restricting function to the chart area */
      if (mouseX < Zx || mouseX > Zx1 || mouseY > Zy || mouseY < Zy1) {
        if (dBox) dBox.remove(); 
        if (displayText) displayText.remove();
        if (document.getElementById(INPUTData.placeholder).style.cursor == "none") document.getElementById('mydivID').style.cursor = "auto";
      } else {

        /* Extending mouse move functions */
        if (typeof(obj.data.mousemove) != 'undefined') obj.data.mousemove(e);
        
        if (typeof(obj.trading) != 'undefined') {
          if (typeof(obj.trading.dragLine) != 'undefined') {
            var yindex = obj.trading.dragLine.yIndex;
            if (mouseY < obj.data.YAxis[yindex].endY && mouseY > obj.data.YAxis[yindex].startY) obj.trading.dragLine.attr('y', mouseY);
          }
        } 
         
        /* Catching mouseX coord and values 
        * Drawing Value Tracker */

        var Xmap = xFullMap()[0];
        Xmap[Xmap.length] = mouseX;
        Xmap = Xmap.sort(function(a, b) {
          return a - b;
        });
        var indexNow = Xmap.indexOf(mouseX),
          xNow = xFullMap()[0][indexNow - 1],
          xNex = xFullMap()[0][indexNow];
        xNow = ((mouseX) > ((xNex + xNow) / 2)) ? xNex : xNow;

        /* Mouse Crosshair */
        if (mx) mx.remove();
        if (my) my.remove();
        if (curs) curs.remove();
        if (INPUTData.Cursor.crosshair == "xy" || INPUTData.Cursor.crosshair == "x") {
          mx = r.path("M " + xNow + "," + mouseY + "L " + crosshairXstart + "," + mouseY + "M " + xNow + "," + mouseY + "L " + crosshairXend + "," + mouseY).attr({
            stroke: INPUTData.Cursor.crosscolor,
            "stroke-width": INPUTData.Cursor.crossthick,
            "stroke-opacity": INPUTData.Cursor.crossopacity
          });
        }
        if (INPUTData.Cursor.crosshair == "xy" || INPUTData.Cursor.crosshair == "y") {
          my = r.path("M " + xNow + "," + mouseY + "L " + xNow + "," + crosshairYstart + "M " + xNow + "," + mouseY + "L " + xNow + "," + crosshairYend).attr({
            stroke: INPUTData.Cursor.crosscolor,
            "stroke-width": INPUTData.Cursor.crossthick,
            "stroke-opacity": INPUTData.Cursor.crossopacity
          });
        }
        curs = r.circle(xNow, mouseY, INPUTData.Cursor.pradius).attr({
          stroke: INPUTData.Cursor.pcolor,
          "stroke-width": INPUTData.Cursor.pthickness,
          "stroke-opacity": INPUTData.Cursor.popacity
        });

        if (xNow != xprev) {
          i = 0;
          while (INPUTData.Series[i]) {
            var valTsize = INPUTData.ValTrack.txtsize,
              timeFlag = false,
              j = Cmap[i]['x'].indexOf(xNow);
            if (j != -1) {
              var a = INPUTData.Series[i],
                nextCoord = 1;
              if (INPUTData.Series[i].type == "candle" || INPUTData.Series[i].type == "ohlc") {
                nextCoord = 4;
              }
              /* Line Area Bar */  
              if (INPUTData.Series[i].type == "line" || INPUTData.Series[i].type == "area" || INPUTData.Series[i].type == "bar") {
                displayValues[dCount] = INPUTData.Series[i].name,
                displayValues[dCount + 1] = Commas((Cmap[i]['yval'][j]).toFixed(2));
                dCount += 2;
                textColors[m] = INPUTData.Series[i].color;
                m++;
                bboxMultiplier += 1.50;
              }

              /* CANDLE and OHLC */  
              if (INPUTData.Series[i].type == "candle" || INPUTData.Series[i].type == "ohlc") {
                displayValues[dCount] = "Open",
                displayValues[dCount + 1] = Cmap[i]['yval'][j],
                displayValues[dCount + 2] = "High",
                displayValues[dCount + 3] = Cmap[i]['yval'][j + 1],
                displayValues[dCount + 4] = "Low",
                displayValues[dCount + 5] = Cmap[i]['yval'][j + 2],
                displayValues[dCount + 6] = "Close",
                displayValues[dCount + 7] = Cmap[i]['yval'][j + 3];
                /* Increment counter */
                bboxMultiplier += 6.50;
                dCount += 8;
                textColors[m] = INPUTData.Series[i].color;
                textColors[m + 1] = INPUTData.Series[i].color;
                textColors[m + 2] = INPUTData.Series[i].color;
                textColors[m + 3] = INPUTData.Series[i].color;
                m += 4;
              }
            }
            i++;
          }

          /* Drawing Calculations */
          boxHeight = INPUTData.ValTrack.txtsize * (bboxMultiplier);
          yLimitB = (yLowest * 1 / 100) * high,
          Y1 = (mouseY + 3 + boxHeight > yLimitB) ? (yLimitB - boxHeight) : (mouseY + 3);

          /* Display X Value */
          var k = xFullMap()[0].indexOf(xNow),
            xVal = xFullMap()[1][k];

          if(INPUTData.XAxis[refAxisIndex].valtype == 'time'){
            /* Date Formatting */    
            xVal = new Date(xVal);
            xVal = xVal.format(INPUTData.XAxis[refAxisIndex].dateFormat);
            xVal = INPUTData.XAxis[refAxisIndex].label.toString()+": "+xVal;
          }else{
            xVal = INPUTData.XAxis[refAxisIndex].label.toString()+": "+xVal;
          } 
          if (displayText) displayText.remove();
          displayText.clear();

          displayText.push(r.text(xNow + 20, Y1 + 15, xVal).attr({
            "font-size": valTsize,
            "text-anchor": "start"
          }));
          var l = 0,
            k = 0;
          yAdder = (valTsize * 2.5);
          for (var l = 0; l < displayValues.length;) {
            displayText.push(r.text(xNow + 20, Y1 + yAdder, displayValues[l] + " : " + displayValues[l + 1]).attr({
              fill: textColors[k],
              "font-size": valTsize,
              "text-anchor": "start"
            }));
            yAdder = yAdder + (valTsize * 1.5);
            l = l + 2;
            k++;
          }
          var BBox = displayText.getBBox();
          var widths = [];
          displayText.forEach(function(b) {
            var wBox = b.getBBox();
            widths.push(wBox.width);
          });
          var dBoxWidth = Math.max.apply(null, widths);

          /* Value Background Box */
          if (dBox) dBox.remove();
          boxHeight = INPUTData.ValTrack.txtsize * (bboxMultiplier);
          var xLimitR = ((INPUTData.XAxis[refAxisIndex].width * 1 + INPUTData.XAxis[refAxisIndex].x * 1) * 1 / 100) * wide,
            yLimitB = (yLowest * 1 / 100) * high,
            Y1 = (mouseY + 3 + boxHeight > yLimitB) ? (yLimitB - boxHeight) : (mouseY + 3);
          xNow = (xNow + 10 + dBoxWidth > xLimitR) ? (xNow - dBoxWidth - 40) : xNow;

          dBox = r.rect(xNow + 10, Y1, dBoxWidth + 20, boxHeight, 10, 10).attr({
            /*gradient: '90-#DDD-#FAFAFA',*/
            fill: '#FFF',
            stroke: '#3b4449',
            'stroke-width': 2,
            'stroke-linejoin': 'round',
            'fill-opacity': 1
          });

          displayText.forEach(function(d) {
            d.attr({
              'x': xNow + 20
            });
          });
          
          displayText.toFront();
        }
        xprev = xNow;
        if (INPUTData.Zooming.Activate == true) drawSelection(mouseX); 
        e.preventDefault();
      }
    });
    /*------- mouse Tracker function ends-------------------------*/

    /**
     * Function to store x,y coordinates and their values in a map  
     * @method CmapStore
     * @param {Integer} i - counter
     * @param {Array} coordx - X coords
     * @param {Array} coordy - Y coords
     * @param {Array} b - X values
     * @param {Array} c - Y values
     * @return
     */
    function CmapStore(i, coordx, coordy, b, c) {
      Cmap[i] = {};
      Cmap[i] = ["x", "y", "xval", "yval"];
      Cmap[i].x = coordx;
      Cmap[i].y = coordy;
      Cmap[i].xval = b;
      Cmap[i].yval = c;
    }

    /*----------------------------------------------
     *------------------Reference Chart--------------
     *---------------------------------------------*/

    /**
     * Draws the reference axis and associated elements
     * @method drawRefBox
     * @return
     */
    function drawRefBox() {
      if (INPUTData.Zooming.Activate) {
        var P = refAxis[refAxisIndex],
          Px = P.x * 1 / 100,
          Py = ((P.y * 1) + (P.refOffset * 1)) / 100,
          Ph = P.refHeight * 1 / 100,
          Pw = P.width * 1 / 100,
          Pa = [],
          Pb = [],
          PSxmin = obj.zoomPosition.start,
          PSxmax = obj.zoomPosition.end;
        var aggregationDays = Math.ceil(P.refData.length / (Pw * wide));
        var lastDate = P.refData[P.refData.length - 1];
        P.refData = P.refData.filter(function(p) {
          return P.refData.indexOf(p) % aggregationDays == 0
        });
        if (P.refData.indexOf(lastDate) == -1) P.refData.push(lastDate);

        var Prefbackup = P.refData;

        Prefbackup.map(function(i) {
          Pa.push(i[0])
        });
        Prefbackup.map(function(i) {
          Pb.push(i[1])
        });

        var pLine = r.linechart(
          wide * Px - 10, //X-Coord of top-left
          high * Py - 10, //Y-Coord of top-left  
          wide * Pw + 20, //%age of width of window
          high * Ph + 20, //%age of height of window
          Pa, //X Axis
          Pb, //Y Axis
          {
            nostroke: false, //Display lines
            axis: "0 0 1 0", //Top-Right-Bottom-Left 
            smooth: false, //Lines straight/curved
            width: P.reflineThick, //Thickness of line
            colors: [P.axisColor], //Color of the line
            shade: true,
            axisxstep: P.refTicks
          })
        var axisItems = pLine.axis[0].text.items
        for (var i = 0, l = axisItems.length; i < l; i++) {
          var date = new Date(parseInt(axisItems[i].attr("text")));
          axisItems[i].attr("text", dateFormat(date, P.refdateFormat));
        }
        
        /* Storing coords in the map */
        Pmap = {};
        Pmap = ["x", "y", "xval", "yval"];
        Pmap.x = coordx;
        Pmap.y = coordy;
        Pmap.xval = Pa;
        Pmap.yval = Pb;

        /* End Markers */
        var PIndiMin = Pmap.xval.indexOf(PSxmin),
          PIndiMax = Pmap.xval.indexOf(PSxmax),
          PIndiHih = high * Ph + high * Py;

        if (PIndiMin == -1) {
          var PmapXvalCopy = Pmap.xval;
          PmapXvalCopy.push(PSxmin);
          PmapXvalCopy = PmapXvalCopy.sort(function(a, b) {
            return a - b;
          });
          PIndiMin = PmapXvalCopy.indexOf(PSxmin);
        }

        if (PIndiMax == -1) {
          PmapXvalCopy = Pmap.xval;
          PmapXvalCopy.push(PSxmax);
          PmapXvalCopy = PmapXvalCopy.sort(function(a, b) {
            return a - b;
          });
          PIndiMax = (Pmap.xval.indexOf(PSxmax));
        }

        /* X Axis */
        r.path("M " + Pmap.x[PIndiMin] + "," + (PIndiHih) + "L " + Pmap.x[PIndiMax] + "," + (PIndiHih)).attr({
          stroke: "#aaa",
          "stroke-width": "1"
        });
        /* Left Marker */
        r.path("M " + Pmap.x[PIndiMin] + "," + (high * Py) + "L " + Pmap.x[PIndiMin] + "," + (PIndiHih)).attr({
          stroke: "#aaa",
          "stroke-width": "1"
        });
        /* Right Marker*/
        r.path("M " + Pmap.x[PIndiMax] + "," + (high * Py) + "L " + Pmap.x[PIndiMax] + "," + (high * Py + high * Ph)).attr({
          stroke: "#aaa",
          "stroke-width": "1"
        });
        /* Scroller */
        var myX = (Pmap.x[PIndiMin] + (Pmap.x[PIndiMax] - Pmap.x[PIndiMin])).toFixed(2) * 1;
        r.rect(refLeft, high * Py, Pmap.x[PIndiMin] - refLeft, high * Ph).attr({
          fill: "#fff",
          stroke: "#aaa",
          "stroke-opacity": "0.6",
          "fill-opacity": "0.7"
        });
        r.rect(myX, high * Py, (refLeft + refWidth).toFixed(2) * 1 - myX, high * Ph).attr({
          fill: "#fff",
          stroke: "#aaa",
          "stroke-opacity": "0.6",
          "fill-opacity": "0.7"
        });
        var panScroll = r.rect(Pmap.x[PIndiMin], high * Py, (Pmap.x[PIndiMax] - Pmap.x[PIndiMin]), high * Ph).attr({
          fill: "#fff",
          stroke: "#444",
          "stroke-opacity": "0.6",
          "fill-opacity": "0.1",
          cursor: "pointer"
        });

        /* Left and Right Movable markers */
        var resizeR = r.rect(Pmap.x[PIndiMax] - 5, high * Py + (high * Ph / 4), 10, high * Ph / 2, 3).attr({
          fill: "#eee",
          stroke: "#444",
          cursor: "ew-resize"
        }),
          resizeL = r.rect(Pmap.x[PIndiMin] - 5, high * Py + (high * Ph / 4), 10, high * Ph / 2, 3).attr({
            fill: "#eee",
            stroke: "#444",
            cursor: "ew-resize"
          });
        r.path("M " + (Pmap.x[PIndiMax] - 1) + " " + (high * Py + (high * Ph * ((3 / 8)))) + "L " + 
	(Pmap.x[PIndiMax] - 1) + " " + (high * Py + (high * Ph * ((5 / 8))))).attr({
          "stroke": "#444"
        });
        r.path("M " + (Pmap.x[PIndiMax] + 1) + " " + (high * Py + (high * Ph * ((3 / 8)))) + "L " + 
	(Pmap.x[PIndiMax] + 1) + " " + (high * Py + (high * Ph * ((5 / 8))))).attr({
          "stroke": "#444"
        });
        r.path("M " + (Pmap.x[PIndiMin] + 1) + " " + (high * Py + (high * Ph * ((3 / 8)))) + "L " + 
	(Pmap.x[PIndiMin] + 1) + " " + (high * Py + (high * Ph * ((5 / 8))))).attr({
          "stroke": "#444"
        });
        r.path("M " + (Pmap.x[PIndiMin] - 1) + " " + (high * Py + (high * Ph * ((3 / 8)))) + "L " + 
	(Pmap.x[PIndiMin] - 1) + " " + (high * Py + (high * Ph * ((5 / 8))))).attr({
          "stroke": "#444"
        });

        /**
         * Functions to run on dragging of ref Axis associated elements
         * @method start, moveL, upL, moveR, upR, moveS, upS
         * @return
         */
        var pX, pXs,
          /* start, move, and up are the drag functions */
          start = function() {
            /* storing original coordinates */
            this.ox = this.attr("x");
            this.oy = this.attr("y");
            this.attr({
              opacity: 1
            });
          },
          moveL = function(dx, dy) {
            /* Move will be called with dx and dy */
            if ((this.ox + dx) >= Pmap.x[PIndiMax] || (this.ox + dx) < Pmap.x[0]) {} else {
              this.attr({
                x: this.ox + dx,
                y: this.oy
              });
              pX = this.ox + dx;
            }
          },
          upL = function() {
            /* Restoring State */    
            if ((pX) == this.ox) {} else {
              i = 0;
              while (Pmap.x[i]) {
                if (pX >= (Pmap.x[i]) && pX < Pmap.x[i + 1]) {
                  obj.datePlot(Pmap.xval[i], Pmap.xval[PIndiMax]);
                }
                i++;
              }
            }
          },
          moveR = function(dx, dy) {
            /* Move will be called with dx and dy */
            if ((this.ox + dx) <= Pmap.x[PIndiMin] || (this.ox + dx + 10) > Pmap.x[Pmap.x.length - 1]) {} else {
              this.attr({
                x: this.ox + dx,
                y: this.oy
              });
              pX = this.ox + dx;
            }
          },
          upR = function() {
            /* Restoring state */
            if ((pX) == this.ox) {} else {
              i = 0;
              while (Pmap.x[i]) {
                if (pX > Pmap.x[i] && pX <= Pmap.x[i + 1]) {
                  /* Pass dates to datePlot */
                  obj.datePlot(Pmap.xval[PIndiMin], Pmap.xval[i + 1]);
                }
                i++;
              }
            }
          },
          moveS = function(dx, dy) {
            /* move will be called with dx and dy */
            if ((this.ox + dx) <= Pmap.x[0] || (this.ox + dx + (Pmap.x[PIndiMax] - Pmap.x[PIndiMin])) > Pmap.x[Pmap.x.length - 1]) {} else {
              this.attr({
                x: this.ox + dx,
                y: this.oy
              });
              pXs = this.ox + dx;
            }
          },
          upS = function() {
            if ((pXs) == this.ox) {} else {
              i = 0;
              while (Pmap.x[i]) {
                if (pXs >= (Pmap.x[i]) && pXs < Pmap.x[i + 1]) {
                  var panBlockEnd = Pmap.xval[PIndiMax] - Pmap.xval[PIndiMin] + Pmap.xval[i];
                  /* Pass dates to datePlot */
                  obj.datePlot(Pmap.xval[i], panBlockEnd);
                }
                i++;
              }
            }
          }

          /*---------Function to draw the selection box on the chart-----------------*/

	/**
	 * Draw selection box for select and zoom
         * @method drawSelection
         * @param {Integer} mPosX
         * @return
         */

        drawSelection = function(mPosX) {
           if (!mouseStillDown) {
            if (selection) selection.remove();
            return;
          }

          if (mouseStillDown) {
            var Swidth = (Sx1 < mPosX) ? (mPosX - Sx1) : (Sx1 - mPosX),
              Sheight = (SelectionHeight * 1 / 100) * high,
              Sx = (Sx1 < mPosX) ? Sx1 : mPosX,
              Sy = (upperY * 1 / 100) * high;

            if (selection) selection.remove();
            selection = r.rect(Sx, Sy, Swidth, Sheight).attr({
              fill: obj.data.SelectBox.color,
              "fill-opacity": obj.data.SelectBox.opacity,
              stroke: obj.data.SelectBox.BorderColor,
              "stroke-width": obj.data.SelectBox.Borderthick,
              "stroke-opacity": obj.data.SelectBox.BorderOpacity
            });
          }
        }
        /*-----------------Draw selection function ends ------------------------*/

        /* rstart and rmove are the resize functions */
        resizeL.drag(moveL, start, upL);
        resizeR.drag(moveR, start, upR);
        panScroll.drag(moveS, start, upS);
      }
    }
    /*--------------------reference chart plotting function ends -----------*/

    /* Calculating lowest of the Y axis */
    yLowest = INPUTData.YAxis[YinX[0][0]].y * 1 + INPUTData.YAxis[YinX[0][0]].height * 1;
    for (var i = 0; i < YinX[0].length; i++) { //Hardcoding the first XAxis
      var yIndex = YinX[0][i];
      currentYlow = INPUTData.YAxis[yIndex].y * 1 + INPUTData.YAxis[yIndex].height * 1;
      yLowest = (yLowest > currentYlow) ? yLowest : currentYlow;
      i++;
    }
    obj.Xlimit1 = Zx,
    obj.Xlimit2 = Zx1,
    obj.Ylimit1 = Zy,
    obj.Ylimit2 = Zy1;
    obj.CMAP = Cmap;
    attachCollateYaxis();
    obj.data = INPUTData;

    if (typeof(obj.trading) != 'undefined') {
      if (typeof(obj.trading.orderList) != 'undefined') obj.trading.drawOrderLines(obj.trading.orderList, obj.trading.seriesID);
      if (typeof(obj.trading.postTradeList) != 'undefined') obj.trading.drawPostTrade(obj.trading.postTradeList, obj.trading.seriesID);
    }
  }
  /*============= main graph draw function ends =====================*/

  /*-----------------------------------------------------------------------*
   *---------Function to draw the selection box on the chart---------------*
   *-----------------------------------------------------------------------*/

  /*-- Zooming --*/

  $("#" + obj.data.placeholder).mousedown(function(event) {
    event.preventDefault();
    Sx1 = event.pageX - $("#" + obj.data.placeholder).offset().left;
    Sy1 = event.pageY - $("#" + obj.data.placeholder).offset().top;
    if (Sx1 < Zx || Sx1 > Zx1 || Sy1 > Zy || Sy1 < Zy1) {} else {
      mouseStillDown = true;
    }
  });

  $("#" + obj.data.placeholder).mouseup(function(event) {
    if (selection) selection.remove();
    Sx2 = event.pageX - $("#" + obj.data.placeholder).offset().left;
    Sy2 = event.pageY - $("#" + obj.data.placeholder).offset().top;

    /*Selection only takes place inside the graph area*/
    if (!(Sx2 < Zx || Sx2 > Zx1 || Sy2 > Zy || Sy2 < Zy1 || mouseStillDown == false)) {
      if (obj.data.Zooming.Activate) zoomedGraph(Sx1, Sx2);
    }
    mouseStillDown = false;
  });


  /**
   * Check area under selection box and set slice markers to zoom in
   * @method zoomedGraph
   * @param {Integer} Sx1 //Starting X coord of selection
   * @param {Integer} Sx2 //Ending X coord of selection
   * @return
   */
  var zoomedGraph = function(Sx1, Sx2) {
    if (Sx1 != Sx2) {
      var xmapCoords = xFullMap()[0];
      var countx1 = 0,
        countx2 = 0,
        flag1 = false,
        flag2 = false;

      for (var i = 0; i < xmapCoords.length; i++) {
        var xCoord = xmapCoords[i];
        if (Sx1 < xCoord && flag1 == false) {
          countx1 = i;
          flag1 = true;
        }
        if (Sx2 < xCoord && flag2 == false) {
          countx2 = i;
          flag2 = true;
        }
        if (flag1 == true && flag2 == true) break;
      }
      if (countx1 > countx2) countx1--;
      else countx2--;
      var xval1 = xFullMap()[1][countx1],
        xval2 = xFullMap()[1][countx2];

      var zoomStartDate = (xval1 < xval2) ? xval1 : xval2,
        zoomEndDate = (xval1 > xval2) ? xval1 : xval2;

      obj.datePlot(zoomStartDate, zoomEndDate);
    }
  }

  /* -- Zooming ends --*/

  /**
   * Slice the data of the chart according to the input params
   * @method datePlot
   * @param {Integer} xs //Start x value
   * @param {Integer} xe //End
   * @return
   */
  this.datePlot = function(xs, xe) {

    if (!(obj.zoomPosition.start == xs && obj.zoomPosition.end == xe)) {
      obj.zoomPosition.start = xs;
      obj.zoomPosition.end = xe;
      this.draw(obj.data);
    }
  }

  /**
   * Adding functional support for date range buttons
   * @method datePlotButtons
   * @param {String} days
   * @return
   */
  obj.datePlotButtons = function(days) {
    if (days == "ALL") {
      obj.datePlot((refAxis[refAxisIndex].refData[0][0] * 1), refAxis[refAxisIndex].refData[refAxis[refAxisIndex].refData.length - 1][0] * 1);
    }
    if (days == "YTD") {
      var startdate = refAxis[refAxisIndex].refData[refAxis[refAxisIndex].refData.length - 1][0];
      startdate = new Date(startdate);
      startdate.setDate(1);
      startdate.setMonth(0);
      obj.datePlot(startdate, refAxis[refAxisIndex].refData[refAxis[refAxisIndex].refData.length - 1][0] * 1);
    } else {
      var multiplier = (days.slice(-1) == "M" ? 30 : (days.slice(-1) == "Y" ? 365 : 1)) * 3600 * 24 * 1000; //Years or Months or Days
      var endposition = obj.zoomPosition.end;
      obj.datePlot((endposition - (days.slice(0, days.length - 1) * multiplier)), endposition);
    }
  }


  /**
   * Add a series
   * @method addSeries
   * @param {Object} newSeries
   * @return
   */
  this.addSeries = function(newSeries) {
    var i = obj.data.Series.length;
    if (seriesIds.indexOf(newSeries.name) == -1) {
      obj.data.Series[i] = newSeries;
    }
  }

  /**
   * Remove a set containing axes and series.
   * @method removeSet
   * @param {Object} inputSet
   * @param {Boolean} flag
   * @return
   */
  this.removeSet = function(inputSet, flag) {
    /* Remove xaxis */
    for (var i = 0; i < inputSet.xaxis.length; i++) {
      var axisINDEX = obj.getAxisById("x", inputSet.xaxis[i]);
      obj.data.XAxis.splice(axisINDEX, 1);
    }

    /* Remove yaxis */
    for (var i = 0; i < inputSet.yaxis.length; i++) {
      var axisINDEX = obj.getAxisById("y", inputSet.yaxis[i]);
      obj.data.YAxis.splice(axisINDEX, 1);
    }

    /* Remove series */
    for (var i = 0; i < inputSet.series.length; i++) {
      var seriesINDEX = obj.getSeriesById(inputSet.series[i]);
      obj.data.Series.splice(seriesINDEX, 1);
    }
    if (typeof(flag) != "undefined")
      if (flag) obj.draw();
  }

  /**
   * Add an axis
   * @method addAxis
   * @param {Object} newAxis
   * @param {String} axisType
   * @return
   */
  this.addAxis = function(newAxis, axisType) {
    if (axisType == "x") {
      var i = obj.data.XAxis.length;
      obj.data.XAxis[i] = newAxis;
    } else {
      var i = obj.data.YAxis.length;
      obj.data.YAxis[i] = newAxis;
    }
  }

  //Remove a series
  /**
   * Description
   * @method removeSeries
   * @param {} seriesID
   * @return
   */
  this.removeSeries = function(seriesID) {
    var seriesINDEX = obj.getSeriesById(seriesID);
    obj.data.Series.splice(seriesINDEX, 1);
  }

  /** 
   * Remove an axis from the chart
   * @method removeAxis
   * @param {String} axisType
   * @param {String} axisID
   * @return
   */
  this.removeAxis = function(axisType, axisID) {
    var axisINDEX = obj.getAxisById(axisType, axisID);
    if (axisType == "X") {
      obj.data.XAxis.splice(axisINDEX, 1);
    } else {
      obj.data.YAxis.splice(axisINDEX, 1);
    }
  }

  /**
   * Move the reference axis plot
   * @method moveRefPlot
   * @param {Integer} Ymove //Amount to be moved
   * @param {Object} InData //Data object of the chart
   * @return
   */
  this.moveRefPlot = function(Ymove, InData) {
    var refAxisIndex = obj.getAxisById("x", mainXaxisId);
    InData.XAxis[refAxisIndex].y = Ymove * 1 + InData.XAxis[refAxisIndex].y * 1;
  }

  /**
   * Move Y axis along Y coordinate
   * @method moveYaxis
   * @param {String} axisID //Id of the axis to be moved
   * @param {Integer} Ymove //Amount to be moved from original position
   * @param {Object} InData //Data object of the chart
   * @return
   */
  this.moveYaxis = function(axisID, Ymove, InData) {
    var axisINDEX = obj.getAxisById("y", axisID);
    if (axisINDEX) {
      InData.YAxis[axisINDEX].y = Ymove * 1 + InData.YAxis[axisINDEX].y * 1;
    }
  }

  /**
   * Use this function to add a line chart with no data. only one 'value'
   * @method plotLine
   * @param {Object} seriesobj
   * @return
   */
  this.plotLine = function(seriesobj) {
    var dates = [];
    var alldata = obj.data.Series.filter(function(s) {
      return s.xaxis == seriesobj.xaxis
    }).map(function(s) {
      return s.data
    });
    for (d in alldata)
      for (di in alldata[d])
        if (dates.indexOf(alldata[d][di][0]) == -1) dates.push(alldata[d][di][0]);
    dates.sort();

    seriesobj.data = dates.map(function(d) {
      return [d, seriesobj.value]
    }); 
    obj.data.Series.push(seriesobj);
  }

  /**
   * To switch between chart types using TP data.
   * @method changeTypeTP
   * @param {Array} TPData
   * @param {String} type
   * @param {String} sID //Id of the series to be converted
   * @param {Integer} candleInterval
   * @return
   */
  this.changeTypeTP = function(TPData, type, sID, candleInterval) {

    /**
     * Convert TP data in to TOHLC. 
     * Creates OHLC packets with time of each defined in interval.
     * @method dataParser
     * @param {Array} TPdata
     * @param {Integer} interval
     * @return {Array} rData
     */
    function dataParser(TPdata, interval) {
      var endTime = TPdata[0][0] + (interval) * 1,
        rData = [],
        j = 0;

      rData[0] = [];
      rData[0][1] = TPdata[0][1];
      for (var i = 0; i < TPdata.length; i++) {
        if (TPdata[i][0] < endTime) {
          //Time
          rData[j][0] = TPdata[i][0],
          //High
          rData[j][2] = (rData[j][2] > TPdata[i][1]) ? rData[j][2] : TPdata[i][1],
          //Low 
          rData[j][3] = (rData[j][3] < TPdata[i][1]) ? rData[j][3] : TPdata[i][1],
          //Close
          rData[j][4] = TPdata[i][1];
        } else {
          if (typeof(rData[j][0]) != "undefined") j++;
          endTime = endTime + (interval) * 1;
          rData[j] = [];
          //Open 
          rData[j][1] = TPdata[i][1];
          i--;
        }
      }
      return rData;
    }

    //Data Conversion Based on Type of Chart
    var sIndex = obj.getSeriesById(sID),
      sdata;
    if (type == "line" || type == "area") {
      sdata = TPData;
    } else if (type == "candle" || type == "ohlc") {
      sdata = dataParser(TPData, candleInterval);
    }

    //Modify Required Flags
    obj.data.Series[sIndex].type = type;
    obj.data.Series[sIndex].data = [];
    obj.data.Series[sIndex].drawData = [];
    obj.data.Series[sIndex].data = sdata;
    obj.data.Series[sIndex].drawData = sdata;

    //Redraw Chart
    obj.draw();
  }

  /**
   * Adjust Y coordinate of each X axis according to 
   * its multiple Y axes.
   * @method attachCollateYaxis
   * @return
   */
  function attachCollateYaxis() {
    for (var i = 0; i < obj.data.XAxis.length; i++) {
      /**
       * Set y coordinate of X axis according to its Y axes
       * @method collateYaxis
       * @param {Object} paddingSet //Set padding to be left top and bottom
       * @param {Boolean} flag //call draw function if true
       * @return
       */
      obj.data.XAxis[i].collateYaxis = function(paddingSet, flag) {

        if (!paddingSet) var paddingSet = {};
        if (typeof(paddingSet.top) == "undefined") paddingSet.top = 0;
        if (typeof(paddingSet.paddingTop) == "undefined") paddingSet.paddingTop = 0;
        if (typeof(paddingSet.paddingBottom) == "undefined") paddingSet.paddingBottom = 0;

        var thisxaxis = this;

        var yaxiss = obj.data.Series.filter(function(s) {
          return s.xaxis == thisxaxis.id
        });
        yaxiss = yaxiss.map(function(s) {
          return s.yaxis
        });
        yaxiss = $.unique(yaxiss);
        yaxiss = yaxiss.map(function(yid) {
          return obj.yAxisById(yid)
        });
        yaxiss = yaxiss.sort(function(a, b) {
          return a.y - b.y
        });

        var currenty = paddingSet.top;
        for (var j = 0; j < yaxiss.length; j++) {
          currenty += paddingSet.paddingTop;
          yaxiss[j].y = currenty * 1;
          currenty += yaxiss[j].height * 1;
          currenty += paddingSet.paddingBottom;
        }
        thisxaxis.y = currenty;

        if (typeof(flag) != "undefined")
          if (flag) obj.draw();
      }
    }
  }

  /* Function to switch between chart types 
   * @method convertTo
   * @param {String} type  //chart type
   * @param {String} seriesId //id of series which needs to be converted
   * return
   * */
  obj.convertTo = function(type, seriesId) {
    var seriesIndex = obj.getSeriesById(seriesId);
    obj.data.Series[seriesIndex].type = type;
    obj.draw();
  }


  if (this.initTechnical) this.initTechnical();
  if (this.data.Trading == true) this.initTrading();

} // END OF uChart
