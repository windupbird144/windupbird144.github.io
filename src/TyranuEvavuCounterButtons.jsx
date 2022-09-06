import { useState, useRef, useEffect } from "react";
import "./App.css";

const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

function TyranuEvavuCounterButtons() {

  const initialDeck = {
    open: null,
    deck: values.map(() => 4),
    failPercent: 0,
    pristine: true,
  };

  const [state, setState] = useState(initialDeck);

  const reveal = (e) => {
    const i = values.indexOf(e);
    if (state.deck[i] <= 0) return; // cannot play any more of this card
    state.deck[i]--;

    const cardsLower = state.deck.slice(0, i).reduce((a, b) => a + b, 0);
    const cardsHigher = state.deck.slice(i + 1).reduce((a, b) => a + b, 0);
    const cardsTotal = state.deck.reduce((a, b) => a + b);

    // evavu fails if we have a higher card
    const evavuFail = cardsHigher / cardsTotal;
    const tyranuFail = cardsLower / cardsTotal;

    let [bestChoice, failPercent] =
      evavuFail < tyranuFail ? ["Evavu", evavuFail] : ["Tyranu", tyranuFail];

    setState({
      open: e,
      deck: state.deck,
      bestChoice,
      failPercent,
      successPercent: 1 - failPercent,
      pristine: false,
      remaining: state.deck.reduce((a,b) => a+b),
      get isCompleted() {
        return this.remaining == 0
      }
    });
  };


  useEventListener("keyup", (e) => {
    // A number key e.g. "2" must be parsed where as a letter key such
    // as "k" for king must be converted to uppercase
    let key = parseInt(e.key) || e.key.toUpperCase()
    if (key === "0") key = 10
    if (values.includes(key)) reveal(key)
  })


  const reset = () => setState(initialDeck);

  const format = (d) => (d * 100).toFixed();

  return (
    <div className="container">      
      <div className="counter">
        {
          (function() {
            if (state.pristine) return "Click the first card to begin"
            if (state.isCompleted) return "Game won!"
            return <>
            <span>You should pick</span>
            <span className="choice">{state.bestChoice}</span>
            <span className="odds">
              {format(state.successPercent)}% chance of success
            </span>
            <span>On top: {state.open}</span>
            <span>Remaining: {state.remaining}</span>
          </>    
          }())
        }
        <div className="buttons">
          {values.map((e,i) => (
            <button key={e} onClick={() => reveal(e)} disabled={state.deck[i] === 0}>
              {e}
            </button>
          ))}
        </div>
        <button className="start-over" onClick={reset}>
          Start over
        </button>
        <details>
          <summary>Stats</summary>
          {JSON.stringify(state, null, 4)}
        </details>
      </div>
      <div>Tip: you can use your keyboard to reveal cards. Key 0 = 10</div>
    </div>

  );
}

export default TyranuEvavuCounterButtons;


// https://usehooks.com/useEventListener/
// Hook
function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}