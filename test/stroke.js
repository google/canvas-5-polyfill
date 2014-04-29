describe('Stroke Test suite',
  function() {
    beforeEach(function() { });
    afterEach(function() { });

    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    function shouldBeCloseTo(x, y, sigma) {
      assert(Math.abs(x - y) <= sigma, 'Values not close enough together.');
    }

    function checkResult(ctx, expectedColors, sigma) {
      for (var i = 0; i < 4; i++) {
        assert.closeTo(ctx.getImageData(75, 75, 1, 1).data[i], expectedColors[i], sigma);
      }
    }

    function drawRectangleOn(contextOrPath) {
      contextOrPath.rect(25, 25, 50, 50);
    }

    function formatName(path) {
      return 'stroke(' + (path ? 'path' : '') + ')';
    }

    function testStrokeWith(path) {
      //console.log('Testing ' + formatName(path));
      ctx.fillStyle = 'rgb(255,0,0)';
      ctx.beginPath();
      ctx.fillRect(0, 0, 100, 100);
      ctx.strokeStyle = 'rgb(0,255,0)';
      ctx.lineWidth = 5;
      if (path) {
        ctx.stroke(path);
      } else {
        ctx.beginPath();
        drawRectangleOn(ctx);
        ctx.stroke();
      }
      checkResult(ctx, [0, 255, 0, 255], 5);
    }

    it('Path Stroke', function() {
        var path = new Path2D();
        drawRectangleOn(path);

        testStrokeWith();
        testStrokeWith(path);
    });
  }
);

