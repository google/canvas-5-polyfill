describe('SVG Path Parser',
  function() {
    beforeEach(function() { });
    afterEach(function() { });

    function cmpCmd(ops, index, b) {
      a = ops[index];
      assert.equal(a.type, b.type, 'Operator #'  + index + ' names must match.');
      assert.equal(a.args.length, b.args.length, 'Argument length mismatch' + a.args.length + ' != ' +  b.args.length);
      for (var i=1; i < a.args.length; i++) {
        assert.closeTo(a.args[i], b.args[i], 1, 'Operator #'  + index + ' values must be close.');
      }
    }

    function radians(d) {
      return d*Math.PI/180;
    }

    it('should handle the empty string', function() {
        var p = parser.parse(' \t');
        assert.equal(p.length, 0);
    });

    it('should handle leading relative move', function() {
        var p = parser.parse('m100 200.0, 200 100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [300, 300]});
    });

    it('should handle leading relative move and any length', function() {
        var p = parser.parse('m100,200 200,100 -100,-100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [300, 300]});
        cmpCmd(p, 2, {type: 'lineTo', args: [200, 200]});
    });

    it('should handle move and list relative', function() {
        var p = parser.parse('m100 200 l 200 100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [300, 300]});
    });

    it('should handle move and list absolute', function() {
        var p = parser.parse('m100 200 L 200 100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [200, 100]});
    });

    it('should understand closePath', function() {
        var p = parser.parse('m100 200l 200 100l -100 -100z');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [300, 300]});
        cmpCmd(p, 2, {type: 'lineTo', args: [200, 200]});
        cmpCmd(p, 3, {type: 'closePath', args: []});
    });

    it('should handle relative horizontal line', function() {
        var p = parser.parse('M100 200 h 200');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [300, 200]});
    });

    it('should handle absolute horizontal line', function() {
        var p = parser.parse('M100 200 H 200');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [200, 200]});
    });

    it('should handle multiple horizontal line args', function() {
        var p = parser.parse('M100,200 H 300 400');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [300, 200]});
        cmpCmd(p, 2, {type: 'lineTo', args: [400, 200]});
    });

    it('should handle relative vertical line', function() {
        var p = parser.parse('M100 200 v 200');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [100, 400]});
    });

    it('should handle absolute vertical line', function() {
        var p = parser.parse('M100 300 V 200');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 300]});
        cmpCmd(p, 1, {type: 'lineTo', args: [100, 200]});
    });

    it('should handle multiple vertical line args', function() {
        var p = parser.parse('M100,200 V 300 400');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'lineTo', args: [100, 300]});
        cmpCmd(p, 2, {type: 'lineTo', args: [100, 400]});
    });

    it('should handle absolute curveto', function() {
        var p = parser.parse('M100,200 C 100,100 200,200, 300,100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'bezierCurveTo', args: [100, 100, 200, 200, 300, 100]});
    });

    it('should handle relative curveto', function() {
        var p = parser.parse('M100,200 c 200,200 400,400, 600,600');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'bezierCurveTo', args: [300, 400, 500, 600, 700, 800]});
    });

    it('should handle relative curveto multiple sets', function() {
        var p = parser.parse('M100,200 c 200,200 400,400, 600,600 100,100 200,200, 300,300');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'bezierCurveTo', args: [300, 400, 500, 600, 700, 800]});
        cmpCmd(p, 2, {type: 'bezierCurveTo', args: [800, 900, 900, 1000, 1000, 1100]});
    });

    it('should handle absolute curveto shorthand', function() {
        var p = parser.parse('M100,200 C 100,100 200,200, 100,300 S 300,100 300,300');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'bezierCurveTo', args: [100, 100, 200, 200, 100, 300]});
        cmpCmd(p, 2, {type: 'bezierCurveTo', args: [  0, 400, 300, 100, 300, 300]});
    });

    it('should handle absolute curveto shorthand multiple sets', function() {
        var p = parser.parse('M100,200 C 100,100 200,200, 100,300 S 300,100 300,300 100,100 200,100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'bezierCurveTo', args: [100, 100, 200, 200, 100, 300]});
        cmpCmd(p, 2, {type: 'bezierCurveTo', args: [  0, 400, 300, 100, 300, 300]});
        cmpCmd(p, 3, {type: 'bezierCurveTo', args: [300, 500, 100, 100, 200, 100]});
    });

    it('should handle relative curveto shorthand multiple sets', function() {
        var p = parser.parse('M100,200 C 100,100 200,200, 100,300 s 200,-100 200,0 100,100 200,100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'bezierCurveTo', args: [100, 100, 200, 200, 100, 300]});
        cmpCmd(p, 2, {type: 'bezierCurveTo', args: [  0, 400, 300, 200, 300, 300]});
        cmpCmd(p, 3, {type: 'bezierCurveTo', args: [300, 400, 400, 400, 500, 400]});
    });

    it('should handle absolute quadratic', function() {
        var p = parser.parse('M100,200 Q 100,100 200,200');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'quadraticCurveTo', args: [100, 100, 200, 200]});
    });

    it('should handle relative quadratic multiple sets', function() {
        var p = parser.parse('M100,200 q 100,100 200,200 100,200, 200,100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'quadraticCurveTo', args: [200, 300, 300, 400]});
        cmpCmd(p, 2, {type: 'quadraticCurveTo', args: [400, 600, 500, 500]});
    });

    it('should handle absolute quadratic shorthand', function() {
        var p = parser.parse('M100,200 Q 100,100 200,200 T 100,100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'quadraticCurveTo', args: [100, 100, 200, 200]});
        cmpCmd(p, 2, {type: 'quadraticCurveTo', args: [300, 300, 100, 100]});
    });

    it('should handle relative quadratic shorthand', function() {
        var p = parser.parse('M100,200 Q 100,100 200,200 t 100,100');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'quadraticCurveTo', args: [100, 100, 200, 200]});
        cmpCmd(p, 2, {type: 'quadraticCurveTo', args: [300, 300, 300, 300]});
    });

    it('should handle relative quadratic shorthand multiple sets', function() {
        var p = parser.parse('M100,200 Q 100,100 200,200 t 200,100 100,200');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 200]});
        cmpCmd(p, 1, {type: 'quadraticCurveTo', args: [100, 100, 200, 200]});
        cmpCmd(p, 2, {type: 'quadraticCurveTo', args: [300, 300, 400, 300]});
        cmpCmd(p, 3, {type: 'quadraticCurveTo', args: [500, 300, 500, 500]});
    });

    it('should handle absolute elliptical arc 0 radius', function() {
        var p = parser.parse('M100,100 A 0,10 20 1 1 200,200');
        cmpCmd(p, 0, {type: 'moveTo', args: [100, 100]});
        cmpCmd(p, 1, {type: 'lineTo', args: [200, 200]});
    });

    it('should handle SVG Path elliptical arc with 0 radius', function() {
        var p = parser.parse('M 125,75 A0,50 0 1,1 100,50');
        cmpCmd(p, 0, {type: 'moveTo', args:    [125, 75]});
        cmpCmd(p, 1, {type: 'lineTo', args:    [100, 50]});
    });

    // Next four tests cases from:
    //   http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
    it('should handle SVG Path elliptical arc to example 1,1', function() {
        var p = parser.parse('M 125,75 a100,50 0 1,1 100,50');
        cmpCmd(p, 0, {type: 'moveTo', args:    [125, 75]});
        cmpCmd(p, 1, {type: 'save', args:      []});
        cmpCmd(p, 2, {type: 'translate', args: [225, 75]});
        cmpCmd(p, 3, {type: 'rotate', args:    [0]});
        cmpCmd(p, 4, {type: 'scale', args:     [100, 50]});
        cmpCmd(p, 5, {type: 'arc', args:       [0, 0, 1, radians(180), radians(90), 0]});
        cmpCmd(p, 6, {type: 'restore', args:   []});
    });

    it('should handle SVG Path elliptical arc to example 0,0', function() {
        var p = parser.parse('M 125,75 a100,50 0 0,0 100,50');
        cmpCmd(p, 0, {type: 'moveTo', args:    [125, 75]});
        cmpCmd(p, 1, {type: 'save', args:      []});
        cmpCmd(p, 2, {type: 'translate', args: [225, 75]});
        cmpCmd(p, 3, {type: 'rotate', args:    [0]});
        cmpCmd(p, 4, {type: 'scale', args:     [100, 50]});
        cmpCmd(p, 5, {type: 'arc', args:       [0, 0, 1, radians(180), radians(90), 1]});
        cmpCmd(p, 6, {type: 'restore', args:   []});
    });

    it('should handle SVG Path elliptical arc to example 0,1', function() {
        var p = parser.parse('M 125,75 a100,50 0 0,1 100,50');
        cmpCmd(p, 0, {type: 'moveTo', args:    [125, 75]});
        cmpCmd(p, 1, {type: 'save', args:      []});
        cmpCmd(p, 2, {type: 'translate', args: [125, 125]});
        cmpCmd(p, 3, {type: 'rotate', args:    [0]});
        cmpCmd(p, 4, {type: 'scale', args:     [100, 50]});
        cmpCmd(p, 5, {type: 'arc', args:       [0, 0, 1, radians(-90), 0, 0]});
        cmpCmd(p, 6, {type: 'restore', args:   []});
    });

    it('should handle SVG Path elliptical arc to example 0,1', function() {
        var p = parser.parse('M 125,75 a100,50 0 1,0 100,50');
        cmpCmd(p, 0, {type: 'moveTo', args:    [125, 75]});
        cmpCmd(p, 1, {type: 'save', args:      []});
        cmpCmd(p, 2, {type: 'translate', args: [125, 125]});
        cmpCmd(p, 3, {type: 'rotate', args:    [0]});
        cmpCmd(p, 4, {type: 'scale', args:     [100, 50]});
        cmpCmd(p, 5, {type: 'arc', args:       [0, 0, 1, radians(-90), 0, 1]});
        cmpCmd(p, 6, {type: 'restore', args:   []});
    });

    // Test for:
    //   http://www.w3.org/TR/SVG/implnote.html#ArcCorrectionOutOfRangeRadii
    it('should handle SVG Path elliptical arc with rescaling the ellipse to fit', function() {
        var p = parser.parse('M 0,0 a10.1,10 0 0,0 50,0');
        cmpCmd(p, 0, {type: 'moveTo', args:    [0, 0]});
        cmpCmd(p, 1, {type: 'save', args:      []});
        cmpCmd(p, 2, {type: 'translate', args: [25, 0]});
        cmpCmd(p, 3, {type: 'rotate', args:    [0]});
        cmpCmd(p, 4, {type: 'scale', args:     [25, 25]});
        cmpCmd(p, 5, {type: 'arc', args:       [0, 0, 1, radians(180), radians(360), 1]});
        cmpCmd(p, 6, {type: 'restore', args:   []});
    });

    it('should handle errors in the path', function() {
        assert.throws(function() { parser.parse('this is not a path'); });
    });
  }
);
