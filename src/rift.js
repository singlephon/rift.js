import { RiftContainer } from "@singlephon/rift";
import DataUtils from "./utils/data-utils";

export default class Rift {

    static version = '0.2.0'

    RiftContainer;
    RiftModules;
    RiftComponents = {};

    RiftHooks = {};

    constructor(RiftModules) {
        this.RiftContainer = RiftContainer;
        this.RiftModules = RiftModules;

        for (let path in this.RiftModules) {
            let name = path
                .replace('./rift/', '')
                .replace('.js', '')
                .replace(/\//g, '.')

            RiftContainer.bind(this.RiftModules[path].default, name);
        }
    }

    beforeInit (callback) {
        this.RiftHooks.beforeInit = this.isTypeof(callback, 'function')
        return this;
    }

    afterInit (callback) {
        this.RiftHooks.afterInit = this.isTypeof(callback, 'function')
        return this;
    }

    start () {
        this.evaluate(this.RiftHooks.beforeInit, this.RiftContainer);
        this.afterAlpineInit(() => {
            document.querySelectorAll('[rift]')
                .forEach(element => this.attachRiftToElement(element));

            Livewire.hook('morph.added', ({ el }) => {
                if (el.hasAttribute && el.hasAttribute('rift')) {
                    this.attachRiftToElement(el);
                }
            });

            Livewire.hook('commit', ({ component, commit, respond, succeed, fail }) => {
                succeed(({ snapshot, effect }) => {
                    snapshot = DataUtils.extractData(JSON.parse(snapshot));
                    const id = snapshot.memo.id;
                    const component = document.querySelector(`[wire\\:id="${id}"]`);
                    if (!component) throw new Error(`[Rift] Component ${snapshot.memo.id} not found`);

                    if (component._x_dataStack){
                        const rift = component._x_dataStack[0].rift;
                        rift._callHookMethod_ ('boot', snapshot);
                        rift._rift_synchronizer_(snapshot.data);
                        rift._callHookMethod_ ('booted', snapshot);
                    }
                })
            })

            this.evaluate(this.RiftHooks.afterInit, this.RiftContainer, this.RiftComponents);
        });
    }

    attachRiftToElement (element) {
        if (element.dataset.riftInit) return;

        const riftName = element.getAttribute('rift');
        if (riftName) {
            const id = element.getAttribute('wire:id');
            const snapshot = DataUtils.extractData(JSON.parse(element.getAttribute('wire:snapshot')));
            const rift = RiftContainer.make(String(riftName), id, snapshot);

            rift._callHookMethod_ ('mount', snapshot);
            rift._callHookMethod_ ('boot', snapshot);

            console.info(`[Rift] Bound ${riftName} to element`, element)

            element.childNodes.forEach(item => {
                item.rift = rift;
            });

            element.rift = rift;
            element.dataset.riftInit = true;

            rift._rift_synchronizer_ (snapshot.data);
            rift._rift_callable_ ();
            rift._rift_mount_ ();

            rift._callHookMethod_ ('booted', snapshot);

            this.RiftComponents[id] = rift;
        }
    }

    isTypeof (variable, type, error = null) {
        if (typeof variable === type)
            return variable;
        else
            throw new Error(error ? error : `[Rift] Evaluated variable ${variable} does not match the expected ${type} type`);
    }

    evaluate (fn, ...args) {
        if (typeof fn !== 'function')
            throw new Error(`[Rift] Evaluated variable ${fn} does not match the expected ${type} type`);

        try {
            return fn (...args);
        } catch (error) {
            throw new Error(`[Rift] Evaluated variable ${fn} contains crashed while running: ${error}`);
        }
    }


    afterAlpineInit (callback) {
        document.addEventListener("alpine:init", callback)
    }

}
