import { ViewportGizmo } from "three-viewport-gizmo";
export default class ViewPortHelper {
    constructor(camera, renderer) {
        this.camera = camera.instance;
        this.renderer = renderer.instance;
        this.instance = new ViewportGizmo(this.camera, this.renderer, this.getGizmoConfig());
        //this.instance.attachControls(camera.controls)
        this.instance.addEventListener("start", () => (camera.controls.enabled = false));
        this.instance.addEventListener("end", () => (camera.controls.enabled = true));
        this.instance.addEventListener("change", () => {
            camera.controls.setPosition(...this.camera.position.toArray());
        });
        camera.controls.addEventListener("update", () => {
            camera.controls.getTarget(this.instance.target);
            this.instance.update();
        });
        camera.controls.update();
    }
    resize() {
        this.instance.update();
    }
    update() {
        this.instance.render();
    }
    getGizmoConfig() {
        const faceConfig = {
            color: 0xFFFFFF,
            labelColor: 0x000000,
            hover: {
                color: 0x4bac84,
            },
        };
        const edgeConfig = {
            color: 0xDDDDDD,
            enabled: true,
            opacity: 1,
            Radius: 1,
            Scale: 1,
            smoothness: 32,
            hover: {
                color: 0x4bac84,
            },
        };
        const cornerConfig = {
            ...faceConfig,
            color: 0xFFFFFF,
            Radius: 0,
            hover: {
                color: 0x4bac84,
            },
        };
        const darkBackground = {
            color: 0xAAAAAA,
            hover: { color: 0xAAAAAA },
        };
        const type = "cube";
        const options = {
            background: darkBackground,
            type,
            offset: { top: 55 },
            corners: cornerConfig,
            lineWidth: 4,
            radius: 0.25,
            resolution: 256,
            smoothness: 18,
            edges: edgeConfig,
            right: faceConfig,
            top: faceConfig,
            front: faceConfig,
            left: faceConfig,
            bottom: faceConfig,
            back: faceConfig,
            placement: "top-right"
        };
        return options;
    }
}
