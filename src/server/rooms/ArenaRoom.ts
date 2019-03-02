import {Room, Client} from "colyseus";
import {DOWN, LEFT, NONE, RIGHT, UP} from "../../definitions";
import {Entity} from "./Entity";
import {State} from "./State";

export class ArenaRoom extends Room {
    onInit() {
        this.setState(new State());
        this.setSimulationInterval(() => this.state.update());
    }

    onJoin(client: Client, options: any) {
        this.state.createPlayer(client.sessionId);
    }

    onMessage(client: Client, message: any) {
        const entity = this.state.entities[client.sessionId];

        // skip dead players
        if (!entity) {
            console.log("DEAD PLAYER ACTING...");
            return;
        }

        const [command, data] = message;

        // change angle
        if (command === "KEYBOARD") {
            let direction = new Entity(0, 0, 0);

            if (data & UP) {
                direction.y += 1;
            }
            if (data & DOWN) {
                direction.y -= 1;
            }
            if (data & LEFT) {
                direction.x+=1;
            }
            if (data & RIGHT) {
                direction.x-=1;
            }

            if (data === NONE) {
                entity.speed*=0.9;
                return;
            }

            entity.speed = 5;
            entity.angle = Math.atan2(direction.y, direction.x);
            return;
        }

        if (command === "ATTACK") {

        }
    }

    onLeave(client: Client) {
        const entity = this.state.entities[client.sessionId];

        // entity may be already dead.
        if (entity) {
            entity.dead = true;
        }
    }

}
