import * as THREE from "three";
import Command from "../Command";
import Section from "../../Models/SectionObject/Section";
export default class AddSectionCommand extends Command {
    constructor(box, normal, position, objects, sections, camera, scene, renderer) {
        super();
        this.name = 'Add section';
        this.objects = objects;
        this.sections = sections;
        this.box = box;
        this.section = new Section(normal, position, box.max, box.min, camera, scene, renderer, this.sections.updateClipping);
    }
    execute() {
        this.sections.sectionsList.forEach(s => {
            s.deactivate();
        });
        this.sections.sectionsList.push(this.section);
        this.section.showOutLine(this.objects);
    }
    undo() {
        this.sections.sectionsList = this.sections.sectionsList.filter(obj => obj != this.section);
        this.section.deactivate();
        this.section.hideOutLine(this.objects);
        this.sections.stop();
    }
    redo() {
        this.sections.sectionsList.push(this.section);
        this.section.showOutLine(this.objects);
    }
    remove() {
        this.sections.sectionsList = this.sections.sectionsList.filter(obj => obj != this.section);
        this.section.hideOutLine(this.objects);
        this.section.outLine.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                child = null;
            }
        });
    }
}
