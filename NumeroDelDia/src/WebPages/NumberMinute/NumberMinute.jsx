import React from 'react'
import GameInfoNM from './GameInfoNM'

function NumberMinute() {
  const mode = "NumberMinute"
  const restartTime = 1000*60
  const columns = 4
  const rows = 5

  function calculateTimeRemaining() {
    const now = new Date()
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    if (now >= targetTime) {
      if ( (now.getMinutes() + 1) === 60 ) {
        targetTime.setHours(now.getHours() +1)
      } else {
        targetTime.setHours(now.getHours())
        targetTime.setMinutes(now.getMinutes() + 1)
      }
    }
    return targetTime - now
  }

  return (
    <GameInfoNM info={{mode, columns, rows, restartTime, calculateTimeRemaining }}/>
  )
}

export default NumberMinute