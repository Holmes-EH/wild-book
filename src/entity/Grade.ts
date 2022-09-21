import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Skill } from './Skill'
import { Wilder } from './Wilder'
@Entity()
export class Grade {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	wilderId: number

	@Column()
	skillId: number

	@Column()
	grade: number

	@ManyToOne(() => Wilder, (wilder) => wilder.grades, {
		cascade: true,
		onDelete: 'CASCADE',
	})
	wilder: Wilder

	@ManyToOne(() => Skill, (skill) => skill.grades, {
		onDelete: 'CASCADE',
	})
	skill: Skill
}
