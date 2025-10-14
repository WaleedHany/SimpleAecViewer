import * as THREE from 'three';
import Command from './Application/Commands/Command';
import ViewerCommands from './Application/Commands/ViewerCommands';
import Grids2D from './Application/Helpers/Grids';
import Environment from './Application/Models/Environment';
import Sections from './Application/Models/SectionObject/Sections';
import Camera from './Application/Utils/Camera';
import Renderer from './Application/Utils/Renderer';
import SceneSizes from './Application/Utils/SceneSizes';
import Raycasting from './Application/Utils/Selections/Raycaster';
import Selection from './Application/Utils/Selections/Selection';
import Time from './Application/Utils/Time';
import ViewPorthelper from './Application/Utils/ViewPortHelper';
/**
 * Initalize the main programe
 */
export default class Viewer {
    canvas: HTMLCanvasElement;
    sizes: SceneSizes;
    scene: THREE.Scene;
    activeCamera: Camera;
    camera3D: Camera;
    camera2D: Camera;
    cameraList: Camera[];
    renderer: Renderer;
    time: Time;
    selection: Selection;
    raycasting: Raycasting;
    environment: Environment;
    command: Command;
    grids: Grids2D;
    ViewPorthelper: ViewPorthelper;
    ViewerCommands: ViewerCommands;
    claddingObjectsGroup: THREE.Group;
    sections: Sections;
    removedObjectsGroup: THREE.Group;
    private constructor();
    static initialize(canvas: HTMLCanvasElement): Viewer;
    static getInstance(): Viewer | null;
    resetCamera(): void;
    resize(): void;
    update(): void;
    dispose(): void;
}
