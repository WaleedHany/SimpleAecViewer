export declare const dummyBuildingConfigurations: IBuildingConfiguration;
export type IBuildingConfiguration = {
    selectionType: "surface" | "edge";
    isError: {
        hasError: boolean;
        errorMessage: string;
    };
    sheet: {
        material: string;
        thickness: number | string;
        sheetWidth: number | string;
        sheetHeight: number | string;
        sheetSurfaceFinish: string;
        sheetColor: string;
    };
    fixation: {
        method: "lAngle" | "Hook";
        maxEdgeDistance: number | string;
        maxSpacing: number | string;
        leg1Length: number | string;
        leg2Length: number | string;
        angleThickness: number | string;
    };
    stiffeners: {
        stiffenerType: string;
        stiffenerWidth: number | string;
        stiffenerHeight: number | string;
        stiffenerMaxEdgeDistance: number | string;
        stiffenerMaxSpacingDistance: number | string;
    };
};
