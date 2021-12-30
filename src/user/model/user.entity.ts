import { Table, Column, Model } from 'sequelize-typescript';

@Table({
	timestamps: true,
	tableName: 'Users',
	paranoid: true,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	deletedAt: 'deletedAt',
})
export class User extends Model {
	@Column
	email: string;

	@Column({ type: 'text' })
	password: string;

	@Column({ type: 'text' })
	profilePicture: string;

	@Column
	name: string;

	@Column({ defaultValue: 'user' })
	role: string;
}
