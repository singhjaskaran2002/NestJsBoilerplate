import { Table, Column, Model } from 'sequelize-typescript';
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
	@Column
	email: string;

	@Column({ type: 'text' })
	password: string;

	@Column({ type: 'text', field: 'profile_picture' })
	profilePicture: string;

	@Column
	name: string;

	@Column({ defaultValue: roles.USER })
	role: string;
}
