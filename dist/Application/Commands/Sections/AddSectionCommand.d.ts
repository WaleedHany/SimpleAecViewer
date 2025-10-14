import * as THREE from "three";
import Command from "../Command";
import Sections from "../../Models/SectionObject/Sections";
import Section from "../../Models/SectionObject/Section";
import Camera from "../../Utils/Camera";
import Renderer from "../../Utils/Renderer";
export default class AddSectionCommand extends Command {
    objects: THREE.Group;
    sections: Sections;
    box: THREE.Box3;
    section: Section;
    name: string;
    constructor(box: THREE.Box3, normal: THREE.Vector3, position: THREE.Vector3, objects: THREE.Group, sections: Sections, camera: Camera, scene: THREE.Scene, renderer: Renderer);
    execute(): void;
    undo(): void;
    redo(): void;
    remove(): void;
}
