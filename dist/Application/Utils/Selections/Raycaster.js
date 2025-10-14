import { Box3, Line3, LineBasicMaterial, Mesh, MeshBasicMaterial, PerspectiveCamera, Plane, PlaneGeometry, Raycaster, Triangle, Vector2, Vector3 } from "three";
import ViewerCommands from "../../Commands/ViewerCommands";
import GlobalCoordinatesArrows from "../../Helpers/GlobalCoordinatesArrows";
import EventEmitter from "../EventsEmitter";
const tempMouse = new Vector2();
let instance;
let cameraVector = new Vector3();
let dir = new Vector3();
const scaleFactor = 10;
export default class Raycasting extends EventEmitter {
    constructor(camera, scene, renderer, objects, selection) {
        super();
        this.camera = camera;
        this.scene = scene;
        this.canvas = this.camera.canvas;
        this.renderer = renderer;
        this.objects = objects;
        this.raycaster = new Raycaster();
        this.raycaster.params.Line.threshold = 0.001;
        this.raycaster.params.Mesh.threshold = 0.1;
        this.raycaster.params.Points.threshold = 0.0001;
        this.mouse = new Vector2();
        this.HighlightedPoint = { a: new Vector3(), b: new Vector3(), c: new Vector3() };
        this.marker = new Mesh(new PlaneGeometry(2, 2), new MeshBasicMaterial({
            color: 0xFFFF40, transparent: true, depthTest: true, opacity: 0.8
        }));
        const arrows = new GlobalCoordinatesArrows(new Vector3(0, 0, 0), 2);
        this.marker.add(arrows.arrows);
        this.marker.name = 'VertexSnippingMarker';
        this.marker.renderOrder = 2;
        this.triangle = new Triangle();
        this.pointsList = [];
        this.numberOfClicks = 1;
        this.LineMaterial = new LineBasicMaterial({ color: 0xff0000 });
        this.LinePoints = [];
        this.selection = selection;
        this.commands = ViewerCommands.GetInstance();
        instance = this;
        this.virtualPlane = new Plane(new Vector3(0, 0, 1), 0);
    }
    static InitializeRaycaster(camera, scene, renderer, objects, selection) {
        return instance !== null && instance !== void 0 ? instance : new Raycasting(camera, scene, renderer, objects, selection);
    }
    hover(event) {
        this.updateMousePosition(event);
        if (this.camera.instance instanceof PerspectiveCamera) {
            this.raycaster.setFromCamera(this.mouse, this.camera.instance);
        }
        else {
            cameraVector.set(this.mouse.x, this.mouse.y, -1);
            cameraVector.unproject(this.camera.instance);
            dir.set(0, 0, -1).transformDirection(this.camera.instance.matrixWorld);
            this.raycaster.set(cameraVector, dir);
        }
        let scale = 1;
        const intersection = this.raycaster.intersectObjects(this.objects.children)[0];
        if (intersection != null && intersection != undefined && intersection.object instanceof Mesh) {
            this.getMarkerPosition(intersection, scale);
        }
        else if (intersection == null) {
            let dir = this.raycaster.ray.direction;
            let direction = new Vector3(dir.x, dir.y, dir.z);
            let origin = this.raycaster.ray.origin;
            let pos = new Vector3(origin.x, origin.y, origin.z);
            let line = new Line3(pos, pos.clone().add(direction.multiplyScalar(10000000)));
            let position = new Vector3();
            this.virtualPlane.intersectLine(line, position);
            this.plane = this.virtualPlane;
            if (position == null) {
                return;
            }
            let distance = position.distanceTo(pos);
            this.marker.position.set(position.x, position.y, position.z);
            if (this.camera.instance instanceof PerspectiveCamera) {
                scale = distance / 18;
            }
            else {
                scale = scaleFactor / this.camera.instance.zoom;
            }
            this.marker.scale.set(scale, scale, scale);
            this.marker.lookAt(position.x, position.y, position.z + 1);
        }
        else {
            this.scene.remove(this.marker);
        }
    }
    enable(numberOfClicks = 1) {
        this.canvas.addEventListener('mousedown', this.mouseDown);
        this.canvas.addEventListener('mousemove', this.mouseMove);
        this.canvas.addEventListener("wheel", this.mouseWheel);
        window.addEventListener("keydown", this.keyDown);
        this.numberOfClicks = numberOfClicks;
        instance.pointsList = [];
    }
    disable() {
        this.canvas.removeEventListener('mousedown', this.mouseDown);
        this.canvas.removeEventListener('mousemove', this.mouseMove);
        this.canvas.removeEventListener('wheel', this.mouseWheel);
        window.removeEventListener("keydown", this.keyDown);
        this.scene.remove(this.marker);
        this.pointsList = [];
    }
    /**
     * Computes the position of the mouse on the screen
     * calculate mouse position in normalized device coordinates
     * (-1 to +1) for both components
     */
    updateMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        tempMouse.x = ((event.clientX - rect.left) / this.canvas.clientWidth) * 2 - 1;
        tempMouse.y = -((event.clientY - rect.top) / this.canvas.clientHeight) * 2 + 1;
        this.mouse = tempMouse;
    }
    getMarkerPosition(intersection, scale) {
        if (intersection != null && intersection.face != null) {
            let sign = -1;
            if (intersection.face.normal.dot(this.raycaster.ray.direction) < 0) {
                sign = 1;
            }
            const position = intersection.point.clone().add(intersection.face.normal.multiplyScalar(sign * 0.1));
            this.marker.position.set(position.x, position.y, position.z);
            if (this.camera.instance instanceof PerspectiveCamera) {
                scale = intersection.distance / 18;
            }
            else {
                scale = scaleFactor / this.camera.instance.zoom;
            }
            this.marker.lookAt(intersection.face.normal.clone().add(this.marker.position));
            this.marker.scale.set(scale, scale, scale);
            this.plane = new Plane(intersection.face.normal, intersection.face.normal.dot(intersection.point));
            this.scene.add(this.marker);
        }
    }
    mouseMove(event) {
        instance === null || instance === void 0 ? void 0 : instance.hover(event);
        if (event.button === 0) {
            instance.hideSelectionBox();
        }
    }
    mouseDown(event) {
        if (event.button === 0) {
            instance.scene.remove(instance.marker);
            instance.disable();
            instance.selection.enable();
            const box = instance.getBoundingBox();
            instance.commands.addSection(box, instance.plane.normal, instance.marker.position);
        }
        instance.hideSelectionBox();
    }
    keyDown(event) {
        if (event.key == "Escape") {
            instance.disable();
            instance.selection.enable();
        }
    }
    mouseWheel(event) {
        instance === null || instance === void 0 ? void 0 : instance.hover(event);
    }
    getBoundingBox() {
        const box = new Box3();
        this.objects.traverse((object) => {
            if (object instanceof Mesh) {
                object.geometry.computeBoundingBox();
                const objectBox = object.geometry.boundingBox.clone();
                objectBox.applyMatrix4(object.matrixWorld);
                box.union(objectBox);
            }
        });
        return box;
    }
    hideSelectionBox() {
        document.querySelectorAll(".selectBox").forEach(x => {
            if (x instanceof HTMLElement) {
                x.style.visibility = "hidden";
            }
        });
    }
}
