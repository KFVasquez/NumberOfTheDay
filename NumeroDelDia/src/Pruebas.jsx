/* import React from 'react'

function Pruebas() {
  /////////////////ESTO VA EN APP/////////////////////
  const { gameWon, gameLost, timeRemainingCounter } = useContext(GameContext)
  const hours = timeRemainingCounter.hours
  const minutes = timeRemainingCounter.minutes
  const seconds = timeRemainingCounter.seconds

  function counterVisual(time){
    return time < 10 ? "0" + time : time
  }

  return (
    <div id='App'>
      <Menu />
      <h1>NÚMERO DEL DÍA</h1>
      <div className='gameDiv'>
        <Game />
      </div>
      <details>
        <summary>Guía para principiantes</summary>
        <ul>
          <li>Debes rellenar fila por fila intentando adivinar el <i><b>número del día</b></i> y presionar "Enter" o "Probar" para verificarlo. Una vez que hayas acertado en alguna fila o fallado en todas ellas, tendrás que volver al siguiente día (esperando que finalice el contador) para adivinar el <i><b>número del día</b></i>.</li>
          <hr/>
          <li>Las casillas <b className='greenText'>verdes</b> indican que el <b className="greenText">número</b> está <b className='greenText'>presente</b> en el número del día y que además está en el <b className="greenText">orden adecuado</b>.</li>
          <br/>
          <li>Las casillas <b className='yellowText'>amarillas</b> indican que el <b className='yellowText'>número</b> está <b className='yellowText'>presente</b> en el número del día pero en un <b className='yellowText'>orden no adecuado</b>. <b>Importante: el color amarillo puede ser engañoso pues podría hacer referencia a un número que ya ha sido acertado.</b></li>
          <br/>
          <li>Las casillas <b className='redText'>rojas</b> indican que el <b className='redText'>número no</b> está <b className='redText'>presente</b> en el número del día.</li>
        </ul>
      </details>
      {gameWon ? <GameWinner /> : null}
      {gameLost ? <GameLost /> : null}
      <div className='counterVisual'>
        Próximo número del día <br/>
        {counterVisual(hours)}:{counterVisual(minutes)}:{counterVisual(seconds)}
      </div>
      <footer style={{ position: "fixed", bottom: 0, right: 0, zIndex: -1 }}>
        v1.0.1
      </footer>
    </div>
  )
  /////////////ESTO VA EN APP///////////////
}

export default Pruebas */


///////////////////////////ESTO VA EN GAME.JSX//////////////////
import React, { useContext, useEffect } from 'react'
import './Game.css'
import { GameContext } from './Context/GameContext'

const numberRegex = /^[0-9]*$/;

function Game() {
  const {columns, rows, rowNumber, numberDayArray, inputsNumberArray, setinputsNumberArray, rowStatus, setrowStatus, gameWon, setGameWon, gameLost, setGameLost } = useContext(GameContext)

  let { inputFocused, rowWin } = useContext(GameContext)

  useEffect(() => { //Store numbers
    localStorage.setItem("inputsNumberArray", JSON.stringify(inputsNumberArray))
  }, [inputsNumberArray])
  
  useEffect(() => { //Store rowStatus & focus next row
      localStorage.setItem("rowStatus", JSON.stringify(rowStatus))
  },[rowStatus])

  useEffect(() => { //NECESSARY FOR FOCUS NEXT ROW
    const inputsCollection = document.getElementsByClassName("numberEntered")
    if ( localStorage.getItem("inputFocused") ) {
      inputsCollection[localStorage.getItem("inputFocused")].focus()
    }
  },[inputFocused])

  const handleFocus = (e) => { //Store focus element
    e.target.select()
    localStorage.setItem('inputFocused', e.target.id)
  }

  useEffect(() => { //Loading colors for inputs
    const numberDayStoraged = JSON.parse(localStorage.getItem("numberDay"))
    const inputsCollection = document.getElementsByClassName("numberEntered")
    const inputsCollectionArray = Array.from(inputsCollection)
    const matrixNumber = Array.from({ length: rows }, (_, j) => {
      return inputsCollectionArray.slice(j*columns, (j+1)*columns)
    })
    
    for(let j=0; j<rows; j++){
      if ( j < rowStatus.indexOf(true) ) {
        for (let i=0; i<columns; i++) {
          if ( matrixNumber[j][i].value != "" ) {
            if ( matrixNumber[j][i].value == numberDayStoraged[i] ) {
              matrixNumber[j][i].classList.add("green")
            } else {
              matrixNumber[j][i].classList.add("red")
              for ( let k=0; k<columns; k++ ) {
                if ( matrixNumber[j][i].value == numberDayStoraged[k] ) {
                  matrixNumber[j][i].classList.remove("red")
                  matrixNumber[j][i].classList.add("yellow")
                }
              }
            }
          }
        }
      }
    }
  },[])

  function focusNextInput(value, index, indexOfRow, indexOfColumns){//Put a number & focus next input
    const inputsPrevsArray = inputsNumberArray.slice(0, (indexOfRow)*columns)
    const inputsNotFull = inputsPrevsArray.some(value => value == "")
    
    const inputsCollection = document.getElementsByClassName("numberEntered")
    
    if ( numberRegex.test(value) ) {
      if ( inputsNotFull ) {
        alert("Debe rellenar la(s) fila(s) anterior(es) y presionar Enter")
      } else {
        setinputsNumberArray(prevArray => {
          const arrayCopy = [...prevArray]
          arrayCopy[index] = value
          return arrayCopy
        })
        if ( indexOfColumns+1<columns && value!="" ) {
          inputsCollection[index+1].focus()
        }
        rowNumber[indexOfColumns] = value
        localStorage.setItem("rowNumber", JSON.stringify(rowNumber))
      }
    }//solucionar cuando se escriben numeros, luego letras y luego numero
  }
  
  function handleKeyDown(e, index, indexOfRow, indexOfColumns){ //Handles each key
    const inputsCollection = document.getElementsByClassName("numberEntered")
    const inputsArray = Array.from(inputsCollection)
    const rowNumberFull = rowNumber.every(value => value != "")
    
    if ( e.key == "Enter" && rowNumberFull ) { //Test rowNumber
      testRowNumber()
    }

    if ( e.key == "Backspace" ) {
      if ( e.target.value == "" && indexOfColumns != 0 ) {
        inputsArray[index-1].focus()
      }
    }

    if ( e.key == "ArrowLeft" || e.key == "ArrowRight" || e.key == "ArrowUp" ||
    e.key == "ArrowDown" ) {
      e.preventDefault()
      if ( e.key == "ArrowLeft" && indexOfColumns != 0 ) {
        inputsArray[index-1].focus()
      }
      if ( e.key == "ArrowRight" && indexOfColumns != columns-1) {
        inputsArray[index+1].focus()
      }
    }
  }

  function testRowNumber(){
    const inputsCollection = document.getElementsByClassName("numberEntered")
    const inputsArray = Array.from(inputsCollection)
    const rowNumberFull = rowNumber.every(value => value != "")
    const indexOfRow = rowStatus.indexOf(true)
    
    if ( rowNumberFull ) { //Test rowNumber
      for ( let i=0; i < columns; i++) {
        if ( rowNumber[i] == numberDayArray[i] ) {
          inputsArray[(indexOfRow*columns)+i].classList.add("green")
        } else {
          inputsArray[(indexOfRow*columns)+i].classList.add("red")
          for ( let j=0; j<columns; j++ ) {
            if ( rowNumber[i] == numberDayArray[j] ) {
              inputsArray[(indexOfRow*columns)+i].classList.remove("red")
              inputsArray[(indexOfRow*columns)+i].classList.add("yellow")
            }
          }
        }
      }
      const rowStatusCopy = [...rowStatus]
      rowStatusCopy.fill(false)
      if ( rowNumber.toString() === numberDayArray.toString() ) { // Game winner
        rowStatusCopy[rows] = true
        setrowStatus(rowStatusCopy)
        setGameWon(true)
        rowWin = indexOfRow+1
        localStorage.setItem("rowWin", indexOfRow+1)
        localStorage.setItem("gameWon", true)
      } else { //Continue the game
        rowStatusCopy[indexOfRow+1] = true
        setrowStatus(rowStatusCopy)
        rowNumber.fill("")
        localStorage.setItem("rowNumber", JSON.stringify(rowNumber))

        if ( indexOfRow < rows-1 ) {
          localStorage.setItem("inputFocused",(indexOfRow+1)*columns)
        }
        if ( indexOfRow == rows-1 ) {
          setGameLost(true)
          localStorage.setItem("gameLost", true)
        }
      }
    }
  }

  return(
    <div className='gameBlock'>
      {Array.from({ length: rows }).map((_, indexOfRow) => (
        <div className='rowGame' key={indexOfRow}>
          {Array.from({ length: columns }).map((_, indexOfColumns) => {
            const index = indexOfRow*4 + indexOfColumns
            return(
              <input
              key={index}
              className='numberEntered'
              id={index}
              maxLength={1}
              value={inputsNumberArray[index]}
              onInput={e => focusNextInput(e.target.value, index, indexOfRow, indexOfColumns)}
              onKeyDown={e => handleKeyDown(e, index, indexOfRow, indexOfColumns)}
              onFocus={handleFocus}
              onMouseUp={e => e.preventDefault()}
              disabled={!rowStatus[indexOfRow]}
              autoComplete='off'
              type='tel'
              /* inputMode='numeric' */>
              </input>
            )
          })}
        </div>
      ))}
      <button className='BtnTest' onClick={testRowNumber}>PROBAR</button>
    </div>
  )
}

export default Game
///////////////////////////ESTO VA EN GAME.JSX//////////////////