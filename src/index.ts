export interface CaptureErrorContract {
    /** Capture error using the container */
    captureError(error: Error): void
}

interface SubtleErrorInterface {
    /** Capture error using the container */
    captureError(container: CaptureErrorContract, error: Error): void
    /** Create .stack property on a target object */
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
}

class SubtleError implements SubtleErrorInterface {
    captureStackTrace(targetObject: object, constructorOpt?: Function): void {
        // @ts-expect-error
        if (Error.captureStackTrace) {
            // @ts-expect-error
            Error.captureStackTrace(targetObject, constructorOpt)
        } else {
            // See https://github.com/sindresorhus/capture-stack-trace/blob/main/index.js
            const container = new Error();
            Object.defineProperty(targetObject, 'stack', {
                configurable: true,
                get() {
                    const { stack } = container;
                    Object.defineProperty(this, 'stack', { value: stack });
                    return stack;
                },
            });
        }
    }
    captureError(container: CaptureErrorContract, error: Error): void {
        if (!container.captureError) {
            throw new Error('The "captureError" method not implemented on the container.')
        }
        return container.captureError(error)
    }
}

export const error = new SubtleError()
