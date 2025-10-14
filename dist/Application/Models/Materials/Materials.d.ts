import { Plane } from "three";
export default class Materials {
    static sectionPlanes: Plane[];
    static baseMaterial: any;
    static errorSurfaceMaterial: any;
    static heighLightMaterial: any;
    static lineHeighLightMaterial: any;
    static selectedMaterial: any;
    static lineSelectedMaterial: any;
    static lineMaterial: any;
    static SectionLineMaterial: any;
    static SectionLineHighlightMaterial: any;
    static updateClippingPlanes(sectionPlanes: Plane[]): void;
}
