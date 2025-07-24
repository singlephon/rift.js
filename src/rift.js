import { RiftContainer } from "@singlephon/rift";

export default class Rift {

    RiftContainer;
    RiftModules;
    RiftComponents = {};

    constructor(RiftModules) {
        this.RiftContainer = RiftContainer;
        this.RiftModules = RiftModules;
        this.bindClasses();
    }


    bindClasses () {
        // console.log(this.RiftModules)
        for (let path in this.RiftModules) {
            let name = path
                .replace('./rift/', '')
                .replace('.js', '')
                .replace(/\//g, '.')

            RiftContainer.bind(this.RiftModules[path].default, name);
        }
    }

    start () {
        this.afterAlpineInit(() => {
            Livewire.hook('morph.added', ({ el }) => {
                if (el.hasAttribute && el.hasAttribute('rift')) {
                    this.#initRiftOnDOMElement(el);
                }
            });

            document.querySelectorAll('[rift]').forEach(el => this.#initRiftOnDOMElement(el));

            Livewire.hook('morph.updating', ({ el }) => {
                if (el.hasAttribute && el.hasAttribute('rift')) {
                    this.#initRiftOnDOMElement(el);
                }
            });
            //
            Livewire.hook('morph.updated', ({ el }) => {
                if (el.hasAttribute && el.hasAttribute('rift')) {
                    this.#initRiftOnDOMElement(el);
                }
            });

            // Livewire.hook('request', ({ url, options, payload, respond, succeed, fail }) => {
            //     // Runs after commit payloads are compiled, but before a network request is sent...
            //
            //     respond(({ status, response }) => {
            //         // Runs when the response is received...
            //         // "response" is the raw HTTP response object
            //         // before await response.text() is run...
            //     })
            //
            //     succeed(({ status, json }) => {
            //         // Runs when the response is received...
            //         // "json" is the JSON response object...
            //         console.log(json.components[0].effects)
            //     })
            //
            //     fail(({ status, content, preventDefault }) => {
            //         // Runs when the response has an error status code...
            //         // "preventDefault" allows you to disable Livewire's
            //         // default error handling...
            //         // "content" is the raw response content...
            //     })
            // });

            Livewire.hook('commit', ({ component, commit, respond, succeed, fail }) => {
                // Runs immediately before a commit's payload is sent to the server...
                // console.log(component)

                respond(() => {
                    // Runs after a response is received but before it's processed...
                })

                succeed(({ snapshot, effect }) => {
                    // Runs after a successful response is received and processed
                    // with a new snapshot and list of effects...
                    snapshot = JSON.parse(snapshot)
                    // console.log(component.effects.html)
                    console.log(component)
                    const needle = snapshot.memo.id;
                    const component_local = document.querySelector(`[wire\\:id="${needle}"]`);
                    if (!component_local) throw new Error(`Rift component ${snapshot.memo.id} not found in RiftComponents{}`);

                    // const wire = Livewire.find(snapshot.memo.id);
                    // wire.count = 111
                    // console.log()
                    // console.log("Found", component)
                    // console.log("SNAPSHOT", snapshot)
                    component_local._x_dataStack[0].rift.livewireSynchronizer(snapshot.data);

                    // component.rift.syncable = false;
                    // for (let prop of component.rift.synchronizer()) {
                    //     if (prop in snapshot.data) {
                    //         component.rift[prop] = snapshot.data[prop];
                    //     }
                    // }
                    // component.rift.syncable = true
                    // component.rift.syncable = false;
                    // component.rift.count=0;
                    // component.rift.syncable = true;


                    // console.log(el.rift.count = Math.random());
                })

                fail(() => {
                    // Runs if some part of the request failed...
                })
            })
        })
    }

    #initRiftOnDOMElement(el) {
        if (el.dataset.riftInit) return;

        const riftName = el.getAttribute('rift');
        if (riftName) {
            el.rift = RiftContainer.make(String(riftName));
            el.rift.initWireComponent(el.getAttribute('wire:id'));
            el.dataset.riftInit = true;

            this.RiftComponents[el.getAttribute('wire:id')] = el;

            console.log(`[Rift] Bound ${riftName} to element`, el)

            el.childNodes.forEach(btn => {
                btn.rift = el.rift;
            });

            if (!el.hasAttribute('x-data')) {
                el.setAttribute('x-data', '{ rift: {} }');
                el.setAttribute('x-init', '$nextTick(() => { rift = $el.rift })');
            }
        }
    }


    afterAlpineInit (callback) {
        document.addEventListener("alpine:init", callback)
    }

}
