import cache from 'memory-cache';

export class MemoryCache {
    private static _instance: MemoryCache;

    public static getInstance() {
        if (!MemoryCache._instance) {
            MemoryCache._instance = new MemoryCache();
        }

        return MemoryCache._instance;
    }

    async put(key: string, value: object | string, timeInSeconds?: number) {
        const timeInMiliseconds = timeInSeconds ? timeInSeconds * 1000 : timeInSeconds;
        const valueString = typeof value === 'string' ? value : JSON.stringify(value);

        return cache.put(key, valueString, timeInMiliseconds);
    }

    async get<T>(key: string): Promise<T | string | null> {
        const data = cache.get(key);

        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data) as T;
        } catch {
            return data as string;
        }
    }
}
