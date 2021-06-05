/** ****************************************************************************
 *
 * Перемешивает элементы одномерного массива случайным образом.
 *
 * @param array - Целевой массив.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

/** ****************************************************************************
 *
 * Перемешивает элементы матрицы случайным образом.
 *
 * @param matrix - Целевая матрица.
 */
function shuffleMatrix(matrix) {

  let array = []

  /** Матрица развертывается в одномерный массив. */
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      array.push(matrix[i][j])
    }
  }

  /** Перемешивание массива. */
  shuffleArray(array)

  /** Массив собирается в матрицу. */
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = array.pop()
    }
  }
}
