describe('isPointInPath Test Suite',
  function() {
    beforeEach(function() { });
    afterEach(function() { });

    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    it('Testing default isPointInPath', function() {
      ctx.beginPath();
      ctx.rect(0, 0, 100, 100);
      ctx.rect(25, 25, 50, 50);
      assert.isTrue(ctx.isPointInPath(50, 50));
    });

    it('Testing nonzero isPointInPath', function() {
      ctx.beginPath();
      ctx.rect(0, 0, 100, 100);
      ctx.rect(25, 25, 50, 50);
      assert.isTrue(ctx.isPointInPath(50, 50, 'nonzero'));
    });

    it('Testing evenodd isPointInPath', function() {
      ctx.beginPath();
      ctx.rect(0, 0, 100, 100);
      ctx.rect(25, 25, 50, 50);
      assert.isFalse(ctx.isPointInPath(50, 50, 'evenodd'));
    });

    it('Testing Path2D default isPointInPath', function() {
      var path = new Path2D();
      path.rect(0, 0, 100, 100);
      path.rect(25, 25, 50, 50);
      assert.isTrue(ctx.isPointInPath(path, 50, 50));
    });

    it('Testing Path2D nonzero isPointInPath', function() {
      var path = new Path2D();
      path.rect(0, 0, 100, 100);
      path.rect(25, 25, 50, 50);
      assert.isTrue(ctx.isPointInPath(path, 50, 50, 'nonzero'));
    });

    it('Testing Path2D evenodd isPointInPath', function() {
      var path = new Path2D();
      path.rect(0, 0, 100, 100);
      path.rect(25, 25, 50, 50);
      assert.isFalse(ctx.isPointInPath(path, 50, 50, 'evenodd'));
    });

  }
);

