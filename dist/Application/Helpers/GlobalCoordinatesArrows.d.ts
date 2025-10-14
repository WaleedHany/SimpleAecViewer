import { ArrowHelper, Group, Vector3 } from "three";
export default class GlobalCoordinatesArrows {
    dirX: Vector3;
    dirY: Vector3;
    dirZ: Vector3;
    arrowHelperX: ArrowHelper;
    arrowHelperY: ArrowHelper;
    arrowHelperZ: ArrowHelper;
    origin: Vector3;
    arrows: Group;
    arrows2D: Group;
    constructor(origin: Vector3, length: number);
    get(): Group;
    get2D(): Group;
}
