export type GloSubscriber<T> = {
    id: number;
    setter: React.Dispatch<React.SetStateAction<T>>;
};

export type GloStoreEntry<T> = {
    value: T;
    subscribers: GloSubscriber<T>[];
};

export type GloStateValue<T> = T | ((prev: T) => T);

export type GloStateReturn<T> = [T, (value: GloStateValue<T>, signal?: boolean) => void, (value: GloStateValue<T>) => void];

