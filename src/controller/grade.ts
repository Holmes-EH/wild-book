const dataSource = require('../utils').dataSource
const Skill = require('../entity/Skill')
const Wilder = require('../entity/Wilder')
const Grades = require('../entity/Grades')

module.exports = {
	noteSkill: async (req, res) => {
		try {
			const { wilderId, skillId, grade } = req.body

			const wilder = await dataSource
				.getRepository(Wilder)
				.findOneBy({ id: wilderId })
			const skill = await dataSource
				.getRepository(Skill)
				.findOneBy({ id: skillId })

			await dataSource.getRepository(Grades).save({
				wilder,
				skill,
				grade,
			})

			res.status(200).send('Grade added')
		} catch (error) {
			console.error(error)
			res.status(500).send(
				`Error while adding note to skill on Wilder : ${error}`
			)
		}
	},
}
