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
        Error.call(this)
        // @ts-ignore
        if (!Error.captureStackTrace) {
            Object.defineProperty(targetObject, 'stack', {
                value: (new Error()).stack,
                writable: true,
                configurable: true,
            })
            return
        }
        // @ts-ignore
        Error.captureStackTrace(targetObject, constructorOpt)
    }
    captureError(container: CaptureErrorContract, error: Error): void {
        if (!container.captureError) {
            throw new Error('The "captureError" method not implemented on the container.')
        }
        return container.captureError(error)
    }
}

export const error = new SubtleError()
