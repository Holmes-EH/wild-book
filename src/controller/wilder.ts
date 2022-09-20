const dataSource = require('../utils').dataSource
const Skill = require('../entity/Skill')
const Wilder = require('../entity/Wilder')
const Grades = require('../entity/Grades')

//source of asyncForEach : https://gist.github.com/Atinux/fd2bcce63e44a7d3addddc166ce93fb2
const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}

module.exports = {
	create: async (req, res) => {
		try {
			const { name, city, description, grades } = req.body
			const newWilder = {
				name,
				description,
				city,
			}
			const wilder = await dataSource
				.getRepository(Wilder)
				.save(newWilder)
			if (grades && grades.length > 0) {
				asyncForEach(grades, async (grade) => {
					const skill = await dataSource
						.getRepository(Skill)
						.findOneBy({ id: grade.id })
					await dataSource.getRepository(Grades).save({
						wilder,
						skill,
						grade: grade.votes,
					})
				})
			}
			res.status(201).send({ message: 'Wilder Created !', data: wilder })
		} catch (error) {
			console.error('Error ->', error)
			res.status(500).send(`Error while creating Wilder : ${error}`)
		}
	},
	findAll: async (req, res) => {
		try {
			const wilders = await dataSource.getRepository(Wilder).find({
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
			const { id, name, city, description, grades } = req.body
			const wilderToUpdate = await dataSource
				.getRepository(Wilder)
				.findOneBy({ id: id })
			if (wilderToUpdate === null) {
				res.status(404).send('Wilder Not found')
			} else {
				wilderToUpdate.skills = []
				try {
					if (grades && grades.length > 0) {
						asyncForEach(grades, async (grade) => {
							const gradeToUpdate = await dataSource
								.getRepository(Grades)
								.findOneBy({ id: grade.id })
							gradeToUpdate.grade = grade.votes
							await dataSource
								.getRepository(Grades)
								.save(gradeToUpdate)
						})
					}
					wilderToUpdate.name = name
					wilderToUpdate.city = city
					wilderToUpdate.description = description
					const updatedWilder = await dataSource
						.getRepository(Wilder)
						.save(wilderToUpdate)

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
			const { id, skillName } = req.body
			const wilderToUpdate = await dataSource
				.getRepository(Wilder)
				.findOneBy({ id: id })
			if (wilderToUpdate === null) {
				res.status(404).send('Wilder Not found')
			} else {
				const skillToAdd = await dataSource
					.getRepository(Skill)
					.findOneBy({ name: skillName })
				// console.log(skillToAdd)
				if (skillToAdd === null) {
					res.status(404).send('Skill not found.')
				} else {
					wilderToUpdate.skills = [
						...wilderToUpdate.skills,
						skillToAdd,
					]
					const updatedWilder = await dataSource
						.getRepository(Wilder)
						.save(wilderToUpdate)
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
			const deletedWilder = await dataSource
				.getRepository(Wilder)
				.delete(id)
			console.log(deletedWilder)
			if (deletedWilder.affected === 0)
				res.status(404).send('Could not delete. Wilder not found')
			res.status(202).send('Wilder deleted successfully')
		} catch (error) {
			console.error(error)
			res.status(500).send(`Error while deleting Wilder : ${error}`)
		}
	},
}
