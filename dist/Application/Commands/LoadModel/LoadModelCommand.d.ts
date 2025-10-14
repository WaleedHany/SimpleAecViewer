import * as THREE from "three";
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader';
import Camera from "../../Utils/Camera";
import Command from "../Command";
export default class LoadModelCommand extends Command {
    name: string;
    camera: Camera;
    loader: Rhino3dmLoader;
    object: THREE.Object3D | any;
    url: string;
    group: THREE.Group;
    addedlines: THREE.LineSegments[];
    constructor(camera: Camera, group: THREE.Group, url: string);
    execute(): Promise<void>;
    undo(): void;
    redo(): void;
    remove(): void;
}
