import { nosync } from "colyseus";

export class Entity {
    x: number;
    y: number;
    radius: number;
    colour: number;

    @nosync dead: boolean = false;
    @nosync angle: number = 0;
    @nosync speed = 0;

    constructor(x: number, y: number, radius: number, colour: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
    }

    static distance(a: Entity, b: Entity) {
        return Math.sqrt(Math.pow(a.y - b.y, 2) + Math.pow(a.x - b.x, 2))
    }
}
