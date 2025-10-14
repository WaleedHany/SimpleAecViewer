import EventsEmitter from "./EventsEmitter";
export default class SceneSizes extends EventsEmitter {
    constructor(canvas) {
        // instansiate base class
        super();
        this.handleResize = (canvas) => {
            this.width = canvas.parentElement.clientWidth;
            this.height = canvas.parentElement.clientHeight;
            // canvas.width = window.innerWidth
            // canvas.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 1);
            this.trigger('resize');
        };
        // Setup
        this.width = canvas.parentElement.clientWidth;
        this.height = canvas.parentElement.clientHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 1);
        // Resize event
        window.addEventListener('resize', () => this.handleResize(canvas));
    }
}
