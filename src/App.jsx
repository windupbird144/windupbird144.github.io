import { useState } from "react";
import "./App.css";

const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

function App() {
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
      complete: state.deck.reduce((a,b) => a+b) === 0
    });
  };

  const reset = () => setState(initialDeck);

  const format = (d) => (d * 100).toFixed();

  return (
    <div className="counter">
      {
        (function() {
          if (state.pristine) return "Click the first card to begin"
          if (state.complete) return "Game won!"
          return <>
          <span>You should pick</span>
          <span className="choice">{state.bestChoice}</span>
          <span className="odds">
            {format(state.successPercent)}% chance of success
          </span>
          <span>On top: {state.open}</span>
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
  );
}

export default App;
