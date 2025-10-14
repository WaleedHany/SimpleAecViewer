import * as THREE from "three";
import Command from "../Command";
import Sections from "../../Models/SectionObject/Sections";
import Section from "../../Models/SectionObject/Section";
export default class DeleteSectionCommand extends Command {
    objects: THREE.Group;
    sections: Sections;
    section: Section;
    name: string;
    constructor(section: Section, objects: THREE.Group, sections: Sections);
    execute(): void;
    undo(): void;
    redo(): void;
    remove(): void;
}
