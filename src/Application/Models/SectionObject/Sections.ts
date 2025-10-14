import { Group, Line, Material, Mesh, Plane, Points, Scene } from "three"
import Section from "./Section"
import BuildingMaterials from "../Materials/Materials"
import Camera from "../../Utils/Camera"

let instance:Sections = null
export default class Sections{
    sectionsList:Section[] = []
    start:CallableFunction
    stop:CallableFunction
    constructor(start:CallableFunction, stop:CallableFunction) {
        this.start = start
        this.stop = stop
        instance = this
    }

    showSections(group:Group){
        this.sectionsList.forEach(s => s.showOutLine(group))
    }
    hideSections(group:Group){
        this.sectionsList.forEach(s =>{
          s.hideOutLine(group)
          s.deactivate()
        })
    }
    updateCamera(camera:Camera){
      this.sectionsList.forEach(s => s.camera = camera)
    }
    updateClipping(){
        const planes = instance.sectionsList.map(s => new Plane().setFromNormalAndCoplanarPoint(s.plane.normal, s.midPlaneMesh.position.clone().sub(s.plane.normal.clone().multiplyScalar(0.1))))
        
        Section.materials.forEach(m => {
            if(m instanceof Material) m.clippingPlanes = planes
        })
        BuildingMaterials.updateClippingPlanes(planes)
    }
}