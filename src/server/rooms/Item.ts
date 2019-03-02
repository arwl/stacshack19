import { Entity } from "./Entity";

const ITEM_RADIUS = 10;

export class Item extends Entity{
    name: string;
    damage: number;
    
    constructor(x: number, y: number){
        super(x,y, ITEM_RADIUS);
    }
}