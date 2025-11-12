import React from "react";
import { GloStateReturn, GloStateValue, GloStoreEntry } from "./types";

let idCounter = 0;
const gloStore = new Map<string, GloStoreEntry<any>>();


export function useGlo<T>(
    key: string,
    initialValue?: GloStateValue<T>
): GloStateReturn<T> {

    if (!gloStore.has(key)) {
        gloStore.set(key, { value: initialValue, subscribers: [] });
    }

    const store = gloStore.get(key)!;
    const [state, setState] = React.useState(store.value);
    const idRef = React.useRef(++idCounter);

    React.useEffect(() => {
        store.subscribers.push({ id: idRef.current, setter: setState });
        return () => {
            store.subscribers = store.subscribers.filter(s => s.id !== idRef.current);
        };
    }, [key]);

    const setGloState = (value: GloStateValue<T>, signal?: boolean) => {
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

    const signal = <T>(value: GloStateValue<T>) => {
        const store = gloStore.get(key);
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

    return [state, setGloState, signal];
}

export function useGloSignal<T>(key: string, value: GloStateValue<T>) {
    const [_, __, signal] = useGlo<T>(key, value as T);

    return signal;
}

