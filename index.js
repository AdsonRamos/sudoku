import { Board } from "./src/helpers/board.js";
import { sleep } from "./src/helpers/util.js";
import { TableView } from "./src/view/table.js";

let originalBoard
let currentBoard

const board = new Board({})

const solveBtn = document.getElementById('solveButton')
const newGameBtn = document.getElementById('newGameButton')

const stage = document.getElementById('stage')

const tableView = new TableView()
const table = tableView.generateNewTable()
tableView.createRightGrid()
stage.appendChild(table)

const levels = ['easy', 'medium', 'hard']

const cleanTable = (table) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = table.rows[i].cells[j]
      cell.classList.forEach(el => cell.classList.remove(el))
    }
  }
}

const newGame = () => {
  cleanTable(table)
  const levelSelect = document.getElementById('levelSelect')
  originalBoard = board.generateSudokuBoard(levels[levelSelect.selectedIndex])
  currentBoard = structuredClone(originalBoard)
  tableView.setCurrentBoard(currentBoard)
  tableView.fillTable(originalBoard, 'fixed')
}

const solveAndShow = async () => {
  const { states } = Board.getSolution(originalBoard)

  for (let i = 0; i < states.length; i++) {
    await sleep(50)
    tableView.fillTable(states[i], 'fromSolution')
  }
}

solveBtn.addEventListener('click', () => {
  solveAndShow()
})

newGameBtn.addEventListener('click', () => {
  newGame()
})

newGame()