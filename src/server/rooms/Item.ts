import {Entity} from "./Entity";

export interface Stats {
    rock?: number,
    paper?: number,
    scissors?: number
}

export class Item extends Entity {
    static ITEM_RADIUS: number = 10;
    colour: number;
    name: string;
    damage: number;
    stats: Stats;

    protected constructor(x: number, y: number, colour: number, name: string, stats: Stats) {
        super(x, y, Item.ITEM_RADIUS);
        this.stats = stats;
        this.name = name;
        this.colour = colour;
    }
}
