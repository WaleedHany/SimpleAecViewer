import { IBuildingConfiguration } from "./Environment";

export const dummyBuildingConfigurations: IBuildingConfiguration = {
  selectionType: "surface",
  isError: {hasError: false, errorMessage: ""},
  isModified: false,
  sheet: {
    material: "Steel",
    thickness: 2.5,
    sheetWidth: 1200,
    sheetHeight: 2400,
    sheetSurfaceFinish: "PowderCoated",
    sheetColor: "RAL7016"
  },
  fixation: {
    method: "lAngle",
    maxEdgeDistance: 50,
    maxSpacing: 300,
    leg1Length: 50,
    leg2Length: 50,
    angleThickness: 5
  },
  stiffeners: {
    stiffenerType: "C-Channel",
    stiffenerWidth: 40,
    stiffenerHeight: 60,
    stiffenerMaxEdgeDistance: 100,
    stiffenerMaxSpacingDistance: 400
  }
};

export const emptyBuildingConfigurations: IBuildingConfiguration = {
  selectionType: "surface",
  isError: {hasError: false, errorMessage: ""},
  isModified: false,
  sheet: {
    material: "",
    thickness: "",
    sheetWidth: "",
    sheetHeight: "",
    sheetSurfaceFinish: "",
    sheetColor: ""
  },
  fixation: {
    method: "lAngle",
    maxEdgeDistance: "",
    maxSpacing: "",
    leg1Length: "",
    leg2Length: "",
    angleThickness: ""
  },
  stiffeners: {
    stiffenerType: "",
    stiffenerWidth: "",
    stiffenerHeight: "",
    stiffenerMaxEdgeDistance: "",
    stiffenerMaxSpacingDistance: ""
  }
};

export const errorBuildingConfigurations: IBuildingConfiguration = {
  selectionType: "surface",
  isError: {hasError: true, errorMessage: "Spacing Shall not exceed 10mm!"},
  isModified: false,
  sheet: {
    material: "Steel",
    thickness: 2.5,
    sheetWidth: 1200,
    sheetHeight: 2400,
    sheetSurfaceFinish: "PowderCoated",
    sheetColor: "RAL7016"
  },
  fixation: {
    method: "lAngle",
    maxEdgeDistance: 50,
    maxSpacing: 300,
    leg1Length: 50,
    leg2Length: 50,
    angleThickness: 5
  },
  stiffeners: {
    stiffenerType: "C-Channel",
    stiffenerWidth: 40,
    stiffenerHeight: 60,
    stiffenerMaxEdgeDistance: 100,
    stiffenerMaxSpacingDistance: 400
  }
};