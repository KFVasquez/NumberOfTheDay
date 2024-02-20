import React, { useContext } from 'react'
import Menu from '../../Components/Menu'
import { ThemeContext } from '../../Context/ThemeContext'

function Rules() {
  const {contextTheme, setContextTheme} = useContext(ThemeContext)

  return (
    <div id="App" className={contextTheme}>
        <Menu />
        <h1>Guía para principiantes</h1>
        <ul>
          <li>Debes rellenar fila por fila intentando adivinar el <i><b>número del día</b></i> y presionar "Enter" o el botón "Probar" para verificarlo. Una vez que hayas acertado en alguna fila o fallado en todas ellas, tendrás que esperar a que finalice el contador para adivinar el siguiente <i><b>número del día</b></i>.</li> 
          <hr/>
          <li>Las casillas <b className='greenText'>verdes</b> indican que el <b className="greenText">número</b> está <b className='greenText'>presente</b> en el número del día y que además está en el <b className="greenText">orden adecuado</b>.</li>
          <br/>
          <li>Las casillas <b className='yellowText'>amarillas</b> indican que el <b className='yellowText'>número</b> está <b className='yellowText'>presente</b> en el número del día pero en un <b className='yellowText'>orden no adecuado</b>. <b>Importante: el color amarillo puede ser engañoso pues podría hacer referencia a un número que ya ha sido acertado.</b></li>
          <br/>
          <li>Las casillas <b className='redText'>rojas</b> indican que el <b className='redText'>número no</b> está <b className='redText'>presente</b> en el número del día.</li>
          <hr/>
          Todos los modos funcionan de manera similar, solo tienes menos tiempo disponible, o tiempo nulo en el modo libre.
        </ul>
    </div>
  )
}

export default Rules