import * as THREE from 'three';
import type { GizmoOptions } from "three-viewport-gizmo";
import { ViewportGizmo } from "three-viewport-gizmo";
import Camera from "./Camera";
import Renderer from "./Renderer";
export default class ViewPortHelper {
    ViewPortHelper: ViewportGizmo | any;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | any;
    renderer: THREE.WebGLRenderer;
    instance: ViewportGizmo;
    constructor(camera: Camera, renderer: Renderer);
    resize(): void;
    update(): void;
    getGizmoConfig(): GizmoOptions;
}
