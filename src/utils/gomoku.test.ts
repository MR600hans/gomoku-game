import { checkWinner } from './gomoku'

describe('checkWinner', () => {
  const createEmptyBoard = () => Array(15).fill(null).map(() => Array(15).fill(null))

  test('should return null for empty board', () => {
    const board = createEmptyBoard()
    expect(checkWinner(board, 7, 7)).toBe(null)
  })

  test('should detect horizontal win', () => {
    const board = createEmptyBoard()
    for (let i = 0; i < 5; i++) {
      board[7][i] = 'B'
    }
    expect(checkWinner(board, 7, 2)).toBe('B')
  })

  test('should detect vertical win', () => {
    const board = createEmptyBoard()
    for (let i = 0; i < 5; i++) {
      board[i][7] = 'W'
    }
    expect(checkWinner(board, 2, 7)).toBe('W')
  })

  test('should detect diagonal win (top-left to bottom-right)', () => {
    const board = createEmptyBoard()
    for (let i = 0; i < 5; i++) {
      board[i][i] = 'B'
    }
    expect(checkWinner(board, 2, 2)).toBe('B')
  })

  test('should detect diagonal win (top-right to bottom-left)', () => {
    const board = createEmptyBoard()
    for (let i = 0; i < 5; i++) {
      board[i][14 - i] = 'W'
    }
    expect(checkWinner(board, 2, 12)).toBe('W')
  })

  test('should return null for incomplete line', () => {
    const board = createEmptyBoard()
    for (let i = 0; i < 4; i++) {
      board[7][i] = 'B'
    }
    expect(checkWinner(board, 7, 2)).toBe(null)
  })
}) 