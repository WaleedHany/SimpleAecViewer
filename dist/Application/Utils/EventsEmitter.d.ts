interface Name {
    original: string;
    value: string;
    namespace: string;
}
/**
 * Event emitter
 */
export default class EventsEmitter {
    callbacks: any;
    constructor();
    /**
     * On event subscription
     * @param _names event name
     * @param callback call back function
     */
    on(_names: string, callback: Function): false | this;
    /**
     * Un-subscripe to event
     * @param _names event name
     */
    off(_names: string): false | this;
    /**
     * Event trigger
     * @param _name event name
     * @param _args additional objects array to be passed with trigger
     */
    trigger(_name: string, _args?: any[]): any;
    /**
     * resolve event name
     * @param _names event name
     * @returns correct name
     */
    resolveNames(_names: string): string[];
    /**
     * resolve event name
     * @param name event name
     * @returns correct name
     */
    resolveName(name: string): Name;
    /**
     * Check if name is valid
     * @param name given name
     * @returns true if valid
     */
    private checkValidName;
    /**
     * Remove call bak namespaces
     * @param name given event name
     */
    private RemoveSpecificCallbackInNamespace;
    /**
     * remove names from namespaces
     * @param namespace namespace
     * @param name event name
     */
    private removeFromNameSpaces;
    /**
     * remove specified name
     * @param name given name of event
     */
    private removeSpecifiedName;
}
export {};
