import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Grade } from './Grade'

@Entity()
export class Skill {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	title: string

	@OneToMany(() => Grade, (grade) => grade.skill)
	grades: Grade[]
}
