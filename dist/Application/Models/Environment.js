import * as THREE from 'three';
export default class Environment {
    constructor(scene) {
        this.sunLight = new THREE.DirectionalLight(0xffffff, 5);
        THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
        this.scene = scene;
        // Setup
        this.setSunLight();
    }
    setSunLight() {
        this.sunLight.color = new THREE.Color(0xffffff);
        this.sunLight.position.set(-40, -40, 20);
        let ambientLight = new THREE.AmbientLight(0xffffff, 2);
        this.scene.add(ambientLight);
        this.scene.add(this.sunLight);
    }
}
