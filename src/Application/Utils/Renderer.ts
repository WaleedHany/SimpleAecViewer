import {Scene, WebGLRenderer} from 'three'
import Viewer from '../../CladdingViewer'
import Camera from './Camera'
import SceneSizes from './SceneSizes'

export default class Renderer {
  instance: WebGLRenderer | any
  canvas: HTMLCanvasElement
  sizes: SceneSizes
  scene: Scene
  application
  camera: Camera
  
  constructor(canvas: HTMLCanvasElement, sizes: SceneSizes, scene: Scene, application: Viewer, camera: Camera) {
    this.canvas = canvas
    this.sizes = sizes
    this.scene = scene
    this.application = application
    this.camera = camera
    this.setInstance()
  }
  
  setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    })
    this.instance.localClippingEnabled = true
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1))
    this.instance.autoClear = false
  }
  
  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 1))
    this.camera.instance.updateProjectionMatrix()
  }
  
  update() {
    this.instance.render(this.scene, this.application.activeCamera.instance)
  }
}