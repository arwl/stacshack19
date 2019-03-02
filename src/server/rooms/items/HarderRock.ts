import {COLOURS} from "../../../definitions";
import {Item} from "../Item";

export class HarderRock extends Item {
    angle: number = 0;
    dead: boolean = false;
    radius: number = Item.ITEM_RADIUS;

    constructor(x: number, y: number) {
        super(x,y, COLOURS.turquoise, "Harder Rock", {rock: 2});
    }
}
