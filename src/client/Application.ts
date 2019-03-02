import * as PIXI from "pixi.js";
import * as Viewport from "pixi-viewport";
import * as Keyboard from "pixi.js-keyboard";
import * as Mouse from "pixi.js-mouse";
import { Client, DataChange } from "colyseus.js";

const SOCKET = "ws://localhost:8080"
export const lerp = (a: number, b: number, t: number) => (b - a) * t + a

// Width/Height of the map
const MAP_SIZE = 4096;

export class App extends PIXI.Application {

    entities: { [id: string]: PIXI.Graphics } = {};
    currentPlayerEnt: PIXI.Graphics;

    client = new Client(SOCKET);
    room = this.client.join("arena");

    vp: Viewport;

    _axisListener: any;
    _interpolation: boolean;
    state: any;

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

        this.interpolation();

    }

    initialize(): any {
        // throw new Error("Method not implemented.");
        this.room.listen("entities/:id", (change: DataChange) => {
            if (change.operation === "add") {
                const colour = 0x87cefa;
                const graphics = new PIXI.Graphics();
                graphics.lineStyle(0);
                graphics.beginFill(colour);
                graphics.drawCircle(0, 0, change.value.radius);
                graphics.endFill();

                graphics.x = change.value.x;
                graphics.y = change.value.y;
                this.vp.addChild(graphics);

                this.entities[change.path.id] = graphics;

                this.state = this.overworld;

                if (change.path.id === this.room.sessionId) {
                    this.currentPlayerEnt = graphics;
                    this.vp.follow(this.currentPlayerEnt);
                }

            } else if (change.operation === "remove") {
                this.vp.removeChild(this.entities[change.path.id]);
                this.entities[change.path.id].destroy();
                delete this.entities[change.path.id]
            }
        });
    }

    interpolation() {
        this._interpolation = true;
        this.room.removeListener(this._axisListener);
        this.loop();
    }

    // Game Loop
    // Listen for keypress and find battles?
    loop() {
        for (let id in this.entities) {
            this.entities[id].x = lerp(this.entities[id].x, this.room.state.entities[id].x, 0.2);
            this.entities[id].y = lerp(this.entities[id].y, this.room.state.entities[id].y, 0.2);
        }
        requestAnimationFrame(this.loop.bind(this));
        this.state();
        Keyboard.update();
        Mouse.update();
    }

    overworld() {
        const speed = 5;
        if (Keyboard.isKeyDown('ArrowLeft', 'KeyA'))
            this.currentPlayerEnt.x -= speed;
        if (Keyboard.isKeyDown('ArrowRight', 'KeyD'))
            this.currentPlayerEnt.x += speed;
        if (Keyboard.isKeyDown('ArrowUp', 'KeyW'))
            this.currentPlayerEnt.y -= speed;
        if (Keyboard.isKeyDown('ArrowDown', 'KeyS'))
            this.currentPlayerEnt.y += speed;
    }

    battle() {
        console.log("You're in a battle friendo");
    }

}