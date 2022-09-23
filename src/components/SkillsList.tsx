import { useState, useEffect } from 'react'
import axios from 'axios'

import styles from '../css/skillsList.module.css'

interface Skill {
	id: number
	title: string
}

const SkillsList = () => {
	const [skills, setSkills] = useState<Skill[]>([])
	const [changesOccured, setChangesOccured] = useState(false)

	useEffect(() => {
		const getSkills = async () => {
			const { data } = await axios.get('http://localhost:5000/api/skills')
			setSkills(data)
		}
		getSkills()
	}, [])

	const handleAddSkill = () => {
		const newSkillArray = [...skills]
		newSkillArray.unshift({ id: skills.length + 1, title: '' })
		setSkills(newSkillArray)
	}

	const updateSkill = (id: number, title: string) => {
		const newSkills = [...skills]
		newSkills[skills.findIndex((skill) => skill.id === id)].title = title
		setSkills(newSkills)
	}

	const handleSave = async () => {
		const { data } = await axios.post('http://localhost:5000/api/skills', {
			skills,
		})
		console.log(data)
	}

	return (
		<div>
			<div className={styles.topActions}>
				<button onClick={handleAddSkill} className={styles.addButton}>
					Add a skill
				</button>
				{changesOccured && (
					<button className={styles.saveButton} onClick={handleSave}>
						Save changes
					</button>
				)}
			</div>
			<div className={styles.inputs}>
				{skills.map((skill) => {
					return (
						<input
							key={skill.id}
							value={skill.title}
							placeholder='Enter skill title'
							onChange={(e) => {
								setChangesOccured(true)
								updateSkill(skill.id, e.target.value)
							}}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default SkillsList
