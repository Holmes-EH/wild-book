const dataSource = require('../utils').dataSource
const Skill = require('../entity/Skill')

module.exports = {
	create: async (req, res) => {
		try {
			await dataSource.getRepository(Skill).save(req.body)
			res.status(201).send('Skill Created !')
		} catch (error) {
			console.error('Error ->', error)
			res.status(500).send(`Error while creating Skill : ${error}`)
		}
	},
	findAll: async (req, res) => {
		try {
			const skills = await dataSource.getRepository(Skill).find()
			if (skills.length > 0) {
				res.status(200).send(skills)
			} else {
				res.status(404).send('No skills found ...')
			}
		} catch (error) {
			console.error(error)
			res.status(500).send(`Error fetching Skills : ${error}`)
		}
	},
	update: async (req, res) => {
		try {
			const { id, name } = req.body
			const skillToUpdate = await dataSource
				.getRepository(Skill)
				.findOneBy({ id: id })
			if (skillToUpdate === null) {
				res.status(404).send('Skill not found')
			} else {
				try {
					const updatedSkill = await dataSource
						.getRepository(Skill)
						.save(req.body)
					//.update(id, { name: name })
					res.status(200).send(updatedSkill)
				} catch (error) {
					res.status(500).send(
						`An error occured updating skill : ${error}`
					)
				}
			}
		} catch (error) {
			console.error(error)
			res.status(500).send(`Error while updating skill : ${error}`)
		}
	},
	delete: async (req, res) => {
		try {
			const { id } = req.body
			const deletedSkill = await dataSource
				.getRepository(Skill)
				.delete(id)
			if (deletedSkill.affected === 0) {
				res.status(404).send('Could not delete. Skill not found')
			} else {
				res.status(202).send('Skill deleted successfully')
			}
		} catch (error) {
			console.error(error)
			res.status(500).send(`Error while deleting skill : ${error}`)
		}
	},
}
