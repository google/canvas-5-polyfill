describe('Clip Test Suite',
  function() {
    beforeEach(function() { });
    afterEach(function() { });

    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    function checkResult(ctx, expectedColors, sigma) {
      for (var i = 0; i < 4; i++) {
        assert.closeTo(ctx.getImageData(50, 50, 1, 1).data[i], expectedColors[i], sigma);
      }
    }

    function drawRectanglesOn(contextOrPath) {
      contextOrPath.rect(0, 0, 100, 100);
      contextOrPath.rect(25, 25, 50, 50);
    }

    function formatName(fillRule, path) {
      return 'clip(' + (path ? 'path' : '') + (fillRule && path ? ', ' : '') + (fillRule ? '"' + fillRule + '"' : '') + ')';
    }

    function testClipWith(ctx, fillRule, path) {
      //console.log('Testing ' + formatName(fillRule, path));

      ctx.fillStyle = 'rgb(255,0,0)';
      ctx.beginPath();
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = 'rgb(0,255,0)';
      if (path) {
        if (fillRule) {
          ctx.clip(path, fillRule);
        } else {
          ctx.clip(path);
        }
      } else {
        ctx.beginPath();
        drawRectanglesOn(ctx);
        if (fillRule) {
          ctx.clip(fillRule);
        } else {
          ctx.clip();
        }
      }
      ctx.beginPath();
      ctx.fillRect(0, 0, 100, 100);
      if (fillRule == 'evenodd') {
        checkResult(ctx, [255, 0, 0, 255], 5);
      } else {
        checkResult(ctx, [0, 255, 0, 255], 5);
      }
    }

    it('Path2D Clip', function() {
      fillRules = [undefined, 'nonzero', 'evenodd'];
      var path = new Path2D();
      drawRectanglesOn(path);

      for (var i = 0; i < fillRules.length; i++) {
         testClipWith(ctx, fillRules[i], path);
         testClipWith(ctx, fillRules[i]);
      }
    });
  }
);

