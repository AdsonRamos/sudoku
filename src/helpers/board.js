import { clone } from "./util.js";

// function to generate an empty sudoku matrix
const generateEmptySudokuGrid = () => {
  const grid = []
  for (let i = 0; i < 9; i++) {
    grid.push([]);
    for (let j = 0; j < 9; j++) {
      grid[i].push(0);
    }
  }
  return grid;
}

// function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// function to check if a number can be entered in a given position
const canInsertNumber = (grid, row, col, num) => {
  // Check if the number already exists in the same row or collumn
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) {
      return false;
    }
  }

  // Check if the number already exists in the same 3x3 block
  const startRow = Math.floor(row / 3) * 3
  const startCol = Math.floor(col / 3) * 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) {
        return false
      }
    }
  }

  return true
}

const getCandidates = (matrix, row, col) => {
  const vertical = Array(9).fill(null)
  const horizontal = Array(9).fill(null)
  const square = Array(9).fill(null)

  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][col]) {
      vertical[matrix[i][col] - 1] = matrix[i][col]
    }

    if (matrix[row][i]) {
      horizontal[matrix[row][i] - 1] = matrix[row][i]
    }
  }

  for (let i = 3 * Math.floor(row / 3); i < 3 * Math.floor(row / 3) + 3; i++) {
    for (let j = 3 * Math.floor(col / 3); j < 3 * Math.floor(col / 3) + 3; j++) {
      if (matrix[i][j]) {
        square[matrix[i][j] - 1] = matrix[i][j]
      }
    }
  }

  let candidates = []

  for (let i = 1; i <= 9; i++) {
    if (!horizontal.includes(i) && !vertical.includes(i) && !square.includes(i)) {
      candidates.push(i)
    }
  }

  return candidates
}

const getSquare = (matrix, row, col) => {
  let square = []

  for (let i = 3 * Math.floor(row / 3); i < 3 * Math.floor(row / 3) + 3; i++) {
    square = square.concat(matrix[i].slice(3 * Math.floor(col / 3), 3 * Math.floor(col / 3) + 3))
  }

  return square
}

class Board {
  static solutionStates = []

  // function to generate a Sudoku board with a certain level of difficulty
  generateSudokuBoard = (difficulty) => {
    const grid = generateEmptySudokuGrid()
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    shuffleArray(numbers)

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const numIndex = (row * 3 + Math.floor(row / 3) + col) % 9
        const num = numbers[numIndex]
        if (canInsertNumber(grid, row, col, num)) {
          grid[row][col] = num
        } else {
          // try to find a valid number
          for (let i = numIndex + 1; i < numIndex + 9; i++) {
            const nextNum = numbers[i % 9]
            if (canInsertNumber(grid, row, col, nextNum)) {
              grid[row][col] = nextNum
              break
            }
          }
        }
      }
    }

    let numToRemove = 0
    switch (difficulty) {
      case 'easy':
        numToRemove = 40
        break;
      case 'medium':
        numToRemove = 50
        break;
      case 'hard':
        numToRemove = 40
        break;

      default:
        numToRemove = 40
        break;
    }

    const indices = []
    for (let i = 0; i < 81; i++) {
      indices.push(i)
    }

    shuffleArray(indices)

    for (let i = 0; i < numToRemove; i++) {
      const index = indices[i]
      const row = Math.floor(index / 9)
      const col = index % 9
      grid[row][col] = 0
    }

    return grid
  }

  static isValidState = (matrix) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let row = clone(matrix[i])
        let col = clone(matrix.map(el => el[j]))
        let square = clone(getSquare(matrix, i, j))

        row = row.sort((a, b) => {
          return a - b
        })

        col = col.sort((a, b) => {
          return a - b
        })

        square = square.sort((a, b) => {
          return a - b
        })

        for (let k = 0; k < 9; k++) {
          if (row[k] !== k + 1 || col[k] !== k + 1 || square[k] !== k + 1) {
            return false
          }
        }
      }
    }

    return true
  }

  static #solve = (matrix) => {
    if (this.isValidState(matrix)) {
      return {
        solution: matrix,
        states: this.solutionStates,
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (!matrix[i][j]) {
          let candidates = getCandidates(matrix, i, j)

          for (let k = 0; k < candidates.length; k++) {
            matrix[i][j] = candidates[k]
            this.solutionStates.push(clone(matrix))
            let isSolved = this.#solve(matrix)
            if (isSolved) {
              return isSolved
            } else {
              matrix[i][j] = null
              this.solutionStates.push(clone(matrix))
            }
          }

          return false
        }
      }
    }
    return true
  }

  static getSolution = (matrix) => {
    this.solutionStates = []

    return this.#solve(matrix)
  }
}

export {
  Board
}