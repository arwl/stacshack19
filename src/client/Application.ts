import * as PIXI from "pixi.js";
import * as Viewport from "pixi-viewport";
import { Client, DataChange } from "colyseus.js";

const SOCKET = "ws://localhost:8080"

// Width/Height of the map
const MAP_SIZE = 4096;

export class App extends PIXI.Application {

    Entities: { [id: string]: PIXI.Graphics } = {};
    currentPlayerEnt: PIXI.Graphics;

    client = new Client(SOCKET);
    room = this.client.join("arena");

    vp: Viewport;

    // Don't know what these are doing right now
    _axisListener: any;
    _interpolation: boolean;

    constructor() {
        super({
            width: window.innerWidth,
            height: window.innerHeight
        });

        this.vp = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: MAP_SIZE,
            worldHeight: MAP_SIZE
        });

        // Show world boundaries
        const bounds = new PIXI.Graphics();
        bounds.beginFill(0x98FB98);
        bounds.drawRect(0, 0, MAP_SIZE, MAP_SIZE);
        this.vp.addChild(bounds);

        // Add vp to stage
        this.stage.addChild(this.vp);

        this.initialize();
        // this.interpolation = false;

        // Let the server know about mouse movements
        this.vp.on("mousemove", (e) => {
            if (this.currentPlayerEnt) {
                const point = this.vp.toLocal(e.data.global);
                this.room.send(['mouse', {x: point.x, y: point.y}]);
            }
        });

    }

    initialize(): any {
        // throw new Error("Method not implemented.");
        this.room.listen("entities/:id", (change: DataChange) => {
            if (change.operation === "add") {
                const color = 0x87cefa;
                const graphics = new PIXI.Graphics();
                graphics.line
            }
        });
    }

}