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

for (let key1 in stats) {
  for (let key2 in stats[key1])
    stats[key1][key2] = Math.round(stats[key1][key2])
}

console.table(stats)

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi91dGlscy5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQjtBQUNPO0FBQ1AsZ0NBQWdDLE9BQU87QUFDdkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGNBQWM7QUFDekI7QUFDTzs7QUFFUDs7QUFFQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEMsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEMsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQ3ZDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ04wQzs7QUFFMUM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QTs7QUFFQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqIFNodWZmbGVzIHRoZSBlbGVtZW50cyBvZiBhIDFEIGFycmF5IGF0IHJhbmRvbS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSAtIFRhcmdldCBhcnJheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGVBcnJheShhcnJheSkge1xuICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICBbYXJyYXlbaV0sIGFycmF5W2pdXSA9IFthcnJheVtqXSwgYXJyYXlbaV1dXG4gIH1cbn1cblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiBTaHVmZmxlcyB0aGUgZWxlbWVudHMgb2YgYSAyRCBhcnJheSAobWF0cml4KSBhdCByYW5kb20uXG4gKlxuICogQHBhcmFtIHtBcnJheS48QXJyYXk+fSBtYXRyaXggLSB0YXJnZXQgbWF0cml4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2h1ZmZsZU1hdHJpeChtYXRyaXgpIHtcblxuICBsZXQgYXJyYXkgPSBbXVxuXG4gIC8qKiBNYXRyaXggZXhwYW5kcyBpbnRvIGEgMUQgYXJyYXkuICovXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXhbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIGFycmF5LnB1c2gobWF0cml4W2ldW2pdKVxuICAgIH1cbiAgfVxuXG4gIC8qKiBTaHVmZmxlIHRoZSBhcnJheS4gKi9cbiAgc2h1ZmZsZUFycmF5KGFycmF5KVxuXG4gIC8qKiBUaGUgYXJyYXkgaXMgY29sbGVjdGVkIGludG8gYSBtYXRyaXguICovXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4Lmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtYXRyaXhbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgIG1hdHJpeFtpXVtqXSA9IGFycmF5LnBvcCgpXG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHNodWZmbGVNYXRyaXggfSBmcm9tICcuL3V0aWxzLmpzJ1xuXG4ndXNlIHN0cmljdCdcblxuY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgZHhNYXg6IDEwMCxcbiAgZHlNYXg6IDEwMCxcbiAgZHpNYXg6IDEwMCxcbn1cblxuLyoqIEFycmF5cyBkaW1lbnNpb25zICh0cnlpbmcgdG8gcmVhZCB0aGVtIGZyb20gdXJsKS4gKi9cbmNvbnN0IGR4TWF4ID0gKHVybFBhcmFtcy5nZXQoJ3gnKSkgPyBOdW1iZXIucGFyc2VJbnQodXJsUGFyYW1zLmdldCgneCcpKSA6IGRlZmF1bHRzLmR4TWF4XG5jb25zdCBkeU1heCA9ICh1cmxQYXJhbXMuZ2V0KCd5JykpID8gTnVtYmVyLnBhcnNlSW50KHVybFBhcmFtcy5nZXQoJ3knKSkgOiBkZWZhdWx0cy5keU1heFxuY29uc3QgZHpNYXggPSAodXJsUGFyYW1zLmdldCgneicpKSA/IE51bWJlci5wYXJzZUludCh1cmxQYXJhbXMuZ2V0KCd6JykpIDogZGVmYXVsdHMuZHpNYXhcblxuLyoqIFV0aWxpdHkgdmFyaWFibGVzLiAqL1xuY29uc3QgbWF0cml4U2l6ZSA9IGR4TWF4ICogZHlNYXhcbmxldCBkeCwgZHksIGR6ID0gMFxubGV0IHggPSAwXG5sZXQgc2h1ZmZsZSA9IFtdXG5sZXQgaW5kaWNlcyA9IFtdXG5sZXQgdGltZVN0YXJ0LCB0aW1lRW5kID0gMFxuXG4vKiogU3RhdGlzdGljcy4gKi9cbmNvbnN0IHN0YXRzID0ge1xuICAnU2ltcGxlIDNEJzogICAgICAgIHsgY3JlYXRpbmc6IDAsIHNlcVdyaXRpbmc6IDAsIHJhbmRXcml0aW5nOiAwLCBzZXFSZWFkaW5nOiAwLCByYW5kUmVhZGluZzogMCB9LFxuICAnU2ltcGxlIFBzZXVkbyAzRCc6IHsgY3JlYXRpbmc6IDAsIHNlcVdyaXRpbmc6IDAsIHJhbmRXcml0aW5nOiAwLCBzZXFSZWFkaW5nOiAwLCByYW5kUmVhZGluZzogMCB9LFxuICAnVHlwZWQgUHNldWRvIDNEJzogIHsgY3JlYXRpbmc6IDAsIHNlcVdyaXRpbmc6IDAsIHJhbmRXcml0aW5nOiAwLCBzZXFSZWFkaW5nOiAwLCByYW5kUmVhZGluZzogMCB9LFxuICAnM0QgTWFwJzogICAgICAgICAgIHsgY3JlYXRpbmc6IDAsIHNlcVdyaXRpbmc6IDAsIHJhbmRXcml0aW5nOiAwLCBzZXFSZWFkaW5nOiAwLCByYW5kUmVhZGluZzogMCB9XG59XG5cbi8qKiBQcmVwYXJpbmcgc2h1ZmZsZWQgaW5kaWNlcyBmb3IgcmFuZG9tIHdyaXRpbmcvcmVhZGluZyB0ZXN0cy4gKi9cbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIHNodWZmbGVbZHhdID0gW11cbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBzaHVmZmxlW2R4XVtkeV0gPSBbXVxuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICBzaHVmZmxlW2R4XVtkeV1bZHpdID0gW2R4LCBkeSwgZHpdXG4gICAgfVxuICB9XG59XG5cbi8qKiBTaHVmZmxlIHRoZSBtYXRyaXguICovXG5zaHVmZmxlTWF0cml4KHNodWZmbGUpXG5cbmNvbnNvbGUubG9nKGAlYzNEIGFycmF5cyBwZXJmb3JtYW5jZSB0ZXN0aW5nIFske2R4TWF4fSB4ICR7ZHlNYXh9IHggJHtkek1heH1dYCwgJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsgYmFja2dyb3VuZC1jb2xvcjogI2NjMDAwMDsnKVxuXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiBDcmVhdGluZyBhcnJheXNcbiAqL1xuXG5jb25zb2xlLmdyb3VwKCclY0NyZWF0aW5nJywgJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnKVxuXG4vKiogKioqKioqKioqKiBUZXN0ICMwMSAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMwMTogaW1wbGUgM0RdIGFuZCBmaWxsaW5nIHdpdGggMC4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmxldCBzaW1wbGUzREFycmF5ID0gW11cbmZvciAobGV0IGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBzaW1wbGUzREFycmF5W2R4XSA9IFtdXG4gIGZvciAobGV0IGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIHNpbXBsZTNEQXJyYXlbZHhdW2R5XSA9IFtdXG4gICAgZm9yIChsZXQgZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICBzaW1wbGUzREFycmF5W2R4XVtkeV1bZHpdID0gMFxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snU2ltcGxlIDNEJ10uY3JlYXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzAyICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzAyOiBDcmVhdGluZyBbU2ltcGxlIFBzZXVkbyAzRF0gYW5kIGZpbGxpbmcgd2l0aCAwLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xubGV0IHNpbXBsZVBzZXVkbzNEQXJyYXkgPSBbXVxuZm9yIChkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgY29uc3QgZGltMSA9IGR4ICogbWF0cml4U2l6ZVxuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGNvbnN0IGRpbTIgPSBkeSAqIGR5TWF4XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIHNpbXBsZVBzZXVkbzNEQXJyYXlbZGltMSArIGRpbTIgKyBkel0gPSAwXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydTaW1wbGUgUHNldWRvIDNEJ10uY3JlYXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzAzICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzAzOiBDcmVhdGluZyBbVHlwZWQgUHNldWRvIDNEXSBhbmQgZmlsbGluZyB3aXRoIDAuLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5sZXQgdHlwZWRQc2V1ZG8zREFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShkeE1heCAqIGR5TWF4ICogZHpNYXgpXG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBjb25zdCBkaW0xID0gZHggKiBtYXRyaXhTaXplXG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgY29uc3QgZGltMiA9IGR5ICogZHlNYXhcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgdHlwZWRQc2V1ZG8zREFycmF5W2RpbTEgKyBkaW0yICsgZHpdID0gMFxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snVHlwZWQgUHNldWRvIDNEJ10uY3JlYXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzA0ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzA0OiBDcmVhdGluZyBbM0QgTWFwXSBhbmQgZmlsbGluZyB3aXRoIDAuLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5sZXQgbWFwID0gbmV3IE1hcCgpXG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBtYXAuc2V0KGR4LCBuZXcgTWFwKCkpXG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgbWFwLmdldChkeCkuc2V0KGR5LCBuZXcgTWFwKCkpXG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIG1hcC5nZXQoZHgpLmdldChkeSkuc2V0KGR6LCAwKVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snM0QgTWFwJ10uY3JlYXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbmNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4vKiogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKlxuICogU2VxdWVudGlhbCB3cml0aW5nIGFycmF5c1xuICovXG5cbmNvbnNvbGUuZ3JvdXAoJyVjU2VxdWVudGlhbCB3cml0aW5nJywgJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogI2ZmZmZmZjsnKVxuXG4vKiogKioqKioqKioqKiBUZXN0ICMwNSAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMwNTogU2VxdWVudGlhbCB3cml0aW5nIFtTaW1wbGUgM0RdIHdpdGggcmFuZG9tIHZhbHVlcy4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAobGV0IGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBmb3IgKGxldCBkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIHNpbXBsZTNEQXJyYXlbZHhdW2R5XVtkel0gPSBNYXRoLnJhbmRvbSgpXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydTaW1wbGUgM0QnXS5zZXFXcml0aW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMwNiAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMwNjogU2VxdWVudGlhbCB3cml0aW5nIFtTaW1wbGUgUHNldWRvIDNEXSB3aXRoIHJhbmRvbSB2YWx1ZXMuLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBjb25zdCBkaW0xID0gZHggKiBtYXRyaXhTaXplXG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgY29uc3QgZGltMiA9IGR5ICogZHlNYXhcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgc2ltcGxlUHNldWRvM0RBcnJheVtkaW0xICsgZGltMiArIGR6XSA9IE1hdGgucmFuZG9tKClcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1NpbXBsZSBQc2V1ZG8gM0QnXS5zZXFXcml0aW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMwNyAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMwNzogU2VxdWVudGlhbCB3cml0aW5nIFtUeXBlZCBQc2V1ZG8gM0RdIHdpdGggcmFuZG9tIHZhbHVlcy4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGNvbnN0IGRpbTEgPSBkeCAqIG1hdHJpeFNpemVcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBjb25zdCBkaW0yID0gZHkgKiBkeU1heFxuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICB0eXBlZFBzZXVkbzNEQXJyYXlbZGltMSArIGRpbTIgKyBkel0gPSBNYXRoLnJhbmRvbSgpXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydUeXBlZCBQc2V1ZG8gM0QnXS5zZXFXcml0aW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMwOCAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMwODogU2VxdWVudGlhbCB3cml0aW5nIFszRCBNYXBdIHdpdGggcmFuZG9tIHZhbHVlcy4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIG1hcC5nZXQoZHgpLmdldChkeSkuc2V0KGR6LCBNYXRoLnJhbmRvbSgpKVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snM0QgTWFwJ10uc2VxV3JpdGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuY29uc29sZS5ncm91cEVuZCgpXG5cbi8qKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqXG4gKiBTZXF1ZW50aWFsIHJlYWRpbmcgYXJyYXlzXG4gKi9cblxuY29uc29sZS5ncm91cCgnJWNTZXF1ZW50aWFsIHJlYWRpbmcnLCAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOycpXG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzA5ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzA5OiBTZXF1ZW50aWFsIHJlYWRpbmcgW1NpbXBsZSAzRF0uLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGxldCBkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgZm9yIChsZXQgZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChsZXQgZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICB4ID0gc2ltcGxlM0RBcnJheVtkeF1bZHldW2R6XVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snU2ltcGxlIDNEJ10uc2VxUmVhZGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMTAgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMTA6IFNlcXVlbnRpYWwgcmVhZGluZyBbU2ltcGxlIFBzZXVkbyAzRF0uLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBjb25zdCBkaW0xID0gZHggKiBtYXRyaXhTaXplXG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgY29uc3QgZGltMiA9IGR5ICogZHlNYXhcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgeCA9IHNpbXBsZVBzZXVkbzNEQXJyYXlbZGltMSArIGRpbTIgKyBkel1cbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1NpbXBsZSBQc2V1ZG8gM0QnXS5zZXFSZWFkaW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMxMSAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMxMTogU2VxdWVudGlhbCByZWFkaW5nIFtUeXBlZCBQc2V1ZG8gM0RdLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuZm9yIChkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgY29uc3QgZGltMSA9IGR4ICogbWF0cml4U2l6ZVxuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGNvbnN0IGRpbTIgPSBkeSAqIGR5TWF4XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIHggPSB0eXBlZFBzZXVkbzNEQXJyYXlbZGltMSArIGRpbTIgKyBkel1cbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1R5cGVkIFBzZXVkbyAzRCddLnNlcVJlYWRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzEyICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzEyOiBTZXF1ZW50aWFsIHJlYWRpbmcgWzNEIE1hcF0uLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICB4ID0gbWFwLmdldChkeCkuZ2V0KGR5KS5nZXQoZHopXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWyczRCBNYXAnXS5zZXFSZWFkaW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG5jb25zb2xlLmdyb3VwRW5kKClcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqIFJhbmRvbSB3cml0aW5nIGFycmF5c1xuICovXG5cbmNvbnNvbGUuZ3JvdXAoJyVjUmFuZG9tIHdyaXRpbmcnLCAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOycpXG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzEzICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzEzOiBSYW5kb20gd3JpdGluZyBbU2ltcGxlIDNEXSB3aXRoIHJhbmRvbSB2YWx1ZXMuLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGxldCBkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgZm9yIChsZXQgZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChsZXQgZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICBpbmRpY2VzID0gc2h1ZmZsZVtkeF1bZHldW2R6XVxuICAgICAgc2ltcGxlM0RBcnJheVtpbmRpY2VzWzBdXVtpbmRpY2VzWzFdXVtpbmRpY2VzWzNdXSA9IE1hdGgucmFuZG9tKClcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJ1NpbXBsZSAzRCddLnJhbmRXcml0aW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMxNCAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMxNDogUmFuZG9tIHdyaXRpbmcgW1NpbXBsZSBQc2V1ZG8gM0RdIHdpdGggcmFuZG9tIHZhbHVlcy4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIGluZGljZXMgPSBzaHVmZmxlW2R4XVtkeV1bZHpdXG4gICAgICBzaW1wbGVQc2V1ZG8zREFycmF5W2luZGljZXNbMF0gKiBtYXRyaXhTaXplICsgaW5kaWNlc1sxXSAqIGR5TWF4ICsgaW5kaWNlc1syXV0gPSBNYXRoLnJhbmRvbSgpXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydTaW1wbGUgUHNldWRvIDNEJ10ucmFuZFdyaXRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzE1ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzE1OiBSYW5kb20gd3JpdGluZyBbVHlwZWQgUHNldWRvIDNEXSB3aXRoIHJhbmRvbSB2YWx1ZXMuLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICBpbmRpY2VzID0gc2h1ZmZsZVtkeF1bZHldW2R6XVxuICAgICAgdHlwZWRQc2V1ZG8zREFycmF5W2luZGljZXNbMF0gKiBtYXRyaXhTaXplICsgaW5kaWNlc1sxXSAqIGR5TWF4ICsgaW5kaWNlc1syXV0gPSBNYXRoLnJhbmRvbSgpXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydUeXBlZCBQc2V1ZG8gM0QnXS5yYW5kV3JpdGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMTYgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMTY6IFJhbmRvbSB3cml0aW5nIFszRCBNYXBdIHdpdGggcmFuZG9tIHZhbHVlcy4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAoZHggPSAwOyBkeCA8IGR4TWF4OyBkeCsrKSB7XG4gIGZvciAoZHkgPSAwOyBkeSA8IGR5TWF4OyBkeSsrKSB7XG4gICAgZm9yIChkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIGluZGljZXMgPSBzaHVmZmxlW2R4XVtkeV1bZHpdXG4gICAgICBtYXAuZ2V0KGluZGljZXNbMF0pLmdldChpbmRpY2VzWzFdKS5zZXQoaW5kaWNlc1syXSwgTWF0aC5yYW5kb20oKSlcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJzNEIE1hcCddLnJhbmRXcml0aW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG5jb25zb2xlLmdyb3VwRW5kKClcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqIFJhbmRvbSByZWFkaW5nIGFycmF5c1xuICovXG5cbmNvbnNvbGUuZ3JvdXAoJyVjUmFuZG9tIHJlYWRpbmcnLCAnZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjZmZmZmZmOycpXG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzE3ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzE3OiBSYW5kb20gcmVhZGluZyBbU2ltcGxlIDNEXS4uLicpXG50aW1lU3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcbmZvciAobGV0IGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGxldCBkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBmb3IgKGxldCBkeiA9IDA7IGR6IDwgZHpNYXg7IGR6KyspIHtcbiAgICAgIGluZGljZXMgPSBzaHVmZmxlW2R4XVtkeV1bZHpdXG4gICAgICB4ID0gc2ltcGxlM0RBcnJheVtpbmRpY2VzWzBdXVtpbmRpY2VzWzFdXVtpbmRpY2VzWzNdXVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snU2ltcGxlIDNEJ10ucmFuZFJlYWRpbmcgPSB0aW1lRW5kIC0gdGltZVN0YXJ0XG5cbi8qKiAqKioqKioqKioqIFRlc3QgIzE4ICoqKioqKioqKiogKi9cblxuY29uc29sZS5sb2coJ1Rlc3QgIzE4OiBSYW5kb20gcmVhZGluZyBbU2ltcGxlIFBzZXVkbyAzRF0uLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICBpbmRpY2VzID0gc2h1ZmZsZVtkeF1bZHldW2R6XVxuICAgICAgeCA9IHNpbXBsZVBzZXVkbzNEQXJyYXlbaW5kaWNlc1swXSAqIG1hdHJpeFNpemUgKyBpbmRpY2VzWzFdICogZHlNYXggKyBpbmRpY2VzWzJdXVxuICAgIH1cbiAgfVxufVxudGltZUVuZCA9IHBlcmZvcm1hbmNlLm5vdygpXG5zdGF0c1snU2ltcGxlIFBzZXVkbyAzRCddLnJhbmRSZWFkaW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG4vKiogKioqKioqKioqKiBUZXN0ICMxOSAqKioqKioqKioqICovXG5cbmNvbnNvbGUubG9nKCdUZXN0ICMxOTogUmFuZG9tIHJlYWRpbmcgW1R5cGVkIFBzZXVkbyAzRF0uLi4nKVxudGltZVN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5mb3IgKGR4ID0gMDsgZHggPCBkeE1heDsgZHgrKykge1xuICBmb3IgKGR5ID0gMDsgZHkgPCBkeU1heDsgZHkrKykge1xuICAgIGZvciAoZHogPSAwOyBkeiA8IGR6TWF4OyBkeisrKSB7XG4gICAgICBpbmRpY2VzID0gc2h1ZmZsZVtkeF1bZHldW2R6XVxuICAgICAgeCA9IHR5cGVkUHNldWRvM0RBcnJheVtpbmRpY2VzWzBdICogbWF0cml4U2l6ZSArIGluZGljZXNbMV0gKiBkeU1heCArIGluZGljZXNbMl1dXG4gICAgfVxuICB9XG59XG50aW1lRW5kID0gcGVyZm9ybWFuY2Uubm93KClcbnN0YXRzWydUeXBlZCBQc2V1ZG8gM0QnXS5yYW5kUmVhZGluZyA9IHRpbWVFbmQgLSB0aW1lU3RhcnRcblxuLyoqICoqKioqKioqKiogVGVzdCAjMjAgKioqKioqKioqKiAqL1xuXG5jb25zb2xlLmxvZygnVGVzdCAjMjA6IFJhbmRvbSByZWFkaW5nIFszRCBNYXBdLi4uJylcbnRpbWVTdGFydCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuZm9yIChkeCA9IDA7IGR4IDwgZHhNYXg7IGR4KyspIHtcbiAgZm9yIChkeSA9IDA7IGR5IDwgZHlNYXg7IGR5KyspIHtcbiAgICBmb3IgKGR6ID0gMDsgZHogPCBkek1heDsgZHorKykge1xuICAgICAgaW5kaWNlcyA9IHNodWZmbGVbZHhdW2R5XVtkel1cbiAgICAgIHggPSBtYXAuZ2V0KGluZGljZXNbMF0pLmdldChpbmRpY2VzWzFdKS5nZXQoaW5kaWNlc1syXSlcbiAgICB9XG4gIH1cbn1cbnRpbWVFbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuc3RhdHNbJzNEIE1hcCddLnJhbmRSZWFkaW5nID0gdGltZUVuZCAtIHRpbWVTdGFydFxuXG5jb25zb2xlLmdyb3VwRW5kKClcblxuLyoqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICpcbiAqIFNob3cgcmVzdWx0c1xuICovXG5cbmNvbnNvbGUubG9nKCctLS0nKVxuY29uc29sZS5sb2coJyVjUmVzdWx0cyAobXMpOicsICdmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICNmZmZmZmY7JylcblxuZm9yIChsZXQga2V5MSBpbiBzdGF0cykge1xuICBmb3IgKGxldCBrZXkyIGluIHN0YXRzW2tleTFdKVxuICAgIHN0YXRzW2tleTFdW2tleTJdID0gTWF0aC5yb3VuZChzdGF0c1trZXkxXVtrZXkyXSlcbn1cblxuY29uc29sZS50YWJsZShzdGF0cylcbiJdLCJzb3VyY2VSb290IjoiIn0=