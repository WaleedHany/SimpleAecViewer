import {DoubleSide, LineBasicMaterial, MeshBasicMaterial, Plane} from "three"
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js'

export default class Materials {
  static sectionPlanes: Plane[] = []
  static baseMaterial = new MeshBasicMaterial({
    color: 0xFFFFE0,
    side: DoubleSide,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.5,
    clippingPlanes: Materials.sectionPlanes
  })
  static errorSurfaceMaterial = new MeshBasicMaterial({
    color: "#d03838",
    side: DoubleSide,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.5,
    clippingPlanes: Materials.sectionPlanes
  })
  static heighLightMaterial = new MeshBasicMaterial({
    color: 0x55AAFF,
    side: DoubleSide,
    transparent: true,
    opacity: 0.4,
    clippingPlanes: Materials.sectionPlanes
  })
  static lineHeighLightMaterial = new LineMaterial({
    color: 0x55AAFF,
    side: DoubleSide,
    linewidth: 5,
    clippingPlanes: Materials.sectionPlanes
  })
  static selectedMaterial = new MeshBasicMaterial({
    color: 0xFFFF40,
    side: DoubleSide,
    clippingPlanes: Materials.sectionPlanes
  })
  static lineSelectedMaterial = new LineMaterial({
    color: 'orange',
    side: DoubleSide,
    linewidth: 5,
    clippingPlanes: Materials.sectionPlanes
  })
  static lineMaterial = new LineBasicMaterial({
    color: 0x000000,
    side: DoubleSide,
    clippingPlanes: Materials.sectionPlanes
  })
  static SectionLineMaterial = new LineBasicMaterial({color: 'red'})
  static SectionLineHighlightMaterial = new LineBasicMaterial({color: '#2d60b0'})
  
  static updateClippingPlanes(sectionPlanes: Plane[]) {
    Materials.baseMaterial.clippingPlanes = sectionPlanes
    Materials.heighLightMaterial.clippingPlanes = sectionPlanes
    Materials.lineHeighLightMaterial.clippingPlanes = sectionPlanes
    Materials.selectedMaterial.clippingPlanes = sectionPlanes
    Materials.lineSelectedMaterial.clippingPlanes = sectionPlanes
    Materials.lineMaterial.clippingPlanes = sectionPlanes
    Materials.errorSurfaceMaterial.clippingPlanes = sectionPlanes
  }
}