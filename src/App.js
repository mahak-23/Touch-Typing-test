import React, { useState, useEffect, useRef } from 'react';
import './App.css'
import Logo from './logo-typing.jpg'

const SECONDS_PER_MINUTE = 60;
const NUM_OF_WORDS = 200;
const COUNTDOWN_DURATION = 300;

function App() {
  const [words, setWords] = useState([]);
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [inputValue, setInputValue] = useState('');
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const textInputRef = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (isCountdownRunning) {
      textInputRef.current.focus();
    }
  }, [isCountdownRunning]);

  useEffect(() => {
    let countdownInterval;

    if (isCountdownRunning && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setIsCountdownRunning(false);
    }

    return () => clearInterval(countdownInterval);
  }, [countdown, isCountdownRunning]);

  function generateWords() {
    return new Array(NUM_OF_WORDS).fill(null).map(() => getRandomKeyWord());
  }

  function getRandomKeyWord() {
    const keys = 'asdfjkl;';
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.keyCode === 32) {
      // Spacebar key
      event.preventDefault();
      checkMatch();
      setInputValue('');
      setCurrWordIndex((prevIndex) => prevIndex + 1);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === inputValue.trim();
    if (doesItMatch) {
      setCorrectCount((prevCount) => prevCount + 1);
    } else {
      setIncorrectCount((prevCount) => prevCount + 1);
    }
  }

  function startCountdown() {
    setWords(generateWords());
    setCountdown(COUNTDOWN_DURATION);
    setInputValue('');
    setCurrWordIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsCountdownRunning(true);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    const remainingSeconds = seconds % SECONDS_PER_MINUTE;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div className="App">
       <h1 className="heading">
        <img src={Logo} alt="logo" className="logo" /> Typing Tester
      </h1>
      <div className="section">
        {(countdown > 20) ? 
        (<div className="timer">
          {formatTime(countdown)}
        </div>):(
          <div className="timer" style={{color: "red"}}>
          {formatTime(countdown)}
        </div>
        )} 
      </div>
      <div className="control is-expanded section">
        <input
          ref={textInputRef}
          type="text"
          className="input"
          disabled={!isCountdownRunning}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          />
        </div>
        <div className="section">
          <button className="button is-info is-fullwidth" onClick={startCountdown}>
            {isCountdownRunning ? 'Restart' : 'Start'}
          </button>
        </div>
        {isCountdownRunning && (
          <div className="section">
            <div className="typing-text">
              {words.map((word, index) => (
                <span
                  key={index}
                  className={`word ${index === currWordIndex ? 'current-word' : ''}`}
                >
                  {word} </span>
              ))}
            </div>
          </div>
        )}
          <div className="section results">
            <div className="stat-item CK">
              Correct Keys: <span>{correctCount}</span>
            </div>
            <div className="stat-item IK">
              Incorrect Keys: <span>{incorrectCount}</span>
            </div>
            <div className="stat-item A">
              Accuracy: <span>{(correctCount / (correctCount + incorrectCount) * 100).toFixed(2)}%</span>
            </div>
          </div>
      </div>
    );
  }
  
  export default App;
  



