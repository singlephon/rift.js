class Container {
    constructor() {
        this.bindings = new Map();      // ClassRef -> factory
        this.namedBindings = new Map(); // 'name' -> factory
        this.singletons = new Map();    // ClassRef -> instance
        this.namedSingletons = new Map(); // 'name' -> instance
    }

    bind(ClassRef, name = null) {
        const factory = () => new ClassRef();
        if (name) {
            this.namedBindings.set(name, factory);
        } else {
            this.bindings.set(ClassRef, factory);
        }
    }

    singleton(ClassRef, name = null) {
        const instance = new ClassRef();
        if (name) {
            this.namedSingletons.set(name, instance);
        } else {
            this.singletons.set(ClassRef, instance);
        }
    }

    make(ClassRefOrName, ...args) {
        if (typeof ClassRefOrName === 'string') {
            if (this.namedSingletons.has(ClassRefOrName)) {
                return this.namedSingletons.get(ClassRefOrName);
            }
            if (this.namedBindings.has(ClassRefOrName)) {
                return this.namedBindings.get(ClassRefOrName)(...args);
            }
        } else {
            if (this.singletons.has(ClassRefOrName)) {
                return this.singletons.get(ClassRefOrName);
            }
            return new ClassRefOrName(...args);
        }

        throw new Error(`No binding found for ${ClassRefOrName}`);
    }

    get(ClassRefOrName) {
        return this.make(ClassRefOrName);
    }
}

export default new Container();
