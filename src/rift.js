import { RiftContainer } from "@singlephon/rift";

export default class Rift {

    RiftContainer;
    RiftModules;

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
        })
    }

    #initRiftOnDOMElement(el) {
        if (el.dataset.riftInit) return;

        const riftName = el.getAttribute('rift');
        if (riftName) {
            el.rift = RiftContainer.make(String(riftName));
            el.dataset.riftInit = true;
            // console.log(`[Rift] Bound ${riftName} to element`, el);

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
