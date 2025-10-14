import EventsEmitter from "./EventsEmitter";
export default class SceneSizes extends EventsEmitter {
    width: number;
    height: number;
    pixelRatio: number;
    constructor(canvas: HTMLCanvasElement);
    handleResize: (canvas: HTMLCanvasElement) => void;
}
