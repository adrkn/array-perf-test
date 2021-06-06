/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shuffleArray": () => (/* binding */ shuffleArray),
/* harmony export */   "shuffleMatrix": () => (/* binding */ shuffleMatrix)
/* harmony export */ });
/** ****************************************************************************
 *
 * Shuffles the elements of a 1D array at random.
 *
 * @param {Array} array - Target array.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

/** ****************************************************************************
 *
 * Shuffles the elements of a 2D array (matrix) at random.
 *
 * @param {Array.<Array>} matrix - target matrix.
 */
function shuffleMatrix(matrix) {

  let array = []

  /** Matrix expands into a 1D array. */
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      array.push(matrix[i][j])
    }
  }

  /** Shuffle the array. */
  shuffleArray(array)

  /** The array is collected into a matrix. */
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = array.pop()
    }
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./utils.js");


'use strict'

const urlParams = new URLSearchParams(window.location.search)

const defaults = {
  dxMax: 100,
  dyMax: 100,
  dzMax: 100,
}

/** Arrays dimensions (trying to read them from url). */
const dxMax = (urlParams.get('x')) ? Number.parseInt(urlParams.get('x')) : defaults.dxMax
const dyMax = (urlParams.get('y')) ? Number.parseInt(urlParams.get('y')) : defaults.dyMax
const dzMax = (urlParams.get('z')) ? Number.parseInt(urlParams.get('z')) : defaults.dzMax

/** Utility variables. */
const matrixSize = dxMax * dyMax
let dx, dy, dz = 0
let x = 0
let shuffle = []
let indices = []
let timeStart, timeEnd = 0

/** Statistics. */
const stats = {
  'Simple 3D':        { creating: 0, seqWriting: 0, randWriting: 0, seqReading: 0, randReading: 0 },
  'Simple Pseudo 3D': { creating: 0, seqWriting: 0, randWriting: 0, seqReading: 0, randReading: 0 },
  'Typed Pseudo 3D':  { creating: 0, seqWriting: 0, randWriting: 0, seqReading: 0, randReading: 0 },
  '3D Map':           { creating: 0, seqWriting: 0, randWriting: 0, seqReading: 0, randReading: 0 }
}

/** Preparing shuffled indices for random writing/reading tests. */
for (dx = 0; dx < dxMax; dx++) {
  shuffle[dx] = []
  for (dy = 0; dy < dyMax; dy++) {
    shuffle[dx][dy] = []
    for (dz = 0; dz < dzMax; dz++) {
      shuffle[dx][dy][dz] = [dx, dy, dz]
    }
  }
}

/** Shuffle the matrix. */
(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.shuffleMatrix)(shuffle)

console.log(`%c3D arrays performance testing [${dxMax} x ${dyMax} x ${dzMax}]`, 'font-weight: bold; color: #ffffff; background-color: #cc0000;')


/** ******************************************************************************************************************
 *
 * Creating arrays
 */

console.group('%cCreating', 'font-weight: bold; color: #ffffff;')

/** ********** Test #01 ********** */

console.log('Test #01: imple 3D] and filling with 0...')
timeStart = performance.now();
let simple3DArray = []
for (let dx = 0; dx < dxMax; dx++) {
  simple3DArray[dx] = []
  for (let dy = 0; dy < dyMax; dy++) {
    simple3DArray[dx][dy] = []
    for (let dz = 0; dz < dzMax; dz++) {
      simple3DArray[dx][dy][dz] = 0
    }
  }
}
timeEnd = performance.now()
stats['Simple 3D'].creating = timeEnd - timeStart

/** ********** Test #02 ********** */

console.log('Test #02: Creating [Simple Pseudo 3D] and filling with 0...')
timeStart = performance.now();
let simplePseudo3DArray = []
for (dx = 0; dx < dxMax; dx++) {
  const dim1 = dx * matrixSize
  for (dy = 0; dy < dyMax; dy++) {
    const dim2 = dy * dyMax
    for (dz = 0; dz < dzMax; dz++) {
      simplePseudo3DArray[dim1 + dim2 + dz] = 0
    }
  }
}
timeEnd = performance.now()
stats['Simple Pseudo 3D'].creating = timeEnd - timeStart

/** ********** Test #03 ********** */

console.log('Test #03: Creating [Typed Pseudo 3D] and filling with 0...')
timeStart = performance.now();
let typedPseudo3DArray = new Float32Array(dxMax * dyMax * dzMax)
for (dx = 0; dx < dxMax; dx++) {
  const dim1 = dx * matrixSize
  for (dy = 0; dy < dyMax; dy++) {
    const dim2 = dy * dyMax
    for (dz = 0; dz < dzMax; dz++) {
      typedPseudo3DArray[dim1 + dim2 + dz] = 0
    }
  }
}
timeEnd = performance.now()
stats['Typed Pseudo 3D'].creating = timeEnd - timeStart

/** ********** Test #04 ********** */

console.log('Test #04: Creating [3D Map] and filling with 0...')
timeStart = performance.now();
let map = new Map()
for (dx = 0; dx < dxMax; dx++) {
  map.set(dx, new Map())
  for (dy = 0; dy < dyMax; dy++) {
    map.get(dx).set(dy, new Map())
    for (dz = 0; dz < dzMax; dz++) {
      map.get(dx).get(dy).set(dz, 0)
    }
  }
}
timeEnd = performance.now()
stats['3D Map'].creating = timeEnd - timeStart

console.groupEnd()

/** ******************************************************************************************************************
 *
 * Sequential writing arrays
 */

console.group('%cSequential writing', 'font-weight: bold; color: #ffffff;')

/** ********** Test #05 ********** */

console.log('Test #05: Sequential writing [Simple 3D] with random values...')
timeStart = performance.now();
for (let dx = 0; dx < dxMax; dx++) {
  for (let dy = 0; dy < dyMax; dy++) {
    for (let dz = 0; dz < dzMax; dz++) {
      simple3DArray[dx][dy][dz] = Math.random()
    }
  }
}
timeEnd = performance.now()
stats['Simple 3D'].seqWriting = timeEnd - timeStart

/** ********** Test #06 ********** */

console.log('Test #06: Sequential writing [Simple Pseudo 3D] with random values...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  const dim1 = dx * matrixSize
  for (dy = 0; dy < dyMax; dy++) {
    const dim2 = dy * dyMax
    for (dz = 0; dz < dzMax; dz++) {
      simplePseudo3DArray[dim1 + dim2 + dz] = Math.random()
    }
  }
}
timeEnd = performance.now()
stats['Simple Pseudo 3D'].seqWriting = timeEnd - timeStart

/** ********** Test #07 ********** */

console.log('Test #07: Sequential writing [Typed Pseudo 3D] with random values...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  const dim1 = dx * matrixSize
  for (dy = 0; dy < dyMax; dy++) {
    const dim2 = dy * dyMax
    for (dz = 0; dz < dzMax; dz++) {
      typedPseudo3DArray[dim1 + dim2 + dz] = Math.random()
    }
  }
}
timeEnd = performance.now()
stats['Typed Pseudo 3D'].seqWriting = timeEnd - timeStart

/** ********** Test #08 ********** */

console.log('Test #08: Sequential writing [3D Map] with random values...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  for (dy = 0; dy < dyMax; dy++) {
    for (dz = 0; dz < dzMax; dz++) {
      map.get(dx).get(dy).set(dz, Math.random())
    }
  }
}
timeEnd = performance.now()
stats['3D Map'].seqWriting = timeEnd - timeStart

console.groupEnd()

/** ******************************************************************************************************************
 *
 * Sequential reading arrays
 */

console.group('%cSequential reading', 'font-weight: bold; color: #ffffff;')

/** ********** Test #09 ********** */

console.log('Test #09: Sequential reading [Simple 3D]...')
timeStart = performance.now();
for (let dx = 0; dx < dxMax; dx++) {
  for (let dy = 0; dy < dyMax; dy++) {
    for (let dz = 0; dz < dzMax; dz++) {
      x = simple3DArray[dx][dy][dz]
    }
  }
}
timeEnd = performance.now()
stats['Simple 3D'].seqReading = timeEnd - timeStart

/** ********** Test #10 ********** */

console.log('Test #10: Sequential reading [Simple Pseudo 3D]...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  const dim1 = dx * matrixSize
  for (dy = 0; dy < dyMax; dy++) {
    const dim2 = dy * dyMax
    for (dz = 0; dz < dzMax; dz++) {
      x = simplePseudo3DArray[dim1 + dim2 + dz]
    }
  }
}
timeEnd = performance.now()
stats['Simple Pseudo 3D'].seqReading = timeEnd - timeStart

/** ********** Test #11 ********** */

console.log('Test #11: Sequential reading [Typed Pseudo 3D]...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  const dim1 = dx * matrixSize
  for (dy = 0; dy < dyMax; dy++) {
    const dim2 = dy * dyMax
    for (dz = 0; dz < dzMax; dz++) {
      x = typedPseudo3DArray[dim1 + dim2 + dz]
    }
  }
}
timeEnd = performance.now()
stats['Typed Pseudo 3D'].seqReading = timeEnd - timeStart

/** ********** Test #12 ********** */

console.log('Test #12: Sequential reading [3D Map]...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  for (dy = 0; dy < dyMax; dy++) {
    for (dz = 0; dz < dzMax; dz++) {
      x = map.get(dx).get(dy).get(dz)
    }
  }
}
timeEnd = performance.now()
stats['3D Map'].seqReading = timeEnd - timeStart

console.groupEnd()

/** ******************************************************************************************************************
 *
 * Random writing arrays
 */

console.group('%cRandom writing', 'font-weight: bold; color: #ffffff;')

/** ********** Test #13 ********** */

console.log('Test #13: Random writing [Simple 3D] with random values...')
timeStart = performance.now();
for (let dx = 0; dx < dxMax; dx++) {
  for (let dy = 0; dy < dyMax; dy++) {
    for (let dz = 0; dz < dzMax; dz++) {
      indices = shuffle[dx][dy][dz]
      simple3DArray[indices[0]][indices[1]][indices[3]] = Math.random()
    }
  }
}
timeEnd = performance.now()
stats['Simple 3D'].randWriting = timeEnd - timeStart

/** ********** Test #14 ********** */

console.log('Test #14: Random writing [Simple Pseudo 3D] with random values...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  for (dy = 0; dy < dyMax; dy++) {
    for (dz = 0; dz < dzMax; dz++) {
      indices = shuffle[dx][dy][dz]
      simplePseudo3DArray[indices[0] * matrixSize + indices[1] * dyMax + indices[2]] = Math.random()
    }
  }
}
timeEnd = performance.now()
stats['Simple Pseudo 3D'].randWriting = timeEnd - timeStart

/** ********** Test #15 ********** */

console.log('Test #15: Random writing [Typed Pseudo 3D] with random values...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  for (dy = 0; dy < dyMax; dy++) {
    for (dz = 0; dz < dzMax; dz++) {
      indices = shuffle[dx][dy][dz]
      typedPseudo3DArray[indices[0] * matrixSize + indices[1] * dyMax + indices[2]] = Math.random()
    }
  }
}
timeEnd = performance.now()
stats['Typed Pseudo 3D'].randWriting = timeEnd - timeStart

/** ********** Test #16 ********** */

console.log('Test #16: Random writing [3D Map] with random values...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  for (dy = 0; dy < dyMax; dy++) {
    for (dz = 0; dz < dzMax; dz++) {
      indices = shuffle[dx][dy][dz]
      map.get(indices[0]).get(indices[1]).set(indices[2], Math.random())
    }
  }
}
timeEnd = performance.now()
stats['3D Map'].randWriting = timeEnd - timeStart

console.groupEnd()

/** ******************************************************************************************************************
 *
 * Random reading arrays
 */

console.group('%cRandom reading', 'font-weight: bold; color: #ffffff;')

/** ********** Test #17 ********** */

console.log('Test #17: Random reading [Simple 3D]...')
timeStart = performance.now();
for (let dx = 0; dx < dxMax; dx++) {
  for (let dy = 0; dy < dyMax; dy++) {
    for (let dz = 0; dz < dzMax; dz++) {
      indices = shuffle[dx][dy][dz]
      x = simple3DArray[indices[0]][indices[1]][indices[3]]
    }
  }
}
timeEnd = performance.now()
stats['Simple 3D'].randReading = timeEnd - timeStart

/** ********** Test #18 ********** */

console.log('Test #18: Random reading [Simple Pseudo 3D]...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  for (dy = 0; dy < dyMax; dy++) {
    for (dz = 0; dz < dzMax; dz++) {
      indices = shuffle[dx][dy][dz]
      x = simplePseudo3DArray[indices[0] * matrixSize + indices[1] * dyMax + indices[2]]
    }
  }
}
timeEnd = performance.now()
stats['Simple Pseudo 3D'].randReading = timeEnd - timeStart

/** ********** Test #19 ********** */

console.log('Test #19: Random reading [Typed Pseudo 3D]...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  for (dy = 0; dy < dyMax; dy++) {
    for (dz = 0; dz < dzMax; dz++) {
      indices = shuffle[dx][dy][dz]
      x = typedPseudo3DArray[indices[0] * matrixSize + indices[1] * dyMax + indices[2]]
    }
  }
}
timeEnd = performance.now()
stats['Typed Pseudo 3D'].randReading = timeEnd - timeStart

/** ********** Test #20 ********** */

console.log('Test #20: Random reading [3D Map]...')
timeStart = performance.now();
for (dx = 0; dx < dxMax; dx++) {
  for (dy = 0; dy < dyMax; dy++) {
    for (dz = 0; dz < dzMax; dz++) {
      indices = shuffle[dx][dy][dz]
      x = map.get(indices[0]).get(indices[1]).get(indices[2])
    }
  }
}
timeEnd = performance.now()
stats['3D Map'].randReading = timeEnd - timeStart

console.groupEnd()

/** ******************************************************************************************************************
 *
 * Show results
 */

console.log('---')
console.log('%cResults (ms):', 'font-weight: bold; color: #ffffff;')
console.log('If you do not see the result table then refresh the page.')

for (let key1 in stats) {
  for (let key2 in stats[key1])
    stats[key1][key2] = Math.round(stats[key1][key2])
}

console.table(stats)

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi91dGlscy5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQjtBQUNPO0FBQ1AsZ0NBQWdDLE9BQU87QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekI7QUFDTzs7QUFFUDs7QUFFQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEMsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEMsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ3ZDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ04wQzs7QUFFMUM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QTtBQUNBOztBQUVBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICogU2h1ZmZsZXMgdGhlIGVsZW1lbnRzIG9mIGEgMUQgYXJyYXkgYXQgcmFuZG9tLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IC0gVGFyZ2V0IGFycmF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2h1ZmZsZUFycmF5KGFycmF5KSB7XG4gIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgIFthcnJheVtpXSwgYXJyYXlbal1dID0gW2FycmF5W2pdLCBhcnJheVtpXV1cbiAgfVxufVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqIFNodWZmbGVzIHRoZSBlbGVtZW50cyBvZiBhIDJEIGFycmF5IChtYXRyaXgpIGF0IHJhbmRvbS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxBcnJheT59IG1hdHJpeCAtIHRhcmdldCBtYXRyaXguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaHVmZmxlTWF0cml4KG1hdHJpeCkge1xuXG4gIGxldCBhcnJheSA9IFtdXG5cbiAgLyoqIE1hdHJpeCBleHBhbmRzIGludG8gYSAxRCBhcnJheS4gKi9cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgYXJyYXkucHVzaChtYXRyaXhbaV1bal0pXG4gICAgfVxuICB9XG5cbiAgLyoqIFNodWZmbGUgdGhlIGFycmF5LiAqL1xuICBzaHVmZmxlQXJyYXkoYXJyYXkpXG5cbiAgLyoqIFRoZSBhcnJheSBpcyBjb2xsZWN0ZWQgaW50byBhIG1hdHJpeC4gKi9cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1hdHJpeFtpXS5sZW5ndGg7IGorKykge1xuICAgICAgbWF0cml4W2ldW2pdID0gYXJyYXkucG9wKClcbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgc2h1ZmZsZU1hdHJpeCB9IGZyb20gJy4vdXRpbHMuanMnXG5cbid1c2Ugc3RyaWN0J1xuXG5jb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBkeE1heDogMTAwLFxuICBkeU1heDogMTAwLFxuICBkek1heDogMTAwLFxufVxuXG4vKiogQXJyYXlzIGRpbWVuc2lvbnMgKHRyeWluZyB0byByZWFkIHRoZW0gZnJvbSB1cmwpLiAqL1xuY29uc3QgZHhNYXggPSAodXJsUGFyYW1zLmdldCgneCcpKSA/IE51bWJlci5wYXJzZUludCh1cmxQYXJhbXMuZ2V0KCd4JykpIDogZGVmYXVsdHMuZHhNYXhcbmNvbnN0IGR5TWF4ID0gKHVybFBhcmFtcy5nZXQoJ3knKSkgPyBOdW1iZXIucGFyc2VJbnQodXJsUGFyYW1zLmdldCgneScpKSA6IGRlZmF1bHRzLmR5TWF4XG5jb25zdCBkek1heCA9ICh1cmxQYXJhbXMuZ2V0KCd6JykpID8gTnVtYmVyLnBhcnNlSW50KHVybFBhcmFtcy5nZXQoJ3onKSkgOiBkZWZhdWx0cy5kek1heFxuXG4vKiogVXRpbGl0eSB2YXJpYWJsZXMuICovXG5jb25zdCBtYXRyaXhTaXplID0gZHhNYXggKiBkeU1heFxubGV0IGR4LCBkeSwgZHogPSAwXG5sZXQgeCA9IDBcbmxldCBzaHVmZmxlID0gW11cbmxldCBpbmRpY2VzID0gW11cbmxldCB0aW1lU3RhcnQsIHRpbWVFbmQgPSAwXG5cbi8qKiBTdGF0aXN0aWNzLiAqL1xuY29uc3Qgc3RhdHMgPSB7XG4gICdTaW1wbGUgM0QnOiAgICAgICAgeyBjcmVhdGluZzogMCwgc2VxV3JpdGluZzogMCwgcmFuZFdyaXRpbmc6IDAsIHNlcVJlYWRpbmc6IDAsIHJhbmRSZWFkaW5nOiAwIH0sXG4gICdTaW1wbGUgUHNldWRvIDNEJzogeyBjcmVhdGluZzogMCwgc2VxV3JpdGluZzogMCwgcmFuZFdyaXRpbmc6IDAsIHNlcVJlYWRpbmc6IDAsIHJhbmRSZWFkaW5nOiAwIH0sXG4gICdUeXBlZCBQc2V1ZG8gM0QnOiAgeyBjcmVhdGluZzogMCwgc2VxV3JpdGluZzogMCwgcmFuZFdyaXRpbmc6IDAsIHNlcVJlYWRpbmc6IDAsIHJhbmRSZWFkaW5nOiAwIH0sXG4gICczRCBNYXAnOiAgICAgICAgICAgeyBjcmVhdGluZzogMCwgc2VxV3JpdGluZzogMCwgcmFuZFdyaXRpbmc6IDAsIHNlcVJlYWRpbmc6IDAsIHJhbmRSZWFkaW5nOiAwIH1cbn1cblxuLyoqIFByZXBhcmluZyBzaHVmZmxlZCBpbmRpY2VzIGZvciByYW5kb20gd3JpdGluZy9yZWFkaW5nIHRlc3RzLiAqL1xuZm9yIChkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgc2h1ZmZsZVtkeF0gPSBbXVxuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIHNodWZmbGVbZHhdW2R5XSA9IFtdXG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIHNodWZmbGVbZHhdW2R5XVtkel0gPSBbZHgsIGR5LCBkel1cbiAgICB9XG4gIH1cbn1cblxuLyoqIFNodWZmbGUgdGhlIG1hdHJpeC4gKi9cbnNodWZmbGVNYXRyaXgoc2h1ZmZsZSlcblxuY29uc29sZS5sb2coYCVjM0QgYXJyYXlzIHBlcmZvcm1hbmNlIHRlc3RpbmcgWyR7ZHhNYXh9IHggJHtkeU1heH0geCAke2R6TWF4fV1gLCAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOyBiYWNrZ3JvdW5kLWNvbG9yOiAjY2MwMDAwOycpXG5cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqIENyZWF0aW5nIGFycmF5c1xuICovXG5cbmNvbnNvbGUuZ3JvdXAoJyVjQ3JlYXRpbmcnLCAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOycpXG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzAxICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzAxOiBpbXBsZSAzRF0gYW5kIGZpbGxpbmcgd2l0aCAwLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xubGV0IHNpbXBsZTNEQXJyYXkgPSBbXVxuZm9yIChsZXQgZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIHNpbXBsZTNEQXJyYXlbZHhdID0gW11cbiAgZm9yIChsZXQgZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgc2ltcGxlM0RBcnJheVtkeF1bZHldID0gW11cbiAgICBmb3IgKGxldCBkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIHNpbXBsZTNEQXJyYXlbZHhdW2R5XVtkel0gPSAwXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydTaW1wbGUgM0QnXS5jcmVhdGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMDIgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMDI6IENyZWF0aW5nIFtTaW1wbGUgUHNldWRvIDNEXSBhbmQgZmlsbGluZyB3aXRoIDAuLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5sZXQgc2ltcGxlUHNldWRvM0RBcnJheSA9IFtdXG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBjb25zdCBkaW0xID0gZHggKiBtYXRyaXhTaXplXG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgY29uc3QgZGltMiA9IGR5ICogZHlNYXhcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgc2ltcGxlUHNldWRvM0RBcnJheVtkaW0xICsgZGltMiArIGR6XSA9IDBcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1NpbXBsZSBQc2V1ZG8gM0QnXS5jcmVhdGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMDMgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMDM6IENyZWF0aW5nIFtUeXBlZCBQc2V1ZG8gM0RdIGFuZCBmaWxsaW5nIHdpdGggMC4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmxldCB0eXBlZFBzZXVkbzNEQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGR4TWF4ICogZHlNYXggKiBkek1heClcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGNvbnN0IGRpbTEgPSBkeCAqIG1hdHJpeFNpemVcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBjb25zdCBkaW0yID0gZHkgKiBkeU1heFxuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICB0eXBlZFBzZXVkbzNEQXJyYXlbZGltMSArIGRpbTIgKyBkel0gPSAwXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydUeXBlZCBQc2V1ZG8gM0QnXS5jcmVhdGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMDQgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMDQ6IENyZWF0aW5nIFszRCBNYXBdIGFuZCBmaWxsaW5nIHdpdGggMC4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmxldCBtYXAgPSBuZXcgTWFwKClcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIG1hcC5zZXQoZHgsIG5ldyBNYXAoKSlcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBtYXAuZ2V0KGR4KS5zZXQoZHksIG5ldyBNYXAoKSlcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgbWFwLmdldChkeCkuZ2V0KGR5KS5zZXQoZHosIDApXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWyczRCBNYXAnXS5jcmVhdGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuY29uc29sZS5ncm91cEVuZCgpXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiBTZXF1ZW50aWFsIHdyaXRpbmcgYXJyYXlzXG4gKi9cblxuY29uc29sZS5ncm91cCgnJWNTZXF1ZW50aWFsIHdyaXRpbmcnLCAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOycpXG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzA1ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzA1OiBTZXF1ZW50aWFsIHdyaXRpbmcgW1NpbXBsZSAzRF0gd2l0aCByYW5kb20gdmFsdWVzLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuZm9yIChsZXQgZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAobGV0IGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGZvciAobGV0IGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgc2ltcGxlM0RBcnJheVtkeF1bZHldW2R6XSA9IE1hdGgucmFuZG9tKClcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1NpbXBsZSAzRCddLnNlcVdyaXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzA2ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzA2OiBTZXF1ZW50aWFsIHdyaXRpbmcgW1NpbXBsZSBQc2V1ZG8gM0RdIHdpdGggcmFuZG9tIHZhbHVlcy4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGNvbnN0IGRpbTEgPSBkeCAqIG1hdHJpeFNpemVcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBjb25zdCBkaW0yID0gZHkgKiBkeU1heFxuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICBzaW1wbGVQc2V1ZG8zREFycmF5W2RpbTEgKyBkaW0yICsgZHpdID0gTWF0aC5yYW5kb20oKVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snU2ltcGxlIFBzZXVkbyAzRCddLnNlcVdyaXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzA3ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzA3OiBTZXF1ZW50aWFsIHdyaXRpbmcgW1R5cGVkIFBzZXVkbyAzRF0gd2l0aCByYW5kb20gdmFsdWVzLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuZm9yIChkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgY29uc3QgZGltMSA9IGR4ICogbWF0cml4U2l6ZVxuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGNvbnN0IGRpbTIgPSBkeSAqIGR5TWF4XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIHR5cGVkUHNldWRvM0RBcnJheVtkaW0xICsgZGltMiArIGR6XSA9IE1hdGgucmFuZG9tKClcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1R5cGVkIFBzZXVkbyAzRCddLnNlcVdyaXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzA4ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzA4OiBTZXF1ZW50aWFsIHdyaXRpbmcgWzNEIE1hcF0gd2l0aCByYW5kb20gdmFsdWVzLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuZm9yIChkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgbWFwLmdldChkeCkuZ2V0KGR5KS5zZXQoZHosIE1hdGgucmFuZG9tKCkpXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWyczRCBNYXAnXS5zZXFXcml0aW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG5jb25zb2xlLmdyb3VwRW5kKClcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqIFNlcXVlbnRpYWwgcmVhZGluZyBhcnJheXNcbiAqL1xuXG5jb25zb2xlLmdyb3VwKCclY1NlcXVlbnRpYWwgcmVhZGluZycsICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7JylcblxuLyoqICoqKioqKioqKiogVGVzdCAjMDkgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMDk6IFNlcXVlbnRpYWwgcmVhZGluZyBbU2ltcGxlIDNEXS4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAobGV0IGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBmb3IgKGxldCBkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIHggPSBzaW1wbGUzREFycmF5W2R4XVtkeV1bZHpdXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydTaW1wbGUgM0QnXS5zZXFSZWFkaW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMxMCAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMxMDogU2VxdWVudGlhbCByZWFkaW5nIFtTaW1wbGUgUHNldWRvIDNEXS4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGNvbnN0IGRpbTEgPSBkeCAqIG1hdHJpeFNpemVcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBjb25zdCBkaW0yID0gZHkgKiBkeU1heFxuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICB4ID0gc2ltcGxlUHNldWRvM0RBcnJheVtkaW0xICsgZGltMiArIGR6XVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snU2ltcGxlIFBzZXVkbyAzRCddLnNlcVJlYWRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzExICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzExOiBTZXF1ZW50aWFsIHJlYWRpbmcgW1R5cGVkIFBzZXVkbyAzRF0uLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBjb25zdCBkaW0xID0gZHggKiBtYXRyaXhTaXplXG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgY29uc3QgZGltMiA9IGR5ICogZHlNYXhcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgeCA9IHR5cGVkUHNldWRvM0RBcnJheVtkaW0xICsgZGltMiArIGR6XVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snVHlwZWQgUHNldWRvIDNEJ10uc2VxUmVhZGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMTIgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMTI6IFNlcXVlbnRpYWwgcmVhZGluZyBbM0QgTWFwXS4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIHggPSBtYXAuZ2V0KGR4KS5nZXQoZHkpLmdldChkeilcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJzNEIE1hcCddLnNlcVJlYWRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbmNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICogUmFuZG9tIHdyaXRpbmcgYXJyYXlzXG4gKi9cblxuY29uc29sZS5ncm91cCgnJWNSYW5kb20gd3JpdGluZycsICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7JylcblxuLyoqICoqKioqKioqKiogVGVzdCAjMTMgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMTM6IFJhbmRvbSB3cml0aW5nIFtTaW1wbGUgM0RdIHdpdGggcmFuZG9tIHZhbHVlcy4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAobGV0IGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBmb3IgKGxldCBkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIGluZGljZXMgPSBzaHVmZmxlW2R4XVtkeV1bZHpdXG4gICAgICBzaW1wbGUzREFycmF5W2luZGljZXNbMF1dW2luZGljZXNbMV1dW2luZGljZXNbM11dID0gTWF0aC5yYW5kb20oKVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snU2ltcGxlIDNEJ10ucmFuZFdyaXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzE0ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzE0OiBSYW5kb20gd3JpdGluZyBbU2ltcGxlIFBzZXVkbyAzRF0gd2l0aCByYW5kb20gdmFsdWVzLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuZm9yIChkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgaW5kaWNlcyA9IHNodWZmbGVbZHhdW2R5XVtkel1cbiAgICAgIHNpbXBsZVBzZXVkbzNEQXJyYXlbaW5kaWNlc1swXSAqIG1hdHJpeFNpemUgKyBpbmRpY2VzWzFdICogZHlNYXggKyBpbmRpY2VzWzJdXSA9IE1hdGgucmFuZG9tKClcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1NpbXBsZSBQc2V1ZG8gM0QnXS5yYW5kV3JpdGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMTUgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMTU6IFJhbmRvbSB3cml0aW5nIFtUeXBlZCBQc2V1ZG8gM0RdIHdpdGggcmFuZG9tIHZhbHVlcy4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIGluZGljZXMgPSBzaHVmZmxlW2R4XVtkeV1bZHpdXG4gICAgICB0eXBlZFBzZXVkbzNEQXJyYXlbaW5kaWNlc1swXSAqIG1hdHJpeFNpemUgKyBpbmRpY2VzWzFdICogZHlNYXggKyBpbmRpY2VzWzJdXSA9IE1hdGgucmFuZG9tKClcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1R5cGVkIFBzZXVkbyAzRCddLnJhbmRXcml0aW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMxNiAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMxNjogUmFuZG9tIHdyaXRpbmcgWzNEIE1hcF0gd2l0aCByYW5kb20gdmFsdWVzLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuZm9yIChkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgaW5kaWNlcyA9IHNodWZmbGVbZHhdW2R5XVtkel1cbiAgICAgIG1hcC5nZXQoaW5kaWNlc1swXSkuZ2V0KGluZGljZXNbMV0pLnNldChpbmRpY2VzWzJdLCBNYXRoLnJhbmRvbSgpKVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snM0QgTWFwJ10ucmFuZFdyaXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbmNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICogUmFuZG9tIHJlYWRpbmcgYXJyYXlzXG4gKi9cblxuY29uc29sZS5ncm91cCgnJWNSYW5kb20gcmVhZGluZycsICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7JylcblxuLyoqICoqKioqKioqKiogVGVzdCAjMTcgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMTc6IFJhbmRvbSByZWFkaW5nIFtTaW1wbGUgM0RdLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuZm9yIChsZXQgZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAobGV0IGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGZvciAobGV0IGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgaW5kaWNlcyA9IHNodWZmbGVbZHhdW2R5XVtkel1cbiAgICAgIHggPSBzaW1wbGUzREFycmF5W2luZGljZXNbMF1dW2luZGljZXNbMV1dW2luZGljZXNbM11dXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydTaW1wbGUgM0QnXS5yYW5kUmVhZGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMTggKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMTg6IFJhbmRvbSByZWFkaW5nIFtTaW1wbGUgUHNldWRvIDNEXS4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIGluZGljZXMgPSBzaHVmZmxlW2R4XVtkeV1bZHpdXG4gICAgICB4ID0gc2ltcGxlUHNldWRvM0RBcnJheVtpbmRpY2VzWzBdICogbWF0cml4U2l6ZSArIGluZGljZXNbMV0gKiBkeU1heCArIGluZGljZXNbMl1dXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydTaW1wbGUgUHNldWRvIDNEJ10ucmFuZFJlYWRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzE5ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzE5OiBSYW5kb20gcmVhZGluZyBbVHlwZWQgUHNldWRvIDNEXS4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIGluZGljZXMgPSBzaHVmZmxlW2R4XVtkeV1bZHpdXG4gICAgICB4ID0gdHlwZWRQc2V1ZG8zREFycmF5W2luZGljZXNbMF0gKiBtYXRyaXhTaXplICsgaW5kaWNlc1sxXSAqIGR5TWF4ICsgaW5kaWNlc1syXV1cbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1R5cGVkIFBzZXVkbyAzRCddLnJhbmRSZWFkaW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMyMCAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMyMDogUmFuZG9tIHJlYWRpbmcgWzNEIE1hcF0uLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICBpbmRpY2VzID0gc2h1ZmZsZVtkeF1bZHldW2R6XVxuICAgICAgeCA9IG1hcC5nZXQoaW5kaWNlc1swXSkuZ2V0KGluZGljZXNbMV0pLmdldChpbmRpY2VzWzJdKVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snM0QgTWFwJ10ucmFuZFJlYWRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbmNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICogU2hvdyByZXN1bHRzXG4gKi9cblxuY29uc29sZS5sb2coJy0tLScpXG5jb25zb2xlLmxvZygnJWNSZXN1bHRzIChtcyk6JywgJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnKVxuY29uc29sZS5sb2coJ0lmIHlvdSBkbyBub3Qgc2VlIHRoZSByZXN1bHQgdGFibGUgdGhlbiByZWZyZXNoIHRoZSBwYWdlLicpXG5cbmZvciAobGV0IGtleTEgaW4gc3RhdHMpIHtcbiAgZm9yIChsZXQga2V5MiBpbiBzdGF0c1trZXkxXSlcbiAgICBzdGF0c1trZXkxXVtrZXkyXSA9IE1hdGgucm91bmQoc3RhdHNba2V5MV1ba2V5Ml0pXG59XG5cbmNvbnNvbGUudGFibGUoc3RhdHMpXG4iXSwic291cmNlUm9vdCI6IiJ9