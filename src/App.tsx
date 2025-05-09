import { 
  createBrowserRouter, 
  RouterProvider,
  Route,
  createRoutesFromElements
} from 'react-router-dom'
import Lobby from './pages/Lobby'
import Room from './pages/Room'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Lobby />} />
      <Route path="/room/:id" element={<Room />} />
    </>
  )
)

function App() {
  return <RouterProvider router={router} />
}

export default App 