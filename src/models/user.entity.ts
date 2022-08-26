import {
	Table,
	Column,
	Model,
	Unique,
	Index,
	AllowNull,
} from 'sequelize-typescript';

@Table({
	timestamps: true,
	tableName: 'Users',
	paranoid: true,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	deletedAt: 'deletedAt',
})
export class User extends Model {
	@Index('email_idx')
	@Column
	email: string;

	@Column({ type: 'text' })
	password: string;

	@Column
	name: string;

	@AllowNull
	@Column({ field: 'profile_picture', type: 'text' })
	profilePicture: string;

	@Index('username_idx')
	@Unique
	@Column
	username: string;

	@Column({ defaultValue: 'user' })
	role: string;
}
