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
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("text", { default: "" })
	message: string;

	@Column()
	date: Date;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ referencedColumnName: "ft_id" })
	user: User;
}
