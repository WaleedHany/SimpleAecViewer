import * as THREE from "three"
import Command from "../Command"
import Sections from "../../Models/SectionObject/Sections"
import Section from "../../Models/SectionObject/Section"

export default class DeleteSectionCommand extends Command {
    objects:THREE.Group
    sections:Sections
    section:Section
    name:string
    constructor(section:Section, objects:THREE.Group, sections:Sections) {
        super()
        this.name = 'delete section'
        this.objects = objects
        this.sections = sections
        this.section = section
    }

    execute() {
        this.sections.sectionsList = this.sections.sectionsList.filter(obj => obj != this.section)
        this.section.deactivate()
        this.section.hideOutLine(this.objects)
        this.sections.stop()
    }
      
    undo() {
       this.sections.sectionsList.forEach(s => {
            s.deactivate()
         });
       this.sections.sectionsList.push(this.section)
       this.section.showOutLine(this.objects)
    }
      
    redo() {
        this.sections.sectionsList = this.sections.sectionsList.filter(obj => obj != this.section)
        this.section.deactivate()
        this.section.hideOutLine(this.objects)
        this.sections.stop()
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