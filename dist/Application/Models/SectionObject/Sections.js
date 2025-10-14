import { Material, Plane } from "three";
import Section from "./Section";
import BuildingMaterials from "../Materials/Materials";
let instance = null;
export default class Sections {
    constructor(start, stop) {
        this.sectionsList = [];
        this.start = start;
        this.stop = stop;
        instance = this;
    }
    showSections(group) {
        this.sectionsList.forEach(s => s.showOutLine(group));
    }
    hideSections(group) {
        this.sectionsList.forEach(s => {
            s.hideOutLine(group);
            s.deactivate();
        });
    }
    updateCamera(camera) {
        this.sectionsList.forEach(s => s.camera = camera);
    }
    updateClipping() {
        const planes = instance.sectionsList.map(s => new Plane().setFromNormalAndCoplanarPoint(s.plane.normal, s.midPlaneMesh.position.clone().sub(s.plane.normal.clone().multiplyScalar(0.1))));
        Section.materials.forEach(m => {
            if (m instanceof Material)
                m.clippingPlanes = planes;
        });
        BuildingMaterials.updateClippingPlanes(planes);
    }
}
