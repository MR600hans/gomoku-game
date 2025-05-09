import React, { useEffect, useRef, useState } from 'react'
import { useRoom } from '../hooks/useRoom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

interface BoardProps {
  roomId: string
}

const Board: React.FC<BoardProps> = ({ roomId }) => {
  const { state, makeMove, playerRole } = useRoom(roomId)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cellSize, setCellSize] = useState(32)
  const [pendingMove, setPendingMove] = useState<{row: number, col: number} | null>(null)

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const padding = 32
        // Use the smaller dimension to ensure square board
        const maxSize = Math.min(screenWidth - padding * 2, screenHeight - 250)
        const calculatedCellSize = Math.floor(maxSize / 9) // 9 gaps for 10 lines
        const minCellSize = 30 // Reduced minimum size for very small screens
        const newCellSize = Math.max(calculatedCellSize, minCellSize)
        setCellSize(newCellSize)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleCellClick = (row: number, col: number) => {
    if (!state || 
        state.board[`${row},${col}`] || 
        state.winner || 
        !state.gameStarted || 
        !playerRole ||
        state.players.current !== state.players[playerRole] ||
        pendingMove) return // Prevent selecting when it's not your turn or when there's a pending move
    setPendingMove({ row, col })
  }

  const handleConfirmMove = async () => {
    if (!pendingMove || !state) return
    
    await makeMove(pendingMove.row, pendingMove.col)
    
    const positions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ]

    const currentPlayer = state.currentTurn
    let maxCount = 1

    for (const [dx, dy] of positions) {
      let count = 1
      let x = pendingMove.row + dx
      let y = pendingMove.col + dy
      
      while (x >= 0 && x < 10 && y >= 0 && y < 10 && state.board[`${x},${y}`] === currentPlayer) {
        count++
        x += dx
        y += dy
      }
      
      x = pendingMove.row - dx
      y = pendingMove.col - dy
      while (x >= 0 && x < 10 && y >= 0 && y < 10 && state.board[`${x},${y}`] === currentPlayer) {
        count++
        x -= dx
        y -= dy
      }

      maxCount = Math.max(maxCount, count)
    }

    if (maxCount >= 5) {
      const roomRef = doc(db, 'rooms', roomId)
      await updateDoc(roomRef, { winner: currentPlayer })
    }

    setPendingMove(null)
  }

  const handleCancelMove = () => {
    setPendingMove(null)
  }

  const renderCell = (row: number, col: number) => {
    const piece = state?.board[`${row},${col}`]
    const lineWidth = Math.max(1, Math.floor(cellSize / 32))
    const isPending = pendingMove?.row === row && pendingMove?.col === col
    
    return (
      <div
        key={`${row}-${col}`}
        className="relative cursor-pointer touch-manipulation"
        style={{
          width: cellSize,
          height: cellSize,
          position: 'relative',
          backgroundColor: 'transparent',
        }}
        onClick={() => state?.gameStarted ? handleCellClick(row, col) : null}
      >
        {/* Horizontal line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            width: '100%',
            height: lineWidth,
            backgroundColor: 'black',
            transform: 'translateY(-50%)',
          }}
        />
        
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            height: '100%',
            width: lineWidth,
            backgroundColor: 'black',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Game piece */}
        {(piece || (isPending && state?.gameStarted)) && (
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: Math.floor(cellSize * 0.8),
              height: Math.floor(cellSize * 0.8),
              borderRadius: '50%',
              backgroundColor: isPending ? (state?.currentTurn === 'B' ? '#000' : '#fff') : (piece === 'B' ? '#000' : '#fff'),
              border: (isPending && state?.currentTurn === 'W') || piece === 'W' ? `${lineWidth}px solid #000` : 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              opacity: isPending ? 0.6 : 1,
              outline: isPending ? '2px solid #3b82f6' : 'none',
              zIndex: 10
            }}
          />
        )}
      </div>
    )
  }

  const isMyTurn = playerRole && state?.players.current === state?.players[playerRole]
  const boardSize = cellSize * 9 + cellSize // Total board size
  const lineWidth = Math.max(1, Math.floor(cellSize / 32))
  const containerPadding = Math.floor(cellSize / 2) + lineWidth * 2 // Increased padding

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-lg font-bold p-2 rounded"
           style={{ 
             backgroundColor: state?.gameStarted ? (isMyTurn ? '#4ade80' : '#ef4444') : '#9ca3af',
             color: 'white'
           }}>
        {state?.gameStarted 
          ? (isMyTurn ? '你的回合' : '對手回合')
          : '等待遊戲開始...'}
      </div>
      
      <div ref={containerRef} className="w-full flex justify-center touch-none">
        <div 
          className="relative rounded-lg shadow-lg overflow-hidden"
          style={{
            width: boardSize + containerPadding * 2,
            height: boardSize + containerPadding * 2,
            backgroundColor: '#DEB887',
            padding: containerPadding,
            touchAction: 'none',
          }}
        >
          {/* Border overlay to ensure complete coverage */}
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              border: `${lineWidth}px solid black`,
              pointerEvents: 'none'
            }}
          />

          <div className="grid grid-cols-10 gap-0">
            {Array(10).fill(null).map((_, row) => (
              <React.Fragment key={row}>
                {Array(10).fill(null).map((_, col) => renderCell(row, col))}
              </React.Fragment>
            ))}
          </div>

          {/* 星位點 */}
          {[
            { top: 2.5, left: 2.5 },
            { top: 2.5, right: 2.5 },
            { bottom: 2.5, left: 2.5 },
            { bottom: 2.5, right: 2.5 }
          ].map((pos, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                ...Object.fromEntries(
                  Object.entries(pos).map(([key, value]) => [
                    key,
                    Math.floor(cellSize * value)
                  ])
                ),
                width: Math.floor(cellSize * 0.2),
                height: Math.floor(cellSize * 0.2),
                borderRadius: '50%',
                backgroundColor: 'black',
                transform: `translate(${pos.left ? '-50%' : '50%'}, ${pos.top ? '-50%' : '50%'})`,
                zIndex: 5
              }}
            />
          ))}
        </div>
      </div>

      {pendingMove && state?.gameStarted && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleConfirmMove}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            確定
          </button>
          <button
            onClick={handleCancelMove}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
        </div>
      )}
    </div>
  )
}

export default Board 