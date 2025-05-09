type Player = 'B' | 'W' | null

export function checkWinner(board: (Player)[][], lastX: number, lastY: number): Player {
  const currentPlayer = board[lastX][lastY]
  if (!currentPlayer) return null

  // Check horizontal
  let count = 1
  let x = lastX
  let y = lastY - 1
  while (y >= 0 && board[x][y] === currentPlayer) {
    count++
    y--
  }
  y = lastY + 1
  while (y < 10 && board[x][y] === currentPlayer) {
    count++
    y++
  }
  if (count >= 5) return currentPlayer

  // Check vertical
  count = 1
  x = lastX - 1
  y = lastY
  while (x >= 0 && board[x][y] === currentPlayer) {
    count++
    x--
  }
  x = lastX + 1
  while (x < 10 && board[x][y] === currentPlayer) {
    count++
    x++
  }
  if (count >= 5) return currentPlayer

  // Check diagonal (top-left to bottom-right)
  count = 1
  x = lastX - 1
  y = lastY - 1
  while (x >= 0 && y >= 0 && board[x][y] === currentPlayer) {
    count++
    x--
    y--
  }
  x = lastX + 1
  y = lastY + 1
  while (x < 10 && y < 10 && board[x][y] === currentPlayer) {
    count++
    x++
    y++
  }
  if (count >= 5) return currentPlayer

  // Check diagonal (top-right to bottom-left)
  count = 1
  x = lastX - 1
  y = lastY + 1
  while (x >= 0 && y < 10 && board[x][y] === currentPlayer) {
    count++
    x--
    y++
  }
  x = lastX + 1
  y = lastY - 1
  while (x < 10 && y >= 0 && board[x][y] === currentPlayer) {
    count++
    x++
    y--
  }
  if (count >= 5) return currentPlayer

  return null
} 