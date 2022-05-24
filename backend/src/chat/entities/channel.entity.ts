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
	PrimaryColumn,
	BaseEntity,
} from "typeorm";

@Entity()
export class Channel extends BaseEntity {
	@PrimaryColumn()
	id: number;

	@Column("text", { default: "" })
	channelname: string;

	@Column("boolean", { default: false })
	private: boolean;

	@Column("text", { default: "" })
	password: string;

	@Column("boolean", { default: false })
	dm: boolean;

	@ManyToOne(() => User, { onDelete: "CASCADE", eager: true, nullable: true })
	@JoinColumn({ referencedColumnName: "ft_id" })
	owner: User;

	@Column("int", { array: true, default: [] })
	admins: number[];

	@Column("int", { array: true, default: [] })
	muted: number[];

	@Column("text", { array: true, default: [] })
	mutedUntil: Date[];

	@Column("int", { array: true, default: [] })
	banned: number[];

	@Column("text", { array: true, default: [] })
	bannedUntil: Date[];

	@ManyToMany((type) => User, { cascade: true })
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

	@ManyToMany((type) => User, { cascade: true })
	@JoinTable({
		name: "muteduser-channel", // table name for the junction table of this relation
		joinColumn: {
			name: "id", // name of the column in the junction table
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "ft_id", // name of the column in the junction table
			referencedColumnName: "ft_id",
		},
	})
	mutedusers: User[];
}
