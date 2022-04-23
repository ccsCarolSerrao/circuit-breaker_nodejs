import { CircuitBreakerOpenrException } from '@helpers/customError/exceptions/circuitBreakerOpen.exception';
import CircuitBreaker from 'opossum';
import { MemoryCache } from './memory-cache.client';

export class CircuitBreakerClient {
    constructor(protected readonly circuitName: string) {
        this._cache = MemoryCache.getInstance();
    }

    private _circuitBreaker: CircuitBreaker;
    private _cache: MemoryCache;

    public wrapExternalService(result: any, error: any) {
        if (result) {
            return Promise.resolve(result);
        }

        return Promise.reject(error);
    }

    static CircuitFire(circuit: CircuitBreaker) {
        return (target: object, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor => {
            const method = propertyDesciptor.value;
            propertyDesciptor.value = async function (...args: any[]) {
                if (!circuit.opened) {
                    await method.apply(this, args);
                }

                throw new CircuitBreakerOpenrException(target.constructor.name);
            };
            return propertyDesciptor;
        };
    }

    private logCircuitState(message: string, circuit: CircuitBreaker) {
        console.log(message, circuit.stats);
    }

    private getCircuitOnCache() {
        return this._cache.get<CircuitBreaker>(this.circuitName) as CircuitBreaker;
    }

    private putCircuitOnCache() {
        this._cache.put(this.circuitName, this._circuitBreaker);
    }

    init() {
        const circuitExport = this.getCircuitOnCache();

        const circuitOptions: CircuitBreaker.Options = {
            timeout: Number(process.env.CIRCUIT_BREAKER_TIMEOUT_IN_MILLISECONDS),
            errorThresholdPercentage: Number(process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE),
            resetTimeout: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_IN_MILLISECONDS),
            ...circuitExport,
        };
        circuitOptions.enabled = process.env.CIRCUIT_BREAKER_ENABLED === 'true' ? true : false;
        circuitOptions.volumeThreshold = Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD);
        circuitOptions.group = this.circuitName;

        this._circuitBreaker = new CircuitBreaker(this.wrapExternalService, circuitOptions);

        //this._circuitBreaker.fallback(() => 'Sorry, out of service right now');

        this._circuitBreaker.on('fire', (_result) => {
            this.logCircuitState('FIRE', this._circuitBreaker);

            this.putCircuitOnCache();
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
