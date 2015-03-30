/*!
 * g.Raphael 0.51 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009-2012 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
//chart prototype for storing common functions
Raphael.g = {
    /*\
     * g.shim
     [ object ]
     **
     * An attribute object that charts will set on all generated shims (shims being the invisible objects that mouse events are bound to)
     **
     > Default value
     | { stroke: 'none', fill: '#000', 'fill-opacity': 0 }
     \*/
    shim: { stroke: 'none', fill: '#000', 'fill-opacity': 0 },

    /*\
     * g.txtattr
     [ object ]
     **
     * An attribute object that charts and tooltips will set on any generated text
     **
     > Default value
     | { font: '12px Arial, sans-serif', fill: '#fff' }
     \*/  
    txtattr: { font: '12px Arial, sans-serif', fill: '#fff' },

    /*\
     * g.colors
     [ array ]
     **
     * An array of color values that charts will iterate through when drawing chart data values.
     **
     \*/
    colors: (function () {
            var hues = [.6, .2, .05, .1333, .75, 0],
                colors = [];

            for (var i = 0; i < 10; i++) {
                if (i < hues.length) {
                    colors.push('hsb(' + hues[i] + ',.75, .75)');
                } else {
                    colors.push('hsb(' + hues[i - hues.length] + ', 1, .5)');
                }
            }

            return colors;
    })(),
    
	//FIX ADDED BY SUPREET FOR SERIES BEING DRAWN OUT OF BOUNDS
	snapEnds: function(from, to, steps) {
     return {from: from, to: to, power: 0};       
	},
    
    axis: function (x, y, length, from, to, steps, orientation, labels, type, dashsize, paper) {
        dashsize = dashsize == null ? 2 : dashsize;
        type = type || "t";
        steps = steps || 10;
        paper = arguments[arguments.length-1] //paper is always last argument

        var path = type == "|" || type == " " ? ["M", x + .5, y, "l", 0, .001] : orientation == 1 || orientation == 3 ? ["M", x + .5, y, "l", 0, -length] : ["M", x, y + .5, "l", length, 0],
            ends = this.snapEnds(from, to, steps),
            f = ends.from,
            t = ends.to,
            i = ends.power,
            j = 0,
            txtattr = { font: "11px 'Fontin Sans', Fontin-Sans, sans-serif" },
            text = paper.set(),
            d;

        d = (t - f) / steps;

        var label = f,
            rnd = i > 0 ? i : 0;
            dx = length / steps;

        if (+orientation == 1 || +orientation == 3) {
            var Y = y,
                addon = (orientation - 1 ? 1 : -1) * (dashsize + 3 + !!(orientation - 1));

            while (Y >= y - length) {
                type != "-" && type != " " && (path = path.concat(["M", x - (type == "+" || type == "|" ? dashsize : !(orientation - 1) * dashsize * 2), Y + .5, "l", dashsize * 2 + 1, 0]));
                text.push(paper.text(x + addon, Y, (labels && labels[j++]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(txtattr).attr({ "text-anchor": orientation - 1 ? "start" : "end" }));
                label += d;
                Y -= dx;
            }

            if (Math.round(Y + dx - (y - length))) {
                type != "-" && type != " " && (path = path.concat(["M", x - (type == "+" || type == "|" ? dashsize : !(orientation - 1) * dashsize * 2), y - length + .5, "l", dashsize * 2 + 1, 0]));
                text.push(paper.text(x + addon, y - length, (labels && labels[j]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(txtattr).attr({ "text-anchor": orientation - 1 ? "start" : "end" }));
            }
        } else {
            label = f;
            rnd = (i > 0) * i;
            addon = (orientation ? -1 : 1) * (dashsize + 9 + !orientation);

            var X = x,
                dx = length / steps,
                txt = 0,
                prev = 0;

            while (X <= x + length) {
                type != "-" && type != " " && (path = path.concat(["M", X + .5, y - (type == "+" ? dashsize : !!orientation * dashsize * 2), "l", 0, dashsize * 2 + 1]));
                text.push(txt = paper.text(X, y + addon, (labels && labels[j++]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(txtattr));

                var bb = txt.getBBox();

                if (prev >= bb.x - 5) {
                    text.pop(text.length - 1).remove();
                } else {
                    prev = bb.x + bb.width;
                }

                label += d;
                X += dx;
            }

            if (Math.round(X - dx - x - length)) {
                type != "-" && type != " " && (path = path.concat(["M", x + length + .5, y - (type == "+" ? dashsize : !!orientation * dashsize * 2), "l", 0, dashsize * 2 + 1]));
                text.push(paper.text(x + length, y + addon, (labels && labels[j]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(txtattr));
            }
        }

        var res = paper.path(path);

        res.text = text;
        res.all = paper.set([res, text]);
        res.remove = function () {
            this.text.remove();
            this.constructor.prototype.remove.call(this);
        };

        return res;
    },
    
    labelise: function(label, val, total) {
        if (label) {
            return (label + "").replace(/(##+(?:\.#+)?)|(%%+(?:\.%+)?)/g, function (all, value, percent) {
                if (value) {
                    return (+val).toFixed(value.replace(/^#+\.?/g, "").length);
                }
                if (percent) {
                    return (val * 100 / total).toFixed(percent.replace(/^%+\.?/g, "").length) + "%";
                }
            });
        } else {
            return (+val).toFixed(0);
        }
    }
}
