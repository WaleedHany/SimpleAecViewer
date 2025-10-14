import EventsEmitter from "../Utils/EventsEmitter"

// Command main class
interface Command {
    name:string
    execute(): void 
    undo(): void 
    redo(): void 
    remove(): void
}

export default class Commands extends EventsEmitter
{
    History: Command[] 
    RedoHistory: Command[] 
    
    constructor()
    {
        super()
        this.History = [] 
        this.RedoHistory = [] 
    }

    async executeCommand(command:Command)
    {
        // Check if command is a Command (implements execute(), undo(), redo())
        if (typeof(command.execute) == "function" 
            && typeof(command.undo) == "function" 
            && typeof(command.redo) == "function" 
            && typeof(command.remove) == "function")
        {
            this.History.push(command) 
            await command.execute() 
            // Clear RedoHistory
            for (let i = 0 ; i < this.RedoHistory.length ; i++){
                this.RedoHistory[i].remove() 
            }
            this.RedoHistory = [] 
        }
        else{
            console.log(typeof(command.execute))
        }
    }

    async undoCommand()
    {
        if(this.History.length > 0){
            this.RedoHistory.push(this.History[this.History.length-1]) 
            await this.History[this.History.length-1].undo() 
            this.History.pop() 
        }
        // redoHistory will support onlt 50 operations
        if(this.RedoHistory.length > 50){
            this.RedoHistory[0].remove() 
            this.RedoHistory.shift() 
        }
        this.trigger('undo')
    }

    async redoCommand()
    {
        if(this.RedoHistory.length > 0)
        {
            this.History.push(this.RedoHistory[this.RedoHistory.length-1]) 
            await this.RedoHistory[this.RedoHistory.length-1].redo() 
            this.RedoHistory.pop() 
        }
    }
}