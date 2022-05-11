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

	@Column("int", { array: true, default: [] })
	blocked: number[];

	// @ManyToMany(() => Game)
	// @JoinTable({
	// 	name: "user-game", // table name for the junction table of this relation
	// 	joinColumn: {
	// 		name: "ft_id", // name of the column in the junction table
	// 		referencedColumnName: "ft_id",
	// 	},
	// 	inverseJoinColumn: {
	// 		name: "id", // name of the column in the junction table
	// 		referencedColumnName: "id",
	// 	},
	// })
	// game: Game[];

	// @ManyToMany((type) => Channel, (channel) => channel.users, {
	// 	cascade: true,
	// })
	// @JoinTable({
	// 	name: "user-channels", // table name for the junction table of this relation
	// 	joinColumn: {
	// 		name: "ft_id", // name of the column in the junction table
	// 		referencedColumnName: "ft_id",
	// 	},
	// 	inverseJoinColumn: {
	// 		name: "id", // name of the column in the junction table
	// 		referencedColumnName: "id",
	// 	},
	// })
	// channels: Channel[];

	@Column("int", { default: 0 })
	lvl: number;
}
