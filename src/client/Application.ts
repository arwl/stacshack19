import * as PIXI from "pixi.js";
import * as Viewport from "pixi-viewport";
import * as Keyboard from "pixi.js-keyboard";
import * as Mouse from "pixi.js-mouse";
import {UP, DOWN, LEFT, RIGHT, NONE, MOVES} from "../definitions";
import {Client, DataChange} from "colyseus.js";
import Sprite = PIXI.Sprite;
import Texture = PIXI.Texture;
import {resources} from "pixi.js";

const SOCKET = "ws://pc2-079-l:8080";
export const lerp = (a: number, b: number, t: number) => (b - a) * t + a

// Width/Height of the map
const MAP_SIZE = 4096;

export class App extends PIXI.Application {
    //
    entities: { [id: string]: PIXI.Container } = {};
    currentPlayerEnt: PIXI.Container;


    client = new Client(SOCKET);
    room = this.client.join("arena");
    //
    vp: Viewport;
    //
    _axisListener: any;
    _interpolation: boolean;
    state: Function;
    private playerBack: any;
    private playerFront: any;
    private playerTexture;

    //
    constructor() {
        super({
            width: window.innerWidth * 0.9,
            height: window.innerHeight * 0.9
        });

        this.initializeArena();


    }

    initializeArena(): any {
        this.addSwitchListener();
        this.vp = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: MAP_SIZE,
            worldHeight: MAP_SIZE
        });
        this.entities = {};
        this.room.listen("entities/:id", (change: DataChange) => {
            if (this.room.name === "arena") {
                console.log(change.operation);
                console.log(JSON.stringify(change, null, 4));
                if (change.operation === "add") {
                    let image: Sprite;

                    if (change.value.inBattle) {
                        image = this.getImage("resources/Sprites/fist.png");

                        if (change.path.id === this.room.sessionId) {
                            console.log("following");
                            this.currentPlayerEnt = image;
                            this.vp.follow(this.currentPlayerEnt);
                        }

                    } else if (change.value.stats) {
                        if (change.value.stats.rock) {
                            image = this.getImage("resources/Sprites/rock.png");
                        } else if (change.value.stats.scissors) {
                            image = this.getImage("resources/Sprites/scissors.png");
                        } else if (change.value.stats.paper) {
                            image = this.getImage("resources/Sprites/paper.png");
                        }

                    }
                    image.scale.x = .20;
                    image.scale.y = .20;
                    image.position.set(change.value.x, change.value.y);

                    this.entities[change.path.id] = image;
                    this.vp.addChild(image);
                    this.state = this.overworld;

                    if (change.path.id === this.room.sessionId) {
                        this.currentPlayerEnt = image;
                        this.vp.follow(this.currentPlayerEnt);
                    }

                } else if (change.operation === "remove") {
                    this.vp.removeChild(this.entities[change.path.id]);
                    this.entities[change.path.id].destroy();
                    delete this.entities[change.path.id]
                }
            }
        });


        // Show world boundaries
        const bounds = new PIXI.Graphics();
        bounds.beginFill(0x98FB98);
        bounds.drawRect(0, 0, MAP_SIZE, MAP_SIZE);
        this.vp.addChild(bounds);

        // Add vp to stage
        this.stage.addChild(this.vp);
        this.state = this.overworld;
        this.interpolation();


    }


    private getImage(location: string) {
        // @ts-ignore
        return new Sprite.from(location);
    }

    initializeBattle(): any {
        this.addSwitchListener();
        this.entities = {};
        this.vp = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: window.innerWidth,
            worldHeight: window.innerHeight
        });

        // Add vp to stage
        this.stage.addChild(this.vp);
        this.state = this.battle;
        this.interpolation();

    }


    private addSwitchListener() {
        this.room.listen("entities/:id/inBattle", (change: DataChange) => {
            console.log(JSON.stringify(change, null, 4));
            if (change.value !== "no") {
                console.log("value is not no")
                if (this.room.name === "arena") {
                    this.room.leave();
                    this.room = this.client.join("battle");
                    this.initializeBattle();
                }
            } else {
                console.log("value is no")
                if (this.room.name === "battle") {
                    this.room.leave();
                    this.room = this.client.join("arena");
                    this.initializeArena();
                }
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

        if (this.state) {

            try {
                this.state();
            } catch (e) {
                console.log(e);
            }
        }

        Keyboard.update();
        Mouse.update();
    }

    sendKeyboard(command: any) {
        if (this.currentPlayerEnt) {
            this.room.send(['KEYBOARD', command]);
        }
    }

    overworld() {
        let direction: number = NONE;

        if (Keyboard.isKeyDown('ArrowLeft', 'KeyA'))
            direction += LEFT;
        if (Keyboard.isKeyDown('ArrowRight', 'KeyD'))
            direction += RIGHT;
        if (Keyboard.isKeyDown('ArrowUp', 'KeyW'))
            direction += UP;
        if (Keyboard.isKeyDown('ArrowDown', 'KeyS'))
            direction += DOWN;

        return this.sendKeyboard(direction)

    }

    battle() {
        if (Keyboard.isKeyDown('KeyR'))
            return this.sendKeyboard(MOVES.ROCK);
        if (Keyboard.isKeyDown('KeyP'))
            return this.sendKeyboard(MOVES.PAPER);
        if (Keyboard.isKeyDown('KeyS'))
            return this.sendKeyboard(MOVES.SCISSORS);

    }

}
