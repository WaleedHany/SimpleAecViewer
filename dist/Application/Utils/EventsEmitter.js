/**
 * Event emitter
 */
export default class EventsEmitter {
    constructor() {
        this.callbacks = {};
        this.callbacks = {};
        this.callbacks.base = {};
    }
    /**
     * On event subscription
     * @param _names event name
     * @param callback call back function
     */
    on(_names, callback) {
        // Errors
        if (this.checkValidName(_names)) {
            console.warn('wrong names');
            return false;
        }
        if (typeof callback === 'undefined') {
            console.warn('wrong callback');
            return false;
        }
        // Resolve names
        const names = this.resolveNames(_names);
        // Each name
        names.forEach((_name) => {
            // Resolve name
            const name = this.resolveName(_name);
            // Create namespace if not exist
            if (!(this.callbacks[name.namespace] instanceof Object))
                this.callbacks[name.namespace] = {};
            // Create callback if not exist
            if (!(this.callbacks[name.namespace][name.value] instanceof Array))
                this.callbacks[name.namespace][name.value] = [];
            // Add callback
            this.callbacks[name.namespace][name.value].push(callback);
        });
        return this;
    }
    /**
     * Un-subscripe to event
     * @param _names event name
     */
    off(_names) {
        // Errors
        if (this.checkValidName(_names)) {
            console.warn('wrong name');
            return false;
        }
        // Resolve names
        const names = this.resolveNames(_names);
        // Each name
        names.forEach((_name) => {
            // Resolve name
            const name = this.resolveName(_name);
            // Remove namespace
            if (name.namespace !== 'base' && name.value === '') {
                delete this.callbacks[name.namespace];
            }
            // Remove specific callback in namespace
            else {
                this.RemoveSpecificCallbackInNamespace(name);
            }
        });
        return this;
    }
    /**
     * Event trigger
     * @param _name event name
     * @param _args additional objects array to be passed with trigger
     */
    trigger(_name, _args) {
        // Errors
        if (this.checkValidName(_name)) {
            console.warn('wrong name');
            return false;
        }
        let finalResult = null;
        let result = null;
        // Default args
        const args = !(_args instanceof Array) ? [] : _args;
        // Resolve names (should on have one event)
        let nameArray = this.resolveNames(_name);
        // Resolve name
        let name = this.resolveName(nameArray[0]);
        // Default namespace
        if (name.namespace === 'base') {
            // Try to find callback in each namespace
            for (const namespace in this.callbacks) {
                if (this.callbacks[namespace] instanceof Object &&
                    this.callbacks[namespace][name.value] instanceof Array) {
                    this.callbacks[namespace][name.value].forEach((callback) => {
                        result = callback.apply(this, args);
                        if (typeof finalResult === 'undefined') {
                            finalResult = result;
                        }
                    });
                }
            }
        }
        // Specified namespace
        else if (this.callbacks[name.namespace] instanceof Object) {
            if (name.value === '') {
                console.warn('wrong name');
                return this;
            }
            this.callbacks[name.namespace][name.value].forEach((callback) => {
                result = callback.apply(this, args);
                if (typeof finalResult === 'undefined')
                    finalResult = result;
            });
        }
        return finalResult;
    }
    /**
     * resolve event name
     * @param _names event name
     * @returns correct name
     */
    resolveNames(_names) {
        let names = _names;
        names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '');
        names = names.replace(/[,/]+/g, ' ');
        names = names.split(' ');
        return names;
    }
    /**
     * resolve event name
     * @param name event name
     * @returns correct name
     */
    resolveName(name) {
        const newName = {};
        const parts = name.split('.');
        newName.original = name;
        newName.value = parts[0];
        newName.namespace = 'base'; // Base namespace
        // Specified namespace
        if (parts.length > 1 && parts[1] !== '') {
            newName.namespace = parts[1];
        }
        return newName;
    }
    /**
     * Check if name is valid
     * @param name given name
     * @returns true if valid
     */
    checkValidName(name) {
        return (typeof name === 'undefined' || name === '');
    }
    /**
     * Remove call bak namespaces
     * @param name given event name
     */
    RemoveSpecificCallbackInNamespace(name) {
        // Default
        if (name.namespace === 'base') {
            // Try to remove from each namespace
            for (const namespace in this.callbacks) {
                this.removeFromNameSpaces(namespace, name);
            }
        }
        // Specified namespace
        else if (this.removeSpecifiedName(name)) {
            delete this.callbacks[name.namespace][name.value];
            // Remove namespace if empty
            if (Object.keys(this.callbacks[name.namespace]).length === 0)
                delete this.callbacks[name.namespace];
        }
    }
    /**
     * remove names from namespaces
     * @param namespace namespace
     * @param name event name
     */
    removeFromNameSpaces(namespace, name) {
        if (this.callbacks[namespace] instanceof Object &&
            this.callbacks[namespace][name.value] instanceof Array) {
            delete this.callbacks[namespace][name.value];
            // Remove namespace if empty
            if (Object.keys(this.callbacks[namespace]).length === 0)
                delete this.callbacks[namespace];
        }
    }
    /**
     * remove specified name
     * @param name given name of event
     */
    removeSpecifiedName(name) {
        return (this.callbacks[name.namespace] instanceof Object && this.callbacks[name.namespace][name.value] instanceof Array);
    }
}
