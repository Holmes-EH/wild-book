import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

import { Grade } from './Grade'

@ObjectType()
@Entity()
export class Skill {
	@Field()
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column()
	title: string

	@OneToMany(() => Grade, (grade) => grade.skill)
	grades: Grade[]
}
