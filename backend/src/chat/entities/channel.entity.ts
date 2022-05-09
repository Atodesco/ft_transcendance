import { User } from "src/user/entities/user.entity";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinTable,
	JoinColumn,
	ManyToMany,
} from "typeorm";

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

	// @OneToMany(() => Message, { onDelete: "CASCADE", eager: true })
	// @JoinColumn()
	// message: Message[];

	@ManyToMany((type) => User, (user) => user.channels)
	@JoinTable()
	users: User[];

	@ManyToMany((type) => User, (user) => user.channels)
	@JoinTable()
	mutedusers: User[];
}
