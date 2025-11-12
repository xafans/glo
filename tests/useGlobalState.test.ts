import { act, renderHook } from "@testing-library/react";
import { expect, it } from 'vitest';
import { useGlobalState } from "../src/useGlobalState";

it("should share correct initial state between components", () => {
    const initialValue = 5;
    const name = "my-global-state";

    const { result: { current: [r1] } } = renderHook(() => useGlobalState(name, initialValue));
    const { result: { current: [r2] } } = renderHook(() => useGlobalState(name, 1));

    expect(r1).toBe(initialValue);
    expect(r2).toBe(initialValue);
});

it("should share state changes between components", () => {
    const name = "my-global-state2";

    const { result: { current: [s1, setS1] } } = renderHook(() => useGlobalState(name));
    const { result: { current: [s2] } } = renderHook(() => useGlobalState(name));

    expect(s1).toBe(undefined);
    expect(s2).toBe(undefined);

    const newValue = 5;
    act(() => setS1(newValue));

    const { result: { current: [ns1] } } = renderHook(() => useGlobalState(name));
    const { result: { current: [ns2] } } = renderHook(() => useGlobalState(name));

    expect(ns1).toBe(newValue);
    expect(ns2).toBe(newValue);
});

it("should signal state changes between components", () => {
    const name = "my-global-state3";

    const { result: { current: [s1, _, signal] } } = renderHook(() => useGlobalState(name));
    const { result: { current: [s2] } } = renderHook(() => useGlobalState(name));

    expect(s1).toBe(undefined);
    expect(s2).toBe(undefined);

    const newValue = 5;
    act(() => signal(newValue));

    const { result: { current: [ns1] } } = renderHook(() => useGlobalState(name));
    const { result: { current: [ns2] } } = renderHook(() => useGlobalState(name));

    expect(ns1).toBe(newValue);
    expect(ns2).toBe(newValue);
});
