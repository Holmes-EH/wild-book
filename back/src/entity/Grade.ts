import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Skill } from './Skill'
import { Wilder } from './Wilder'
@ObjectType()
@Entity()
export class Grade {
	@Field()
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	wilderId: number

	@Column()
	skillId: number

	@Field()
	@Column()
	grade: number

	@ManyToOne(() => Wilder, (wilder) => wilder.grades, {
		cascade: true,
		onDelete: 'CASCADE',
	})
	wilder: Wilder

	@Field()
	@ManyToOne(() => Skill, (skill) => skill.grades, {
		onDelete: 'CASCADE',
	})
	skill: Skill
}
