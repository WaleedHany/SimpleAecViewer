import Command from "../Command";
export default class UpdatePropertiesCommand extends Command {
    constructor(selectedObjs, config) {
        super();
        this.name = 'Update properties';
        this.selectedObjs = selectedObjs;
        this.config = config;
        this.oldConfiguration = this.selectedObjs.map((s) => s.userData["leftPanelProperties"]);
        this.selectedObjs.forEach((s, index) => {
            s.userData["leftPanelProperties"] = {
                ...this.config[index],
            };
        });
    }
    execute() {
        this.selectedObjs.forEach((s, index) => {
            s.userData["leftPanelProperties"] = {
                ...this.config[index],
            };
        });
    }
    undo() {
        console.log("undo");
        this.selectedObjs.forEach((s, index) => {
            s.userData["leftPanelProperties"] = {
                ...this.oldConfiguration[index],
            };
        });
    }
    redo() {
        console.log("redo");
        this.selectedObjs.forEach((s, index) => {
            s.userData["leftPanelProperties"] = {
                ...this.config[index],
            };
        });
    }
    remove() {
        console.log("remove");
        this.selectedObjs.forEach((s, index) => {
            s.userData["leftPanelProperties"] = {
                ...this.oldConfiguration[index],
            };
        });
        this.config = [];
    }
}
