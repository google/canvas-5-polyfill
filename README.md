# Canvas 5 Polyfill

Canvas 5 Polyfill is a Javascript polyfill library to fill in new features for HTML 5
Canvas that browsers may not have implemented yet, such as Path2D objects and
ellipse() on CanvasRenderingContext2D.

## Installation

Canvas 5 Polyfill uses [Bower](http://bower.io/) to make installation easy:

```
    bower install --save canvas-5-polyfill
```

You can also get the code directly at [GitHub](https://github.com/google/canvas-5-polyfill).

## Usage

    <html>
    <head>
        <title>Test Canvas Polyfill</title>
        <script
          src='bower_components/canvas-5-polyfill/canvas.js'
          type='text/javascript'></script>
    </head>
    <body>
      <canvas id=ID width=500 height=500>
      <script type='text/javascript' charset='utf-8'>
        var ctx = document.getElementById('ID').getContext('2d');
        var p = new Path2D();
        p.moveTo(100, 10);
        p.lineTo(10, 100);

        ctx.strokeStyle = '#555';
        ctx.lineWidth = 10;
        ctx.stroke(p);
      </script>
    </body>
    </html>

## Status

Canvas 5 Polyfill adds the following classes and methods to an existing HTML
Canvas implementation if they are missing, if they are not missing the native
implementations are used:

The polyfill adds the following methods to CanvasRenderingContext2D:

    void stroke(Path2D path);
    void fill(Path2D path, optional CanvasFillRule fillRule = "nonzero");
    void clip(Path2D path, optional CanvasFillRule fillRule = "nonzero");
    boolean isPointInPath(Path2D path,  double x,
        double y, optional CanvasFillRule fillRule = "nonzero");
    boolean isPointInStroke(Path2D path,  double x, double y);
    void ellipse( double x, double y, double radiusX, double radiusY,
      double rotation, double startAngle, double endAngle,
      optional boolean anticlockwise = false);

It also adds Path2D with the following constructors:

    Path2D()
    Path2D(Path2D path, optional CanvasFillRule fillRule = "nonzero"),
    Path2D(DOMString d)

Where Path2D has the following methods:

    void addPath(Path2D path, SVGMatrix? transformation);
    void closePath();
    void moveTo(double x,  double y);
    void lineTo(double x,  double y);
    void quadraticCurveTo( double cpx, double cpy, double x, double y);
    void bezierCurveTo( double cp1x, double cp1y, double cp2x, double cp2y,
      double x,  double y);
    void arcTo(double x1, double y1, double x2, double y2, double radius);
    void arcTo(double x1, double y1, double x2, double y2, double radiusX,
      double radiusY,  double rotation);
    void rect(double x, double y, double w, double h);
    void arc(double x, double y, double radius, double startAngle,
      double endAngle, optional boolean anticlockwise = false);
    void ellipse(double x, double y, double radiusX, double radiusY,
      double rotation, double startAngle, double endAngle,
      optional boolean anticlockwise = false);

## Caveats

With this polyfill installed, the calls to context.clip(path),
context.isPointInPath(path, x, y) and context.isPointInStroke(path, x, y)
all affect the current path.

When using the polyfill the best approach is to move strictly to using
Path2D objects to describe paths and then use the path enabled calls
on the context, such as ctx.fill(path). Do not mix and match such calls.
