import { useEffect, useMemo, useRef, useState } from "react";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import * as t from "./tyranuevavu";
import TyranuEvavuCounterButtons from './TyranuEvavuCounterButtons';

export default function App() {
  return (
    <HashRouter>
      <main>
        <Routes>
          <Route path="/" element={<TyranuEvavuCounter />} />
          <Route path="/tyranu-evavu-counter" element={<TyranuEvavuCounter />} />
          <Route path="/tyranu-evavu-counter-buttons" element={<TyranuEvavuCounterButtons />} />
          <Route path="/pyramids" element={<Pyramids />} />
        </Routes>
      </main>
      <nav>
        <Link to="/tyranu-evavu-counter">Tyranu Evavu Counter</Link>
        <Link to="/tyranu-evavu-counter-buttons">Tyranu Evavu Counter with buttons</Link>
        {/* <Link to="pyramids">Pyramids</Link> */}
      </nav>
    </HashRouter>
  );
}

function Pyramids() {
  return "not implemented";
}

function TyranuEvavuCounter() {
  const [value, setValue] = useState("");
  const result = useMemo(() => {
    return t.evaluate(value);
  }, [value]);

  return (
    <div className="container">
      <div className="counter">
        <div className="result">
            <div>You should pick</div>
            <div className="choice">{result.bestChoice}</div>
            <div>{(100 * result.odds).toFixed(0)}% chance of success</div>
        </div>
        <textarea
          autoFocus
          rows={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Start typing to begin ..."
        ></textarea>
        <details>
          <summary>How to use</summary>
          <p>
            Type in the chain of characters that represents your game. To start,
            please type in the first card of the game
          </p>
          <code>4</code>
          <p>As you keep playing, keep typing in the cards</p>
          <code>4k4T893J</code>
          <p>
            The card ten is repesented by either a <code>T</code> or{" "}
            <code>0</code> or <code>1</code>, the other cards are unsurprisingly
            represented by <code>2, 3, 4, 5, 6, 7, 8, 9, J, Q, K, A</code>
          </p>
        </details>
      </div>
    </div>
  );
}

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
