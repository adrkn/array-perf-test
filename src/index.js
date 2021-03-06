import { shuffleMatrix } from './utils.js'

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
shuffleMatrix(shuffle)

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
