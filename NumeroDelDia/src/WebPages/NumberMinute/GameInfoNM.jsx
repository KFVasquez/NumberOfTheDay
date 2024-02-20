import React, { useEffect, useState } from 'react'
import Menu from '../../Components/Menu'
import GameNM from './GameNM'
import GameWinner from '../../Components/GameWinner'
import GameLost from '../../Components/GameLost'

function GameInfoND({info}) {
  const { mode, columns, rows, restartTime, calculateTimeRemaining } = info
  const initialRowStatus = Array(rows).fill(false)
  initialRowStatus[0] = true
  const [numberDayArray, setNumberDayArray] = useState([])
  const [timeRemainingCounter, setTimeRemainingCounter] = useState(countdownTimer())
  const [gameWon, setGameWon] = useState(() => {  
    return localStorage.getItem("gameWon"+mode) === "true"
  })
  const [gameLost, setGameLost] = useState(() => {
    return localStorage.getItem("gameLost"+mode) === "true"
  })

  //LOADING/CREATING DATA
  let rowWin = localStorage.getItem("rowWin"+mode)
  ? JSON.parse(localStorage.getItem("rowWin"+mode))
  : ""

  let rowNumber = localStorage.getItem("rowNumber"+mode)
  ? JSON.parse(localStorage.getItem("rowNumber"+mode)) 
  : Array(columns).fill("")

  let inputFocused = localStorage.getItem("inputFocused"+mode)
  ? JSON.parse(localStorage.getItem("inputFocused"+mode))
  : localStorage.setItem("inputFocused"+mode, 0)

  const [inputsNumberArray, setinputsNumberArray] = useState(() => 
    localStorage.getItem("inputsNumberArray"+mode)
    ? JSON.parse(localStorage.getItem("inputsNumberArray"+mode))
    : Array(columns*rows).fill("")
  )

  const [rowStatus, setrowStatus] = useState(() => 
    localStorage.getItem("rowStatus"+mode)
    ? JSON.parse(localStorage.getItem("rowStatus"+mode))
    : initialRowStatus
  )
  //EACH SECOND UPDATES THE COUNTER
  useEffect(() => {
    const intervalID = setInterval(() => {
      setTimeRemainingCounter(countdownTimer())
    }, 1000)

    return () => clearInterval(intervalID)
  },[])
  //START GAME
  useEffect(() => {
    function startGeneration() {
      const timeRemaining = calculateTimeRemaining()

      setTimeout(() => {
        restartGame()

        setInterval(restartGame, restartTime) //NO TENGO QUE CAMBIAR DE PÁGINA DURANTE EL RESTARTTIME PARA QUE SE LANCE TIMEOUT
      }, timeRemaining)
    }

    if ( localStorage.getItem("guessNumber"+mode) ) { //START GAME
      setNumberDayArray(JSON.parse(localStorage.getItem("guessNumber"+mode)))
    } else {
      restartGame()
    }
    startGeneration()
  },[])

  function generateNumber() {
    const newArray = []
    
    for(let i=0; i<columns; i++){
      const random = Math.floor(Math.random()*10)
      newArray.push(random)
    }
    setNumberDayArray(newArray)
    localStorage.setItem("guessNumber"+mode, JSON.stringify(newArray))
  }

  function restartGame(){
    generateNumber()
    setinputsNumberArray(Array(columns*rows).fill(""))
    localStorage.setItem("inputsNumberArray"+mode, JSON.stringify(Array(columns*rows).fill("")))
    rowNumber.fill("")
    localStorage.setItem("rowNumber"+mode, JSON.stringify(rowNumber))
    setrowStatus(initialRowStatus)
    localStorage.setItem("rowStatus"+mode, JSON.stringify(initialRowStatus))
    localStorage.setItem("inputFocused"+mode, "0")
    const inputsCollection = document.getElementsByClassName("numberEntered"+mode);
    [...inputsCollection].forEach(element => {
      element.classList.remove("green")
      element.classList.remove("yellow")
      element.classList.remove("red")
    })
    setGameWon(false)
    localStorage.setItem("gameWon"+mode, false)
    setGameLost(false)
    localStorage.setItem("gameLost"+mode, false)
    localStorage.setItem("rowWin"+mode, 0)
  }

  function countdownTimer(){
    const difference = calculateTimeRemaining()

    const hours = Math.floor(difference / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    const timeRemainingCounterObj = {hours, minutes, seconds}
    return timeRemainingCounterObj
  }
  
  const formattedHours = counterVisual(timeRemainingCounter.hours)
  const formattedMinutes = counterVisual(timeRemainingCounter.minutes)
  const formattedSeconds = counterVisual(timeRemainingCounter.seconds)

  function counterVisual(time){
    return time < 10 ? "0" + time : time
  }

  return (
    <div id='App'>
      <Menu />
      <h1>NÚMERO DEL MINUTO</h1>
      <div className='gameDiv'>
        <GameNM data={{mode, columns, rows, restartTime, calculateTimeRemaining, rowNumber, numberDayArray, setNumberDayArray, inputsNumberArray, setinputsNumberArray, rowStatus, setrowStatus, gameWon, setGameWon, gameLost, setGameLost, inputFocused}}/>
      </div>
      {gameWon ? <GameWinner rowWin={rowWin} mode={mode}/> : null}
      {gameLost ? <GameLost mode={mode}/> : null}
      <div className='counterVisual'>
        Próximo número del minuto <br/>
        {formattedHours}:{formattedMinutes}:{formattedSeconds}
      </div>
      <footer>
        v1.0.1
      </footer>
    </div>
  )
}

export default GameInfoND