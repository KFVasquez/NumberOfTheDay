import React, { useEffect, useState } from 'react'
import Menu from '../../Components/Menu'
import GameWinner from '../../Components/GameWinner'
import GameLost from '../../Components/GameLost'
import GameFM from './GameFM'

function FreeMode() {
    const mode = "FreeMode"
    const [columns, setColumns] = useState(() => 
        localStorage.getItem("columns"+mode)
        ? JSON.parse(localStorage.getItem("columns"+mode))
        : 4
    )
    const [rows, setRows] = useState(() => 
        localStorage.getItem("rows"+mode)
        ? JSON.parse(localStorage.getItem("rows"+mode))
        : 5
    )
    const initialRowStatus = Array(rows).fill(false)
    initialRowStatus[0] = true
    const [numberDayArray, setNumberDayArray] = useState([])
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
    //START GAME
    useEffect(() => {
        if ( localStorage.getItem("guessNumber"+mode) ) { //START GAME
        setNumberDayArray(JSON.parse(localStorage.getItem("guessNumber"+mode)))
        } else {
        restartGame(columns, rows)
        }
    },[])

    function generateNumber(columns) {
        const newArray = []
        
        for(let i=0; i<columns; i++){
        const random = Math.floor(Math.random()*10)
        newArray.push(random)
        }
        setNumberDayArray(newArray)
        localStorage.setItem("guessNumber"+mode, JSON.stringify(newArray))
    }

    function restartGame(columns, rows){
        generateNumber(columns)
        setinputsNumberArray(Array(columns*rows).fill(""))
        localStorage.setItem("inputsNumberArray"+mode, JSON.stringify(Array(columns*rows).fill("")))
        rowNumber.length = columns
        rowNumber.fill("")
        localStorage.setItem("rowNumber"+mode, JSON.stringify(rowNumber))
        const initialRowStatus = Array(rows).fill(false)
        initialRowStatus[0] = true
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

    function createGame() {
        setColumns(selectedOptionColumns)
        setRows(selectedOptionRows)
        restartGame(selectedOptionColumns, selectedOptionRows)
        localStorage.setItem("columns"+mode, selectedOptionColumns)
        localStorage.setItem("rows"+mode, selectedOptionRows)
    }

    const options = []
    for(let i=1; i<11; i++){
        options.push(i)
    }
    const [selectedOptionColumns, setSelectedOptionColumns] = useState(options[0])
    const [selectedOptionRows, setSelectedOptionRows] = useState(options[0])

    return (
        <div id='App'>
        <Menu />
        <h1>MODO LIBRE</h1>
        <label>Selecciona el número de casillas:
            <select value={selectedOptionColumns} onChange={ e => setSelectedOptionColumns(parseInt(e.target.value))}>
                {options.map((option, index) => (
                    <option key={index}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
        <label>Selecciona el número de filas:
            <select value={selectedOptionRows} onChange={ e => setSelectedOptionRows(parseInt(e.target.value))}>
                {options.map((option, index) => (
                    <option key={index}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
        <button value="Generar" onClick={createGame}>GENERAR</button>
        
        <div className='gameDiv'>
            <GameFM key={columns} data={{mode, columns, rows, rowNumber, numberDayArray, setNumberDayArray, inputsNumberArray, setinputsNumberArray, rowStatus, setrowStatus, gameWon, setGameWon, gameLost, setGameLost, inputFocused, restartGame}}/>
        </div>
        {gameWon ? <GameWinner rowWin={rowWin} mode={mode}/> : null}
        {gameLost ? <GameLost mode={mode}/> : null}
        <footer>
            v1.0.1
        </footer>
        </div>
    )
}

export default FreeMode