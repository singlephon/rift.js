import {RiftError} from "./rift";

export class MethodNotFoundError extends RiftError {
    constructor(method, componentId) {
        super(`Method '${method}' not found on component '${componentId}'`, {
            code: 'METHOD_NOT_FOUND',
            context: { method, componentId }
        });
    }
}

export class PropertyNotFoundError extends RiftError {
    constructor(prop, componentId) {
        super(`Property '${prop}' not found on component '${componentId}'`, {
            code: 'PROPERTY_NOT_FOUND',
            context: { prop, componentId }
        });
    }
}

export class SyncError extends RiftError {
    constructor(prop, componentId) {
        super(`Sync failed for '${prop}' on '${componentId}'`, {
            code: 'SYNC_ERROR',
            context: { prop, componentId }
        });
    }
}


export class ComponentNotFoundError extends RiftError {
    constructor(componentId) {
        super(`Component ${componentId} not found`, {
            code: 'COMPONENT_NOT_FOUND',
            context: { componentId }
        });
    }
}
