import { Group, Vector3, LineBasicMaterial, BufferGeometry, Line } from "three";
class Grids2D {
    constructor(origin, length, width, spacingX, spacingY) {
        this.length = length;
        this.width = width;
        this.spacingX = spacingX;
        this.spacingY = spacingY;
        this.origin = origin;
        this.grids2D = new Group();
        let numberX = (this.length / spacingX) + 1;
        let numberY = (this.width / spacingY) + 1;
        for (let i = 0; i < numberX; i++) {
            let points = [];
            points.push(new Vector3(this.origin.x + (this.spacingX * i), this.origin.y, this.origin.z));
            points.push(new Vector3(this.origin.x + (this.spacingX * i), this.origin.y + width, this.origin.z));
            let geometry = new BufferGeometry().setFromPoints(points);
            let line = new Line(geometry, Grids2D.lineMaterial);
            this.grids2D.add(line);
        }
        for (let i = 0; i < numberY; i++) {
            let points = [];
            points.push(new Vector3(this.origin.x, this.origin.y + (this.spacingY * i), this.origin.z));
            points.push(new Vector3(this.origin.x + length, this.origin.y + (this.spacingY * i), this.origin.z));
            let geometry = new BufferGeometry().setFromPoints(points);
            let line = new Line(geometry, Grids2D.lineMaterial);
            this.grids2D.add(line);
        }
    }
    get() {
        return this.grids2D;
    }
}
Grids2D.lineMaterial = new LineBasicMaterial({ color: 'rgb(60,60,60)', alphaTest: 0.8, transparent: true, opacity: 0.8 });
export default Grids2D;
