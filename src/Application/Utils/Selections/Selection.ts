import * as THREE from 'three'
import {acceleratedRaycast, computeBoundsTree, disposeBoundsTree} from 'three-mesh-bvh'
import {SelectionHelper} from 'three/examples/jsm/interactive/SelectionHelper.js'
import {Line2} from 'three/examples/jsm/lines/Line2.js'
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js'
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js'
import {LineSegments2} from 'three/examples/jsm/lines/LineSegments2'
import {LineSegmentsGeometry} from 'three/examples/jsm/lines/LineSegmentsGeometry'
import {dummyBuildingConfigurations} from "../../Commands/LoadModel/Configurations"
import ViewerCommands from '../../Commands/ViewerCommands'
import Materials from "../../Models/Materials/Materials"
import Section from '../../Models/SectionObject/Section'
import Camera from "../Camera"
import EventsEmitter from "../EventsEmitter"
import Renderer from "../Renderer"
import {SelectionBox} from "./SelectionBox"

const tempMouse = new THREE.Vector2()
let instance: Selection
let cameraVector = new THREE.Vector3()
let dir = new THREE.Vector3()

export default class Selection extends EventsEmitter {
  selectedObjects: THREE.Mesh[] = []
  isEnabled = false
  private canvas: HTMLCanvasElement
  private camera: Camera
  private renderer: Renderer
  private scene: THREE.Scene
  private raycaster: THREE.Raycaster
  private mouse: THREE.Vector2 = new THREE.Vector2()
  private highlightedObject?: THREE.Mesh | null
  private highlightedLine?: THREE.Mesh | THREE.LineSegments
  private highlightedSection: Section
  private selectedSection: Section
  private highlightMaterial: THREE.Material
  private lineHighlightMaterial: LineMaterial
  private selectedMaterial: THREE.Material
  private lineSelectedMaterial: LineMaterial
  private selection: SelectionBox
  private helper: any
  private startFlag: boolean
  private claddingObjectsGroup: any
  private comands: ViewerCommands
  
  private constructor(canvas: HTMLCanvasElement, camera: Camera, renderer: Renderer, scene: THREE.Scene, group: THREE.Group) {
    super()
    // For accelerated raycasting
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
    THREE.Mesh.prototype.raycast = acceleratedRaycast
    
    instance = this
    this.canvas = canvas
    this.camera = camera
    this.renderer = renderer
    this.scene = scene
    this.claddingObjectsGroup = group
    this.raycaster = new THREE.Raycaster()
    this.raycaster.firstHitOnly = true
    this.raycaster.params.Line.threshold = 0.03
    this.highlightMaterial = Materials.heighLightMaterial
    this.lineHighlightMaterial = Materials.lineHeighLightMaterial
    this.selectedMaterial = Materials.selectedMaterial
    this.lineSelectedMaterial = Materials.lineSelectedMaterial
    this.selection = new SelectionBox(this.camera.instance, this.scene)
    this.helper = new SelectionHelper(this.renderer.instance, 'selectBox')

	this.helper.onSelectOver = ()=> {
		this.helper?.element?.parentElement?.removeChild( this.helper.element )
	}
    this.startFlag = false
    this.comands = ViewerCommands.GetInstance()
  }
  
  static initialize(canvas: HTMLCanvasElement, camera: Camera, renderer: Renderer, scene: THREE.Scene, group: THREE.Group) {
    return instance ?? (instance = new Selection(canvas, camera, renderer, scene, group))
  }
  
  removeSelections() {
    // for all selected elements
    for (let obj of this.selectedObjects) {
      if (obj.userData['isLinear']) {
        this.scene.remove(obj)
        obj.geometry.dispose()
        obj.material = null
        obj = null
      } else if (obj.userData['material']) {
        obj.material = obj.userData['material']
      }
    }
    if (this.selectedSection != null) {
      this.selectedSection.deactivate()
      this.selectedSection = null
    }
    // remove all elements from selected list
    this.selectedObjects = []
    this.trigger('selectionUpdated', [])
  }
  
  mouseUp(event) {
    if (event.button === 0 && instance.startFlag) {
      instance.updateMousePosition(event)
      instance.selection.endPoint.set(instance.mouse.x, instance.mouse.y, 0.5)
      let distance = instance.selection.endPoint.distanceTo(instance.selection.startPoint)
      if (distance > 0.1) {
        // get selected elements
        const allSelected = instance.selection.select()
        const frustum = instance.selection.getFrustum()
        let hasChanges = false
        // Step 3: Manually test segmentData items
        allSelected.forEach((c: THREE.Mesh | THREE.Object3D) => {
          let linesPositions: number[] = []
          let selectedLines: any[] = []
          if (c instanceof THREE.Mesh && c.userData['material']) {
            let selectedOject = instance.selectedObjects.find(e => e.uuid == c.uuid)
            if (!selectedOject) {
              c.material = instance.selectedMaterial
              instance.selectedObjects.push(c)
              hasChanges = true
            }
          } else if ((c instanceof THREE.Line) && c.userData['segments']) {
            let map = c.userData['segments']
            for (const part of map) {
              const segment = part[1]
              if (frustum.intersectsBox(segment.box)) {
                let start = segment.start.clone()
                let end = segment.end.clone()
                const line = new THREE.Line3(start, end)
                let vec = new THREE.Vector3(-1000000, -10000000, -1000000)
                let intersects = false
                if (frustum.containsPoint(start) || frustum.containsPoint(end)) {
                  intersects = true
                } else {
                  for (const plane of frustum.planes) {
                    plane.intersectLine(line, vec)
                    const closestPoint = line.closestPointToPoint(vec, true, new THREE.Vector3());
                    const distance = closestPoint.distanceTo(vec);
                    if (frustum.containsPoint(vec) && distance <= 1.0e-4) {
                      intersects = true
                      break
                    }
                  }
                }
                if (intersects) {
                  linesPositions.push(
                    start.x, start.y, start.z,
                    end.x, end.y, end.z
                  )
                  selectedLines.push({start, end})
                }
              }
            }
            if (linesPositions.length > 0 && linesPositions.length % 6 == 0) {
              const geometry = new LineSegmentsGeometry()
              geometry.setPositions(linesPositions)
              
              const mesh = new LineSegments2(geometry, instance.lineSelectedMaterial)
              mesh.computeLineDistances()
              
              mesh.userData['isLinear'] = true
              mesh.userData['segments'] = selectedLines
              mesh.userData['attributes'] = c.userData['attributes']
              
              instance.scene.add(mesh)
              instance.selectedObjects.push(mesh)
              hasChanges = true
            }
          }
        })
        if (hasChanges) {
          instance.trigger('selectionUpdated', [instance.selectedObjects.map(s => s.userData.leftPanelProperties)])
        }
      }
      instance.hideSelectionBox()
      // new selection started to false
      instance.startFlag = false
    }
  }
  
  updateCamera(camera: Camera) {
    this.camera = camera
  }
  
  getSelectedSection() {
    return this.selectedSection;
  }
  
  enable() {
    this.canvas.addEventListener('dblclick', this.doubleClickEvent)
    document.addEventListener('keydown', this.additionalKeysPressed)
    // /**
    //  * Mouse move, Element selections and Box selection
    //  */
    // // 1- when mouse down
    this.canvas.addEventListener('mousedown', this.mouseDown)
    // // 2- when mouse move
    this.canvas.addEventListener('mousemove', this.mouseMove)
    // // 3- whem mouse up (selection process)
    this.canvas.addEventListener('mouseup', this.mouseUp)
    this.isEnabled = true
  }
  
  disable() {
    document.removeEventListener('keydown', this.additionalKeysPressed)
    this.canvas.removeEventListener('dblclick', this.doubleClickEvent)
    this.canvas.removeEventListener('mousedown', this.mouseDown)
    this.canvas.removeEventListener('mousemove', this.mouseMove)
    this.canvas.removeEventListener('mouseup', this.mouseUp)
    this.hideSelectionBox()
    this.startFlag = false
    this.isEnabled = false
  }
  
  findSegmentByStartEnd(
    segments: Map<number, any>,
    start: THREE.Vector3,
    end: THREE.Vector3,
    tolerance: number = 1e-6
  ) {
    let found: any = null;
    
    segments.forEach((segment) => {
      if (
        segment.start.distanceToSquared(start) < tolerance &&
        segment.end.distanceToSquared(end) < tolerance
      ) {
        found = segment;
      }
    });
    
    return found;
  }
  
  
  private updateMousePosition(event: any) {
    const rect = this.canvas.getBoundingClientRect()
    tempMouse.x = ((event.clientX - rect.left) / this.canvas.clientWidth) * 2 - 1
    tempMouse.y = -((event.clientY - rect.top) / this.canvas.clientHeight) * 2 + 1
    this.mouse = tempMouse
  }
  
  private setCameraProjection() {
    if (this.camera.instance instanceof THREE.OrthographicCamera) {
      cameraVector.set(this.mouse.x, this.mouse.y, -1);
      cameraVector.unproject(this.camera.instance);
      dir.set(0, 0, -1).transformDirection(this.camera.instance.matrixWorld);
      this.raycaster.set(cameraVector, dir);
    } else {
      this.raycaster.setFromCamera(this.mouse, this.camera.instance)
    }
  }
  
  private hover(event: MouseEvent) {
    this.updateMousePosition(event)
    this.setCameraProjection()
    
    const intersection = this.raycaster.intersectObjects(this.claddingObjectsGroup.children)
    
    let object
    if (intersection == null || intersection.length == 0) {
      object = null
    } else {
      object = intersection[0].object
    }
    if (object != null) {
      if (object instanceof THREE.Mesh && this.highlightedObject != object) {
        this.clearHighlight()
        this.highlightedObject = new THREE.Mesh(object.geometry.clone(), this.highlightMaterial)
        this.highlightedObject.scale.set(0.001, 0.001, 0.001)
        this.highlightedObject.renderOrder = 2
        this.highlightedObject['source'] = object
        this.scene.add(this.highlightedObject)
      }
      if (object instanceof THREE.Line && object.userData['object']) {
        object.userData['object'].highlight(this.claddingObjectsGroup)
        this.highlightedSection = object.userData['object']
        // this.highlightedLine.userData['original'] = intersection[0].object.id
      } else if (object instanceof THREE.Line || object instanceof THREE.LineSegments) {
        this.clearHighlight()
        const points = this.getHitSegment(intersection[0])
        if (points != null) {
          const positions = [
            points.start.x, points.start.y, points.start.z,
            points.end.x, points.end.y, points.end.z
          ]
          const geometry = new LineGeometry()
          geometry.setPositions(positions)
          const mesh = new Line2(geometry, this.lineHighlightMaterial)
          mesh.userData['attributes'] = intersection[0].object.userData['attributes']
          this.scene.add(mesh)
          this.highlightedLine = mesh
          this.highlightedLine.userData['isLinear'] = true
          this.highlightedLine.userData['startPoint'] = points.start
          this.highlightedLine.userData['endPoint'] = points.end
          this.highlightedLine.userData['original'] = intersection[0].object.id
          this.highlightedLine.userData['intersectionIndex'] = intersection[0].index
        }
      }
    } else {
      this.clearHighlight()
    }
  }
  
  private clearHighlight() {
    if (this.highlightedObject) {
      this.scene.remove(this.highlightedObject)
      this.highlightedObject.geometry.dispose()
      this.highlightedObject.material = null
      this.highlightedObject = null
    }
    if (this.highlightedLine) {
      this.scene.remove(this.highlightedLine)
      this.highlightedLine.geometry.dispose()
      this.highlightedLine.material = null
      this.highlightedLine = null
    }
    if (this.highlightedSection) {
      this.highlightedSection.unhighlight()
      //this.highlightedSection = null
    }
  }
  
  private select(add: boolean) {
    let intersection = this.highlightedObject != null ? this.highlightedObject['source'] : this.highlightedLine
    if (this.highlightedSection != null && intersection == null) {
      this.highlightedSection.activate()
      this.selectedSection = this.highlightedSection
      this.highlightedSection = null
      this.disable()
      document.addEventListener('keydown', this.sectionMoved)
    }
    if (intersection != null) {
      // if selection without adding, remove all previous selections
      if (!add) {
        this.removeSelections()
      }
      // if selection is not repeated, proceed
      let selectedOject = this.selectedObjects.find(e => e.uuid == intersection.uuid || this.checkSameLineHighlightes(e, intersection))
      if (!selectedOject) {
        
        // highlight intersected object
        if (intersection.userData['isLinear']) {
          const line = intersection.clone()
          const original = this.claddingObjectsGroup.children.find(c => c.id === line.userData.original)
          const segment = original?.userData?.segments?.get(intersection?.userData?.intersectionIndex)
          const start = segment?.start.clone()
          const end = segment?.end.clone()
          const leftPropertyPanel = this.findSegmentByStartEnd(original.userData.segments, start, end).leftPanelProperties
          line.material = this.lineSelectedMaterial
          line.userData['isLinear'] = intersection.userData['isLinear']
          line.userData['startPoint'] = intersection.userData['startPoint']
          line.userData['endPoint'] = intersection.userData['endPoint']
          line.userData['intersectionIndex'] = intersection?.userData?.intersectionIndex
          line.userData['leftPanelProperties'] = original ? leftPropertyPanel : {
            ...dummyBuildingConfigurations,
            selectionType: "edge"
          }
          this.scene.add(line)
          this.selectedObjects.push(line)
        } else {
          intersection.material = this.selectedMaterial
          this.selectedObjects.push(intersection)
        }
      } else if (add) // to unselect already selected element when pressing shift
      {
        const index = this.selectedObjects.indexOf(selectedOject)
        this.selectedObjects.splice(index, 1)
        if (intersection.userData['isLinear']) {
          this.scene.remove(selectedOject)
          selectedOject.geometry.dispose()
          selectedOject.material = null
          selectedOject = null
        } else {
          intersection.material = intersection.userData['material']
        }
      }
      this.trigger('selectionUpdated', [this.selectedObjects.map(s => s.userData.leftPanelProperties)])
    }
  }
  
  private checkSameLineHighlightes(selection: THREE.Mesh, object: THREE.Mesh) {
    if (selection.userData['isLinear'] && object.userData['isLinear'] && selection.userData['startPoint'] && selection.userData['endPoint'] && object.userData['startPoint'] && object.userData['endPoint'] &&
      (selection.userData['startPoint'] as THREE.Vector3).distanceToSquared(object.userData['startPoint'] as THREE.Vector3) < 1.0e-4 &&
      (selection.userData['endPoint'] as THREE.Vector3).distanceToSquared(object.userData['endPoint'] as THREE.Vector3) < 1.0e-4) {
      return true
    }
    return false
  }
  
  private mouseMove(event: MouseEvent) {
    if (event.button === 0 && instance.startFlag) {
      instance.updateMousePosition(event);
      if (instance.helper.isDown) {
        instance.selection.endPoint.set(instance.mouse.x, instance.mouse.y, 0.5)
        document.querySelectorAll(".selectBox").forEach(x => {
          if (x instanceof HTMLElement) {
            x.style.visibility = "visible"
          }
        })
      } else {
        instance.startFlag = false
      }
    } else {
      instance.hover(event)
      instance.startFlag = false
      instance.hideSelectionBox()
    }
  }
  
  private mouseDown(event: MouseEvent) {
    if (event.button === 0 && event.target == instance?.canvas) {
      instance.select(event.shiftKey ? true : false)
      instance.updateMousePosition(event)
      instance.selection.startPoint.set(instance.mouse.x, instance.mouse.y, 0.5)
      instance.startFlag = true
    } else {
      instance.hideSelectionBox()
    }
  }
  
  private getHitSegment(intersection: THREE.Intersection) {
    let map = intersection.object.userData['segments']
    if (map && intersection.object instanceof THREE.Line) {
      const segment = map.get(intersection.index)
      const start = segment.start.clone()
      const end = segment.end.clone()
      return {start, end}
    } else if (intersection.object instanceof THREE.Line) {
      const geometry = intersection.object.geometry
      const positionAttr = geometry.attributes.position
      const segmentIndex = intersection.index
      if (segmentIndex == null) {
        return null
      }
      const start = new THREE.Vector3().fromBufferAttribute(positionAttr, segmentIndex)
      const end = new THREE.Vector3().fromBufferAttribute(positionAttr, segmentIndex + 1)
      return {start, end}
    }
    return null
  }
  
  private hideSelectionBox() {
    document.querySelectorAll(".selectBox").forEach(x => {
      if (x instanceof HTMLElement) {
        x.style.visibility = "hidden"
      }
    })
  }
  
  private doubleClickEvent(event: KeyboardEvent) {
    if (!event.shiftKey) {
      instance.removeSelections()
    }
  }
  
  private additionalKeysPressed(event: KeyboardEvent) {
    if (event.key == "Escape") {
      instance.removeSelections()
    }
  }
  
  private sectionMoved(event) {
    if (event.key == "Enter" || event.key == "Escape") {
      instance.enable()
      if (instance.selectedSection != null) {
        instance.selectedSection.deactivate()
        instance.selectedSection = null
      }
      document.removeEventListener('keydown', instance.sectionMoved)
    } else if (event.key == "Delete") {
      instance.comands?.deleteSection(instance.selectedSection)
    }
  }
}