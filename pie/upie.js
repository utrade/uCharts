 	  /* RANDOM COLOR GENERATOR */
 	 function get_random_color() {
 	   var letters = '0123456789ABCDEF'.split('');
 	   var color = '#';
 	   for (var i = 0; i < 6; i++) {
 	     color += letters[Math.round(Math.random() * 15)];
 	   }
 	   return color;
 	 }

 	 function pieChart(data) {
 	   this.data = data;
 	   var obj = this;
 	   var wide = $("#" + obj.data.placeholder).width(),
 	     high = $("#" + obj.data.placeholder).height(),
 	     r = Raphael(obj.data.placeholder, wide, high);

 	   function D(angle) {
 	     return angle * (180 / Math.PI);
 	   }

 	   function R(angle) {
 	     return angle * (Math.PI / 180);
 	   }

 	   /* Defining Arc Function */
 	   r.customAttributes.arc = function(x, y, r1, r2, start, end) {
 	     start -= 90;
 	     end -= 90;
 	     var f = ((end - start) > 180) ? 1 : 0;
 	     var sx1 = x + r1 * Math.cos(R(start));
 	     var sy1 = y + r1 * Math.sin(R(start));
 	     var ex1 = x + r1 * Math.cos(R(end));
 	     var ey1 = y + r1 * Math.sin(R(end));
 	     var sx2 = x + r2 * Math.cos(R(start));
 	     var sy2 = y + r2 * Math.sin(R(start));
 	     var ex2 = x + r2 * Math.cos(R(end));
 	     var ey2 = y + r2 * Math.sin(R(end));
 	     var path = [
 	       ["M", ex1, ey1],
 	       ["A", r1, r1, 0, f, 0, sx1, sy1],
 	       ["L", sx2, sy2],
 	       ["A", r2, r2, 0, f, 1, ex2, ey2],
 	       ["L", ex1, ey1],
 	       ["Z"]
 	     ];
 	     return {
 	       path: path
 	     };
 	   }
 	   var pieSet = r.set(),
 	     markerSet = r.set(),
 	     Rlegend = r.set(),
 	     Llegend = r.set();

 	   this.draw = function() {
 	     console.log("calling piedraw");
 	     if (typeof(pieSet) != 'undefined') pieSet.remove();
 	     if (typeof(markerSet) != 'undefined') markerSet.remove();
 	     if (typeof(Rlegend) != 'undefined') Rlegend.remove();
 	     if (typeof(Llegend) != 'undefined') Llegend.remove();

 	     /* -- DEFINING DEFAULT OBJECT -- */
 	     /* Animation */
 	     if (typeof(obj.data.animation) == 'undefined') obj.data.animation = {};
 	     if (typeof(obj.data.animation.activate) == 'undefined') obj.data.animation.activate = false;
 	     if (typeof(obj.data.animation.duration) == 'undefined') obj.data.animation.duration = 1000;
 	     /* Title */
 	     if (typeof(obj.data.title) == 'undefined') obj.data.title = {};
 	     if (typeof(obj.data.title.x) == 'undefined') obj.data.title.x = $("#" + obj.data.placeholder).width() / 2;
 	     if (typeof(obj.data.title.y) == 'undefined') obj.data.title.y = '50';
 	     if (typeof(obj.data.title.name) == 'undefined') obj.data.title.name = 'Pie Chart';
 	     if (typeof(obj.data.title.style) == 'undefined') obj.data.title.style = {};
 	     if (typeof(obj.data.title.style['font-size']) == 'undefined') obj.data.title.style['font-size'] = '20';
 	     if (typeof(obj.data.title.style['font-family']) == 'undefined') obj.data.title.style['font-family'] = 'Arial';
 	     if (typeof(obj.data.title.style['font-weight']) == 'undefined') obj.data.title.style['font-weight'] = 'bold';
 	     if (typeof(obj.data.title.style['fill']) == 'undefined') obj.data.title.style['fill'] = '#444';
 	     /* Legend */
 	     if (typeof(obj.data.Legend) == 'undefined') obj.data.Legend = {};
 	     if (typeof(obj.data.Legend.style) == 'undefined') obj.data.Legend.style = {};
 	     if (typeof(obj.data.Legend.style['font-size']) == 'undefined') obj.data.Legend.style['font-size'] = '14';
 	     if (typeof(obj.data.Legend.style['font-family']) == 'undefined') obj.data.Legend.style['font-family'] = 'Arial';
 	     if (typeof(obj.data.Legend.style['font-weight']) == 'undefined') obj.data.Legend.style['font-weight'] = 'normal';
 	     /* Center */
 	     if (typeof(obj.data.center) == 'undefined') obj.data.center = {};
 	     if (typeof(obj.data.center['x']) == 'undefined') obj.data.center['x'] = $("#" + obj.data.placeholder).width() / 2;
 	     if (typeof(obj.data.center['y']) == 'undefined') obj.data.center['y'] = $("#" + obj.data.placeholder).height() / 2;
 	     /* Radius */
 	     if (typeof(obj.data.radius) == 'undefined') obj.data.radius = 100;
 	     /* Border */
 	     if (typeof(obj.data['border-color']) == 'undefined') obj.data['border-color'] = '#fff';


 	     /* Dynamic center*/
 	     if (obj.data.center.dynamic == true) {
 	       obj.data.center['x'] = $("#" + obj.data.placeholder).width() / 2;
 	       obj.data.center['y'] = $("#" + obj.data.placeholder).height() / 2;
 	     }
 	     if (obj.data.data == "") {
 	       document.getElementById(data.placeholder).innerHTML = "No Data Available";
 	       return;
 	     }
 	     var INPUTData = obj.data;

 	     /* Title */
 	     var drawTitle = r.text(INPUTData.title.x, INPUTData.title.y, INPUTData.title.name).attr(INPUTData.title.style);

 	     /* Calculating Sector Values */
 	     var valSum = 0;
 	     INPUTData.data.map(function(s) {
 	       valSum += s[1];
 	     });

 	     var dataArray = INPUTData.data,
 	       prevAngle = 0,
 	       prevAnim = 0,
 	       animDelay = 0,
 	       cx = INPUTData.center.x * 1,
 	       cy = INPUTData.center.y * 1,
 	       sectors = [],
 	       p = INPUTData,
 	       sideCount = 0;

 	     for (var i = 0; i < dataArray.length; i++) {
 	       var fraction = (dataArray[i][1] * 1 / valSum),
 	         thisAngle = fraction * 360,
 	         thisAnim = fraction * INPUTData.animation.duration * 1;

 	       /* Fix for one full angle */
 	       thisAngle = (thisAngle == 360) ? 359.99 : thisAngle;
 	       var calculatedAngle = (prevAngle + thisAngle);
 	       sectors[i] = r.path().attr({
 	         arc: [cx, cy, 0, p.radius, prevAngle, prevAngle],
 	         'stroke': p['border-color'],
 	         fill: get_random_color(),
 	         'stroke-width': 0
 	       });

 	       /* Animate */
 	       if (INPUTData.animation.activate) {

 	         sectors[i] = r.path().attr({
 	           arc: [cx, cy, 0, p.radius, prevAngle, prevAngle],
 	           'stroke': p['border-color'],
 	           fill: get_random_color(),
 	           'stroke-width': 0
 	         });

 	         sectors[i].animate(Raphael.animation({
 	           arc: [cx, cy, 0, p.radius, prevAngle, calculatedAngle],
 	           'stroke-width': 1
 	         }, thisAnim).delay(animDelay));
 	       } else {
 	         sectors[i] = r.path().attr({
 	           arc: [cx, cy, 0, p.radius, prevAngle, calculatedAngle],
 	           'stroke': p['border-color'],
 	           fill: get_random_color(),
 	           'stroke-width': 1
 	         });

 	       }

 	       sectors[i]['name'] = INPUTData.data[i][0];
 	       sectors[i]['value'] = INPUTData.data[i][1].toFixed(2);
 	       sectors[i]['sAngle'] = prevAngle,
 	       sectors[i]['eAngle'] = calculatedAngle;

 	       var hovertext, hoverbox;
 	       /* Function when mouse hovers in */    
 	       var hoverin = function(event) {

 	         var mouseX = event.pageX - $("#" + INPUTData.placeholder).offset().left,
 	           mouseY = event.pageY - $("#" + INPUTData.placeholder).offset().top;
 	         if (hovertext) hovertext.remove();
 	         if (hoverbox) hoverbox.remove();

 	         hovertext = r.text(mouseX + 13, mouseY + 9, this.name + " : " + this.value + "%").attr({
 	           "font-size": 15,
 	           "text-anchor": "start"
 	         });

 	         var boxWidth = hovertext.getBBox().width,
 	           boxHeight = hovertext.getBBox().height;
 	         hoverbox = r.rect(mouseX + 10, mouseY, boxWidth + 7, boxHeight + 3).attr({
 	           fill: '#FFF',
 	           stroke: '#3b4449',
 	           'stroke-width': 2,
 	           'stroke-linejoin': 'round',
 	           'fill-opacity': 1
 	         });
 	         hovertext.toFront();
 	         this.animate(Raphael.animation({
 	           arc: [cx, cy, 0, p.radius * (1.1), this.sAngle, this.eAngle]
 	         }, 200));
 	       }

 	       /* Function when mouse hovers out */
 	       var hoverout = function() {
 	         if (hovertext) hovertext.remove();
 	         if (hoverbox) hoverbox.remove();

 	         this.animate(Raphael.animation({
 	           arc: [cx, cy, 0, p.radius, this.sAngle, this.eAngle]
 	         }, 200));
 	       }

 	       sectors[i].hover(hoverin, hoverout);
 	       pieSet.push(sectors[i]);
 	       animDelay += thisAnim;
 	       if (prevAngle + ((calculatedAngle - prevAngle) / 2) < 180) sideCount++;
 	       prevAngle = calculatedAngle;
 	     }

 	     function filter_legends(start, end) {
 	       var sorted_value_list = [];
 	       var sorted_index_list = [];
 	       var index_val_dict = {};
 	       for (var k = start; k < end; k++) {
 	         index_val_dict[k] = sectors[k].value;
 	       }
 	       var keys = [];
 	       for (var key in index_val_dict) keys.push(key);
 	       return keys.sort(function(a, b) {
 	         return index_val_dict[b] * 1 - index_val_dict[a] * 1
 	       }).slice(0, max_points)
 	     }

 	     function draw_legends(i, sideCount, sign, max_y, filter_list) {

 	       var markers = [];
 	       for (i; i <= sideCount; i++) {
 	         if (filter_list.indexOf(i.toString()) != -1) {
 	           sAngle = R(sectors[i].sAngle),
 	           eAngle = R(sectors[i].eAngle),
 	           mycos = Math.cos(sAngle + ((eAngle - sAngle) / 2))
 	           mysin = Math.sin(sAngle + ((eAngle - sAngle) / 2))
 	           org_xC = cx + (p.radius) * mysin,
 	           org_yC = cy - (p.radius) * mycos,
 	           x1 = cx + (p.radius + 50) * mysin,
 	           y1 = cy - (p.radius + 50) * mycos;
 	           if (Math.abs(y1 - prev_y1) >= inc && Math.abs(max_y - y1 - 1) > sizeText * (sideCount - i) && ((y1 > prev_y1 && sign == 1) || (y1 < prev_y1 && sign == -1))) {
 	             prev_y1 = y1;
 	             markers[i] = r.path([
 	               ["M", org_xC, org_yC],
 	               ["L", x1, y1]
 	             ]);
 	             INPUTData.Legend.style.fill = sectors[i].attrs.fill;
 	             Rlegend.push(r.text(x1, y1, INPUTData.data[i][0]).attr(INPUTData.Legend.style));
 	           } else if (Math.abs(max_y - (prev_y1 + inc)) > sizeText * (sideCount - i - 1)) {
 	             y1 = prev_y1 + sign * inc;
 	             prev_y1 = y1;
 	             x1 = cx + sign * Math.sqrt(Math.abs(Math.pow(p.radius + 50, 2) - (Math.pow(cy - y1, 2))));
 	             xC2 = cx + (p.radius + cur1) * mysin,
 	             yC2 = cy - (p.radius + cur1) * mycos,
 	             x2 = cx + (p.radius + cur2) * mysin,
 	             y2 = cy - (p.radius + cur2) * mycos;
 	             markers[i] = r.path([
 	               ["M", org_xC, org_yC],
 	               ["C", xC2, yC2, x2, y2, x1, y1]
 	             ])
 	             INPUTData.Legend.style.fill = sectors[i].attrs.fill;
 	             Rlegend.push(r.text(x1, y1, INPUTData.data[i][0]).attr(INPUTData.Legend.style));
 	           } else {
 	             for (var j = i; j < sideCount; j++) {
 	               if (filter_list.indexOf(j.toString()) != -1) {
 	                 sAngle = R(sectors[j].sAngle),
 	                 eAngle = R(sectors[j].eAngle),
 	                 mycos = Math.cos(sAngle + ((eAngle - sAngle) / 2))
 	                 mysin = Math.sin(sAngle + ((eAngle - sAngle) / 2))
 	                 org_xC = cx + (p.radius) * mysin,
 	                 org_yC = cy - (p.radius) * mycos,
 	                 y1 = prev_y1 + sign * inc;
 	                 prev_y1 = y1;
 	                 x1 = cx + sign * Math.sqrt(Math.abs(Math.pow(p.radius + 50, 2) - Math.pow(cy - y1, 2)));
 	                 xC2 = cx + (p.radius + cur1) * mysin,
 	                 yC2 = cy - (p.radius + cur1) * mycos,
 	                 x2 = cx + (p.radius + cur2) * mysin,
 	                 y2 = cy - (p.radius + cur2) * mycos;
 	                 markers[j] = r.path([
 	                   ["M", org_xC, org_yC],
 	                   ["C", xC2, yC2, x2, y2, x1, y1]
 	                 ]);
 	                 INPUTData.Legend.style.fill = sectors[j].attrs.fill;
 	                 Rlegend.push(r.text(x1, y1, INPUTData.data[j][0]).attr(INPUTData.Legend.style));
 	                 markerSet.push(markers[j]);
 	               }
 	             }
 	             i = sideCount;
 	           }
 	           markerSet.push(markers[i]);
 	         }
 	       }
 	     }
 	     /* Legend */
 	     if (INPUTData.Legend) {
 	       var xposLegend = cx + p.radius + 50,
 	         sizeText = INPUTData.Legend.style['font-size'],
 	         inc = sizeText * 1.2,
 	         dataLength = INPUTData.data.length;
 	       INPUTData.Legend.style['text-anchor'] = 'start';

 	       var min_y = cy - (p.radius + 50);
 	       var max_y = cy + (p.radius + 50);

 	       min_y = (min_y < 0) ? 0 : min_y;
 	       max_y = (max_y > $("#" + obj.data.placeholder).height()) ? $("#" + obj.data.placeholder).height() : max_y;
 	       var cur2 = (cy - min_y - p.radius);
 	       var cur1 = cur2 / 2;
 	       /* Calculated Maximum no. of points on either side */
 	       max_points = (max_y - min_y) / (inc + sizeText) - 1; 
 	       /* Right Side */     
 	       prev_y1 = min_y;
 	       var filter_list = filter_legends(0, sideCount);
 	       draw_legends(0, sideCount, 1, max_y, filter_list);
 	       /* Left Side */
 	       prev_y1 = max_y;
 	       INPUTData.Legend.style['text-anchor'] = 'end';
 	       filter_list = filter_legends(sideCount, INPUTData.data.length);
 	       draw_legends(sideCount, INPUTData.data.length - 1, -1, min_y, filter_list);
 	     }
 	   }
 	 }
