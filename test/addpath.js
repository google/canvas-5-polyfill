describe('AddPath Test Suite.',
  function() {
    beforeEach(function() { });
    afterEach(function() { });

    it('should add paths w/o transform.', function() {
      var path = new Path2D();
      if (path.ops_ == undefined) {
        // Don't bother testing a native Path2D impl.
        return
      }
      var toadd = new Path2D();
      toadd.rect(0, 0, 100, 100);

      path.addPath(toadd);
      assert.equal(path.ops_.length, 1);
      assert.equal(path.ops_[0].type, 'rect');
    });

    it('should add paths with transform.', function() {
      var path = new Path2D();
      if (path.ops_ == undefined) {
        // Don't bother testing a native Path2D impl.
        return
      }
      var toadd = new Path2D();
      toadd.rect(0, 0, 100, 100);

      var tr = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
      tr.a = 0;
      tr.b = 1;
      tr.c = 2;
      tr.d = 3;
      tr.e = 4;
      tr.f = 5;
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

