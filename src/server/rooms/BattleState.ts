import {MOVES} from "../../definitions";
import {Player} from "./Player";


export class BattleState {

    player1: Player;
    player2: Player;


    player1Move:MOVES;
    player2Move:MOVES;

    winner: Player;
    loser: Player;

    resolveBattle() {
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

}
