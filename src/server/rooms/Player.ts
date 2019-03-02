import {COLOURS} from "../../definitions";
import {Entity} from "./Entity";
import {Item} from "./Item";

const DEFAULT_HEALTH = 20;
const PLAYER_RADIUS = 20;

export class Player extends Entity {
    health: number;
    name: string;
    inventory: Item[];
    inBattle: string = "no";


    constructor(x: number, y: number, name: string) {
        super(x, y, PLAYER_RADIUS, COLOURS.blue);
        this.name = name;
        this.health = DEFAULT_HEALTH;
        this.inventory = [];
    }

    damage(hit: number, item: Item) {
        let damage = hit;
        if (item !== null) {
            damage += item.damage;
        }
        this.health -= damage;
    }

    additem(item: Item) {
        if (this.inventory.length >= 3) {
            return false;
        } else {
            this.inventory.push(item);
            return true;
        }
    }

    useitem() {

    }
}
