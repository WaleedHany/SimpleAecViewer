import EventsEmitter from "./EventsEmitter"

export default class SceneSizes extends EventsEmitter {
  width: number
  height: number
  pixelRatio: number
  _resizeTimer?: number
   observer: ResizeObserver
  
  constructor(canvas: HTMLCanvasElement) {
    super()

    this.width = canvas.parentElement?.clientWidth ?? canvas.clientWidth
    this.height = canvas.parentElement?.clientHeight ?? canvas.clientWidth
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Observe the canvas parent for layout changes
    this.observer = new ResizeObserver(() => this.handleResize(canvas))
    if (canvas.parentElement) this.observer.observe(canvas.parentElement)
    else this.observer.observe(canvas) 

    // Resize event
    window.addEventListener('resize', () => this.handleResize(canvas))
    // catch devicePixelRatio changes (zoom or screen change)
    window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      .addEventListener('change', () => this.handleResize(canvas))
  }

  handleResize = (canvas: HTMLCanvasElement) => {
    const parent = canvas.parentElement
    if(parent){
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    this.width = parent?.clientWidth ?? canvas.clientWidth
    this.height = parent?.clientHeight ?? canvas.clientWidth
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.trigger('resize')
  }

  // handleWindowResize(canvas: HTMLCanvasElement) {
  //   clearTimeout(this._resizeTimer)
  //   this.handleResize(canvas)
  //   this._resizeTimer = window.setTimeout(() => {
  //     this.handleResize(canvas)
  //   }, 500)
  // }

  dispose() {
    this.observer.disconnect()
  }















  
  // constructor(canvas: HTMLCanvasElement) {
  //   // instansiate base class
  //   super()
    
  //   // Setup
  //   this.width = canvas.parentElement.clientWidth
  //   this.height = canvas.parentElement.clientHeight
  //   this.pixelRatio = Math.min(window.devicePixelRatio, 1)
    
  //   // Resize event
  //   window.addEventListener('resize', () => this.handleResize(canvas), false)
  // }
  
  // // handleResize = (canvas: HTMLCanvasElement) => {
  // //   this.width = canvas.parentElement.clientWidth
  // //   this.height = canvas.parentElement.clientHeight
  // //   // canvas.width = window.innerWidth
  // //   // canvas.height = window.innerHeight
  // //   this.pixelRatio = Math.min(window.devicePixelRatio, 1)
  // //   this.trigger('resize')
  // // }

  // updateFromCanvas(canvas: HTMLCanvasElement) {
  //   const parent = canvas.parentElement
  //   this.width = parent?parent.clientWidth:canvas.clientWidth
  //   this.height = parent?parent.clientHeight:canvas.clientHeight
  //   this.pixelRatio = Math.min(window.devicePixelRatio, 2)
  // }

  // handleResize(canvas: HTMLCanvasElement) {
  //   clearTimeout(this._resizeTimer)
  //   //this.updateFromCanvas(canvas)
  //   this.trigger('resize')
  //   this._resizeTimer = window.setTimeout(() => {
  //     this.updateFromCanvas(canvas)
  //     this.trigger('resize')
  //   }, 100)
  // }
}