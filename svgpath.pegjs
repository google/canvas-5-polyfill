/*
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 *
 *
 * Parser for SVG path, converting the path into a series of Path2D operations
 * that can be added to the Path2D polyfill object.
 */
{
  // The last coordinate we are at in the path. In absolute coords.
  var lastCoord = [0, 0];
  // The last control point we encountered in the path. In absolute coords.
  var lastControl = [0, 0];
  // The list of operations we've parsed so far.
  var ops = [];
  // Have we parsed the first sub-path yet?
  var firstSubPath = true;
  // The letter of the last parsed command.
  var lastCh = '';

  // Flatten an array.
  function flatten(a) {
    var flat = [];
    for (var i = 0; i < a.length; i++) {
      if (a[i] instanceof Array) {
        flat.push.apply(flat, flatten(a[i]));
      } else {
        flat.push(a[i]);
      }
    }
    return flat;
  }

  // Convert a position into an absolute position.
  function makeAbsolute(c, coord) {
    if ('mlazhvcsqt'.indexOf(c) === -1) {
      lastCoord = coord;
    } else {
      lastCoord[0] += coord[0];
      lastCoord[1] += coord[1];
    }
    lastCh = c;
    return lastCoord.slice(0);
  }

  // Convert a sequence of coordinates into absolute coordinates.
  //
  // For arguments that take multiple coord pairs, such as bezier.
  function makeAbsoluteMultiple(c, seq) {
    var r = [];
    var lastPosCopy = lastCoord.slice(0);
    for (var i=0; i < seq.length; i+=2) {
      // Only the last point should update lastCoord.
      lastCoord = lastPosCopy.slice(0);
      var coord = makeAbsolute(c, seq.slice(i, i+2));
      r = r.concat(coord);
      // Record the last control point, it might be needed for
      // shorthand operations.
      if (i == seq.length-4) {
        lastControl = coord.slice(0);
      }
    }
    return r;
  }

  // Find the reflection of the last control point over
  // the last postion in the path.
  function makeReflected() {
    if ('CcSsQqTt'.indexOf(lastCh) == -1) {
      lastControl = lastCoord.slice(0);
    }
    // reflected = 2*lastCoord - lastControl
    // Note the result is absolute, not relative.
    var r = [0, 0];
    r[0] = 2*lastCoord[0] - lastControl[0];
    r[1] = 2*lastCoord[1] - lastControl[1];
    return r;
  }

  function makeAbsoluteFromX(c, x) {
    var coord = [x, 0];
    if (c == 'H') {
      coord[1] = lastCoord[1];
    }
    return makeAbsolute(c, coord);
  }

  function makeAbsoluteFromY(c, y) {
    var coord = [0, y];
    if (c == 'V') {
      coord[0] = lastCoord[0];
    }
    return makeAbsolute(c, coord);
  }

  function concatSequence(one, rest) {
    var r = [one];
    if (rest && rest.length > 1) {
      var rem = rest[1];
      for (var i = 0; i < rem.length; i++) {
        r.push(rem[i]);
      }
    }
    return r;
  }

  function mag(v) {
    return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
  }

  function dot(u, v) {
    return (u[0]*v[0] + u[1]*v[1]);
  }

  function ratio(u, v) {
    return dot(u,v) / (mag(u)*mag(v))
  }

  function angle(u, v) {
    var sign = 1.0;
    if ((u[0]*v[1] - u[1]*v[0]) < 0) {
      sign = -1.0;
    }
    return sign * Math.acos(ratio(u,v));
  }

  function rotClockwise(v, angle) {
    var cost = Math.cos(angle);
    var sint = Math.sin(angle);
    return [cost*v[0] + sint*v[1], -1 * sint*v[0] + cost*v[1]];
  }

  function rotCounterClockwise(v, angle) {
    var cost = Math.cos(angle);
    var sint = Math.sin(angle);
    return [cost*v[0] - sint*v[1], sint*v[0] + cost*v[1]];
  }

  function midPoint(u, v) {
    return [(u[0] - v[0])/2.0, (u[1] - v[1])/2.0];
  }

  function meanVec(u, v) {
    return [(u[0] + v[0])/2.0, (u[1] + v[1])/2.0];
  }

  function pointMul(u, v) {
    return [u[0]*v[0], u[1]*v[1]];
  }

  function scale(c, v) {
    return [c*v[0], c*v[1]];
  }

  function sum(u, v) {
    return [u[0] + v[0], u[1] + v[1]];
  }

  // Convert an SVG elliptical arc to a series of canvas commands.
  //
  // x1, x2: start and stop coordinates of the ellipse.
  // rx, ry: radii of the ellipse.
  // phi: rotation of the ellipse.
  // fA: large arc flag.
  // fS: sweep flag.
  function ellipseFromEllipticalArc(x1, rx, ry, phi, fA, fS, x2) {
    // Convert from endpoint to center parametrization, as detailed in:
    //   http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
    if (rx == 0 || ry == 0) {
      ops.push({type: 'lineTo', args: x2});
      return;
    }
    var phi = phi * (Math.PI / 180.0);
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    var xPrime = rotClockwise(midPoint(x1, x2), phi);                // F.6.5.1
    var xPrime2 = pointMul(xPrime, xPrime);
    var rx2 = Math.pow(rx, 2);
    var ry2 = Math.pow(ry, 2);

    var lambda = Math.sqrt(xPrime2[0]/rx2 + xPrime2[1]/ry2);
    if (lambda > 1) {
      rx *= lambda;
      ry *= lambda;
      rx2 = Math.pow(rx, 2);
      ry2 = Math.pow(ry, 2);
    }

    var factor = Math.sqrt((rx2*ry2 - rx2*xPrime2[1] - ry2*xPrime2[0]) /
      (rx2*xPrime2[1] + ry2*xPrime2[0]));
    if (fA == fS) {
      factor *= -1.0;
    }
    var cPrime = scale(factor, [rx*xPrime[1]/ry, -ry*xPrime[0]/rx]); // F.6.5.2
    var c = sum(rotCounterClockwise(cPrime, phi), meanVec(x1, x2));  // F.6.5.3
    var x1UnitVector = [(xPrime[0] - cPrime[0])/rx, (xPrime[1] - cPrime[1])/ry];
    var x2UnitVector = [(-1.0*xPrime[0] - cPrime[0])/rx, (-1.0*xPrime[1] - cPrime[1])/ry];
    var theta = angle([1, 0], x1UnitVector);                         // F.6.5.5
    var deltaTheta = angle(x1UnitVector, x2UnitVector);              // F.6.5.6
    var start = theta;
    var end = theta+deltaTheta;
    ops.push(
      {type: 'save', args: []},
      {type: 'translate', args: [c[0], c[1]]},
      {type: 'rotate', args: [phi]},
      {type: 'scale', args: [rx, ry]},
      {type: 'arc', args: [0, 0, 1, start, end, 1-fS]},
      {type: 'restore', args: []}
      );
  }
}

svg_path
  = wsp* d:moveTo_drawTo_commandGroups? wsp*
    { return ops; }

moveTo_drawTo_commandGroups
  = one:moveTo_drawTo_commandGroup rest:(wsp* moveTo_drawTo_commandGroups)?

moveTo_drawTo_commandGroup
  = one:moveto rest:(wsp* drawto_commands)?

drawto_commands
  = one:drawto_command rest:(wsp* drawto_commands)?

drawto_command
  = closepath
    / lineto
    / horizontal_lineto
    / vertical_lineto
    / curveto
    / smooth_curveto
    / quadratic_bezier_curveto
    / smooth_quadratic_bezier_curveto
    / elliptical_arc

moveto
  = ch:[Mm] wsp* args:moveto_argument_sequence
    {
      var moveCh = ch
      // If this is the first move cmd then force it to be absolute.
      if (firstSubPath) {
        moveCh = 'M';
        firstSubPath = false;
      }
      ops.push({type: 'moveTo', args: makeAbsolute(moveCh, args[0])});
      for (var i=1; i < args.length; i++) {
        // The lineTo args are either abs or relative, depending on the
        // original moveto command.
        ops.push({type: 'lineTo', args: makeAbsolute(ch, args[i])});
      }
    }

moveto_argument_sequence
  = one:coordinate_pair rest:(comma_wsp? lineto_argument_sequence)?
    { return concatSequence(one, rest); }


closepath
  = [Zz]
    { ops.push({type: 'closePath', args: []}); }

lineto
  = ch:[Ll] wsp* args:lineto_argument_sequence
    {
      for (var i=0; i < args.length; i++) {
        ops.push({type: 'lineTo', args: makeAbsolute(ch, args[i])});
      }
    }

lineto_argument_sequence
  = one:coordinate_pair rest:(comma_wsp? lineto_argument_sequence)?
    { return concatSequence(one, rest); }

horizontal_lineto
  = ch:[Hh] wsp* args:coordinate_sequence
  {
    for (var i=0; i < args.length; i++) {
      ops.push({type: 'lineTo', args: makeAbsoluteFromX(ch, args[i])});
    }
  }

coordinate_sequence
  = one:coordinate rest:(comma_wsp? coordinate_sequence)?
  { return concatSequence(one, rest); }

vertical_lineto
  = ch:[Vv] wsp* args:coordinate_sequence
  {
    for (var i=0; i < args.length; i++) {
      ops.push({type: 'lineTo', args: makeAbsoluteFromY(ch, args[i])});
    }
  }

curveto
  = ch:[Cc] wsp* args:curveto_argument_sequence
  {
    for (var i=0; i < args.length; i++) {
      ops.push({type: 'bezierCurveTo', args: makeAbsoluteMultiple(ch, args[i])});
    }
  }

curveto_argument_sequence
  = one:curveto_argument rest:(comma_wsp? curveto_argument_sequence)?
  { return concatSequence(one, rest); }

curveto_argument
  = cp1:coordinate_pair comma_wsp? cp2:coordinate_pair comma_wsp? last:coordinate_pair
  { return cp1.concat(cp2, last); }

smooth_curveto
  = ch:[Ss] wsp* args:smooth_curveto_argument_sequence
  {
    for (var i=0; i < args.length; i++) {
      ops.push({type: 'bezierCurveTo', args: makeReflected().concat(makeAbsoluteMultiple(ch, args[i]))});
    }
  }

smooth_curveto_argument_sequence
  = one:smooth_curveto_argument rest:(comma_wsp? smooth_curveto_argument_sequence)?
  { return concatSequence(one, rest); }

smooth_curveto_argument
  = cp1:coordinate_pair comma_wsp? last:coordinate_pair
  { return cp1.concat(last); }


quadratic_bezier_curveto
  = ch:[Qq] wsp* args:quadratic_bezier_curveto_argument_sequence
  {
    for (var i=0; i < args.length; i++) {
      ops.push({type: 'quadraticCurveTo', args: makeAbsoluteMultiple(ch, args[i])});
    }
  }

quadratic_bezier_curveto_argument_sequence
  = one:quadratic_bezier_curveto_argument rest:(comma_wsp? quadratic_bezier_curveto_argument_sequence)?
  { return concatSequence(one, rest); }

quadratic_bezier_curveto_argument
  = cp1:coordinate_pair comma_wsp? last:coordinate_pair
  { return cp1.concat(last); }


smooth_quadratic_bezier_curveto
  = ch:[Tt] wsp* args:smooth_quadratic_bezier_curveto_argument_sequence
  {
    for (var i=0; i < args.length; i++) {
      var reflected = makeReflected();
      ops.push({type: 'quadraticCurveTo', args: reflected.concat(makeAbsoluteMultiple(ch, args[i]))});
      lastControl = reflected.slice(0);
    }
  }

smooth_quadratic_bezier_curveto_argument_sequence
  = one:coordinate_pair rest:(comma_wsp? smooth_quadratic_bezier_curveto_argument_sequence)?
  { return concatSequence(one, rest); }

elliptical_arc
  = ch:[Aa] wsp* args:elliptical_arc_argument_sequence
  {
    for (var i=0; i < args.length; i++) {
      var x1 = [lastCoord.slice()];
      var x2 = [makeAbsolute(ch, args[i].slice(-2))];
      absArgs = x1.concat(args[i].slice(0, -2), x2);
      ellipseFromEllipticalArc.apply(this, absArgs);
    }
  }

elliptical_arc_argument_sequence
  = one:elliptical_arc_argument rest:(comma_wsp? elliptical_arc_argument_sequence)?
  { return concatSequence(one, rest); }

elliptical_arc_argument
  = rx:nonnegative_number comma_wsp? ry:nonnegative_number comma_wsp?
        xrot:number comma_wsp large:flag comma_wsp? sweep:flag comma_wsp? last:coordinate_pair
  { return [parseFloat(rx), parseFloat(ry), parseFloat(flatten(xrot).join('')), parseInt(large), parseInt(sweep), last[0], last[1]]; }

coordinate_pair
  = x:coordinate comma_wsp? y:coordinate
  { return [x, y] }

coordinate
  = number:number
  { return parseFloat(flatten(number).join('')) }

nonnegative_number
  = floating_point_constant
  / integer_constant

number
  = sign? floating_point_constant
  / sign? integer_constant

flag
  = '0' / '1'

comma_wsp
  = (wsp+ comma? wsp*)
  / (comma wsp*)

comma
  = ','

integer_constant
  = digit_sequence

floating_point_constant
  = fractional_constant exponent?
  / digit_sequence exponent

fractional_constant
  = digit_sequence? '.' digit_sequence
  / digit_sequence '.'

exponent
  = [eE] sign? digit_sequence

sign
  = '+' / '-'

digit_sequence
  = digits:[0-9]+
    { return digits.join('') }

wsp
  = [ \t\n\r]

// vim: set ft=javascript:
