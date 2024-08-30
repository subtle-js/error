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

/**
 * See https://github.com/sindresorhus/capture-stack-trace/blob/main/index.js
 * @param err {Error}
 */
function captureStackTraceShim(err: Error) {
    const container = new Error(); // eslint-disable-line unicorn/error-message

    Object.defineProperty(err, 'stack', {
        configurable: true,
        get() {
            const { stack } = container;
            Object.defineProperty(this, 'stack', { value: stack });
            return stack;
        },
    });
}

// @ts-expect-error
const captureStackTrace: SubtleErrorInterface['captureStackTrace'] = Error.captureStackTrace ?? captureStackTraceShim;

class SubtleError implements SubtleErrorInterface {
    captureStackTrace = captureStackTrace

    captureError(container: CaptureErrorContract, error: Error): void {
        if (!container.captureError) {
            throw new Error('The "captureError" method not implemented on the container.')
        }
        return container.captureError(error)
    }
}

export const error = new SubtleError()
