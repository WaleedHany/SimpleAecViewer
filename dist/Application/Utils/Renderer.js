import { WebGLRenderer } from 'three';
export default class Renderer {
    constructor(canvas, sizes, scene, application, camera) {
        this.canvas = canvas;
        this.sizes = sizes;
        this.scene = scene;
        this.application = application;
        this.camera = camera;
        this.setInstance();
    }
    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        });
        this.instance.localClippingEnabled = true;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1));
        this.instance.autoClear = false;
    }
    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1));
        this.camera.instance.updateProjectionMatrix();
    }
    update() {
        this.instance.render(this.scene, this.application.activeCamera.instance);
    }
}
