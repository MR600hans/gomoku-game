import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Board from '../components/Board'
import { useRoom } from '../hooks/useRoom'

const Room: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { state, setReady, startGame, resetGame, playerRole } = useRoom(id!)

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const canStartGame = state.ready.black && state.ready.white && playerRole === 'black' && !state.gameStarted

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Game Board Section */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-4 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold">Room Code:</h2>
            <div className="text-lg md:text-xl font-mono bg-white px-3 py-1 rounded shadow">
              {state.roomCode}
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1 md:px-4 md:py-2 bg-gray-500 text-white text-sm md:text-base rounded hover:bg-gray-600"
          >
            Leave Room
          </button>
        </div>
        <Board roomId={id!} />
      </div>

      {/* Game Status Section */}
      <div className="w-full md:w-80 bg-white shadow-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Game Status</h2>
        
        <div className="space-y-4 md:space-y-6">
          {/* Player Status */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Black (Player 1)</span>
                <div className="text-sm text-gray-500">
                  {!state.players.black ? 'Waiting...' : state.gameStarted ? 'Playing' : state.ready.black ? 'Ready' : 'Not Ready'}
                </div>
              </div>
              {(playerRole === 'black') && (
                <button
                  onClick={() => setReady('black', !state.ready.black)}
                  disabled={state.gameStarted}
                  className={`px-3 py-1 rounded text-sm md:text-base ${
                    state.gameStarted
                      ? 'bg-blue-500 text-white'
                      : state.ready.black
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } ${state.gameStarted && 'opacity-50 cursor-not-allowed'}`}
                >
                  {state.gameStarted ? 'Playing' : state.ready.black ? 'Ready' : 'Not Ready'}
                </button>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">White (Player 2)</span>
                <div className="text-sm text-gray-500">
                  {!state.players.white ? 'Waiting...' : state.gameStarted ? 'Playing' : state.ready.white ? 'Ready' : 'Not Ready'}
                </div>
              </div>
              {(playerRole === 'white') && (
                <button
                  onClick={() => setReady('white', !state.ready.white)}
                  disabled={state.gameStarted}
                  className={`px-3 py-1 rounded text-sm md:text-base ${
                    state.gameStarted
                      ? 'bg-blue-500 text-white'
                      : state.ready.white
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  } ${state.gameStarted && 'opacity-50 cursor-not-allowed'}`}
                >
                  {state.gameStarted ? 'Playing' : state.ready.white ? 'Ready' : 'Not Ready'}
                </button>
              )}
            </div>
          </div>

          {/* Game Status */}
          <div className="space-y-3 md:space-y-4">
            <div className="text-center p-2 md:p-3 bg-gray-50 rounded text-sm md:text-base">
              {!state.gameStarted ? (
                <p className="text-gray-600">
                  {!state.players.black || !state.players.white
                    ? 'Waiting for players to join...'
                    : !state.ready.black || !state.ready.white
                    ? 'Waiting for players to ready up...'
                    : 'Ready to start!'}
                </p>
              ) : (
                <p className="font-medium">
                  Current Turn: {state.currentTurn === 'B' ? 'Black' : 'White'}
                </p>
              )}
            </div>

            {canStartGame && (
              <button
                onClick={startGame}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm md:text-base"
              >
                Start Game
              </button>
            )}
          </div>
        </div>

        {state.winner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-sm">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">
                {state.winner === 'B' ? 'Black' : 'White'} Wins!
              </h3>
              {playerRole === 'black' && (
                <button
                  onClick={resetGame}
                  className="w-full bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Room 