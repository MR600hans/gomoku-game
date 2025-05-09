import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../config/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

interface BoardState {
  [key: string]: 'B' | 'W' | null;
}

const generateRoomCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const Lobby: React.FC = () => {
  const navigate = useNavigate()
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')

  const createRoom = async () => {
    try {
      const newRoomCode = generateRoomCode()
      const emptyBoard: BoardState = {}
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          emptyBoard[`${i},${j}`] = null
        }
      }

      const roomRef = await addDoc(collection(db, 'rooms'), {
        roomCode: newRoomCode,
        board: emptyBoard,
        currentTurn: 'B',
        winner: null,
        gameStarted: false,
        players: {
          black: null,
          white: null,
          current: null
        },
        ready: {
          black: false,
          white: false
        },
        createdAt: new Date().toISOString()
      })
      navigate(`/room/${roomRef.id}`)
    } catch (error) {
      console.error('Error creating room:', error)
      setError('Failed to create room. Please try again.')
    }
  }

  const joinRoom = async () => {
    if (!roomCode || roomCode.length !== 6) {
      setError('Please enter a valid 6-digit room code')
      return
    }

    try {
      // Query for the room with matching room code
      const roomsRef = collection(db, 'rooms')
      const q = query(roomsRef, where('roomCode', '==', roomCode))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const roomDoc = querySnapshot.docs[0]
        navigate(`/room/${roomDoc.id}`)
      } else {
        setError('Room not found. Please check the room code.')
      }
    } catch (error) {
      console.error('Error joining room:', error)
      setError('Failed to join room. Please try again.')
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">寒極五子棋</h1>
        
        <div className="space-y-4">
          <button
            onClick={createRoom}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Create New Room
          </button>

          <div className="relative">
            <div className="flex space-x-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit room code"
                value={roomCode}
                onChange={(e) => {
                  setError('')
                  setRoomCode(e.target.value.replace(/[^0-9]/g, ''))
                }}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={joinRoom}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Join
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lobby 