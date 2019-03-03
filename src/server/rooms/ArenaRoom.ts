import {Room, Client} from "colyseus";
import {DOWN, LEFT, NONE, RIGHT, UP} from "../../definitions";
import {Entity} from "./Entity";
import {Player} from "./Player";
import {State} from "./State";

export class ArenaRoom extends Room {
    onInit() {
        this.setState(State.getCurrentState());
        this.setSimulationInterval(() => this.state.update());
    }

    onJoin(client: Client, options: any) {
        console.log("adding player");
        let found;
        for (const sessionId in this.state.entities) {
            const value = this.state.entities[sessionId];
            if (value instanceof Player && value.id === client.id) {
                console.log("found matching player");
                found = sessionId;
                break;
            }
        }
        if (!found) {
            this.state.createPlayer(client.sessionId, client.id);
        } else {
            const value = this.state.entities[found];
            delete this.state.entities[found];
            this.state.entities[client.sessionId] = value;
            console.log(this.state.entities[client.sessionId]);
        }
        console.log(`sessionId was ${found}`);
        console.log(`sessionId is ${client.sessionId}`);
    }

    onMessage(client: Client, message: any) {
        const entity = this.state.entities[client.sessionId];

        // // skip dead players
        if (!entity) {
            // console.log(client.id);
            return;
        }

        const [command, data] = message;

        // change angle
        if (command === "KEYBOARD") {
            let direction = new Entity(0, 0, 0, 0);

            if (data & UP) {
                direction.y += 1;
            }
            if (data & DOWN) {
                direction.y -= 1;
            }
            if (data & LEFT) {
                direction.x += 1;
            }
            if (data & RIGHT) {
                direction.x -= 1;
            }

            if (data === NONE) {
                entity.speed *= 0.9;
                return;
            }

            entity.speed = 5;
            entity.angle = Math.atan2(direction.y, direction.x);
            return;
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
