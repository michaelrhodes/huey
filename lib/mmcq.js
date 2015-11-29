/*!
 *  MMCQ.js
 *  Copyright (C) 2014 Nikola Klaric. MIT Licensed.
 *
 *  Derived from original work created by Nick Rabinovitz,
 *  and licensed under the MIT License.
 *
 *  http://opensource.org/licenses/mit-license.php
 */
module.exports = (function (_Math) {
  var histogram, _min = _Math.min, _max = _Math.max

  function x (a, b) {
    return a.c() - b.c()
  }

  function y (a, b) {
    return a.c() * a.v() - b.c() * b.v()
  }

  /**
   *  Priority queue.
   */
  function PQueue (comparator) {
    var contents = [],
      sorted = 0

    return {
      u: function (o) { /* push */
        contents.push(o)
        sorted = 0
      },
      o: function () { /* pop */
        if (!sorted) {
          contents.sort(comparator)
          sorted = 1
        }
        return contents.pop()
      },
      s: function () { /* size */
        return contents.length
      },
      m: function (f) { /* map */
        return contents.map(f)
      }
    }
  }

  /**
   *  3D colorspace box.
   */
  function VBox (r1, r2, g1, g2, b1, b2, histogram) {
    var vbox = this
    vbox.r1 = r1; vbox.r2 = r2
    vbox.g1 = g1; vbox.g2 = g2
    vbox.b1 = b1; vbox.b2 = b2
    vbox.h = histogram
  }
  VBox.prototype = {
    v: function () { /* volume */
      var vbox = this
      if (!vbox.V) {
        vbox.V = (vbox.r2 - vbox.r1 + 1) * (vbox.g2 - vbox.g1 + 1) * (vbox.b2 - vbox.b1 + 1)
      }
      return vbox.V
    },
    c: function () { /* count */
      var vbox = this
      if (!vbox.S) {
        var histogram = vbox.h,
          pixelCount = 0,
          rA = vbox.r1 - 1, rB = vbox.r2 + 1, gA, gB, bA, bB
        while (++rA < rB) {
          gA = vbox.g1 - 1; gB = vbox.g2 + 1
          while (++gA < gB) {
            bA = vbox.b1 - 1; bB = vbox.b2 + 1
            while (++bA < bB) {
              pixelCount += (histogram[1024 * rA + 32 * gA + bA] || 0)
            }
          }
        }

        vbox.C = pixelCount
        vbox.S = 1
      }
      return vbox.C
    },
    a: function () { /* avg */
      var vbox = this, histogram = vbox.h
      if (!vbox.A) {
        var ntot = 0,
          rsum = 0, gsum = 0, bsum = 0,
          hval,
          rA = vbox.r1 - 1, rB = vbox.r2 + 1, gA, gB, bA, bB
        while (++rA < rB) {
          gA = vbox.g1 - 1; gB = vbox.g2 + 1
          while (++gA < gB) {
            bA = vbox.b1 - 1; bB = vbox.b2 + 1
            while (++bA < bB) {
              hval = histogram[1024 * rA + 32 * gA + bA]
              if (hval) {
                ntot += hval
                rsum += hval * (0.5 + rA); gsum += hval * (0.5 + gA); bsum += hval * (0.5 + bA)
              }
            }
          }
        }
        if (ntot) {
          vbox.A = [~~(8 * rsum / ntot), ~~(8 * gsum / ntot), ~~(8 * bsum / ntot)]
        } else {
          /* Empty box. */
          vbox.A = [~~(4 * (1 + vbox.r1 + vbox.r2)), ~~(4 * (1 + vbox.g1 + vbox.g2)), ~~(4 * (1 + vbox.b1 + vbox.b2))]
        }
      }
      return vbox.A
    }
  }

  function _iterate (lh, target) {
    var ncolors = 1, niters = 0, count2,
      rw, gw, bw, maxw, i, j, k, dim,
      partialsum, lookaheadsum,
      total, sum,
      vbox,
      r1, r2, g1, g2, b1, b2,
      index, endA, endB, endC,
      left, right, vbox1, vbox2, d2,
      val1, val2

    while (niters < 1000) {
      vbox = lh.o()
      if (!vbox.c()) {
        lh.u(vbox); /* .push() */
        niters++
        continue
      }

      r1 = vbox.r1; r2 = vbox.r2; g1 = vbox.g1; g2 = vbox.g2; b1 = vbox.b1; b2 = vbox.b2
      rw = 1 + r2 - r1; gw = 1 + g2 - g1; bw = 1 + b2 - b1
      maxw = _max.call(0, rw, gw, bw)
      total = 0
      partialsum = []; lookaheadsum = []

      /* Find the partial sum arrays along the selected axis. */
      if (maxw == rw) {
        val1 = r1; val2 = r2
        dim = 'r'; endA = r2 + 1; endB = g2 + 1; endC = b2 + 1
        for (i = r1; i < endA; i++) {
          sum = 0
          for (j = g1; j < endB; j++) {
            for (k = b1; k < endC; k++) {
              sum += (histogram[1024 * i + 32 * j + k] || 0)
            }
          }
          total += sum
          partialsum[i] = total
        }
      } else if (maxw == gw) {
        val1 = g1; val2 = g2
        dim = 'g'; endA = g2 + 1; endB = r2 + 1; endC = b2 + 1
        for (i = g1; i < endA; i++) {
          sum = 0
          for (j = r1; j < endB; j++) {
            for (k = b1; k < endC; k++) {
              sum += (histogram[32 * i + 1024 * j + k] || 0)
            }
          }
          total += sum
          partialsum[i] = total
        }
      } else { /* maxw == bw */
        val1 = b1; val2 = b2
        dim = 'b'; endA = b2 + 1; endB = r2 + 1; endC = g2 + 1
        for (i = b1; i < endA; i++) {
          sum = 0
          for (j = r1; j < endB; j++) {
            for (k = g1; k < endC; k++) {
              sum += (histogram[1024 * j + 32 * k + i] || 0)
            }
          }
          total += sum
          partialsum[i] = total
        }
      }

      total /= 2
      index = partialsum.length
      while (index--) {
        if (partialsum[index]) {
          lookaheadsum[index] = total - partialsum[index]
        }
      }

      /* Determine the cut planes. */
      for (i = val1; i <= val2; i++) {
        if (partialsum[i] > total) {
          left = i - val1; right = val2 - i
          d2 = (left > right) ? _max(val1, ~~(i - 1 - left / 2)) : _min(val2 - 1, ~~(i + right / 2))

          /* Avoid 0-count boxes. */
          while (!partialsum[d2]) {
            d2++
          }
          count2 = lookaheadsum[d2]
          while (!count2 && partialsum[d2 - 1]) {
            count2 = lookaheadsum[--d2]
          }

          /* Set dimensions. */
          vbox1 = new VBox(r1, r2, g1, g2, b1, b2, vbox.h); vbox1[dim + '2'] = d2
          vbox2 = new VBox(r1, r2, g1, g2, b1, b2, vbox.h); vbox2[dim + '1'] = d2 + 1

          break
        }
      }

      lh.u(vbox1); /* .push() */
      if (vbox2) {
        lh.u(vbox2); /* .push() */
        ncolors++
      }
      if (ncolors >= target || niters++ > 1000) {
        return
      }
    }
  }

  function quantize (pixels, maxcolors) {
    histogram = []

    var colorMap = new PQueue(y),
      index,
      rmin = 32, rmax = 0,
      gmin = 32, gmax = 0,
      bmin = 32, bmax = 0,
      pixel, rval, gval, bval,
      queueA = new PQueue(x), queueB = new PQueue(y),
      pixelIndex = pixels.length

    while (pixelIndex) {
      pixel = pixels[--pixelIndex]
      rval = pixel[0] >> 3
      gval = pixel[1] >> 3
      bval = pixel[2] >> 3

      if (rval < rmin) {
        rmin = rval
      } else if (rval > rmax) {
        rmax = rval
      }

      if (gval < gmin) {
        gmin = gval
      } else if (gval > gmax) {
        gmax = gval
      }

      if (bval < bmin) {
        bmin = bval
      } else if (bval > bmax) {
        bmax = bval
      }

      index = 1024 * rval + 32 * gval + bval
      histogram[index] = (histogram[index] || 0) + 1
    }
    queueA.u(new VBox(rmin, rmax, gmin, gmax, bmin, bmax, histogram)); /* .push() */

    /* First set of colors, sorted by population. */
    _iterate(queueA, 0.75 * maxcolors)

    /* Re-sort by the product of pixel occupancy times the size in color space: npix * volume. */
    while (queueA.s()) { /* .size() */
      queueB.u(queueA.o()); /* .push() .pop() */
    }

    /* Next set, generate the median cuts using the npix * volume sorting. */
    _iterate(queueB, maxcolors - queueB.s()); /* .size() */

    /* Calculate the actual colors. */
    while (queueB.s()) { /* .size() */
      colorMap.u(queueB.o()); /* .push() .pop() */
    }

    return colorMap.m(function (vb) { /* .map() */
      return vb.a(); /* .avg() */
    })
  }

  return quantize
})(Math)
