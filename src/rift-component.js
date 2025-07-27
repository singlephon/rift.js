const do_not_sync = [
    '_id_', '_snapshot_', '_synchronizer_', '_sync_', '_mounted_'
]

export default class RiftComponent {

    _id_ = null;
    _snapshot_ = null;
    _synchronizer_ = [];

    _sync_ = true;
    _mounted_ = false;

    constructor(id, snapshot) {
        this._id_ = id;
        this._snapshot_ = snapshot;
        this._synchronizer_ = snapshot.data._synchronizer_;

        return new Proxy(this, {
            set: (target, prop, value) => {

                if (do_not_sync.includes(prop)) {
                    target[prop] = value;
                    return true;
                }
                this._callHookMethod_ ('updating', prop, value);
                target[prop] = value;
                this._callHookMethod_ ('updated', prop, value);

                const component = Livewire.find(this._id_);

                if (this._synchronizer_.includes(prop) && component) {
                    if (!this._sync_) {
                        return true;
                    }
                    if (component) {
                        component.$set(prop, value);
                    } else {
                        console.error(`[Rift] Livewire component with wireId=${target._id_} not found for sync of ${prop}`);
                    }
                }

                return true;
            }
        });
    }

    _rift_synchronizer_ (data) {
        this._sync_ = false;

        this._callHookMethod_ ('syncing', data);
        for (let prop of this._synchronizer_) {
            if (prop in data) {
                this[prop] = data[prop];
            }
        }
        this._callHookMethod_ ('synced', data);
        this._sync_ = true;
    }

    _rift_callable_ () {
        this.rift = new Proxy({}, {
            get: (target, prop) => {
                let component = Livewire.find(this._id_);
                if (!component) throw new Error(`[Rift] Component ${this._id_} not found`);

                if (typeof component[prop] === 'function') {
                    return (...args) => component.$call(prop, ...args);
                } else {
                    return component[prop];
                }
            },
            set: async (target, prop, value) => {
                let component = Livewire.find(this._id_);
                if (!component) throw new Error(`[Rift] Component ${this._id_} not found`);
                return await component.$set(prop, value);
            }
        });
    }

    _rift_mount_ () {
        if (this._mounted_)
            return;

        Livewire.on(`rift:call:${this._id_}`, ({ method, arguments: args }) => {
            if (typeof this[method] === 'function') {
                this[method](...args);
            } else {
                console.error(`[Rift] Called method '${method}' not found on component.`);
            }
        });
        this._mounted_ = true;
    }


    _callHookMethod_ (hook, ...args) {
        if (typeof this[hook] === 'function') {
            try {
                this[hook](...args);
            } catch (error) {
                throw new Error(`[Rift] Error in "${hook}" hook: ${error}`);
            }
        }
    }


}
