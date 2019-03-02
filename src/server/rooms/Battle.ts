import { Room, Client } from "colyseus";
import { ArenaRoom } from "./ArenaRoom"
import { Entity } from "./Entity";

export class Battle extends ArenaRoom {

    // onMessage(client: import("colyseus").Client, data: any): void {
    //     throw new Error("Method not implemented.");
    // }

    maxClients = 2;

    requestJoin(options: any) {
        let currentEntities = (this.state.getCurrentState().entities as Map<string, Entity>)
        if (currentEntities.size === 0) {
            return true;
        } else {
            currentEntities.forEach((e) => {

            });
        }
        return true;
    }

    onMessage(client: Client, message: any) {
        const entity = this.state.entities[client.sessionId];
    }

}