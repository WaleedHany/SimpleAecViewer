import _ from "lodash";
import {Mesh, Object3D} from "three";
import {IBuildingConfiguration} from "../../Models/Environment";
import Command from "../Command"

export default class UpdatePropertiesCommand extends Command {
  selectedObjs: Mesh[] | Object3D[];
  config: IBuildingConfiguration[]
  oldConfiguration: IBuildingConfiguration[]
  name: string
  selectedLines: Mesh[] | Object3D[] | undefined
  
  constructor(selectedObjs: Mesh[] | Object3D[], config: IBuildingConfiguration[], selectedLines?: Mesh[] | Object3D[] | undefined) {
    super();
    this.name = 'Update properties'
    this.selectedObjs = selectedObjs
    this.config = config
    this.selectedLines = selectedLines
    
    this.oldConfiguration = this.selectedObjs.map((s, index) => {
      let config = s.userData["leftPanelProperties"]
      if (s.userData.segments && selectedLines) {
        const segment = s?.userData?.segments?.get(selectedLines[index]?.userData?.intersectionIndex)
        config = segment["leftPanelProperties"]
      } else if (s.userData.segments && !selectedLines) {
        for (const segment of s.userData.segments.values()) {
          config = segment["leftPanelProperties"]
        }
      }
      return config
    })
    this.setConfigurationsToItems(this.selectedObjs, this.config, this.selectedLines)
  }
  
  execute() {
    this.setConfigurationsToItems(this.selectedObjs, this.config, this.selectedLines)
  }
  
  undo() {
    console.log("undo")
    this.setConfigurationsToItems(this.selectedObjs, this.oldConfiguration, this.selectedLines)
  }
  
  redo() {
    console.log("redo")
    this.setConfigurationsToItems(this.selectedObjs, this.config, this.selectedLines)
  }
  
  remove() {
    console.log("remove")
    this.setConfigurationsToItems(this.selectedObjs, this.oldConfiguration, this.selectedLines)
    this.config = []
  }
  
  setConfigurationsToItems(
    items: Mesh[] | Object3D[],
    config: IBuildingConfiguration[],
    lineSegments: Mesh[] | Object3D[] | undefined
  ) {
    console.log(_.cloneDeep(config));
    
    items.forEach((s, index) => {
      const existing = s.userData["leftPanelProperties"] ?? {};
      
      // 🟩 Merge new config with existing properties
      s.userData["leftPanelProperties"] = _.merge({}, existing, config[index]);
      
      if (s.userData.segments && lineSegments) {
        console.log("line");
        
        const segment = s?.userData?.segments?.get(
          lineSegments[index]?.userData?.intersectionIndex
        );
        
        if (segment) {
          const existingSegmentProps = segment["leftPanelProperties"] ?? {};
          segment["leftPanelProperties"] = _.merge(
            {},
            existingSegmentProps,
            config[index]
          );
        }
      } else if (s.userData.segments && !lineSegments) {
        console.log("not a line");
        
        for (const segment of s.userData.segments.values()) {
          const existingSegmentProps = segment["leftPanelProperties"] ?? {};
          segment["leftPanelProperties"] = _.merge(
            {},
            existingSegmentProps,
            config[index],
            {selectionType: "edge"}
          );
        }
      }
    });
  }
  
}