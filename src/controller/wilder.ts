/* eslint-disable @typescript-eslint/restrict-template-expressions */
import AppDataSource from '../utils'
import {
	IController,
	IIncomingGrade,
	IIncomingWilder,
} from '../interfaces/interfaces'

import { Skill } from '../entity/Skill'
import { Wilder } from '../entity/Wilder'
import { Grade } from '../entity/Grade'

const wilderRepository = AppDataSource.getRepository(Wilder)
const skillRepository = AppDataSource.getRepository(Skill)
const gradeRepository = AppDataSource.getRepository(Grade)

const wilderController: IController = {
	create: async (req, res) => {
		try {
			const { name, city, description, grades }: IIncomingWilder =
				req.body
			const newWilder = {
				name,
				description,
				city,
			}
			const wilderExists = await wilderRepository.findOneBy({ name })
			if (wilderExists !== null) {
				res.status(400).send('Wilder exists, consider updating !')
			} else {
				const savedWilder = await wilderRepository.save(newWilder)
				const wilder = await wilderRepository.save(savedWilder)
				if (wilder !== null) {
					await Promise.all(
						grades.map(async (grade: IIncomingGrade) => {
							const skillToAdd = await skillRepository.findOneBy({
								id: grade.id,
							})
							if (skillToAdd !== null) {
								const newGrade = new Grade()
								newGrade.wilder = wilder
								newGrade.skill = skillToAdd
								newGrade.grade = grade.grade
								await gradeRepository.save(newGrade)
							}
						})
					)
					const newWilder = await wilderRepository.findOne({
						where: {
							id: savedWilder.id,
						},
						relations: {
							grades: {
								skill: true,
							},
						},
					})
					res.status(201).send({
						message: 'Wilder Created !',
						newWilder,
					})
				}
			}
		} catch (error) {
			console.error('Error ->', error)
			res.status(500).send(`Error while creating Wilder : ${error}`)
		}
	},
	findAll: async (req, res) => {
		try {
			const wilders = await wilderRepository.find({
				relations: {
					grades: {
						skill: true,
					},
				},
			})
			if (wilders.length > 0) {
				res.status(200).send(wilders)
			} else {
				res.status(404).send('No Wilders found ...')
			}
		} catch (error) {
			console.error(error)
			res.status(500).send(`Error fetching Wilders : ${error}`)
		}
	},
	update: async (req, res) => {
		try {
			const { id, name, city, description, grades }: IIncomingWilder =
				req.body
			const wilderToUpdate = await wilderRepository.findOne({
				where: { id },
				relations: {
					grades: {
						skill: true,
					},
				},
			})
			if (wilderToUpdate === null) {
				res.status(404).send('Wilder Not found')
			} else {
				try {
					wilderToUpdate.name = name
					wilderToUpdate.city = city
					wilderToUpdate.description = description
					await wilderRepository.save(wilderToUpdate)
					await Promise.all(
						grades.map(async (incomingGrade: IIncomingGrade) => {
							const gradeToUpdate = await gradeRepository.findOne(
								{
									where: {
										skillId: incomingGrade.id,
									},
								}
							)
							if (gradeToUpdate !== null) {
								gradeToUpdate.grade = incomingGrade.grade
								await gradeRepository.save(gradeToUpdate)
							} else {
								const skillToAdd =
									await skillRepository.findOneBy({
										id: incomingGrade.id,
									})
								if (skillToAdd !== null) {
									const newGrade = new Grade()
									newGrade.wilder = wilderToUpdate
									newGrade.skill = skillToAdd
									newGrade.grade = incomingGrade.grade
									await gradeRepository.save(newGrade)
								}
							}
						})
					)
					const updatedWilder = await wilderRepository.findOne({
						where: {
							id,
						},
						relations: {
							grades: {
								skill: true,
							},
						},
					})
					res.status(200).send({
						message: 'Wilder Updated',
						updatedWilder,
					})
				} catch (error) {
					console.log(error)
					res.status(500).send(
						`An error occured updating Wilder : ${error}`
					)
				}
			}
		} catch (error) {
			console.error(error)
			res.status(500).send(`Error while updating Wilder : ${error}`)
		}
	},
	addSkill: async (req, res) => {
		try {
			const { wilderId, skillId, grade } = req.body
			const wilderToUpdate = await wilderRepository.findOneBy({
				id: wilderId,
			})
			if (wilderToUpdate === null) {
				res.status(404).send('Wilder Not found')
			} else {
				const skillToAdd = await skillRepository.findOneBy({
					id: skillId,
				})

				if (skillToAdd === null) {
					res.status(404).send('Skill not found.')
				} else {
					const newGrade = new Grade()
					newGrade.wilder = wilderToUpdate
					newGrade.skill = skillToAdd
					newGrade.grade = grade
					wilderToUpdate.grades = [...wilderToUpdate.grades, newGrade]
					const updatedWilder = await wilderRepository.save(
						wilderToUpdate
					)
					res.status(200).send(updatedWilder)
				}
			}
		} catch (error) {
			console.error(error)
			res.status(500).send(
				`Error while adding skill to Wilder : ${error}`
			)
		}
	},
	delete: async (req, res) => {
		try {
			const { id } = req.body
			const deletedWilder = await wilderRepository.delete(id)
			console.log(deletedWilder)
			if (deletedWilder.affected === 0) {
				res.status(404).send('Could not delete. Wilder not found')
			} else {
				res.status(202).send('Wilder deleted successfully')
			}
		} catch (error) {
			console.error(error)
			res.status(500).send(`Error while deleting Wilder : ${error}`)
		}
	},
}

export default wilderController
