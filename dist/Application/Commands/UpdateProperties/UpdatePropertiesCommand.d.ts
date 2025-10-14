import { Mesh } from "three";
import { IBuildingConfiguration } from "../../Models/Environment";
import Command from "../Command";
export default class UpdatePropertiesCommand extends Command {
    selectedObjs: Mesh[];
    config: IBuildingConfiguration[];
    oldConfiguration: IBuildingConfiguration[];
    name: string;
    constructor(selectedObjs: Mesh[], config: IBuildingConfiguration[]);
    execute(): void;
    undo(): void;
    redo(): void;
    remove(): void;
}
