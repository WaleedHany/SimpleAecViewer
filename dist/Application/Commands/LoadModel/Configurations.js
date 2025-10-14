export const dummyBuildingConfigurations = {
    selectionType: "surface",
    isError: { hasError: false, errorMessage: "" },
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
