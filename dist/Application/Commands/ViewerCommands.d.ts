import * as THREE from "three";
import { Box3, Mesh, Vector3 } from "three";
import CladdingViewer from "../../CladdingViewer";
import { IBuildingConfiguration } from "../Models/Environment";
import Section from "../Models/SectionObject/Section";
import Command from "./Command";
export default class ViewerCommands {
    viewer: CladdingViewer;
    command: Command;
    private constructor();
    static initialize(viewer: CladdingViewer, command: Command): ViewerCommands;
    static GetInstance(): ViewerCommands;
    onKeyDownEvent: (event: KeyboardEvent) => void;
    enable(): void;
    disable(): void;
    loadModel(url: string): Promise<void>;
    zoomToFit(object: THREE.Object3D | null | undefined): Promise<void>;
    showEdges(): void;
    showMeshes(): void;
    addSection(box: Box3, normal: Vector3, position: Vector3): void;
    deleteSection(section: Section): void;
    updateProperties(selectedObjs: Mesh[], config: IBuildingConfiguration[]): void;
}
