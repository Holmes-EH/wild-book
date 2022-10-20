import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import styles from '../css/skillsList.module.css'

interface Skill {
	id: number
	title: string
}

const GET_SKILLS = gql`
	query getAllSkills {
		getAllSkills {
			id
			title
		}
	}
`

const ADD_NEW_SKILL = gql`
	mutation createSkill($title: String!) {
		createSkill(title: $title)
	}
`

const SkillsList = () => {
	const [skills, setSkills] = useState<Skill[]>([])
	const [newSkill, setNewSkill] = useState('')
	const [changesOccured, setChangesOccured] = useState(false)

	const [createNewSkill] = useMutation(ADD_NEW_SKILL, {
		refetchQueries: [{ query: GET_SKILLS }, 'getAllSkills'],
	})

	const { loading, error, data } = useQuery(GET_SKILLS)

	const handleAddSkill = () => {
		createNewSkill({
			variables: {
				title: newSkill,
			},
		})
		setNewSkill('')
	}

	const updateSkill = (id: number, title: string) => {
		const newSkills = [...skills]
		newSkills[skills.findIndex((skill) => skill.id === id)].title = title
		setSkills(newSkills)
	}

	const handleSave = async () => {
		console.log(skills)
	}

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error :(</p>

	return (
		<div>
			<div className={styles.topActions}>
				<div>
					<button
						onClick={handleAddSkill}
						className={styles.addButton}
					>
						Add a skill
					</button>
					<input
						type='text'
						value={newSkill}
						onChange={(e) => setNewSkill(e.target.value)}
						className={styles.newSkillInput}
					/>
				</div>
				{changesOccured && (
					<button className={styles.saveButton} onClick={handleSave}>
						Save changes
					</button>
				)}
			</div>
			<div className={styles.inputs}>
				{data.getAllSkills.map((skill: Skill) => {
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
