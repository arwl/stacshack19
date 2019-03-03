import {Client, Delayed, Room} from "colyseus";
import {MOVES} from "../../definitions";
import {ArenaRoom} from "./ArenaRoom"
import {Player} from "./Player";
import {State} from "./State";

export class Battle extends Room {

    // onMessage(client: import("colyseus").Client, data: any): void {
    //     throw new Error("Method not implemented.");
    // }


    maxClients = 2;
    randomMoveTimeout: Delayed;
    private TURN_TIMEOUT: 10;

    onJoin(client: Client, options: any) {
        console.log(JSON.stringify({id: client.id, sessionId: client.sessionId}, null, 4));

        if (this.clients.length === 2) {
            const id1 = this.clients[0].id;
            const id2 = this.clients[1].id;
            this.state.battles[id1] = {};
            const battle = this.getBattle();
            for (const sessionId in this.state.entities) {
                const value = this.state.entities[sessionId];
                if (value instanceof Player && value.id === id1) {
                    console.log("added player 1");
                    battle.player1 = value;
                    continue;
                }
                if (value instanceof Player && value.id === id2) {
                    console.log("added player 2");
                    this.resetTimeOut();
                    battle.player2 = value;
                    continue;
                }

            }
            if (battle.player1 && battle.player2) {
                console.log("both users connected");
            }
            // lock this room for new users
            this.lock();
        }
    }

    private resetTimeOut() {
        this.randomMoveTimeout = this.clock.setTimeout(() => this.lose(), this.TURN_TIMEOUT * 1000);
    }

    finish() {
        if (resolveBattle.bind(this.getBattle())()) {
            const item = this.getBattle().loser.inventory.find(() => true);
            if (this.getBattle().winner.additem(item)) {
                console.log("winner got item");
                const index = this.getBattle().loser.inventory.findIndex((item1) => item1 === item);
                this.getBattle().loser.inventory[index] = null;
            }
            this.getBattle().loser.health -= 1;
            this.end();
            console.log("game over");
        } else {
            this.resetTimeOut();
            this.getBattle().player1Move = null;
            this.getBattle().player2Move = null;
        }
    }

    lose() {

        if (!this.getBattle().player1Move) {
            this.getBattle().player1.health -= 1;
        } else {
            this.getBattle().player2.health -= 1;
        }
        this.end();
    }

    private end() {
        this.getBattle().player1.inBattle = "no";
        this.getBattle().player1.x += 100;
        this.getBattle().player2.inBattle = "no";
        this.getBattle().player2.x -= 100;
    }

    onInit() {
        this.setState(State.getCurrentState());
        // this.setSimulationInterval(() => this.state.update());

    }

    requestJoin(options: any) {

        if (this.clients.length === 0) {
            return true;
        }

        let player1: Player = this.getBattle().player1;
        return player1.inBattle === options.id;

    }

    getBattle() {
        console.log(this.clients.length);
        if (this.clients.length === 0) {
            return null;
        } else if (this.clients.length === 1) {
            let battle = this.state.battles[this.clients[0].id];

            if (battle) {
                return battle;
            }
        } else if (this.clients.length === 2) {
            let battle1 = this.state.battles[this.clients[0].id];
            if (battle1) {
                return battle1;
            } else {
                return this.state.battles[this.clients[1].id];
            }

        } else {
            return null;
        }


    }

    onMessage(client: Client, message: any) {
        const [command, data] = message;
        console.log("message " + data);
        let battle = this.getBattle();
        if (!battle) {
            return;
        }
        if (!(battle.player1 && battle.player2)) {
            return;
        }
        const isPlayer1 = (battle.player1.id === client.id);


        // change angle
        if (command === "KEYBOARD" && (MOVES[data])) {
            isPlayer1 ? battle.player1Move = data : battle.player2Move = data;
            console.log((isPlayer1 ? "player 1" : "player 2") + " made move " + data);

            if (battle.player1Move && battle.player2Move) {
                console.log("both moves made");
                this.finish();
            }

        }
    }


}

function resolveBattle() {
    if (this.player1Move === this.player2Move) {
        this.player1Move = null;
        this.player2Move = null;
        return false;
    }

    if (this.player1Move === MOVES.ROCK) {
        if (this.player2Move === MOVES.PAPER) {
            this.winner = this.player2;
            this.loser = this.player1;
        } else {
            this.winner = this.player1;
            this.loser = this.player2;
        }
    } else if (this.player1Move === MOVES.PAPER) {
        if (this.player2Move === MOVES.SCISSORS) {
            this.winner = this.player2;
            this.loser = this.player1;
        } else {
            this.winner = this.player1;
            this.loser = this.player2;
        }
    } else if (this.player1Move === MOVES.SCISSORS) {
        if (this.player2Move === MOVES.ROCK) {
            this.winner = this.player2;
            this.loser = this.player1;
        } else {
            this.winner = this.player1;
            this.loser = this.player2;
        }
    }
    return true;
}
