import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserStatus } from "../../interfaces/user-status.enum";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: true })
	ft_id: number;

	@Column("text", { default: "" })
	username: string;

	@Column("text", { default: "empty" })
	picture: string;

	@Column("int", { default: 1000 })
	elo: number;

	@Column("int", { default: 0 })
	win: number;

	@Column("int", { default: 0 })
	lose: number;

	@Column("text", { default: "Offline" })
	status: UserStatus;
}
