import * as THREE from "three"
import {Rhino3dmLoader} from 'three/examples/jsm/loaders/3DMLoader'
import {dummyBuildingConfigurations, errorBuildingConfigurations} from "../../Models/Configurations";
import Materials from "../../Models/Materials/Materials"
import Camera from "../../Utils/Camera"
import Command from "../Command"
import Units from "../../Models/Units";
// import CladdingPannel from "../../Models/CladdingObjects/CladdingPannel"

let that: LoadModelCommand
export default class LoadModelCommand extends Command {
  name: string
  camera: Camera
  loader: Rhino3dmLoader
  object: THREE.Object3D | any
  url: string;
  group: THREE.Group
  scaleFactor:number
  // objectList: CladdingPannel[]
  // addedObjects: CladdingPannel[]
  addedlines: THREE.LineSegments[] = []
  
  constructor(camera: Camera, group: THREE.Group, url: string) {
    super()
    this.name = "load model"
    this.camera = camera
    this.group = group
    //this.objectList = objectsList
    this.url = url
    this.loader = new Rhino3dmLoader()
    this.loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.4.0/')
    that = this
  }
  
  async execute() {
    const object: THREE.Object3D = await new Promise((resolve, reject) => {
      this.loader.load(
        this.url,
        (obj: THREE.Object3D) => resolve(obj),
        undefined, // progress callback
        (err: any) => reject(err)
      )
    })
    
    this.object = object;
    this.scaleFactor = this.getUnitScaleFactor()
    this.object.scale.setScalar(this.scaleFactor)
    this.group.add(this.object);   
    const material = Materials.lineMaterial
    this.object.children.forEach((child: THREE.Mesh, index: number) => {
      if (child instanceof THREE.Mesh) {
        const edges = new THREE.EdgesGeometry(child.geometry)
        const lines = new THREE.LineSegments(edges, material)
        lines.scale.set(this.scaleFactor, this.scaleFactor, this.scaleFactor)    
        child.userData['material'] = child.material;    

        child.userData['leftPanelProperties'] = dummyBuildingConfigurations
        child.userData['unit'] = {
          inputRhinoModelUnit:this.object?.userData?.settings?.modelUnitSystem?.name, 
          currentUnit: "UnitSystem_Meters",
          currentUnitValue: 4,
          scaleFactor:this.scaleFactor
        }
      
        child.geometry.computeBoundsTree();
        
        const segmentMap = new Map();
        const posAttr = lines.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i += 2) {
          const start = new THREE.Vector3().fromBufferAttribute(posAttr, i).multiplyScalar(this.scaleFactor)
          const end = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1).multiplyScalar(this.scaleFactor)
          const box = new THREE.Box3().setFromPoints([start.clone(), end.clone()])
          segmentMap.set(i, {
            start,
            end,
            box,
            index: i,
            leftPanelProperties: {...dummyBuildingConfigurations, selectionType: "edge"}
          })
        }
        lines.userData['segments'] = segmentMap
        lines.userData['surfaceId'] = child.userData.attributes.id
        lines.userData['unit'] = {
            inputRhinoModelUnit:this.object?.userData?.settings?.modelUnitSystem?.name, 
            currentUnit: "UnitSystem_Meters",
            currentUnitValue: 4,
            scaleFactor:this.scaleFactor
          }

        this.group.add(lines)
        this.addedlines.push(lines)
      }
    })
    
    const boundingBox = new THREE.Box3().setFromObject(this.object)
    const position = boundingBox.max.add(boundingBox.min).multiplyScalar(0.5)
    this.camera.controls.moveTo(position.x, position.y, position.z, true)
  }
  
  undo() {
    if (this.object != null) {
      this.group.remove(this.object)
      this.addedlines.forEach(o => this.group.remove(o))
      //that.objectList = that.objectList.filter(obj => !that.addedObjects.includes(obj))
    }
  }
  
  redo() {
    if (this.object != null) {
      this.group.add(this.object)
      this.addedlines.forEach(o => this.group.add(o))
      //that.objectList.push(...that.addedObjects)
    }
  }
  
  remove() {
    if (this.object != null) {
      this.group.remove(this.object)
      this.addedlines.forEach(o => {
        this.group.remove(o)
        o.geometry.dispose()
        o = null
      })
      this.object.traverse((child: THREE.Mesh) => {
        // Test if it's a mesh
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          child = null
          // Loop through the material properties
          // if (child.material instanceof THREE.Material) {
          //   // Test if there is a dispose function
          //     if (typeof child.material.dispose === 'function')
          //         child.material.dispose()
          // }
          // else if (child.material.length > 1) {
          //     for (const key in child.material) {
          //         const value = child.material[key]
          //         // Test if there is a dispose function
          //         if (value && typeof value.dispose === 'function')
          //             value.dispose()
          //     }
          // }
        }
      })
    }
  }

    private getUnitScaleFactor(target: "meters" | "millimeters" | "centimeters" | "feet" | "inches" = "meters"): number {
        const settings = this.object?.userData?.settings?.modelUnitSystem;
        const unitValue: number | undefined = settings?.value;
        const unitName: string | undefined = settings?.name;

        const fromMeters =
          (typeof unitValue === "number" && Units.UnitToMetersByValue[unitValue] != null)
            ? Units.UnitToMetersByValue[unitValue]
            : (typeof unitName === "string"
                ? Units.UnitToMetersByName[unitName.trim().toLowerCase()]
                : undefined);
            
        // if unknown, assume already in meters
        const fromToMeters = fromMeters ?? 1;
            
        const targetToMeters =
          target === "meters" ? 1 :
          target === "millimeters" ? 1e-3 :
          target === "centimeters" ? 1e-2 :
          target === "feet" ? 0.3048 :
          target === "inches" ? 0.0254 :
          1;
            
        // factor to go from "model units" to target units:
        // model -> meters: multiply by fromToMeters
        // meters -> target: divide by targetToMeters
        return fromToMeters / targetToMeters;
    }
}