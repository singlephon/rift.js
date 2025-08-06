import { VersionError } from './errors';

export default class Version {
    static _exact_ = '0.2.4'

    static check (version, config = { soft: false}) {
        if (config.soft) {
            if (version !== Version._exact_)
                console.warn(`[Rift] Framework version mismatch: frontend (${Version._exact_}) ≠ backend (${version})`)
            return true;
        }
        if (version !== Version._exact_)
            throw new VersionError(Version._exact_, version)
    }
}
