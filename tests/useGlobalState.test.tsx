import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from 'vitest';
import { useGlobalState } from '../src/useGlobalState';


it("should share state between multiple components", () => {
    render(
        <>
            <Counter label="A" />
            <Counter label="B" />
        </>
    );

    const buttonA = screen.getByTestId("A-button");
    const valueA = screen.getByTestId("A-value");
    const valueB = screen.getByTestId("B-value");

    // Initial state should match
    expect(valueA).toHaveTextContent("0");
    expect(valueB).toHaveTextContent("0");

    // Clicking A's button should update both
    fireEvent.click(buttonA);

    expect(valueA).toHaveTextContent("1");
    expect(valueB).toHaveTextContent("1");


    function Counter({ label }: { label: string }) {
        const [count, setCount] = useGlobalState("counter", 0);

        return (
            <div>
                <span data-testid={`${label}-value`}>{count}</span>
                <button data-testid={`${label}-button`} onClick={() => setCount(c => c + 1)}>
                    Increment
                </button>
            </div>
        );
    }
});

it("should isolate different keys", () => {
    const TestA = () => {
        const [val, setVal] = useGlobalState("keyA", 0);
        return <button data-testid="btnA" onClick={() => setVal(v => v + 1)}>{val}</button>;
    };

    const TestB = () => {
        const [val, setVal] = useGlobalState("keyB", 100);
        return <button data-testid="btnB" onClick={() => setVal(v => v + 1)}>{val}</button>;
    };

    render(
        <>
            <TestA />
            <TestB />
        </>
    );

    const btnA = screen.getByTestId("btnA");
    const btnB = screen.getByTestId("btnB");

    fireEvent.click(btnA);
    expect(btnA).toHaveTextContent("1");
    expect(btnB).toHaveTextContent("100");

    fireEvent.click(btnB);
    expect(btnA).toHaveTextContent("1");
    expect(btnB).toHaveTextContent("101");
});

it("should support functional updates", () => {
    const Test = () => {
        const [val, setVal] = useGlobalState("func", 5);
        return <button data-testid="btn" onClick={() => setVal(v => v * 2)}>{val}</button>;
    };

    render(<Test />);

    const btn = screen.getByTestId("btn");
    expect(btn).toHaveTextContent("5");

    fireEvent.click(btn);
    expect(btn).toHaveTextContent("10");
});

it("should support only signaling the change", () => {
    const TestA = () => {
        const [_, __, signal] = useGlobalState("key", 0);
        return <button data-testid="btn" onClick={() => signal(v => v + 1)}>Signal</button>;
    };

    const TestB = () => {
        const [val] = useGlobalState<number>("key");
        return <div data-testid="div">{val}</div>;
    };

    render(
        <>
            <TestA />
            <TestB />
        </>
    );

    const btn = screen.getByTestId("btn");
    const div = screen.getByTestId("div");

    expect(div).toHaveTextContent("0");

    fireEvent.click(btn);
    
    expect(div).toHaveTextContent("1");
});
