export default class {

    wireId = null;

    constructor() {
        this.initCallableRemote()

        const synchronizer = this.synchronizer?.() ?? [];
        this.__syncKeys = synchronizer;

        return new Proxy(this, {
            set: (target, prop, value) => {
                target[prop] = value;

                if (target.__syncKeys.includes(prop)) {
                    let component = Livewire.find(target.wireId);
                    if (component) {
                        component.$set(prop, value);
                    } else {
                        console.warn(`[Rift] Livewire component with wireId=${target.wireId} not found for sync of ${prop}`);
                    }
                }

                return true;
            }
        });
    }

    initCallableRemote () {
        this.rift = new Proxy({}, {
            get: (target, prop) => {
                return async (...args) => {
                    let component = Livewire.find(this.wireId);
                    if (!component) throw new Error(`Rift component ${this.wireId} not found`);
                    return await component.$call(prop, ...args);
                }
            },
            set: async (target, prop, value) => {
                let component = Livewire.find(this.wireId);
                if (!component) throw new Error(`Rift component ${this.wireId} not found`);
                return await component.$set(prop, value);
            }
        });
    }

    initWireComponent (wireId) {
        this.wireId = wireId;
    }

}
