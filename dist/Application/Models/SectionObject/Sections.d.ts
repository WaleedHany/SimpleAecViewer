import { Group } from "three";
import Section from "./Section";
import Camera from "../../Utils/Camera";
export default class Sections {
    sectionsList: Section[];
    start: CallableFunction;
    stop: CallableFunction;
    constructor(start: CallableFunction, stop: CallableFunction);
    showSections(group: Group): void;
    hideSections(group: Group): void;
    updateCamera(camera: Camera): void;
    updateClipping(): void;
}
