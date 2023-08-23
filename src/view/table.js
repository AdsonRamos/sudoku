import { Board } from "../helpers/board.js";

class TableView {
  #getCell = (row, col) => {
    return this.table.rows[row].cells[col]
  }

  generateNewTable = () => {
    const table = document.createElement('table')
    table.id = 'table'
    for (let i = 0; i < 3; i++) {
      const colgroup = document.createElement('colgroup')
      colgroup.appendChild(document.createElement('col'))
      colgroup.appendChild(document.createElement('col'))
      colgroup.appendChild(document.createElement('col'))
      table.appendChild(colgroup)
    }
    for (let i = 0; i < 3; i++) {
      const tbody = document.createElement('tbody')
      for (let j = 0; j < 3; j++) {
        const tr = document.createElement('tr')
        for (let k = 0; k < 9; k++) {
          const td = document.createElement('td')
          td.addEventListener('mousedown', () => {
            const xPos = 3 * i + j
            const yPos = k

            const currentCell = this.#getCell(xPos, yPos)

            if (currentCell.classList.contains('fixed')) {
              return
            }

            if (this.tableX !== undefined && this.tableY !== undefined) {
              const oldCell = this.#getCell(this.tableX, this.tableY)
              oldCell.classList.remove('selected')
            }

            this.tableX = xPos
            this.tableY = yPos

            this.#activateGrid()
            td.classList.add('selected')
          })
          tr.appendChild(td)
        }
        tbody.appendChild(tr)
      }
      table.appendChild(tbody)
    }

    this.table = table

    return table
  }

  #activateGrid = () => {
    const grid = document.getElementById('gridTBody')
    console.log(grid)
    grid.classList.remove('deactivate')
    grid.classList.add('activate')
  }

  #changeCell = (row, col, value, cellType) => {
    const cell = this.table.rows[row].cells[col]

    cell.innerHTML = value
    if (cellType === 'fixed') {
      cell.classList.add(cellType)
    } else if (cellType === 'fromSolution' && this.currentBoard[row][col] === 0) {
      cell.classList.add(cellType)
    }
  }

  fillTable = (board, cellType) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j]) {
          this.#changeCell(i, j, board[i][j], cellType)
        } else {
          this.table.rows[i].cells[j].innerText = ''
          this.table.rows[i].cells[j].classList.remove('fromSolution')
        }
      }
    }
  }

  setCurrentBoard = (currentBoard) => {
    this.currentBoard = currentBoard
  }

  createRightGrid = () => {
    const [rightSidebar] = document.getElementsByClassName('right-sidebar')
    const gridTable = document.createElement('table')
    const tbody = document.createElement('tbody')
    tbody.id = 'gridTBody'
    tbody.classList.add('deactivate')
    for (let i = 0; i < 3; i++) {
      const tr = document.createElement('tr')
      for (let j = 0; j < 3; j++) {
        const td = document.createElement('td')
        td.innerText = 3 * i + j + 1
        td.addEventListener('mousedown', event => {
          this.#changeCell(this.tableX, this.tableY, 3 * i + j + 1, false)
          this.currentBoard[this.tableX][this.tableY] =  3 * i + j + 1
          if (Board.isValidState(this.currentBoard)) {
            alert("You won the game!! Press New Game to play again!!")
          }
        })
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    }
    gridTable.appendChild(tbody)
    rightSidebar.prepend(gridTable)
  }
}

export {
  TableView
}