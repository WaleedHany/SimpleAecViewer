import EventsEmitter from "./EventsEmitter";
export default class Time extends EventsEmitter {
    start: number;
    current: number;
    elapsed: number;
    delta: number;
    constructor();
    tick(): void;
}
