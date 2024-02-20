import React from 'react'

function GameLost({mode}) {
  const numberDayArray = JSON.parse(localStorage.getItem("guessNumber"+mode))

  return (
    <div>
      <h2>¡HAS PERDIDO!</h2>
      <p>Solución: {numberDayArray}</p>
      { mode === "FreeMode" ? <p>Has fallado en todos los intentos, presiona el botón reiniciar para volver a jugar</p> : <p>Has fallado en todos los intentos, vuelve cuando termine el contador para un nuevo desafío</p> }
    </div>
  )
}

export default GameLost