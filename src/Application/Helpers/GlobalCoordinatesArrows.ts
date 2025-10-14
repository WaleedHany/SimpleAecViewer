import { ArrowHelper, Group, Vector3, Sprite, BoxGeometry ,EdgesGeometry, LineSegments, LineBasicMaterial} from "three";
//import SpriteText from 'three-spritetext'

const hexX = 'red'// 0xa6050d;
const hexY = 'green'// 0x0c8a53;
const hexZ = 'blue'// 0x0675c9;
const headLength = 0.4;
const headWidth = 0.14;

export default class GlobalCoordinatesArrows
{
    
    dirX : Vector3
    dirY : Vector3
    dirZ : Vector3
    arrowHelperX : ArrowHelper
    arrowHelperY : ArrowHelper
    arrowHelperZ : ArrowHelper
    // txtSpriteX : Sprite
    // txtSpriteY : Sprite
    // txtSpriteZ : Sprite
    origin : Vector3
    arrows : Group
    arrows2D : Group

    constructor(origin:Vector3, length: number)
    {
        this.dirX = new Vector3(1, 0, 0)
        this.dirY = new Vector3(0, 1, 0)
        this.dirZ = new Vector3(0, 0, 1)
        this.origin = origin
        this.arrowHelperX = new ArrowHelper(this.dirX, origin, length, hexX, headLength, headWidth)
        this.arrowHelperY = new ArrowHelper(this.dirY, origin, length, hexY, headLength, headWidth)
        this.arrowHelperZ = new ArrowHelper(this.dirZ, origin, length, hexZ, headLength, headWidth)

        const geometry = new BoxGeometry( 0.8,0.8,0.01 )
        const edges = new EdgesGeometry( geometry )
        const line = new LineSegments(edges, new LineBasicMaterial({color: 0x444 , transparent:true, opacity:0.6})) 

        this.arrows = new Group()
        this.arrows2D = new Group()
        this.arrows.add(this.arrowHelperX)
        this.arrows.add(this.arrowHelperY)
        this.arrows.add(this.arrowHelperZ)
        this.arrows.add(line)

        this.arrows2D.add(this.arrowHelperX.clone())
        this.arrows2D.add(this.arrowHelperY.clone())

        const xPos = origin.clone().add(new Vector3(length+0.5, 0, 0)) 
        const yPos = origin.clone().add(new Vector3(0, length+0.5, 0)) 
        const zPos = origin.clone().add(new Vector3(0, 0, length+0.5)) 
        // this.txtSpriteX = new SpriteText('X',  0.5, 'rgb(204,1,1,1)')
        // this.txtSpriteX.position.set(xPos.x, xPos.y, xPos.z)
        // if(this.txtSpriteX) this.arrows.add(this.txtSpriteX), this.arrows2D.add(this.txtSpriteX.clone())

        // this.txtSpriteY = new SpriteText('Y',  0.5, 'rgb(6,117,201,1)')
        // this.txtSpriteY.position.set(yPos.x, yPos.y, yPos.z)
        // if(this.txtSpriteY)this.arrows.add(this.txtSpriteY), this.arrows2D.add(this.txtSpriteY.clone())

        // this.txtSpriteZ = new SpriteText('Z',  0.5, 'rgb(5,166,96,1)')
        // this.txtSpriteZ.position.set(zPos.x, zPos.y, zPos.z)
        // if(this.txtSpriteZ)this.arrows.add(this.txtSpriteZ)
    }

    get()
    {
        return this.arrows
    }

    get2D()
    {
        return this.arrows2D
    }
}