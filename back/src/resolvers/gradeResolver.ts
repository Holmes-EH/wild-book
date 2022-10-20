import { ApolloError } from 'apollo-server'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { Grade } from '../entity/Grade'
import { Wilder } from '../entity/Wilder'
import { Skill } from '../entity/Skill'
import dataSource from '../utils'

@Resolver()
export class GradeResolver {
	@Mutation(() => String)
	async addNewGrade(
		@Arg('wilderId') wilderId: number,
		@Arg('skillId') skillId: number,
		@Arg('grade') grade: number
	): Promise<String> {
		try {
			const wilder = await dataSource.manager.findOneByOrFail(Wilder, {
				id: wilderId,
			})
			const skill = await dataSource.manager.findOneByOrFail(Skill, {
				id: skillId,
			})
			const newGrade = new Grade()
			newGrade.wilder = wilder
			newGrade.skill = skill
			newGrade.grade = grade
			await dataSource.manager.save(Grade, newGrade)
			return 'Grade Added'
		} catch (error: any) {
			throw new ApolloError('Something went terribly wrong', error)
		}
	}
}
