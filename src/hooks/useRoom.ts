import { useState, useEffect } from 'react'
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

interface BoardState {
  [key: string]: 'B' | 'W' | null;  // 格式: "x,y": "B"|"W"|null
}

type PlayerRole = 'black' | 'white'

interface Players {
  black: string | null
  white: string | null
  current: string | null
}

interface RoomState {
  roomCode: string
  board: BoardState
  currentTurn: 'B' | 'W'
  winner: 'B' | 'W' | null
  gameStarted: boolean
  players: Players
  ready: {
    black: boolean
    white: boolean
  }
  createdAt: string
}

export function useRoom(roomId: string) {
  const [state, setState] = useState<RoomState | null>(null)
  const [playerId] = useState<string>(() => {
    const storedId = localStorage.getItem('playerId')
    if (storedId) return storedId
    const newId = Math.random().toString(36).substr(2, 9)
    localStorage.setItem('playerId', newId)
    return newId
  })

  useEffect(() => {
    const roomRef = doc(db, 'rooms', roomId)
    
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        setState(doc.data() as RoomState)
      }
    }, (error) => {
      console.error('Error listening to room:', error)
      setTimeout(() => {
        unsubscribe()
      }, 5000)
    })

    return () => unsubscribe()
  }, [roomId])

  useEffect(() => {
    const joinRoom = async () => {
      if (!state || !playerId) return

      const roomRef = doc(db, 'rooms', roomId)
      const { players } = state

      // If player is already in the room, do nothing
      if (players.black === playerId || players.white === playerId) return

      // Join as the first available role
      if (!players.black) {
        await updateDoc(roomRef, { 
          'players.black': playerId,
          'players.current': playerId // Set initial current player
        })
      } else if (!players.white) {
        await updateDoc(roomRef, { 
          'players.white': playerId,
          'players.current': players.black // Black always starts
        })
      }
    }

    joinRoom()
  }, [state, playerId, roomId])

  const makeMove = async (x: number, y: number) => {
    if (!state || state.winner || state.board[`${x},${y}`] || !state.gameStarted) return

    const currentPlayer = state.currentTurn === 'B' ? 'black' : 'white'
    if (state.players[currentPlayer] !== playerId) return

    const roomRef = doc(db, 'rooms', roomId)
    const roomDoc = await getDoc(roomRef)
    
    if (!roomDoc.exists()) return

    // Update the board and switch turns
    const nextTurn = state.currentTurn === 'B' ? 'W' : 'B'
    const nextPlayer = nextTurn === 'B' ? state.players.black : state.players.white

    await updateDoc(roomRef, {
      [`board.${x},${y}`]: state.currentTurn,
      currentTurn: nextTurn,
      'players.current': nextPlayer
    })
  }

  const setReady = async (color: PlayerRole, ready: boolean) => {
    if (!state || state.players[color] !== playerId) return

    const roomRef = doc(db, 'rooms', roomId)
    await updateDoc(roomRef, {
      [`ready.${color}`]: ready
    })
  }

  const startGame = async () => {
    if (!state || state.players.black !== playerId || !state.ready.black || !state.ready.white) return

    const roomRef = doc(db, 'rooms', roomId)
    await updateDoc(roomRef, {
      gameStarted: true,
      'players.current': state.players.black // Black always starts
    })
  }

  const resetGame = async () => {
    if (!state || state.players.black !== playerId) return

    const roomRef = doc(db, 'rooms', roomId)
    const emptyBoard: BoardState = {}
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        emptyBoard[`${i},${j}`] = null
      }
    }
    
    await updateDoc(roomRef, {
      board: emptyBoard,
      currentTurn: 'B',
      winner: null,
      gameStarted: false,
      'ready.black': false,
      'ready.white': false,
      'players.current': state.players.black // Reset to black player
    })
  }

  const getPlayerRole = (): PlayerRole | null => {
    if (!state) return null
    if (state.players.black === playerId) return 'black'
    if (state.players.white === playerId) return 'white'
    return null
  }

  return {
    state,
    makeMove,
    setReady,
    startGame,
    resetGame,
    playerId,
    playerRole: getPlayerRole()
  }
} 