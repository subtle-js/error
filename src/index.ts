export interface CaptureErrorContract {
    captureError(error: Error): void
}

interface SubtleErrorInterface {
    captureError(container: CaptureErrorContract, error: Error): void
}

class SubtleError implements SubtleErrorInterface {
    captureError(container: CaptureErrorContract, error: Error): void {
        if (!container.captureError) {
            throw new Error('The "captureError" method not implemented on the container.')
        }
        return container.captureError(error)
    }
}

export const error = new SubtleError()
