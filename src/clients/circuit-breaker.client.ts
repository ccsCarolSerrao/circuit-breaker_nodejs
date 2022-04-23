import CircuitBreaker from 'opossum';
import { MemoryCache } from './memory-cache.client';

export class CircuitBreakerClient {
    constructor(protected readonly circuitName: string, protected action: (...args: any) => Promise<any>) {
        this._cache = MemoryCache.getInstance();
    }

    private _circuitBreaker: CircuitBreaker;
    private _cache: MemoryCache;

    private logCircuitState(message: string, circuit: CircuitBreaker) {
        console.log(message, circuit.stats);
    }

    private async getCircuitOnCache() {
        return (await this._cache.get<CircuitBreaker>(this.circuitName)) as CircuitBreaker;
    }

    private async putCircuitOnCache() {
        await this._cache.put(this.circuitName, this._circuitBreaker);
    }

    async init() {
        const circuitExport = await this.getCircuitOnCache();

        const circuitOptions: CircuitBreaker.Options = {
            timeout: Number(process.env.CIRCUIT_BREAKER_TIMEOUT_IN_MILLISECONDS),
            errorThresholdPercentage: Number(process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE),
            resetTimeout: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_IN_MILLISECONDS),
            ...circuitExport,
        };
        circuitOptions.enabled = process.env.CIRCUIT_BREAKER_ENABLED === 'true' ? true : false;
        circuitOptions.volumeThreshold = Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD);
        circuitOptions.group = this.circuitName;

        this._circuitBreaker = new CircuitBreaker(this.action, circuitOptions);

        this._circuitBreaker.fallback(() => 'Sorry, out of service right now');

        this._circuitBreaker.on('fire', async (_result) => {
            this.logCircuitState('FIRE', this._circuitBreaker);

            await this.putCircuitOnCache();
        });

        this._circuitBreaker.on('success', (_result) => {
            this.logCircuitState('SUCCESS', this._circuitBreaker);
        });

        this._circuitBreaker.on('failure', (_result) => {
            this.logCircuitState('FAILURE', this._circuitBreaker);
        });

        this._circuitBreaker.on('timeout', (_result) => {
            this.logCircuitState('TIMEOUT: Service is taking too long to respond.', this._circuitBreaker);
        });

        this._circuitBreaker.on('reject', () => {
            this.logCircuitState('REJECTED: The circuit for ${route} is open. Failing fast.', this._circuitBreaker);
        });

        this._circuitBreaker.on('open', () => {
            this.logCircuitState('OPEN: The circuit for the service just opened.', this._circuitBreaker);
        });

        this._circuitBreaker.on('halfOpen', () => {
            this.logCircuitState('HALF_OPEN: The circuit for the service is half open.', this._circuitBreaker);
        });

        this._circuitBreaker.on('close', () => {
            this.logCircuitState('CLOSE: The circuit has closed. Service OK.', this._circuitBreaker);
        });

        this._circuitBreaker.on('fallback', (data) => {
            this.logCircuitState(`FALLBACK: ${JSON.stringify(data)}`, this._circuitBreaker);
        });

        this._circuitBreaker.on('shutdown', () => {
            this.logCircuitState('SHUTDOWN', this._circuitBreaker);
        });

        return this._circuitBreaker;
    }
}
