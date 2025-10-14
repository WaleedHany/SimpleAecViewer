import { Group, Vector3 } from "three";
export default class Grids2D {
    spacingX: number;
    spacingY: number;
    width: number;
    length: number;
    origin: Vector3;
    grids2D: Group;
    static lineMaterial: any;
    constructor(origin: Vector3, length: number, width: number, spacingX: number, spacingY: number);
    get(): Group;
}
