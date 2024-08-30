export interface CaptureErrorContract {
    /** Capture error using the container */
    captureError(err: Error): void
}

interface SubtleErrorInterface {
    /** Capture error using the container */
    captureError(container: CaptureErrorContract, err: Error): void
}

class SubtleError implements SubtleErrorInterface {
    captureError(container: CaptureErrorContract, err: Error): void {
        if (!container.captureError) {
            throw new Error('The "captureError" method not implemented on the container.')
        }
        return container.captureError(err)
    }
}

class ErrorContainer {
    public readonly subtle = new SubtleError()
}

export const error = new ErrorContainer()
