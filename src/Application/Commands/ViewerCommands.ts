import * as THREE from "three";
import {Box3, LineSegments, Mesh, Object3D, Vector3} from "three";
import CladdingViewer from "../../CladdingViewer"
import {IBuildingConfiguration} from "../Models/Environment";
import Section from "../Models/SectionObject/Section"
import Command from "./Command"
import LoadModelCommand from "./LoadModel/LoadModelCommand"
import AddSectionCommand from "./Sections/AddSectionCommand"
import DeleteSectionCommand from "./Sections/DeleteSectionCommand"
import UpdatePropertiesCommand from "./UpdateProperties/UpdatePropertiesCommand";

let instance: ViewerCommands = null
export default class ViewerCommands {
  viewer: CladdingViewer
  command: Command
  
  private constructor(viewer: CladdingViewer, command: Command) {
    this.viewer = viewer
    this.command = command
    this.enable()
    instance = this
  }
  
  static initialize(viewer: CladdingViewer, command: Command) {
    return instance != null ? instance : new ViewerCommands(viewer, command)
  }
  
  static GetInstance() {
    return instance
  }
  
  onKeyDownEvent = (event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC')
    const key = event.key.toLowerCase()
    const isUndo =
      (key === 'z' && ((isMac && event.metaKey && !event.shiftKey) || (!isMac && event.ctrlKey && !event.shiftKey)))
    const isRedo =
      (key === 'z' && ((isMac && event.metaKey && event.shiftKey) || (!isMac && event.ctrlKey && event.shiftKey))) ||
      (key === 'y' && !isMac && event.ctrlKey)
    if (isUndo) {
      instance.command.undoCommand()
    } else if (isRedo) {
      instance.command.redoCommand()
    }
    
    // ALT + W => Perspective View
    if (event.altKey && event.code === "KeyW") {
      instance.viewer.activeCamera = instance.viewer.camera3D
      instance.viewer.selection.updateCamera(instance.viewer.activeCamera)
      instance.viewer.sections.showSections(instance.viewer.claddingObjectsGroup)
      instance.viewer.renderer.update()
    }
    
    // T => Top View
    else if (!event.altKey && event.code === "KeyT") {
      console.log("T")
      instance.viewer.activeCamera = instance.viewer.camera2D
      instance.viewer.selection.updateCamera(instance.viewer.activeCamera)
      instance.viewer.activeCamera.changeOrthographicCameraDirection("top")
      instance.viewer.renderer.update()
    }
    
    // F => Front View
    else if (!event.altKey && event.code === "KeyF") {
      instance.viewer.activeCamera = instance.viewer.camera2D
      instance.viewer.selection.updateCamera(instance.viewer.activeCamera)
      instance.viewer.activeCamera.changeOrthographicCameraDirection("front")
      instance.viewer.renderer.update()
    }
    
    // S => Side (Left) View
    else if (!event.altKey && event.code === "KeyS") {
      instance.viewer.activeCamera = instance.viewer.camera2D
      instance.viewer.selection.updateCamera(instance.viewer.activeCamera)
      instance.viewer.activeCamera.changeOrthographicCameraDirection("side")
      instance.viewer.renderer.update()
    } 

    // P => Section view
    else if (!event.altKey && event.code === "KeyP") {
      const section = instance.viewer.selection.getSelectedSection()
      if (section != null) {
        instance.viewer.sections.hideSections(instance.viewer.claddingObjectsGroup)
        const position = section.getCameraPosition(5)
        instance.viewer.activeCamera = instance.viewer.camera2D
        instance.viewer.selection.updateCamera(instance.viewer.activeCamera)
       
        instance.viewer.activeCamera.changeOrthographicCameraSectionView(position, section.midpoint)
        instance.viewer.renderer.update()
        instance.viewer.selection.enable()

      }
    }
  }
  
  enable() {
    document.addEventListener('keydown', this.onKeyDownEvent)
  }
  
  disable() {
    document.removeEventListener("keydown", this.onKeyDownEvent)
  }
  
  async loadModel(url: string) {
    await this.command.executeCommand(new LoadModelCommand(this.viewer.activeCamera, this.viewer.claddingObjectsGroup, url))
  }
  
  async zoomToFit(object: THREE.Object3D | null | undefined) {
    try {
      if (!this.viewer?.activeCamera?.controls) {
        return;
      }
      let targetPos = new THREE.Vector3(0, 0, 0); // Default to origin
      
      if (object) {
        const boundingBox = new THREE.Box3().setFromObject(object);
        
        // If the bounding box is valid and non-empty
        if (!boundingBox.isEmpty() && isFinite(boundingBox.min.x) && isFinite(boundingBox.max.x)) {
          targetPos = boundingBox.max.clone().add(boundingBox.min).multiplyScalar(0.5); // Center of box
        } else {
          console.warn("zoomToFit: Bounding box is empty or invalid, using (0,0,0).");
        }
      } else {
        console.warn("zoomToFit: Provided object is null/undefined, zooming to origin.");
      }
      
      await this.viewer.activeCamera.controls.moveTo(targetPos.x, targetPos.y, targetPos.z, true);
      
    } catch (err) {
      console.error("zoomToFit: Failed to zoom.", err);
    }
  }
  
  
  showEdges() {
    const meshes = this.viewer.claddingObjectsGroup.children.filter(c => !(c instanceof LineSegments) && !c.userData['isSectionBox'])
    this.viewer.sections.sectionsList.forEach(s => s.deactivate())
    if (!this.viewer.selection.isEnabled) {
      this.viewer.selection.enable()
    }
    this.viewer.removedObjectsGroup.add(...meshes)
    this.viewer.scene.remove(...meshes)
    this.viewer.selection.removeSelections()
  }
  
  showMeshes() {
    this.viewer.sections.sectionsList.forEach(s => s.deactivate())
    if (!this.viewer.selection.isEnabled) {
      this.viewer.selection.enable()
    }
    this.viewer.claddingObjectsGroup.add(...this.viewer.removedObjectsGroup.children)
    this.viewer.removedObjectsGroup.remove(...this.viewer.removedObjectsGroup.children)
    this.viewer.selection.removeSelections()
  }
  
  addSection(box: Box3, normal: Vector3, position: Vector3) {
    this.command.executeCommand(new AddSectionCommand
    (box, normal, position, this.viewer.claddingObjectsGroup, this.viewer.sections, this.viewer.activeCamera, this.viewer.scene, this.viewer.renderer))
  }
  
  deleteSection(section: Section) {
    this.command.executeCommand(new DeleteSectionCommand(section, this.viewer.claddingObjectsGroup, this.viewer.sections))
  }
  
  updateProperties(selectedObjs: Mesh[] | Object3D[], config: IBuildingConfiguration[], selectedLines?: Mesh[] | Object3D[]) {
    this.command.executeCommand(new UpdatePropertiesCommand(selectedObjs, config, selectedLines))
  }
}