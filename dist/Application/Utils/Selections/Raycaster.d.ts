import { Group, LineBasicMaterial, Mesh, Plane, Raycaster, Scene, Triangle, Vector2, Vector3 } from "three";
import ViewerCommands from "../../Commands/ViewerCommands";
import Camera from "../Camera";
import EventEmitter from "../EventsEmitter";
import Renderer from "../Renderer";
import Selection from "./Selection";
export default class Raycasting extends EventEmitter {
    raycaster: Raycaster;
    mouse: Vector2;
    HighlightedPoint: {
        a: Vector3;
        b: Vector3;
        c: Vector3;
    };
    marker: Mesh;
    triangle: Triangle;
    pointsList: Vector3[];
    numberOfClicks: number;
    LineMaterial: LineBasicMaterial;
    LinePoints: Vector3[];
    objects: Group;
    renderer: Renderer;
    camera: Camera;
    scene: Scene;
    selection: Selection;
    commands: ViewerCommands;
    virtualPlane: Plane;
    plane: Plane;
    canvas: HTMLCanvasElement;
    private constructor();
    static InitializeRaycaster(camera: Camera, scene: Scene, renderer: Renderer, objects: Group, selection: Selection): Raycasting;
    hover(event: MouseEvent): void;
    enable(numberOfClicks?: number): void;
    disable(): void;
    /**
     * Computes the position of the mouse on the screen
     * calculate mouse position in normalized device coordinates
     * (-1 to +1) for both components
     */
    private updateMousePosition;
    private getMarkerPosition;
    private mouseMove;
    private mouseDown;
    private keyDown;
    private mouseWheel;
    private getBoundingBox;
    private hideSelectionBox;
}
