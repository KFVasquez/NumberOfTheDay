import React, { useEffect } from 'react'
import '../../../src/Game.css'
import ErrorNotFullRow from '../../Components/ErrorNotFullRow';

const numberRegex = /^[0-9]*$/;

function GameFM({data}) {
  const {mode, columns, rows, rowNumber, inputsNumberArray, setinputsNumberArray, rowStatus, setrowStatus, gameWon, setGameWon, gameLost, setGameLost, restartGame } = data

  let { inputFocused, rowWin } = data

  useEffect(() => { //Store numbers
    localStorage.setItem("inputsNumberArray"+mode, JSON.stringify(inputsNumberArray))
  }, [inputsNumberArray])
  
  useEffect(() => { //Store rowStatus & focus next row
      localStorage.setItem("rowStatus"+mode, JSON.stringify(rowStatus))
  },[rowStatus])

  useEffect(() => { //NECESSARY FOR FOCUS NEXT ROW
    const inputsCollection = document.getElementsByClassName("numberEntered"+mode)
    if ( localStorage.getItem("inputFocused"+mode) ) {
      inputsCollection[localStorage.getItem("inputFocused"+mode)].focus()
    }
  },[inputFocused])

  const handleFocus = (e) => { //Store focus element
    e.target.select()
    localStorage.setItem('inputFocused'+mode, e.target.id)
  }

  useEffect(() => { //Loading colors for inputs
    const numberDayStoraged = JSON.parse(localStorage.getItem("guessNumber"+mode))
    const inputsCollection = document.getElementsByClassName("numberEntered"+mode)
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
    /* const inputsPrevsArray = inputsNumberArray.slice(0, (indexOfRow)*columns)
    const inputsNotFull = inputsPrevsArray.some(value => value == "") */
    
    const inputsCollection = document.getElementsByClassName("numberEntered"+mode)
    console.log("entro")
    if ( numberRegex.test(value) ) {
      /* if ( inputsNotFull ) {
        alert("Debe rellenar la(s) fila(s) anterior(es) y presionar Enter")
      } else { */
        setinputsNumberArray(prevArray => {
          const arrayCopy = [...prevArray]
          arrayCopy[index] = value
          return arrayCopy
        })
        if ( indexOfColumns+1<columns && value!="" ) {
          inputsCollection[index+1].focus()
        }
        rowNumber[indexOfColumns] = value
        localStorage.setItem("rowNumber"+mode, JSON.stringify(rowNumber))
      
    } else{ //solucionar cuando se escriben numeros, luego letras y luego numero
      /* console.log(value)
      console.log(inputsNumberArray[index]) */
    }
  }
  
  function handleKeyDown(e, index, indexOfRow, indexOfColumns){ //Handles each key
    const inputsCollection = document.getElementsByClassName("numberEntered"+mode)
    const inputsArray = Array.from(inputsCollection)

    if ( e.key === "Enter" ) { //Test rowNumber
      testRowNumber()
    }

    if ( e.key === "Backspace" ) {
      if ( e.target.value == "" && indexOfColumns != 0 ) {
        inputsArray[index-1].focus()
      }
    }

    if ( e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" ||
    e.key === "ArrowDown" ) {
      e.preventDefault()
      if ( e.key == "ArrowLeft" && indexOfColumns != 0 ) {
        inputsArray[index-1].focus()
      }
      if ( e.key === "ArrowRight" && indexOfColumns != columns-1) {
        inputsArray[index+1].focus()
      }
    }
  }

  function testRowNumber(){
    const inputsCollection = document.getElementsByClassName("numberEntered"+mode)
    const inputsArray = Array.from(inputsCollection)
    const rowNumberFull = rowNumber.every(value => value != "")
    const indexOfRow = rowStatus.indexOf(true)
    const numberDayArray = JSON.parse(localStorage.getItem("guessNumber"+mode))
    
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
        localStorage.setItem("rowWin"+mode, indexOfRow+1)
        localStorage.setItem("gameWon"+mode, true)
      } else { //Continue the game
        rowStatusCopy[indexOfRow+1] = true
        setrowStatus(rowStatusCopy)
        rowNumber.fill("")
        localStorage.setItem("rowNumber"+mode, JSON.stringify(rowNumber))

        if ( indexOfRow < rows-1 ) {
          localStorage.setItem("inputFocused"+mode,(indexOfRow+1)*columns)
        }
        if ( indexOfRow == rows-1 ) {
          setGameLost(true)
          localStorage.setItem("gameLost"+mode, true)
        }
      }
    } else {
      const errorArray = document.getElementsByClassName("error")
      if(!errorArray[0].classList.contains("show")){
        errorArray[0].classList.add("show")
        setTimeout(() => {
          errorArray[0].classList.remove("show")
        }, 1000)
      }
    }
  }

  return(
    <div className='gameBlock'>
      {Array.from({ length: rows }).map((_, indexOfRow) => (
        <div className='rowGame' key={indexOfRow}>
          {Array.from({ length: columns }).map((_, indexOfColumns) => {
            const index = indexOfRow*columns + indexOfColumns
            return(
              <input
              key={index}
              className={"numberEntered"+mode}
              id={index}
              maxLength={1}
              value={inputsNumberArray[index]}
              /* onInput={e => focusNextInput(e.target.value, index, indexOfRow, indexOfColumns)} */
              onInput={e => console.log("aaaaaa")}
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
      <button className='BtnRestart' onClick={() => restartGame(columns, rows)}>REINICIAR</button>
      <button className='BtnTest' onClick={testRowNumber}>PROBAR</button>
      <ErrorNotFullRow />
    </div>
  )
}

export default GameFM