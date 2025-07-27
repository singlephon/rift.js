export default class {

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
                target[prop] = value;
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

        for (let prop of this._synchronizer_) {
            if (prop in data) {
                this[prop] = data[prop];
            }
        }

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
        if (this.mounted)
            return;

        Livewire.on(`rift:call:${this._id_}`, ({ method, arguments: args }) => {
            if (typeof this[method] === 'function') {
                this[method](...args);
            } else {
                console.error(`[Rift] Called method '${method}' not found on component.`);
            }
        });
        this.mounted = true;
    }

}
