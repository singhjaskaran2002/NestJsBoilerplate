import {
	Table,
	Column,
	Model,
	Unique,
	Index,
	AllowNull,
} from 'sequelize-typescript';
import { roles } from 'src/common/utils/constants';

@Table({
	timestamps: true,
	tableName: 'users',
	paranoid: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	deletedAt: 'deleted_at',
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

	@Column({ defaultValue: roles.USER })
	role: string;
}
