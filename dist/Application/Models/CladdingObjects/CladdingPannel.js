import { EdgesGeometry, LineSegments } from "three";
import Materials from "../Materials/Materials";
export default class CladdingPannel {
    constructor(mesh) {
        this.mesh = mesh;
        const edges = new EdgesGeometry(mesh.geometry);
        const material = Materials.lineMaterial;
        this.lines = new LineSegments(edges, material);
        this.lines.scale.set(0.001, 0.001, 0.001);
        this.lines.userData = mesh.userData;
        this.mesh.userData['material'] = this.mesh.material;
        this.mesh.geometry.computeBoundsTree();
        this.lines.geometry.computeBoundsTree();
    }
}
