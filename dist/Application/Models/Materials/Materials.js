import { DoubleSide, LineBasicMaterial, MeshBasicMaterial } from "three";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
class Materials {
    static updateClippingPlanes(sectionPlanes) {
        Materials.baseMaterial.clippingPlanes = sectionPlanes;
        Materials.heighLightMaterial.clippingPlanes = sectionPlanes;
        Materials.lineHeighLightMaterial.clippingPlanes = sectionPlanes;
        Materials.selectedMaterial.clippingPlanes = sectionPlanes;
        Materials.lineSelectedMaterial.clippingPlanes = sectionPlanes;
        Materials.lineMaterial.clippingPlanes = sectionPlanes;
        Materials.errorSurfaceMaterial.clippingPlanes = sectionPlanes;
    }
}
Materials.sectionPlanes = [];
Materials.baseMaterial = new MeshBasicMaterial({
    color: 0xFFFFE0,
    side: DoubleSide,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.5,
    clippingPlanes: Materials.sectionPlanes
});
Materials.errorSurfaceMaterial = new MeshBasicMaterial({
    color: "#d03838",
    side: DoubleSide,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.5,
    clippingPlanes: Materials.sectionPlanes
});
Materials.heighLightMaterial = new MeshBasicMaterial({
    color: 0x55AAFF,
    side: DoubleSide,
    transparent: true,
    opacity: 0.4,
    clippingPlanes: Materials.sectionPlanes
});
Materials.lineHeighLightMaterial = new LineMaterial({
    color: 0x55AAFF,
    side: DoubleSide,
    linewidth: 5,
    clippingPlanes: Materials.sectionPlanes
});
Materials.selectedMaterial = new MeshBasicMaterial({
    color: 0xFFFF40,
    side: DoubleSide,
    clippingPlanes: Materials.sectionPlanes
});
Materials.lineSelectedMaterial = new LineMaterial({
    color: 'orange',
    side: DoubleSide,
    linewidth: 5,
    clippingPlanes: Materials.sectionPlanes
});
Materials.lineMaterial = new LineBasicMaterial({
    color: 0x000000,
    side: DoubleSide,
    clippingPlanes: Materials.sectionPlanes
});
Materials.SectionLineMaterial = new LineBasicMaterial({ color: 'red' });
Materials.SectionLineHighlightMaterial = new LineBasicMaterial({ color: '#2d60b0' });
export default Materials;
