import {Room, Client, Delayed} from "colyseus";
import {MOVES} from "../../definitions";
import {ArenaRoom} from "./ArenaRoom"
import {BattleState} from "./BattleState";
import {Entity} from "./Entity";
import {Item} from "./Item";
import {Player} from "./Player";
import {State} from "./State";

export class Battle<BattleState> extends ArenaRoom {

    // onMessage(client: import("colyseus").Client, data: any): void {
    //     throw new Error("Method not implemented.");
    // }


    maxClients = 2;
    randomMoveTimeout: Delayed;
    private TURN_TIMEOUT: 10;

    onJoin(client: Client, options: any) {

        if (this.clients.length == 2) {

            this.resetTimeOut();

            // lock this room for new users
            this.lock();
        }
    }

    private resetTimeOut() {
        this.randomMoveTimeout = this.clock.setTimeout(() => this.lose(), this.TURN_TIMEOUT * 1000);
    }

    finish() {
        if (this.state.resolveBattle()) {
            const item = this.state.loser.inventory.find(() => true);
            if (this.state.winner.additem(item)) {
                const index = this.state.loser.inventory.findIndex((item1) => item1 === item);
                this.state.loser.inventory[index] = null;
            }
            this.end();
        } else {
            this.resetTimeOut();
        }
    }

    lose() {

        if (!this.state.player1Move) {
            this.state.player1.health-=1;
        } else {
            this.state.player2.health-=1;
        }
        this.end();
    }

    private end() {
        this.state.player1.inBattle = "no";
        this.state.player2.inBattle = "no";
    }

    onInit() {
        this.setState(new BattleState());
    }

    requestJoin(options: any) {

        let player1: Player = this.state.player1;
        if (!player1) {
            return true;
        }

        let player2: Player = this.state.player2;
        return player1 && !player2 && player1.inBattle === options.clientId;

    }

    onMessage(client: Client, message: any) {

        const isPlayer1 = (this.state.player2.inBattle === client.sessionId);

        const [command, data] = message;

        // change angle
        if (command === "KEYBOARD") {
            isPlayer1 ? this.state.player1Move = data: this.state.player2Move = data;

            if (this.state.player1Move && this.state.player2Move) {
                this.finish();
            }

        }
    }


}
