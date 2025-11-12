# glo

A lightweight, dependency-free global state manager for React.

A **tiny, dependency-free global state management hook** for React that keeps your components perfectly in sync, without Context, Redux, or external libraries.


## Why use `glo`?

If you’ve ever thought:

> “I just need a global variable that re-renders components automatically…”

Then **useGlo** is exactly that, nothing more, nothing less.
It’s your **shared state hook without the bloat**.`


## Features

- ⚡ **Simple API** – Just one hook: `useGlo`.
- 🧠 **Global React state** – Share state across components easily.
- 🪶 **Lightweight** – Zero dependencies, minimal footprint.
- 🔄 **Signal updates** – Optional fine-grained control to broadcast or skip updates.
- 🔒 **Type-safe** – Full TypeScript support.


## Installation

```bash
npm install use-glo
# or
yarn add use-glo
```

_(If using directly in your project, just copy the hook file.)_



## Usage

### Basic Example

```tsx
import React from "react";
import { useGlo } from "use-glo";

function Counter() {
  const [count, setCount] = useGlo("count", 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  );
}

function Display() {
  const [count] = useGlo<number>("count");

  return <h2>Current count: {count}</h2>;
}

export default function App() {
  return (
    <>
      <Counter />
      <Display />
    </>
  );
}
```

---

### Update Without Re-rendering the Source

If you want to **update the state everywhere** (even in the component that triggered it) without re-rendering logic conflicts, use the `signal` method.

```tsx
const [count, setCount, signal] = useGlo("count", 0);

// Signal update all other components
signal((prev) => prev + 1);

// Or using the setter with signal
setCount((prev) => prev + 1, true);
```


## API Reference

### `useGlo`

```
useGlo<T>(key: string, initialValue?: T): [
    T,
    (value: T | (prev: T) => T, signal?: boolean) => void,
    (value: T | (prev: T) => T) => void
]
```

Creates or connects to a shared global state.

| Parameter      | Type             | Description                               |
| -------------- | ---------------- | ----------------------------------------- |
| `key`          | `string`         | Unique identifier for the global state.   |
| `initialValue` | `T` _(optional)_ | Initial value when the key is first used. |

#### Returns:

1. **state** – The current value of the global state.
2. **setGloState** – Updates the value (optionally skip current component re-render with `signal=true`).
3. **signal** – Force broadcast of the value to _all_ subscribers.

---

### `useGloSignal`

```
useGloSignal<T>(key: string, value: T)
```

A simplified version that returns only the `signal` function.  
Useful for broadcasting updates without subscribing to state changes.

```tsx
const signalCount = useGloSignal("count", 0);
signalCount((prev) => prev + 10);
```

## Internal Design

- Maintains a **global store** (`Map<string, GloStoreEntry>`) shared across hook instances.
- Each state entry tracks:
  - `value`: the current value
  - `subscribers`: an array of component-specific setters
- `setGloState` updates state and notifies subscribers except when `signal=true` is passed.
- `signal` updates all subscribers directly.


## 🧰 TypeScript Support

Includes full type inference:

```ts
const [theme, setTheme] = useGlo<"light" | "dark">("theme", "light");
```


## Example: Theming

```tsx
function ThemeToggler() {
  const [theme, setTheme] = useGlo("theme", "light");

  return (
    <button
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
    >
      Switch to {theme === "light" ? "dark" : "light"}
    </button>
  );
}

function Page() {
  const [theme] = useGlo("theme");

  return <div className={`page \${theme}`}>Current theme: {theme}</div>;
}
```


## License

MIT © Xafans
