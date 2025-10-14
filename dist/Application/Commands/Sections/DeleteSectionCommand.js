import * as THREE from "three";
import Command from "../Command";
export default class DeleteSectionCommand extends Command {
    constructor(section, objects, sections) {
        super();
        this.name = 'delete section';
        this.objects = objects;
        this.sections = sections;
        this.section = section;
    }
    execute() {
        this.sections.sectionsList = this.sections.sectionsList.filter(obj => obj != this.section);
        this.section.deactivate();
        this.section.hideOutLine(this.objects);
        this.sections.stop();
    }
    undo() {
        this.sections.sectionsList.forEach(s => {
            s.deactivate();
        });
        this.sections.sectionsList.push(this.section);
        this.section.showOutLine(this.objects);
    }
    redo() {
        this.sections.sectionsList = this.sections.sectionsList.filter(obj => obj != this.section);
        this.section.deactivate();
        this.section.hideOutLine(this.objects);
        this.sections.stop();
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
