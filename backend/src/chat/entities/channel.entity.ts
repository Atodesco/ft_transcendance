import { User } from "src/user/entities/user.entity";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinTable,
	JoinColumn,
	ManyToMany,
	OneToMany,
} from "typeorm";
import { Message } from "./message.entity";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("text", { default: "" })
	channelname: string;

	@Column("boolean", { default: false })
	private: boolean;

	@Column("text", { default: "" })
	password: string;

	@ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
	@JoinColumn({ referencedColumnName: "ft_id" })
	owner: User;

	@OneToMany(() => Message, (message) => message.channel)
	@JoinColumn()
	message: Message[];

	@ManyToMany((type) => User, (user) => user.channels)
	@JoinTable({
		name: "user-channels", // table name for the junction table of this relation
		joinColumn: {
			name: "id", // name of the column in the junction table
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "ft_id", // name of the column in the junction table
			referencedColumnName: "ft_id",
		},
	})
	users: User[];

	@ManyToMany((type) => User, (user) => user.channels)
	@JoinTable()
	mutedusers: User[];
}
