import React from 'react'
import GameInfoND from './WebPages/NumberDay/GameInfoND'
import './App.css'

function App() {
  const mode = "NumberDay"
  const restartTime = 24*60*60*1000
  const columns = 4
  const rows = 5
  
  function calculateTimeRemaining() {
    const now = new Date()

    let targetTime = localStorage.getItem("targetTime"+mode)
              ? new Date(localStorage.getItem("targetTime"+mode))
              : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
              //CASO ULTIMO DIA DEL AÑO
              
    if (now >= targetTime) {
      targetTime = now
      targetTime.setDate(targetTime.getDate() + 1)
      targetTime.setHours(0)
      targetTime.setMinutes(0)
      targetTime.setSeconds(0)
      targetTime.setMilliseconds(0)
      localStorage.setItem("targetTime"+mode, targetTime.toISOString())
    }
    
    return targetTime - now
  }

  return (
    <GameInfoND info={{mode, columns, rows, restartTime, calculateTimeRemaining }}/>
  )
}

export default App