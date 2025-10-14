import { BufferAttribute, BufferGeometry, Group, Line, Material, Mesh, MeshBasicMaterial, Plane, PlaneGeometry, Points, Scene, Vector3 } from "three"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import Renderer from "../../Utils/Renderer"
import Camera from "../../Utils/Camera"
import Materials from "../Materials/Materials"

export default class Section{
    plane:Plane
    transformControl:TransformControls
    camera:Camera
    renderer:Renderer
    initialPosition:Vector3
    scene:Scene
    zDir:Vector3 = new Vector3(0, 0, 1)
    yDir:Vector3 = new Vector3(0, 1, 0)
    outLine:Line
    callBack:Function
    gizmo:any
    horizontalPlane: Plane
    midpoint: Vector3
    midPlaneMesh: any
    static materials:Material[] = []

    constructor(normal:Vector3, position:Vector3, max:Vector3, min: Vector3, camera:Camera, scene:Scene, renderer:Renderer, callBack:Function = null) {
        this.plane = new Plane().setFromNormalAndCoplanarPoint(normal.negate().normalize(), position)
        this.horizontalPlane = new Plane().setFromNormalAndCoplanarPoint(this.zDir, position)
        this.initialPosition = position
        this.camera = camera
        this.renderer = renderer
        this.scene = scene
        this.callBack = callBack
        this.transformControl = new TransformControls(this.camera.instance, this.renderer.instance.domElement)
        this.gizmo = this.transformControl .getHelper()
        this.setOutLine(min, max)
    }

    setOutLine(min:Vector3, max:Vector3)
    {
        this.midPlaneMesh = new Mesh(new PlaneGeometry(0.001, 0.001), new MeshBasicMaterial({transparent:true, opacity:0}))
        
        const point1 = min.clone().sub(new Vector3(5,5,5))
        let localMin = new Vector3()
        this.horizontalPlane.projectPoint(point1, localMin)
        const point2 = max.clone().add(new Vector3(5,5,5))
        let localMax = new Vector3()
        this.horizontalPlane.projectPoint(point2, localMax)

        const midPoint = localMin.clone().add(localMax.clone()).multiplyScalar(0.5)
        const boundMid = point1.clone().add(point2.clone()).multiplyScalar(0.5)
        const mid = new Vector3()
        this.plane.projectPoint(boundMid, mid)
        this.midPlaneMesh.position.copy(mid)
        const dir = mid.clone().add(this.plane.normal.clone().negate())
        this.midPlaneMesh.lookAt(dir.x,dir.y,dir.z)

        const p0 = localMin.clone().sub(midPoint).sub(mid)
        const d = localMax.clone().sub(localMin.clone())
        const baseDirection = Math.abs(this.horizontalPlane.normal.normalize().dot(this.zDir)) <= 1.0e-3 ? this.zDir:this.yDir
        const baseLineDir = baseDirection.clone().cross(this.horizontalPlane.normal).normalize() 
        const baseDistance = d.dot(baseLineDir)
        
        const p1 = localMin.clone().add(baseLineDir.clone().multiplyScalar(baseDistance)).sub(midPoint).sub(mid)
        const p2 = localMax.clone().sub(midPoint).sub(mid)
        const orthVec = localMax.clone().sub(p1)
        const p3 = p0.clone().add(orthVec).sub(midPoint).sub(mid)
        const geometry  = new BufferGeometry() 
        const positions = new Float32Array([
            p0.x, p0.y, p0.z,
            p1.x, p1.y, p1.z,
            p2.x, p2.y, p2.z,
            p3.x, p3.y, p3.z,
            p0.x, p0.y, p0.z
        ])
        geometry.setAttribute('position', new BufferAttribute(positions, 3))

        this.outLine = new Line(geometry, Materials.SectionLineMaterial)
        const middlePoint = new Vector3() 
        this.plane.projectPoint(mid, middlePoint)
        this.midpoint = mid
        this.outLine.position.set(middlePoint.x, middlePoint.y, middlePoint.z)
        this.outLine.userData['object'] = this
        this.outLine.userData['isSectionBox'] = true
        this.midPlaneMesh.userData['isSectionBox'] = true
        this.midPlaneMesh.add(this.outLine)
    }
    showOutLine(group:Group){
        this.getAllMaterials(group)
        group.add(this.midPlaneMesh)
        this.callBack()
    }
    hideOutLine(group:Group){
        this.getAllMaterials(group)
        group.remove(this.midPlaneMesh)
        this.callBack()
    }
    highlight(group:Group){
        this.outLine.material = Materials.SectionLineHighlightMaterial
        this.getAllMaterials(group)
    }
    unhighlight(){
        this.outLine.material = Materials.SectionLineMaterial
    }
    activate(){
        this.outLine.material = Materials.SectionLineHighlightMaterial  
        this.transformControl.attach(this.midPlaneMesh)

        this.transformControl.space = 'local'
        this.transformControl.showX = false
        this.transformControl.showY = false

        this.scene.add(this.gizmo)
        
        this.transformControl.addEventListener( 'change', () => {
            this.renderer.update()
            callBack() 
        })
        const camera = this.camera
        const callBack = this.callBack
        const scene = this.midPlaneMesh.parent
		this.transformControl.addEventListener( 'dragging-changed', function ( event ) {
			camera.controls.enabled = ! event.value
            callBack()
		})
    }
    deactivate(){
        this.outLine.material = Materials.SectionLineMaterial
        this.transformControl.detach(  )
        this.scene.remove(this.gizmo)
        let camera = this.camera
        this.transformControl.removeEventListener( 'change', () => this.renderer.update() )
		this.transformControl.removeEventListener( 'dragging-changed', function ( event ) {
			camera.controls.enabled = ! event.value
		} )
    }
    getCameraPosition(distance:number){
        return this.midpoint.clone().add(this.plane.normal.clone().negate().multiplyScalar(distance))
    }
    getAllMaterials(group:Group){
         const materials = new Set<Material>()
        group.traverse((object) => {
          if ((object instanceof Mesh || object instanceof Line || object instanceof Points) && !object.userData['isSectionBox']) {
            if (Array.isArray(object.material)) {
              object.material.forEach(mat => materials.add(mat))
            } else materials.add(object.material)
          }
        })
        Section.materials = Array.from(materials)
    }
}