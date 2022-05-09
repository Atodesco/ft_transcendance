import { Channel } from "src/chat/entities/channel.entity";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
} from "typeorm";
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

	@Column("int", { array: true, default: [] })
	friends: number[];

	// @ManyToMany(() => Game)
	// @JoinTable()
	// game: Game[];

	@ManyToMany((type) => Channel, (channel) => channel.users, {
		cascade: true,
	})
	@JoinTable()
	channels: Channel[];

	@Column("int", { default: 0 })
	lvl: number;

	@Column("int", { array: true, default: [] })
	blockedusers: number[];
}
