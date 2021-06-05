/** ****************************************************************************
 *
 * Shuffles the elements of a 1D array at random.
 *
 * @param {Array} array - Target array.
 */
export function shuffleArray(array) {
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
export function shuffleMatrix(matrix) {

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
