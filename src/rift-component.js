import Version from "./utils/version";
import {ComponentNotFoundError, MethodNotFoundError, PropertyNotFoundError, SyncError} from "./errors/not-found";

const do_not_sync = [
    '_id_', '_snapshot_', '_synchronizer_', '_component_members_', '_sync_', '_mounted_'
]

const do_not_call = ['__v_isRef', '__v_isReadonly', '__v_raw', '__v_skip', 'Symbol("Symbol.toStringTag")']

export default class RiftComponent {

    _id_ = null;
    _snapshot_ = null;
    _synchronizer_ = [];
    _component_members_ = {};

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
                        this._throw_error_(new SyncError(prop, target._id_));
                    }
                }

                return true;
            },
            get(obj, prop) {
                const value = obj[prop];

                if (typeof value === 'function') {
                    return function (...args) {
                        let result;

                        try {
                            result = value.apply(this, args);
                        } catch (error) {
                            obj._throw_error_(error)
                        }

                        if (result instanceof Promise) {
                            return result.catch(error => {
                                obj._throw_error_(error)
                            });
                        }

                        return result;
                    };
                }

                return value;
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
            set: async (target, prop, value) => {
                let component = Livewire.find(this._id_);
                if (!component) {
                    this._throw_error_(new ComponentNotFoundError(this._id_));
                    return undefined;
                }
                if (component._component_members_.properties.includes(prop)) {
                    return await component.$set(prop, value);
                } else {
                    this._throw_error_(new PropertyNotFoundError(prop, this._id_))
                }
            },
            get: (target, prop) => {
                let component = Livewire.find(this._id_);
                if (!component) {
                    this._throw_error_(new ComponentNotFoundError(this._id_));
                    return undefined;
                }

                if (typeof prop === 'symbol') return;

                if (!component._component_members_.methods.includes(prop) || !component._component_members_.properties.includes(prop))
                    return;

                if (typeof component[prop] === 'function') {
                    if (do_not_call.includes(prop))
                        return;

                    if (component._component_members_.methods.includes(prop)) {
                        return (...args) => component.$call(prop, ...args);
                    } else {
                        this._throw_error_(new MethodNotFoundError(prop, this._id_))
                        return () => {};
                    }
                } else {
                    return component[prop];
                }
            },
        });
    }

    _rift_mount_ () {
        if (this._mounted_)
            return;

        Livewire.on(`rift:call:${this._id_}`, ({ method, arguments: args }) => {
            if (typeof this[method] === 'function') {
                this[method](...args);
            } else {
                this._throw_error_(new MethodNotFoundError(method, this._id_))
            }
        });
        this._mounted_ = true;
    }


    _callHookMethod_ (hook, ...args) {
        if (typeof this[hook] === 'function') {
            return this[hook](...args);
        }
    }

    _throw_error_ (error) {
        const proceed = this._callHookMethod_?.('exception', error);
        if (proceed || typeof proceed === 'undefined') throw error;
    }

    _version_ (version) {
        Version.check(version, { soft: false });
    }

}
