import CircuitBreaker from 'opossum';
import { MemoryCache } from '@clients/memory-cache.client';

export class CircuitBreakerClient {
    private _cache: MemoryCache;

    constructor(private readonly _circuitName: string) {
        this._cache = MemoryCache.getInstance();
    }

    private wrapExternalService(result: any, error: any) {
        if (result) {
            return Promise.resolve(result);
        }

        return Promise.reject(error);
    }

    private logCircuitState(message: string, circuit: CircuitBreaker) {
        console.log(message, circuit.stats);
    }

    private getCircuitOnCache() {
        return this._cache.get<CircuitBreaker>(this._circuitName) as CircuitBreaker;
    }

    private putCircuitOnCache(circuit: CircuitBreaker) {
        this._cache.put(this._circuitName, circuit);
    }

    public getInstance() {
        const circuitOnCache = this.getCircuitOnCache();

        const circuitOptions: CircuitBreaker.Options = {
            timeout: Number(process.env.CIRCUIT_BREAKER_TIMEOUT_IN_MILLISECONDS),
            errorThresholdPercentage: Number(process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE),
            resetTimeout: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_IN_MILLISECONDS),
            ...circuitOnCache,
        };
        circuitOptions.enabled = process.env.CIRCUIT_BREAKER_ENABLED === 'true' ? true : false;
        circuitOptions.volumeThreshold = Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD);
        circuitOptions.group = this._circuitName;

        const circuitBreaker = new CircuitBreaker(this.wrapExternalService, circuitOptions);

        //circuitBreaker.fallback(() => 'Sorry, out of service right now');

        circuitBreaker.on('fire', (_result) => {
            this.logCircuitState('FIRE', circuitBreaker);

            this.putCircuitOnCache(circuitBreaker);
        });

        circuitBreaker.on('success', (_result) => {
            this.logCircuitState(`SUCCESS: The circuit for the ${this._circuitName} just succssed.`, circuitBreaker);
        });

        circuitBreaker.on('failure', (_result) => {
            this.logCircuitState(`FAILURE: The circuit for the ${this._circuitName} just failed.`, circuitBreaker);
        });

        circuitBreaker.on('timeout', (_result) => {
            this.logCircuitState(`TIMEOUT: Service ${this._circuitName} is taking too long to respond.`, circuitBreaker);
        });

        circuitBreaker.on('reject', () => {
            this.logCircuitState(`REJECTED: The circuit for ${this._circuitName} is open. Failing fast.`, circuitBreaker);
        });

        circuitBreaker.on('open', () => {
            this.logCircuitState(`OPEN: The circuit for ${this._circuitName} just opened.`, circuitBreaker);
        });

        circuitBreaker.on('halfOpen', () => {
            this.logCircuitState(`HALF_OPEN: The circuit for ${this._circuitName} is half open.`, circuitBreaker);
        });

        circuitBreaker.on('close', () => {
            this.logCircuitState(`CLOSE: The circuit for ${this._circuitName} has closed. Service OK.`, circuitBreaker);
        });

        circuitBreaker.on('fallback', (data) => {
            this.logCircuitState(`FALLBACK: ${JSON.stringify(data)}`, circuitBreaker);
        });

        circuitBreaker.on('shutdown', () => {
            this.logCircuitState('SHUTDOWN', circuitBreaker);
        });

        return circuitBreaker;
    }
}
