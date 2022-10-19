import { ApolloError } from 'apollo-server'
import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import { Grade } from '../entity/Grade'
import { Skill } from '../entity/Skill'
import { Wilder } from '../entity/Wilder'
import dataSource from '../utils'

@InputType()
class AddGradesInput {
	@Field()
	skillId: number

	@Field()
	grade: number
}

@InputType()
class UpdateGradesInput extends AddGradesInput {
	@Field()
	id?: number
}

@InputType({ description: 'New Wilder data' })
class AddWilderInput {
	@Field()
	name: string

	@Field()
	city: string

	@Field()
	description: string

	@Field(() => [AddGradesInput])
	grades: AddGradesInput[]
}

@InputType({ description: 'Wilder Update data' })
class UpdateWilderInput extends AddWilderInput {
	@Field()
	id: number
}

@Resolver()
export class WilderResolver {
	@Query(() => [Wilder])
	async getAllWilders(): Promise<Wilder[]> {
		return await dataSource.manager.find(Wilder, {
			relations: {
				grades: {
					skill: true,
				},
			},
		})
	}

	@Mutation(() => Wilder)
	async addNewWilder(
		@Arg('data') data: AddWilderInput
	): Promise<Wilder | ApolloError> {
		// TODO : Check if wilder exists
		const newWilder = new Wilder()
		newWilder.name = data.name
		newWilder.city = data.city
		newWilder.description = data.description
		const savedWilder = await dataSource.manager.save(Wilder, newWilder)
		if (savedWilder !== null) {
			const newGrades: Grade[] = []
			await Promise.all(
				data.grades.map(async (grade: AddGradesInput) => {
					const skillToAdd = await dataSource.manager.findOneBy(
						Skill,
						{
							id: grade.skillId,
						}
					)
					if (skillToAdd !== null) {
						const newGrade = new Grade()
						newGrade.wilder = savedWilder
						newGrade.skill = skillToAdd
						newGrade.grade = grade.grade
						newGrades.push(newGrade)
					}
				})
			)
			await dataSource.manager.save(Grade, newGrades)
			const newWilder = await dataSource.manager.findOne(Wilder, {
				where: {
					id: savedWilder.id,
				},
				relations: {
					grades: {
						skill: true,
					},
				},
			})
			if (newWilder !== null) {
				return newWilder
			}
		} else {
			throw new ApolloError('Something went wrong !!')
		}

		return savedWilder
	}

	@Mutation(() => Wilder)
	async updateWilder(
		@Arg('data') data: UpdateWilderInput
	): Promise<Wilder | ApolloError> {
		const { id, name, city, description, grades } = data
		try {
			const wilderToUpdate = await dataSource.manager.findOneOrFail(
				Wilder,
				{
					where: { id },
					relations: {
						grades: {
							skill: true,
						},
					},
				}
			)

			wilderToUpdate.name = name
			wilderToUpdate.city = city
			wilderToUpdate.description = description
			await dataSource.manager.save(Wilder, wilderToUpdate)
			const newGrades: Grade[] = []
			await Promise.all(
				grades.map(async (grade: UpdateGradesInput) => {
					const gradeToUpdate = await dataSource.manager.findOne(
						Grade,
						{
							where: {
								skillId: grade.id,
								wilderId: wilderToUpdate.id,
							},
						}
					)
					if (gradeToUpdate !== null) {
						gradeToUpdate.grade = grade.grade
						await dataSource.manager.save(Grade, gradeToUpdate)
					} else {
						const skillToAdd = await dataSource.manager.findOneBy(
							Skill,
							{
								id: grade.id,
							}
						)
						if (skillToAdd !== null) {
							const newGrade = new Grade()
							newGrade.wilder = wilderToUpdate
							newGrade.skill = skillToAdd
							newGrade.grade = grade.grade
							newGrades.push(newGrade)
						}
					}
				})
			)
			await dataSource.manager.save(Grade, newGrades)
			const updatedWilder = await dataSource.manager.findOne(Wilder, {
				where: {
					id,
				},
				relations: {
					grades: {
						skill: true,
					},
				},
			})
			if (updatedWilder !== null) {
				return updatedWilder
			} else {
				throw new Error()
			}
		} catch (error: any) {
			throw new ApolloError(error.message)
		}
	}

	@Mutation(() => String)
	async deleteWilder(@Arg('id') id: number): Promise<String> {
		try {
			await dataSource.manager.delete(Wilder, id)
			return 'Deleted successfully'
		} catch (error: any) {
			throw new ApolloError(error.message)
		}
	}
}
