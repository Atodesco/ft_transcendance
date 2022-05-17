import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Socket } from "socket.io";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { Player, Room, State } from "./interfaces/room.interface";

@Injectable()
export class PongService {
	constructor(
		private rooms: Map<string, Room> = new Map(),
		private queue: Array<Player> = [],
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	createRoom(code: string = null): Room {
		while (!code) {
			const length = 10;
			const generated = Math.floor(
				Math.random() * Math.pow(16, length)
			).toString(16);
			if (!this.rooms.has(generated)) code = generated;
		}

		const room: Room = {
			code,
			state: State.WAITING,
			players: [],
			ball: { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, speed: 20 },
		};
		this.rooms.set(code, room);
		return room;
	}

	getRoom(code: string): Room {
		return this.rooms.get(code);
	}

	removeRoom(code: string) {
		this.rooms.delete(code);
	}

	getPlayer(ft_id: number): Player {
		for (const room of this.rooms.values()) {
			for (const player of room.players) {
				if (player.ft_id == ft_id) {
					return player;
				}
			}
		}
		return null;
	}

	getRoomForUser(ft_id: number): Room {
		const rooms = Array.from(this.rooms.values());
		const room = rooms.find(
			(room) => !!room.players.find((player) => player.ft_id == ft_id)
		);
		if (!room) throw new HttpException("Room not found", HttpStatus.NOT_FOUND);

		return room;
	}

	emit(room: Room, event: string, ...args: any): void {
		for (const player of room.players) {
			player.socket.emit(event, ...args);
		}
		if (room.spectators) {
			for (const spectator of room.spectators) {
				spectator.emit(event, ...args);
			}
		}
	}

	async removeSocket(player?: Player, spectator?: Socket): Promise<any> {
		if (this.queue.indexOf(player) !== -1) {
			return this.queue.splice(this.queue.indexOf(player), 1);
		}

		for (const room of this.rooms.values()) {
			if (
				room.spectators &&
				spectator &&
				room.spectators.indexOf(spectator) !== -1
			) {
				return room.spectators.splice(room.spectators.indexOf(spectator), 1);
			}

			for (const p of room.players) {
				if (player.ft_id === p.ft_id) {
					await this.stopGame(
						room,
						room.players.find((player1) => player1.ft_id !== player.ft_id)
					);
					room.players.splice(room.players.indexOf(player), 1);
					break;
				}
			}
			if (!room.players.length) {
				return this.rooms.delete(room.code);
			}
		}
	}

	addQueue(player: Player): void {
		for (const p of this.queue) {
			if (player.ft_id === p.ft_id) {
				return;
			}
		}
		if (this.getPlayer(player.ft_id)) {
			return;
		}

		this.queue.push(player);
		if (this.queue.length < 2) {
			return;
		}

		const room: Room = this.createRoom();
		while (this.queue.length && room.players.length < 2)
			this.joinRoom(room, this.queue.shift());
	}

	async joinRoom(
		room: Room,
		player?: Player,
		spectator?: Socket
	): Promise<void> {
		if (room.state == State.WAITING && player) {
			room.players.push(player);
			if (room.players.length == 2) {
				room.state = State.STARTING;
				const p1Username = await this.userRepository.findOne({
					ft_id: room.players[0].ft_id,
				});
				const p2Username = await this.userRepository.findOne({
					ft_id: room.players[1].ft_id,
				});
				room.players.map((p) => {
					p.socket.emit("room", {
						code: room.code,
						p1Username: p1Username.username,
						p2Username: p2Username.username,
					});
				});
			}
		} else {
			if (!room.spectators) {
				room.spectators = [];
			}
			if (spectator) {
				room.spectators.push(spectator);

				// spectator.emit("ready"); // send les usernames des autres joueurs
				spectator.emit("room", room.code);
			}
		}
	}

	startGame(room: Room): void {
		if (room.state != State.STARTING) {
			return;
		}
		room.state = State.COUNTDOWN;

		this.emit(
			room,
			"ready"
			// room.players.map((player) => player.user)
		); // send les usernames des autres joueurs
	}

	startCalc(room: Room): void {
		if (room.state != State.COUNTDOWN) {
			return;
		}

		// this.pong.resetBall(room);
		room.state = State.INGAME;
	}

	@Interval(1000 / 60)
	loop(): void {
		for (const room of this.rooms.values()) {
			if (room.state == State.INGAME) {
				// this.pong.update(room);
			}
		}
	}

	async stopGame(room: Room, player: Player): Promise<void> {
		if (!player || room.state === State.END) {
			return;
		}
		room.state = State.END;

		if (room.players.length == 2) {
			const loser = room.players.find(
				(player1) => player1.ft_id != player.ft_id
			);
			const winner = player;
			const score = room.players.map((player) => player.score);

			// await this.userService.updateRank(winner, loser);
			// await this.userService.createMatchHistory({
			// 	score,
			// 	winner,
			// 	loser,
			// } as Match);
		}

		this.emit(room, "stop", player);
	}
}
