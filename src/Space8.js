/// <reference path="Ctrl8.js" />
function Space8(init) {
    Space8.baseConstructor.call(this, init);
    this.Prop("VPPos", [0, 0]);
    this.Prop("ZoomScale", 1);
    this.Prop("VPSize", [800, 800]);    
}

WebCtrl8.ExtendsTo(Space8);

Space8.Util = {
    EnableSpan: function (dom, fx) {
        var m1;
        dom.addEventListener("mousemove", function (e) {
            e = window.event || e;
            if (e.buttons == 1) {
                var m2 = Space8.Util.MouseXY(dom, e);
                fx.apply(dom, [e, {
                    "dx": m2[0] - m1[0],
                    "dy": m2[1] - m1[1],
                    "m1": [m1[0], m1[1]],
                    "m2": [m2[0], m2[1]]
                }]);
                m1 = m2;
            }
            else
                m1 = Space8.Util.MouseXY(dom, e);
            e.stopPropagation();
            e.preventDefault();
        })
    },
    MouseXY: function (dom, e) {
        var b = dom.getBoundingClientRect();
        return [e.clientX - b.left, e.clientY - b.top];
    }
}

Space8.prototype.SpanTo = function (x, y) {
    this.VPPos[0] = x;
    this.VPPos[1] = y;
    this.UpdateTransform();
}

Space8.prototype.UpdateTransform = function () {
}

Space8.prototype.Span = function (dx, dy, pixcoord) {
    pixcoord ? (dx = this.WorldScale(dx), dy = this.WorldScale(dy)) : 1;
    var x = this.VPPos[0] + dx;
    var y = this.VPPos[1] + dy;
    this.SpanTo(x, y);
}

Space8.prototype.ZoomTo = function (s, AtPixels) {
    var wp, Pixels;

    if (AtPixels)
        wp = this.View2World(AtPixels);
    this.ZoomScale = s <= 1e-8 ? 1 : s;
    if (wp) {
        Pixels = this.World2View(wp);
        var DX = this.WorldScaleV([Pixels[0] - AtPixels[0], Pixels[1] - AtPixels[1]]);
        this.VPPos[0] += DX[0];
        this.VPPos[1] += DX[1];
    }
    this.UpdateTransform();
}

Space8.prototype.ZoomRect = function (x1, y1, x2, y2, pixel) {
    var temp
    x1 > x2 ? (temp = x1, x1 = x2, x2 = temp) : 0;
    y1 > y2 ? (temp = y1, y1 = y2, y2 = temp) : 0;
    var dim = [x2 - x1, y2 - y1], wp = [x1, y1];
    if (pixel) {
        wp = this.View2World([x1, y1]);
        dim = this.WorldScaleV(dim)
    }

    var Size = this.WorldScaleV(this.VPSize);
    var scale;
    if (dim[0] > dim[1])
        scale = Size[0] / dim[0];
    else
        scale = Size[1] / dim[1];


    this.ZoomScale = scale;
    this.VPPos[0] = wp[0];

    this.VPPos[1] = wp[1];
    this.UpdateTransform();
}

Space8.prototype.Center = function (at) {
    var dx = at[0] - (this.VPPos[0] + this.VPSize[0] * .5);
    var dy = at[1] - (this.VPPos[1] + this.VPSize[1] * .5);
    this.Span(dx / this.ZoomScale, dy / this.ZoomScale);
}

Space8.prototype.Zoom = function (ds, AtPixels) {
    var s = this.ZoomScale + ds;
    this.ZoomTo(s, AtPixels);
}

Space8.prototype.SetSize = function (size) {
    this.VPSize = size;
    this.UpdateTransform();
}

Space8.prototype.WorldScale = function (dl) {
    return dl / this.ZoomScale;
}

Space8.prototype.WorldScaleV = function (DL) {
    var s = 1 / this.ZoomScale;
    return [DL[0] * s, DL[1] * s];
}

Space8.prototype.ViewScale = function (dp) {
    return dp * this.ZoomScale;
}

Space8.prototype.ViewScaleV = function (dpv) {
    return [dpv[0] * this.ZoomScale, dpv[1] * this.ZoomScale];
}

Space8.prototype.World2View = function (p) {
    var y = (p[1] - this.VPPos[1]) * this.ZoomScale
    return [(p[0] - this.VPPos[0]) * this.ZoomScale, this.Cartesian ? this.VPSize[1] - y : y];
}

Space8.prototype.View2World = function (p) {
    return [p[0] / this.ZoomScale + this.VPPos[0], (this.Cartesian ? (this.VPSize[1] - p[1]) : p[1]) / this.ZoomScale + this.VPPos[1]];
}

function Html8(c, init) {
    Html8.baseConstructor.call(this, c, init);
}

Space8.ExtendsTo(Html8);

Html8.prototype.SetupCanvas = function () {
    this.DOM.style["overflow"] = "hidden";

    this.SPACE = document.createElement("div");
    this.SPACE.setAttribute("space8", "");
    this.SPACE.style["position"] = "relative";
    this.SPACE.style["transform-origin"] = "left top"

    var DesignedElements = this.DOM.childNodes;
    while (DesignedElements.length) {
        this.SPACE.appendChild(DesignedElements[0]);
    }
    this.DOM.appendChild(this.SPACE);   
}

Html8.prototype.Center = function (at) {
    var dx = at[0] - (this.VPPos[0] + this.VPSize[0] * .5);
    var dy = at[1] - (this.VPPos[1] + this.VPSize[1] * .5);
    this.Span(dx / this.ZoomScale, dy / this.ZoomScale);
}

Html8.prototype.UpdateTransform = function () {
    var Y = this.Cartesian ? -1 : 1;
    var DY = this.Cartesian ? this.VPSize[1] : 0;
    this.SPACE.style["transform"] =
    "translate(" + (-this.VPPos[0] * this.ZoomScale) + "px," + (-this.VPPos[1] * this.ZoomScale) + "px)" +
    "scale(" + this.ZoomScale + "," + Y * this.ZoomScale + ")"
    this.DOM.style["width"] = this.VPSize[0] + "px";
    this.DOM.style["height"] = this.VPSize[1] + "px";
}

function Svg8(init) {
    Svg8.baseConstructor.call(this, init);
    this.SetupCanvas();
}

Space8.ExtendsTo(Svg8);

Svg8.prototype.SetupCanvas = function () {
    var DOM = typeof this.DOM == 'string' ? document.querySelector(this.DOM) : this.DOM;
    DOM.setAttribute("preserveAspectRatio", "xMinYMin slice");
    this.UpdateTransform();
}

Svg8.prototype.UpdateTransform = function () {
    var Transform = [
        this.VPPos[0],
        this.Cartesian ? (-this.VPPos[1] - this.VPSize[1] / this.ZoomScale) : this.VPPos[1],
        this.VPSize[0] / this.ZoomScale,
        this.VPSize[1] / this.ZoomScale
    ];
    var DOM = typeof this.DOM == 'string' ? document.querySelector(this.DOM) : this.DOM;
    DOM.setAttribute("viewBox", Transform.join(" "));
    DOM.style["width"] = this.VPSize[0] + "px";
    DOM.style["height"] = this.VPSize[1] + "px";
}
