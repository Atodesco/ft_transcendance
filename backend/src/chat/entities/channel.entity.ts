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
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("text", { default: "" })
	channelname: string;

	@Column("boolean", { default: false })
	private: boolean;

	@Column("text", { default: "" })
	password: string;

	@Column("boolean", { default: false })
	dm: boolean;

	@ManyToOne(() => User, (user) => user.channel_owned, {
		cascade: true,
		nullable: true,
	})
	@JoinColumn({ name: "owner_id", referencedColumnName: "ft_id" })
	owner: User;

	@ManyToMany(() => User, { cascade: true })
	@JoinTable({
		name: "channel-admin",
		joinColumn: {
			name: "channel_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "user_id",
			referencedColumnName: "id",
		},
	})
	admins: User[];

	@ManyToMany(() => User, { cascade: true })
	@JoinTable({
		name: "channel-muted",
		joinColumn: {
			name: "channel_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "user_id",
			referencedColumnName: "id",
		},
	})
	muted: User[];

	// @Column("date", { array: true, default: [] })
	// mutedUntil: Date[];

	@ManyToMany(() => User, { cascade: true })
	@JoinTable({
		name: "channel-banned",
		joinColumn: {
			name: "channel_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "user_id",
			referencedColumnName: "id",
		},
	})
	banned: User[];

	// @Column("date", { array: true, default: [] })
	// bannedUntil: Date[];

	@ManyToMany((type) => User, (user) => user.channels, { cascade: true })
	@JoinTable({
		name: "channel-user",
		joinColumn: {
			name: "channel_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "user_id",
			referencedColumnName: "id",
		},
	})
	users: User[];
}
