/** Base error for all failed PDF operations. */
export class PdfError extends Error {
    /** qpdf process exit code (2 = error). */
    exitCode;
    /** Raw qpdf stderr output. */
    stderr;
    constructor(message, exitCode, stderr) {
        super(message);
        this.name = 'PdfError';
        this.exitCode = exitCode;
        this.stderr = stderr;
    }
}
/** Thrown when a supplied password is wrong or a required password is missing. */
export class PdfPasswordError extends PdfError {
    constructor(message, exitCode, stderr) {
        super(message, exitCode, stderr);
        this.name = 'PdfPasswordError';
    }
}
