import { Scene, WebGLRenderer } from 'three';
import Viewer from '../../CladdingViewer';
import Camera from './Camera';
import SceneSizes from './SceneSizes';
export default class Renderer {
    instance: WebGLRenderer | any;
    canvas: HTMLCanvasElement;
    sizes: SceneSizes;
    scene: Scene;
    application: Viewer;
    camera: Camera;
    constructor(canvas: HTMLCanvasElement, sizes: SceneSizes, scene: Scene, application: Viewer, camera: Camera);
    setInstance(): void;
    resize(): void;
    update(): void;
}
