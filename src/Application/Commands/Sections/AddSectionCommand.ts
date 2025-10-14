import * as THREE from "three"
import Command from "../Command"
import Sections from "../../Models/SectionObject/Sections"
import Section from "../../Models/SectionObject/Section"
import Camera from "../../Utils/Camera"
import Renderer from "../../Utils/Renderer"

export default class AddSectionCommand extends Command {
    objects:THREE.Group
    sections:Sections
    box: THREE.Box3
    section:Section
    name:string
    
    constructor(box:THREE.Box3, normal:THREE.Vector3, position:THREE.Vector3, objects:THREE.Group, sections:Sections, camera:Camera, scene:THREE.Scene, renderer:Renderer) {
        super()
        this.name = 'Add section'
        this.objects = objects
        this.sections = sections
        this.box = box
        this.section = new Section(normal, position, box.max, box.min, camera, scene, renderer, this.sections.updateClipping)
    }

    execute() {
         this.sections.sectionsList.forEach(s => {
            s.deactivate()
         })
       this.sections.sectionsList.push(this.section)
       this.section.showOutLine(this.objects)
    }
      
    undo() {
       this.sections.sectionsList = this.sections.sectionsList.filter(obj => obj != this.section)
       this.section.deactivate()
       this.section.hideOutLine(this.objects)
       this.sections.stop()
    }
      
    redo() {
        this.sections.sectionsList.push(this.section)
        this.section.showOutLine(this.objects)
    }
    
    remove() {
        this.sections.sectionsList = this.sections.sectionsList.filter(obj => obj != this.section)
        this.section.hideOutLine(this.objects)
        this.section.outLine.traverse((child: THREE.Mesh) => 
        {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()
                child = null
            }
        })
    }
}