import React from 'react'
import "./GameWinner.css"

function GameWinner({rowWin, mode}) {

  return (
    <div className='GameWinner'>
      <h2>¡HAS GANADO!</h2>
      <p>Acertaste en el intento número: {rowWin}</p>
      { mode === "FreeMode" ? <p>Has adivinado el número por ahora, presiona el botón reiniciar para volver a jugar</p> : <p>Has adivinado el número por ahora, vuelve al finalizar el contador para un nuevo desafío</p> }
    </div>
  )
}

export default GameWinner