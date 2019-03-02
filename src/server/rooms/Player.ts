import {COLOURS} from "../../definitions";
import { Entity } from "./Entity";
import { Item } from "./Item";
const DEFAULT_HEALTH = 20;
const PLAYER_RADIUS = 20;

export class Player extends Entity {
    health: number;
    name: string;
    inventory: Item[];
    inBattle: string;
    
    
    constructor(x: number, y:number, name: string){
        super(x,y,PLAYER_RADIUS);
        this.name = name;
        this.health = DEFAULT_HEALTH;
        this.inventory = [];
        super.colour = COLOURS.blue;
    }

    damage(hit: number ,item: Item){
        var damage = hit;
        if(item === null){
            hit += item.damage;
        }
        this.health  -= hit;
    }

    additem(item: Item) {
        if (this.inventory.length >= 3) {
            return false;
        } else {
            this.inventory.push(item);
            return true;
        }
    }

    useitem(){

    }
}
