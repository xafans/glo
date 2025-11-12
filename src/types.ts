export type GlobalSubscriber<T> = {
    id: number;
    setter: React.Dispatch<React.SetStateAction<T>>;
};

export type GlobalStoreEntry<T> = {
    value: T;
    subscribers: GlobalSubscriber<T>[];
};

export type GlobalStateValue<T> = T | ((prev: T) => T);

export type GlobalStateReturn<T> = [T, (value: GlobalStateValue<T>, signal?: boolean) => void, (value: GlobalStateValue<T>) => void];

