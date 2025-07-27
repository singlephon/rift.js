import { VersionError } from './errors';

export default class Version {
    static _exact_ = '0.2.1'

    static check (version) {
        if (version !== Version._exact_)
            throw new VersionError(Version._exact_, version)
    }
}
