/* eslint-disable @typescript-eslint/restrict-template-expressions */
import AppDataSource from '../utils'
import { IController } from '../interfaces/interfaces'

import { Skill } from '../entity/Skill'
import { Wilder } from '../entity/Wilder'
import { Grade } from '../entity/Grade'

const wilderRepository = AppDataSource.getRepository(Wilder)
const skillRepository = AppDataSource.getRepository(Skill)
const gradeRepository = AppDataSource.getRepository(Grade)

const gradeController: IController = {
	noteSkill: async (req, res) => {
		try {
			const { wilderId, skillId, grade } = req.body

			const wilder = await wilderRepository.findOneBy({
				id: wilderId,
			})
			const skill = await skillRepository.findOneBy({
				id: skillId,
			})
			if (wilder !== null && skill !== null) {
				await gradeRepository.save({
					wilderId: wilder.id,
					skillId: skill.id,
					grade,
				})
			} else {
				throw new Error('Wilder && Skill cannot be null')
			}

			res.status(200).send('Grade added')
		} catch (error) {
			console.error(error)
			res.status(500).send(
				`Error while adding note to skill on Wilder : ${error}`
			)
		}
	},
}

export default gradeController
