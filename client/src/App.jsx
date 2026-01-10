import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CanvasBoard from './components/CanvasBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">
      <CanvasBoard />
    </div>
  )
}

export default App
