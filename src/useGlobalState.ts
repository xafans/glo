import React from "react";
import { GlobalStateReturn, GlobalStateValue, GlobalStoreEntry } from "./types";

let idCounter = 0;
const globalStore = new Map<string, GlobalStoreEntry<any>>();


export function useGlobalState<T>(
    key: string,
    initialValue?: GlobalStateValue<T>
): GlobalStateReturn<T> {

    if (!globalStore.has(key)) {
        globalStore.set(key, { value: initialValue, subscribers: [] });
    }

    const store = globalStore.get(key)!;
    const [state, setState] = React.useState(store.value);
    const idRef = React.useRef(++idCounter);

    React.useEffect(() => {
        store.subscribers.push({ id: idRef.current, setter: setState });
        return () => {
            store.subscribers = store.subscribers.filter(s => s.id !== idRef.current);
        };
    }, [key]);

    const setGlobalState = (value: GlobalStateValue<T>, signal?: boolean) => {
        const valueToStore =
            typeof value === "function"
                ? (value as (prev: T) => T)(store.value)
                : value;

        store.value = valueToStore;

        for (const { id, setter } of store.subscribers) {
            if (signal && id === idRef.current) continue;
            setter(valueToStore);
        }
    };

    const signal = <T>(value: GlobalStateValue<T>) => {
        const store = globalStore.get(key);
        if (!store) return;

        const nextValue =
            typeof value === "function"
                ? (value as any)(store.value)
                : value;

        store.value = nextValue;

        for (const { setter } of store.subscribers) {
            setter(nextValue);
        }
    }

    return [state, setGlobalState, signal];
}

export function useGlobalSignal<T>(key: string, value: GlobalStateValue<T>) {
    const [_, __, signal] = useGlobalState<T>(key, value as T);

    return signal;
}

