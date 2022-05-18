import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Room, Vec2 } from "./interfaces/room.interface";
import { RoomService } from "./room.service";

@Injectable()
export class PongService {
	constructor(
		@Inject(forwardRef(() => RoomService)) private roomService: RoomService
	) {}

	velocity = (speed: number, radian: number): Vec2 => {
		return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };
	};

	updateBall(x: number, y: number, radian: number, room: Room): void {
		room.ball.position.x = x;
		room.ball.position.y = y;
		room.ball.velocity = this.velocity((room.ball.speed *= 1.01), radian);
		this.roomService.emit(room, "ball", room.ball.position);
	}

	resetBall(room: Room, left?: boolean): void {
		let radian = (Math.random() * Math.PI) / 2 - Math.PI / 4;
		if (left) radian += Math.PI;

		this.updateBall(50, 50, radian, room);
	}

	update(room: Room): any {
		const next = {
			x: room.ball.position.x + room.ball.velocity.x,
			y: room.ball.position.y + room.ball.velocity.y,
		};
		// sides + score
		if (next.x - room.ball.radius < 0 || next.x + room.ball.radius > 100) {
			if (next.x > room.ball.radius) {
				++room.players[0].score;
			} else {
				++room.players[1].score;
			}

			this.roomService.emit(
				room,
				"score",
				room.players.map((player) => player.score)
			);

			for (const player of room.players) {
				if (player.score === room.maxScore) {
					return this.roomService.stopGame(room, player);
				}
			}

			this.resetBall(room, next.x + room.ball.radius > 100);
		}
		// player 1
		if (
			next.y >= room.players[0].position.y - room.players[0].heightFromCenter &&
			next.y <= room.players[0].position.y + room.players[0].heightFromCenter
		)
			if (next.x - room.ball.radius < room.players[0].position.x)
				return this.updateBall(
					room.ball.position.x,
					room.ball.position.y,
					(Math.random() * Math.PI) / 2 - Math.PI / 4,
					room
				);
		//player 2
		if (
			next.y >= room.players[1].position.y - room.players[1].heightFromCenter &&
			next.y <= room.players[1].position.y + room.players[1].heightFromCenter
		)
			if (next.x + room.ball.radius > 100 - room.players[0].position.x)
				return this.updateBall(
					room.ball.position.x,
					room.ball.position.y,
					(Math.random() * Math.PI) / 2 - Math.PI / 4 + Math.PI,
					room
				);
		//floor n top
		if (next.y - room.ball.radius < 0 || next.y + room.ball.radius > 100) {
			room.ball.velocity.y *= -1;
		}
		//normal behavior
		room.ball.position.x += room.ball.velocity.x;
		room.ball.position.y += room.ball.velocity.y;
		this.roomService.emit(room, "ball", room.ball.position);
	}
}
