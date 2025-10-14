import CameraControls from 'camera-controls'
import * as THREE from 'three'
import SceneSizes from './SceneSizes'

const clock = new THREE.Clock()

export default class Camera {
  static numberOfScreens: number = 0
  sizes: SceneSizes
  scene: THREE.Scene
  canvas: HTMLCanvasElement
  isPrespective: boolean
  enableRotation: boolean
  instance: THREE.PerspectiveCamera | THREE.OrthographicCamera | any
  controls: CameraControls | any
  x: number = 0
  y: number = 0
  width: number | any
  height: number | any
  widthRatio: number | any
  heightRatio: number | any
  private _lastZoomFactor: number = 2;
  
  constructor(sizes: SceneSizes, scene: THREE.Scene, canvas: HTMLCanvasElement, isPrespective: boolean = true, enableRotation: boolean = true) {
    this.sizes = sizes
    this.scene = scene
    this.canvas = canvas
    this.isPrespective = isPrespective
    this.enableRotation = enableRotation
    this.setInstance()
    this.setControls(enableRotation)
    Camera.numberOfScreens += 1
  }
  
  setInstance() {
    if (this.isPrespective) {
      this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 4000)
      this.instance.position.set(40, 40, 40)
      this.instance.lookAt(0, 0, 0)
    } else {
      let aspect = this.sizes.width / this.sizes.height
      this.instance = new THREE.OrthographicCamera(-50, 50, 50 / aspect, -50 / aspect, -1000, 2000)
      this.instance.position.set(5, 5, 5)
    }
    this.instance.up.set(0, 0, 1)
  }
  
  setControls(enableRotation: boolean = true) {
    CameraControls.install({THREE: THREE})
    this.controls = new CameraControls(this.instance, this.canvas)
    this.controls.smoothTime = 0.1
    this.controls.zoomSpeed = 0.1
    this.controls.dollyToCursor = true
    this.controls.infinityDolly = true
    this.controls.mouseButtons.left = CameraControls.ACTION.NONE
    this.controls.mouseButtons.right = enableRotation ? CameraControls.ACTION.ROTATE : CameraControls.ACTION.NONE
    this.controls.mouseButtons.middle = CameraControls.ACTION.TRUCK
    // this.controls.boundaryEnclosesCamera
  }
  
  async zoomIn(factor: number = 2) {
    if (!this.controls || factor <= 0) {
      return;
    }
    
    if (this.isPrespective) {
      // Perspective: dolly in by setting a smaller distance to target
      const target = new THREE.Vector3();
      this.controls.getTarget(target);
      const dist = this.instance.position.distanceTo(target);
      const newDist = Math.max(0.001, dist / factor);
      await this.controls.dollyTo(newDist, true);
    } else {
      // Orthographic: zoom increases
      const cam = this.instance as THREE.OrthographicCamera;
      const newZoom = cam.zoom * factor;
      await this.controls.zoomTo(newZoom, true);
      cam.updateProjectionMatrix();
    }
  }
  
  async zoomOut() {
    if (!this.controls) return
    
    const factor = this._lastZoomFactor
    if (this.isPrespective) {
      const target = new THREE.Vector3()
      this.controls.getTarget(target)
      const dist = this.instance.position.distanceTo(target)
      const newDist = dist * factor // reverse of zoomIn's divide
      await this.controls.dollyTo(newDist, true)
    } else {
      const cam = this.instance as THREE.OrthographicCamera
      const newZoom = Math.max(0.0001, cam.zoom / factor)
      await this.controls.zoomTo(newZoom, true)
      cam.updateProjectionMatrix()
    }
  }
  
  disableMotion() {
    //this.controls.dollyToCursor = false
    //this.controls.infinityDolly = false
    this.controls.mouseButtons.left = CameraControls.ACTION.NONE
    this.controls.mouseButtons.right = CameraControls.ACTION.NONE
    this.controls.mouseButtons.wheel = CameraControls.ACTION.NONE
  }
  
  enableMotion() {
    //this.controls.dollyToCursor = true
    //this.controls.infinityDolly = true
    this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK
    this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE
    this.controls.mouseButtons.wheel = CameraControls.ACTION.ZOOM
  }
  
  disableTruck() {
    this.controls.mouseButtons.left = CameraControls.ACTION.NONE
  }
  
  enableTruck() {
    this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK
  }
  
  changeOrthographicCameraDirection = (direction: "top" | "side" | "front") => {
    if (this.isPrespective) {
      return
    }
    switch (direction) {
      case 'top':
        this.controls.setLookAt(0, 0, 100, 0, 0, 0, true) // top-down
        this.instance.up.set(0, 1, 0)
        break;
      case 'side':
        this.controls.setLookAt(-100, 0, 0, 0, 0, 0, true) // left view
        this.instance.up.set(0, 0, 1)
        break;
      case 'front':
        this.controls.setLookAt(0, -100, 0, 0, 0, 0, true) // front view
        this.instance.up.set(0, 0, 1)
        break
    }
    this.instance.updateProjectionMatrix()
  }
  
  changeOrthographicCameraSectionView = (position: THREE.Vector3, lookAt: THREE.Vector3) => {
    if (this.isPrespective) {
      return
    }
    
    this.controls.setLookAt(position.x, position.y, position.z, lookAt.x, lookAt.y, lookAt.z, true)
    this.instance.up.set(0, 0, 1)
    this.instance.updateProjectionMatrix()
  }
  
  isMouseOver(x: number, y: number) {
    if (x >= this.x && x <= this.x + (this.width / this.sizes.width) &&
      y >= this.y && y <= this.y + (this.height / this.sizes.height) && !this.controls.enabled) {
      return this
    }
    return null
  }
  
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    if (!this.isPrespective) {
      this.instance.left = -50
      this.instance.right = 50
      this.instance.top = 50 / this.instance.aspect
      this.instance.bottom = -50 / this.instance.aspect
    }
    this.instance.updateProjectionMatrix()
  }
  
  update() {
    const delta = clock.getDelta()
    this.controls.update(delta)
  }
  
  dispose() {
    if (Camera.numberOfScreens > 1) {
      Camera.numberOfScreens -= 1
      this.scene.remove(this.instance)
      this.instance.clearViewOffset()
      this.instance.clear()
      this.instance = null
      this.controls.dispose()
      this.controls = null
    }
  }
}