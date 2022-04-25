import { CircuitBreakerClient } from '@clients/circuit-breaker.client';

export function circuitFire() {
    return (target: object, _propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor => {
        const className = target.constructor.name;
        target.constructor.prototype._circuitInstance = target.constructor.prototype._circuitInstance ?? new CircuitBreakerClient(className).getInstance();
        const circuit = target.constructor.prototype._circuitInstance

        const method = propertyDesciptor.value;
        propertyDesciptor.value = async function (...args: any[]) {
            let result;
            let error;

            try {
                if (!circuit.opened) {
                    result = await method.apply(this, args);
                }
            } catch (exception) {
                error = exception;
            } finally {
                return await circuit.fire(result, error);
            }
        };
        return propertyDesciptor;
    };
}