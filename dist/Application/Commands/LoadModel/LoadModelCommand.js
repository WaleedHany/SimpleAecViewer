import * as THREE from "three";
import { Rhino3dmLoader } from 'three/examples/jsm/loaders/3DMLoader';
import { dummyBuildingConfigurations } from './Configurations';
import Materials from "../../Models/Materials/Materials";
import Command from "../Command";
let that;
export default class LoadModelCommand extends Command {
    constructor(camera, group, url) {
        super();
        this.addedlines = [];
        this.name = "load model";
        this.camera = camera;
        this.group = group;
        this.url = url;
        this.loader = new Rhino3dmLoader();
        this.loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.4.0/');
        that = this;
    }
    async execute() {
        const object = await new Promise((resolve, reject) => {
            this.loader.load(this.url, (obj) => resolve(obj), undefined, // progress callback
            (err) => reject(err));
        });
        this.object = object;
        this.object.scale.set(0.001, 0.001, 0.001);
        this.group.add(this.object);
        const material = Materials.lineMaterial;
        const totalChildren = this.object.children.length;
        this.object.children.forEach((child, index) => {
            if (child instanceof THREE.Mesh) {
                const edges = new THREE.EdgesGeometry(child.geometry);
                const lines = new THREE.LineSegments(edges, material);
                lines.scale.set(0.001, 0.001, 0.001);
                child.userData['material'] = child.material;
                child.userData['leftPanelProperties'] = dummyBuildingConfigurations;
                child.geometry.computeBoundsTree();
                const segmentMap = new Map();
                const posAttr = lines.geometry.attributes.position;
                for (let i = 0; i < posAttr.count; i += 2) {
                    const start = new THREE.Vector3().fromBufferAttribute(posAttr, i).multiplyScalar(0.001);
                    const end = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1).multiplyScalar(0.001);
                    const box = new THREE.Box3().setFromPoints([start.clone(), end.clone()]);
                    segmentMap.set(i, { start, end, box, index: i });
                }
                lines.userData['segments'] = segmentMap;
                lines.userData['leftPanelProperties'] = dummyBuildingConfigurations;
                this.group.add(lines);
                this.addedlines.push(lines);
            }
        });
        const boundingBox = new THREE.Box3().setFromObject(this.object);
        const position = boundingBox.max.add(boundingBox.min).multiplyScalar(0.5);
        this.camera.controls.moveTo(position.x, position.y, position.z, true);
    }
    undo() {
        if (this.object != null) {
            this.group.remove(this.object);
            this.addedlines.forEach(o => this.group.remove(o));
        }
    }
    redo() {
        if (this.object != null) {
            this.group.add(this.object);
            this.addedlines.forEach(o => this.group.add(o));
            //that.objectList.push(...that.addedObjects)
        }
    }
    remove() {
        if (this.object != null) {
            this.group.remove(this.object);
            this.addedlines.forEach(o => {
                this.group.remove(o);
                o.geometry.dispose();
                o = null;
            });
            this.object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    child = null;
                }
            });
        }
    }
}
