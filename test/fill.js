describe('Fill Test Suite',
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

    function formatName(path) {
      return 'fill(' + (path ? 'path' : '') + ')';
    }

    function drawRectanglesOn(contextOrPath) {
      contextOrPath.rect(0, 0, 100, 100);
      contextOrPath.rect(25, 25, 50, 50);
    }

    function formatName(fillRule, path) {
      return 'fill(' + (path ? 'path' : '') + (fillRule && path ? ', ' : '') + (fillRule ? '"' + fillRule + '"' : '') + ')';
    }

    function testFillWith(ctx, fillRule, path) {
      //console.log('Testing ' + formatName(fillRule, path));
      ctx.fillStyle = 'rgb(255,0,0)';
      ctx.beginPath();
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = 'rgb(0,255,0)';
      if (path) {
        if (fillRule) {
          ctx.fill(path, fillRule);
        } else {
          ctx.fill(path);
        }
      } else {
        ctx.beginPath();
        drawRectanglesOn(ctx);
        if (fillRule) {
          ctx.fill(fillRule);
        } else {
          ctx.fill();
        }
      }
      if (fillRule == 'evenodd') {
        checkResult(ctx, [255, 0, 0, 255], 5);
      } else {
        checkResult(ctx, [0, 255, 0, 255], 5);
      }
    }

    it('Path Fill', function() {
      fillRules = [undefined, 'nonzero', 'evenodd'];
      var path = new Path2D();
      drawRectanglesOn(path);

      for (var i = 0; i < fillRules.length; i++) {
         testFillWith(ctx, fillRules[i], path);
         testFillWith(ctx, fillRules[i]);
      }
    });
  }
);

