import { Vector3, BufferGeometry } from 'three';
declare class SelectionBox {
    camera: any;
    endPoint: Vector3;
    scene: any;
    startPoint: Vector3;
    collection: any[];
    instances: {};
    deep: number;
    constructor(camera: any, scene: any, deep?: number);
    getFrustum(): any;
    select(startPoint?: null, endPoint?: null): any[];
    updateFrustum(startPoint: any, endPoint: any): void;
    searchChildInFrustum(frustum: any, object: any): void;
    searchGeometryInFrustum(object: BufferGeometry): void;
}
export { SelectionBox };
