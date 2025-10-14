import EventsEmitter from "../Utils/EventsEmitter";
interface Command {
    name: string;
    execute(): void;
    undo(): void;
    redo(): void;
    remove(): void;
}
export default class Commands extends EventsEmitter {
    History: Command[];
    RedoHistory: Command[];
    constructor();
    executeCommand(command: Command): Promise<void>;
    undoCommand(): Promise<void>;
    redoCommand(): Promise<void>;
}
export {};
