import { useEffect, useRef, useState } from 'react'
import Die from './components/Die'
import { nanoid } from "nanoid"
import Confetti from "react-confetti"


function App() {


  const [dice, setDice] = useState(() => generateAllNewDice());

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)


  const buttonRef = useRef(null);


  function generateAllNewDice() {
    return Array(10)
      .fill(0)
      .map(() => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      }))
  }

  useEffect(()=>{
    if(gameWon){
      buttonRef.current.focus();
    }
  }, [gameWon])


  const diceElements = dice.map(dieObj => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
    />
  ))



  function rollDice(){
    if(!gameWon){
      setDice(oldDice => oldDice.map(die => 
        die.isHeld ? die :
        {...die, value: Math.ceil(Math.random() * 6)}
      ))
    } else {
      setDice(generateAllNewDice());
    }
  }


  function hold(id) {
    setDice(oldDice => oldDice.map(die =>
      die.id === id ?
        { ...die, isHeld: !dice.isHeld } :
        die
    ))
  }


  function playSound(){
    const audio = new Audio("../src/assets/sounds/trumpet.mp3");
    audio.play();
  }

  return (
    <main>
      {gameWon && <Confetti />}
      {gameWon && playSound()}
      <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
      <h1 className='title'>Tenzies The Game</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button ref={buttonRef} className='roll-dice' onClick={rollDice}>{gameWon ? "Start New Game" : "Roll Dice"}</button>
    </main>
  )
}

export default App;
