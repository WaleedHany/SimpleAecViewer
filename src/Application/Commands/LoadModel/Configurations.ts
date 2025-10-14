export const dummyBuildingConfigurations: IBuildingConfiguration = {
  selectionType: "surface",
  isError: {hasError: false, errorMessage: ""},
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
}

export type IBuildingConfiguration = {
  selectionType: "surface" | "edge",
  isError: { hasError: boolean, errorMessage: string },
  sheet: {
    material: string,
    thickness: number | string
    sheetWidth: number | string,
    sheetHeight: number | string
    sheetSurfaceFinish: string,
    sheetColor: string
  },
  fixation: {
    method: "lAngle" | "Hook",
    maxEdgeDistance: number | string,
    maxSpacing: number | string
    leg1Length: number | string,
    leg2Length: number | string,
    angleThickness: number | string
  },
  stiffeners: {
    stiffenerType: string,
    stiffenerWidth: number | string,
    stiffenerHeight: number | string,
    stiffenerMaxEdgeDistance: number | string,
    stiffenerMaxSpacingDistance: number | string,
  }
}