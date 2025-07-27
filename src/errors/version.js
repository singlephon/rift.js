export class VersionError extends Error {
    constructor(frontendVersion, backendVersion) {
        super(`[Rift] Framework version mismatch: frontend (${frontendVersion}) ≠ backend (${backendVersion})`);
        this.name = "VersionError";
        this.frontendVersion = frontendVersion;
        this.backendVersion = backendVersion;
        this.statusCode = 500;
    }
}
