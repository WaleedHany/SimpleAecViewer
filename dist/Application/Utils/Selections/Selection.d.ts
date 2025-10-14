import * as THREE from 'three';
import Section from '../../Models/SectionObject/Section';
import Camera from "../Camera";
import EventsEmitter from "../EventsEmitter";
import Renderer from "../Renderer";
export default class Selection extends EventsEmitter {
    selectedObjects: THREE.Mesh[];
    isEnabled: boolean;
    private canvas;
    private camera;
    private renderer;
    private scene;
    private raycaster;
    private mouse;
    private highlightedObject?;
    private highlightedLine?;
    private highlightedSection;
    private selectedSection;
    private highlightMaterial;
    private lineHighlightMaterial;
    private selectedMaterial;
    private lineSelectedMaterial;
    private selection;
    private helper;
    private startFlag;
    private claddingObjectsGroup;
    private comands;
    private constructor();
    static initialize(canvas: HTMLCanvasElement, camera: Camera, renderer: Renderer, scene: THREE.Scene, group: THREE.Group): Selection;
    removeSelections(): void;
    /**
     * Computes the position of the mouse on the screen
     * calculate mouse position in normalized device coordinates
     * (-1 to +1) for both components
     */
    private updateMousePosition;
    private setCameraProjection;
    private hover;
    private clearHighlight;
    private select;
    private checkSameLineHighlightes;
    private mouseMove;
    private mouseDown;
    mouseUp(event: MouseEvent): void;
    updateCamera(camera: Camera): void;
    getSelectedSection(): Section;
    private getHitSegment;
    private hideSelectionBox;
    private doubleClickEvent;
    private additionalKeysPressed;
    private sectionMoved;
    enable(): void;
    disable(): void;
}
