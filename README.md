# Space8
2D SpaceWeb

>Simple library for SVG,HTML 2D space control. Programmer will now can jump directly into creating custom SVG/HTML digram without spending time worrying about space management for their graph.

No 2nd party dependencies

### Table Of Content
1. Getting Started
2. References
  * [Initialization](https://github.com/ManhQLe/Space8/blob/master/README.md#initialization)
  * Navigation
    0. [Span](https://github.com/ManhQLe/Space8/blob/master/README.md#span---move-viewport-an-amount-of-dxdy)
    1. [SpanTo](https://github.com/ManhQLe/Space8/blob/master/README.md#spanto---move-viewport-to-world-coordinate-xy)
    2. [Zoom](https://github.com/ManhQLe/Space8/blob/master/README.md#zoom---zoom-an-amount-of-ds-at-an-optional-pixel-position-xy)
    3. [ZoomTo](https://github.com/ManhQLe/Space8/blob/master/README.md#zoomto---set-zoom-level-to-s-at-an-optional-pixel-position-xy)
    4. [ZoomRect](https://github.com/ManhQLe/Space8/blob/master/README.md#zoomrect---fit-current-view-to-a-rectangle)
    5. [Center](https://github.com/ManhQLe/Space8/blob/master/README.md#center---set-viewport-such-that-a-point-is-at-viewports-center)
    6. [Size](https://github.com/ManhQLe/Space8/blob/master/README.md#size---set-size-of-the-canvas-in-pixel)
  * Transform
    1. [View2World](https://github.com/ManhQLe/Space8/blob/master/README.md#view2world---convert-a-pixel-point-to-world-point)
    2. [World2View](https://github.com/ManhQLe/Space8/blob/master/README.md#world2view---convert-a-world-point-to-pixel-point)
    3. [WorldScale](https://github.com/ManhQLe/Space8/blob/master/README.md#worldscale---convert-a-length-in-pixel-to-world-length)
    4. [WorldScaleV](https://github.com/ManhQLe/Space8/blob/master/README.md#worldscalev---convert-pair-of-lengths-in-pixel-to-world-length-vector)
    5. [ViewScale](https://github.com/ManhQLe/Space8/blob/master/README.md#viewscale---convert-a-length-in-world-to-pixel-length)
    6. [ViewScaleV](https://github.com/ManhQLe/Space8/blob/master/README.md#viewscalev---convert-a-pair-of-length-vector-to-pixel-length-vector)
    
### Getting Started
>Demo is [here](http://8thdensity.com/Demo/Space8/Space.html)

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Space8</title>
    <script src="/Resources/Tools/Ctrl8.js"></script>
    <script src="/Resources/Tools/Space8/Space8.js"></script>
    <script src="/Resources/JS/jquery-2.1.3.min.js"></script>
    <script src="/Resources/JS/jquery.mobile.min.js"></script>
    <script src="/Resources/JS/d3.v3.min.js"></script>
    <style type="text/css">
        body {
            padding:0;
            margin:0;
            overflow:hidden;
        }
    </style>
</head>
<body>

    <svg id="CANVAS" style="background-color:white">
        <circle r="30" fill="#3498db" />
    </svg>
    <script>
        var G = new Svg8("#CANVAS");



        function Resize(){
            G.SetSize([window.innerWidth,window.innerHeight]);    
        }
        window.onresize = Resize;
        Resize();
        G.Center([0,0]) // Center our canvas at point 0,0

        d3.select(G.SPACE).append("circle") // Orange Circle
        .attr({
            "cx": -100,
            "cy": -150,
            "r": 45,
            "fill": "#e67e22",
            "stroke": "#ecf0f1",
            "stroke-width": "8px"
        })

        d3.select(G.SPACE).append("rect") //Red regtangle
        .attr({
            "x": -200,
            "y": 200,
            "width": 80,
            "height": 80,
            "fill": "#e74c3c",
            "stroke": "#bdc3c7",
            "stroke-width":"5px"
        })

        //Optional Interactivity

        function MouseXY(dom, e) {
            var b = dom.getBoundingClientRect();
            return [e.pageX - b.left, e.pageY - b.top];
        }

        function SpanEnable(dom, fx) {
            var m1;
            var move = false;
            $(dom).on("vmousedown", function (e) {
                move = true;
                m1 = MouseXY(this, e);
            })

            $(dom).on("vmousemove", function (e) {
                if (move) {
                    var m2 = MouseXY(dom, e);
                    fx.apply(dom, [e, {
                        "dx": m2[0] - m1[0],
                        "dy": m2[1] - m1[1],
                        "m1": [m1[0], m1[1]],
                        "m2": [m2[0], m2[1]]
                    }]);
                    m1 = m2;
                }
                e.stopPropagation();
                e.preventDefault();
            })

            $(dom).on('vmouseup', function (e) {
                move = false;
            });
        }


        SpanEnable(document.getElementById("CANVAS"), function (e, m) {
            G.Span(-m.dx, -m.dy, 1);
        });
    </script>
</body>
</html>
```
### References
#### Initialization
>Properties of canvas can be initialized either inline or with javascript

```html
 <svg id="CANVAS" style="background-color:white" init="{ZoomScale:0.8,VPSize:[800,600],VPPos=[-400,-300]}">
        <circle r="30" fill="#3498db" />
 </svg>
```
```javascript
/*
 Default Value
 ZoomScale:1 - Zoom Level
 VPSize:[800,800] - Canvas Size
 VPPos:[0,0] - Viewport Position
*/

var G = new Svg8("#CANVAS",{ZoomScale:0.5,VPSize:[800,600],VPPos=[-400,-300]})
```

#### Navigation
##### [Span](#NAV-Span) - Move viewport an amount of dx,dy
```javascript
Space8.prototype.SpanTo(dx,dy,isPixel)
/*
   dx: Number
   dy: Number
   isPixel: Boolean - Indication if x and y are measurement in pixel
*/
```

##### [SpanTo](#NAV-Span) - Move viewport to world coordinate x,y
```javascript
Space8.prototype.Span(x,y)
/*
   x: Number
   y: Number   
*/
```

##### [Zoom](#NAV-Zoom) - Zoom an amount of ds at an optional Pixel position [x,y]
```javascript
Space8.prototype.SpanTo(ds,AtPixels)
/*
   ds: Number. eg. 0.5
   AtPixels: Array [x,y]   
*/
G.Zoom(.05,[100,100]) // Zoom in an amount of 0.05 at pixel [100,100]
G.Zoom(-0.1,[200,200]) //Zoom out an amount of 0.1 at pixel [200,200]
```

##### [ZoomTo](#NAV-ZoomTo) - Set Zoom level to s at an optional Pixel position [x,y]
```javascript
Space8.prototype.ZoomTo(s,AtPixels)
/*
   s: Number. eg. 1.5
   AtPixels: Array [x,y]   
*/
G.ZoomTo(1.5,[100,100]) // Set Zoom Level to 1.5 at pixel [100,100]

```

##### [ZoomRect](#NAV-ZoomRect) - Fit current view to a rectangle
```javascript
Space8.prototype.ZoomRect(x1,y1,x2,y2,isPixel)
/*
   x1,y1,x2,y2: Number -  Positions
   isPixel: Boolean - Indication the positions are in pixel
*/
G.ZoomRect(-100,-100,200,200) // Fit viewport to this rectangle which has LeftTop (-100,-100) and RightBottom(200,200)
```

##### [Center](#NAV-Center) - Set viewport such that a point is at viewport's center
```javascript
Space8.prototype.Center(at)
/*
   at: Array[x,y] World position
*/
G.Center([100,100]) // Set the viewport such that 100,100 at the center of the viewport.
```

##### [Size](#NAV-Size) - Set size of the canvas in Pixel
```javascript
Space8.prototype.Size(size)
/*
  Size: Array[W,H] - Size in pixel
*/
G.SetSize([500,300]) // Set canvas size to 500 in Width and 300 in Height
```

#### Transform - For Computation
##### [View2World](#TRANS-V2W) - Convert a pixel point to world point
```javascript
Space8.prototype.View2World(Pixels) - Return Array[X,Y]
/*
  Pixel: Array[X,Y]
*/
var WorldPoint = G.View2World([35,80]) 
```
##### [World2View](#TRANS-W2V) - Convert a world point to pixel point
```javascript
Space8.prototype.World2View(WorldPoint) - Return Array[X,Y]
/*
  WorldPoint: Array[X,Y]
*/
var Pixels = G.View2World([-2.60,300.05]) 
```
##### [WorldScale](#TRANS-WS) - Convert a length in pixel to world length
```javascript
Space8.prototype.WorldScale(Len)
/*
  Len: Number
*/
var WorldLen = G.WorldScale(20) //Convert 20 unit in pixel length to world len
```
##### [WorldScaleV](#TRANS-WSV) - Convert pair of lengths in pixel to world length vector
```javascript
Space8.prototype.WorldScaleV(PV) - Return Array[V1,V2]
/*
  PV: Array[V1,V2]
*/
var WorldVec = G.WorldScaleV([20,20]) //Convert Vector 20,20 in Pixel to World Vector
```

##### [ViewScale](#TRANS-VS) - Convert a length in world to pixel length
```javascript
Space8.prototype.ViewScale(Len)
/*
  Len: Number
*/
var PixelLen = G.ViewScale(20.06) - Convert 20.06 in World to Pixel
```

##### [ViewScaleV](#TRANS-VSV) - Convert a pair of length vector to pixel length vector
```javascript
Space8.prototype.ViewScaleV(WV) - Return Array[V1,V2]
/*
  WV: Array[V1,V2]
*/
var V = G.ViewScaleV([30.06,25.1]) // Convert 30.06 in X aned 25.1 in Y to Pixel Measurements
```

#### Author
Manh Le

#### Contribution
Welcome

#### License
It is free to use on any project, any type of project. Have fun :)
