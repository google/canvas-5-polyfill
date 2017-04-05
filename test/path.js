describe('Path constructors.',
  function() {
    beforeEach(function() { });
    afterEach(function() { });

    it('Path copy constructor.', function() {
      var path = new Path2D();
      if (path.ops_ == undefined) {
        // Don't bother testing a native Path2D impl.
        return
      }
      path.rect(0, 0, 100, 100);
      assert.equal(path.ops_[0].type, 'rect', 'Test the test.');

      var copy = new Path2D(path);
      assert.equal(copy.ops_.length, 1, 'List of operation should be copied.');
      assert.equal(copy.ops_[0].type, 'rect', 'Operations should be copied correctly.');
    });
  }
);

describe('Path simple methods.',
  function() {
    beforeEach(function() { });
    afterEach(function() { });

    it('Simple methods.', function() {
      var path = new Path2D();
      if (path.ops_ == undefined) {
        // Don't bother testing a native Path2D impl.
        return
      }
      path.rect(0, 1, 2, 3);
      assert.equal(path.ops_[0].type, 'rect');
      assert.equal(path.ops_[0].args[0], 0);
      assert.equal(path.ops_[0].args[1], 1);
      assert.equal(path.ops_[0].args[2], 2);
      assert.equal(path.ops_[0].args[3], 3);
    });

    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    it('All the simple methods.', function() {
      var path = new Path2D();
      path.moveTo(10, 10);
      path.lineTo(20, 20);
      path.quadraticCurveTo(30, 0, 40, 30);
      path.bezierCurveTo(40, 0, 50, 30, 60, 30);
      path.arcTo(110, 10, 110, 120, 5, 4, 0);
      path.ellipse(110, 130, 5, 5, Math.PI/2, 0, Math.PI, false);
      path.arc(80, 10, 0, Math.PI, false);
      path.rect(70, 10, 10, 10);
      path.closePath();
      ctx.strokeStyle = 'red';
      ctx.stroke(path);
    });
  }
);

