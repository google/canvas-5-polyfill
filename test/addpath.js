describe('AddPath Test Suite.',
  function() {
    beforeEach(function() { });
    afterEach(function() { });

    it('should add paths w/o transform.', function() {
      var path = new Path2D();
      var toadd = new Path2D();
      toadd.rect(0, 0, 100, 100);

      path.addPath(toadd);
      assert.equal(path.ops_.length, 1);
      assert.equal(path.ops_[0].type, 'rect');
    });

    it('should add paths with transform.', function() {
      var path = new Path2D();
      var toadd = new Path2D();
      toadd.rect(0, 0, 100, 100);

      tr = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5
      };
      path.addPath(toadd, tr);
      assert.equal(path.ops_.length, 4);
      assert.equal(path.ops_[0].type, 'save');
      assert.equal(path.ops_[1].type, 'transform');
      assert.equal(path.ops_[1].args[1], 1);
      assert.equal(path.ops_[1].args[5], 5);
      assert.equal(path.ops_[2].type, 'rect');
      assert.equal(path.ops_[3].type, 'restore');
    });
  }
);

