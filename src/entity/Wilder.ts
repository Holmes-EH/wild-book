import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { Grade } from './Grade'

@ObjectType()
@Entity()
export class Wilder {
	@Field()
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column()
	name: string

	@Field()
	@Column()
	description: string

	@Field()
	@Column()
	city: string

	@Field(() => [Grade])
	@OneToMany(() => Grade, (grade) => grade.wilder)
	grades: Grade[]
}
