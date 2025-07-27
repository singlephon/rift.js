export default class {

    wireId = null;
    syncable = true;
    mounted = false;

    constructor() {
        this.initCallableRemote();

        // const synchronizer = this.synchronizer?.() ?? [];
        // this.__syncKeys = synchronizer;
        //
        this.__syncKeys = [];
        this._synchronizer = [];

        return new Proxy(this, {
            set: (target, prop, value) => {
                target[prop] = value;
                const component = Livewire.find(this.wireId);
                if (component)
                    this._synchronizer = Array.from(component._synchronizer)

                if (this._synchronizer.includes(prop)) {
                    if (!this.syncable) {
                        // console.info("[Rift] Skip syncing")
                        return true;
                    }
                    if (component) {
                        component.$set(prop, value);
                    } else {
                        console.error(`[Rift] Livewire component with wireId=${target.wireId} not found for sync of ${prop}`);
                    }
                }

                return true;
            }
        });
    }

    initCallableRemote () {
        this.rift = new Proxy({}, {
            // get: (target, prop) => {
            //     return async (...args) => {
            //         let component = Livewire.find(this.wireId);
            //         if (!component) throw new Error(`Rift component ${this.wireId} not found`);
            //         return await component.$call(prop, ...args);
            //     }
            // },
            get: (target, prop) => {
                let component = Livewire.find(this.wireId);
                if (!component) throw new Error(`[Rift] Component ${this.wireId} not found`);

                if (typeof component[prop] === 'function') {
                    return (...args) => component.$call(prop, ...args);
                } else {
                    return component[prop];
                }
            },
            set: async (target, prop, value) => {
                let component = Livewire.find(this.wireId);
                if (!component) throw new Error(`[Rift] Component ${this.wireId} not found`);
                return await component.$set(prop, value);
            }
        });
    }

    initBackendCallListener () {
        if (this.mounted)
            return;

        // RiftMount
        // console.log('MOUNT !')

        Livewire.on(`rift:call:${this.wireId}`, ({ method, arguments: args }) => {
            if (typeof this[method] === 'function') {
                this[method](...args);
            } else {
                console.error(`[Rift] Called method '${method}' not found on component.`);
            }
        });
        this.mounted = true;
    }

    // livewireSynchronizer (data) {
    //     this.syncable = false;
    //     for (let prop of data._synchronizer[0]) {
    //         if (prop in data) {
    //             // if (typeof data[prop] === 'arr')
    //             this[prop] = data[prop];
    //         }
    //     }
    //     this.syncable = true;
    // }

    // RiftSync
    livewireSynchronizer(data) {
        this.syncable = false;

        // console.log('SYNC !')

        for (let prop of data._synchronizer[0]) {
            if (prop in data) {
                const value = data[prop];

                if (Array.isArray(value) && value.length === 2 && typeof value[1] === 'object') {
                    this[prop] = this.unpackLivewireData(value);
                } else {
                    this[prop] = value;
                }
            }
        }

        this.syncable = true;
    }

    unpackLivewireData([values, mapping]) {
        // const result = {};
        // for (const key in mapping) {
        //     const index = mapping[key];
        //     result[key] = values[index];
        // }
        // return result;
        return values;
    }

    initWireComponent (wireId) {
        this.wireId = wireId;
        this.initBackendCallListener();
    }


}
