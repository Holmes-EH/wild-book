import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Grade } from './Grade'

@Entity()
export class Wilder {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	description: string

	@Column()
	city: string

	@OneToMany(() => Grade, (grade) => grade.wilder)
	grades: Grade[]
}
