import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "../../interfaces/user-status.enum";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("text", { default: "" })
	username: string;

	@Column("text", { default: "empty" })
	profile_picture: string;

	// @Column("int", { default: 1000 })
	// elo: number;

	@Column("int", { default: 0 })
	game_won: number;

	@Column("int", { default: 0 })
	lost_game: number;

	@Column("text", { default: "Offline" })
	status: UserStatus;
}
