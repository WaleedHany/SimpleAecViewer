import * as THREE from 'three'
import Command from './Application/Commands/Command'
import ViewerCommands from './Application/Commands/ViewerCommands'
import Grids2D from './Application/Helpers/Grids'
import Environment from './Application/Models/Environment'
import Sections from './Application/Models/SectionObject/Sections'
import Camera from './Application/Utils/Camera'
import Renderer from './Application/Utils/Renderer'
import SceneSizes from './Application/Utils/SceneSizes'
import Raycasting from './Application/Utils/Selections/Raycaster'
import Selection from './Application/Utils/Selections/Selection'
import Time from './Application/Utils/Time'
import ViewPorthelper from './Application/Utils/ViewPortHelper'

let instance: Viewer | null = null

/**
 * Initalize the main programe
 */
export default class Viewer {
  canvas: HTMLCanvasElement
  sizes: SceneSizes
  scene: THREE.Scene
  activeCamera: Camera;
  camera3D: Camera
  camera2D: Camera;
  cameraList: Camera[]
  renderer: Renderer
  time: Time
  selection: Selection
  raycasting: Raycasting
  environment: Environment
  command: Command
  grids: Grids2D
  ViewPorthelper: ViewPorthelper
  ViewerCommands: ViewerCommands
  claddingObjectsGroup: THREE.Group
  sections: Sections
  removedObjectsGroup: THREE.Group = new THREE.Group()
  
  private constructor(_canvas: HTMLCanvasElement) {
    instance = this
    // Canvas
    this.canvas = _canvas
    // sizes
    this.sizes = new SceneSizes(this.canvas)
    this.sizes.on('resize', () => {
      this.resize()
    })
    THREE.Object3D.DEFAULT_UP.set(0, 0, 1)
    // Scene
    this.scene = new THREE.Scene()
    
    // Cameras
    this.camera3D = new Camera(this.sizes, this.scene, this.canvas, false)
    this.camera2D = new Camera(this.sizes, this.scene, this.canvas, false, false)
    this.activeCamera = this.camera3D
    // Renderer
    this.renderer = new Renderer(this.canvas, this.sizes, this.scene, this, this.activeCamera)
    
    this.ViewPorthelper = new ViewPorthelper(this.activeCamera, this.renderer)
    
    // Additional cameras
    this.cameraList = []
    this.cameraList.push(this.camera3D)
    this.cameraList.push(this.camera2D)
    
    // Main view
    this.environment = new Environment(this.scene)
    
    // Time
    this.time = new Time()
    this.time.on('tick', () => this.update())
    
    this.claddingObjectsGroup = new THREE.Group()
    this.scene.add(this.claddingObjectsGroup)
    
    this.command = new Command()
    this.ViewerCommands = ViewerCommands.initialize(this, this.command)
    
    // Element selection/hover
    this.selection = Selection.initialize(this.canvas, this.activeCamera, this.renderer, this.scene, this.claddingObjectsGroup)
    this.selection.enable()
    this.raycasting = Raycasting.InitializeRaycaster(this.activeCamera, this.scene, this.renderer, this.claddingObjectsGroup, this.selection)
    this.sections = new Sections(() => {
      this.selection.disable()
      this.raycasting.enable()
    }, () => {
      if (!this.selection.isEnabled) {
        this.selection.enable()
        this.raycasting.disable()
      }
    })
    // Grids
    //this.grids = new Grids2D(new THREE.Vector3(0, 0, 0), 80, 80, 8, 8)
    //this.scene.add(this.grids.grids2D)
    const axesHelper = new THREE.AxesHelper( 5 )
    this.scene.add( axesHelper )
    
    // this.command.on('undo', () => instance.selection.removeSelections())
    // this.selection.on("selectionUpdated", (args) => console.log(args))
  }
  
  public static initialize(canvas: HTMLCanvasElement) {
    return instance ?? (instance = new Viewer(canvas));
  }
  
  public static getInstance() {
    return instance
  }
  
  resetCamera() {
    if (this.cameraList.length > 0) {
      this.activeCamera = this.cameraList[0]
      this.renderer.camera = this.activeCamera
    }
  }
  
  public resize() {
    this.activeCamera.resize()
    this.renderer.resize()
    this.ViewPorthelper.resize()
  }
  
  update() {
    this.activeCamera.update()
    this.renderer.update()
    this.ViewPorthelper.update()
  }
  
  dispose() {
    this.sizes.off('resize')
    this.time.off('tick')
    
    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        
        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key]
          
          // Test if there is a dispose function
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
      this.activeCamera.controls.dispose()
      this.renderer.instance.dispose()
    })
  }
}