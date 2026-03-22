import { useState } from 'react'
import LoginPage from './home.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <LoginPage/>
    </>
  )
}

export default App
