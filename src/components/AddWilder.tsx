import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from '../css/addWilder.module.css'
import Skill from './Skill'
import { ISkill, IWilderToEdit } from '../interfaces/interfaces'

const AddWilder = ({
	isEditing,
	setWilderToEdit,
	editId,
	editName,
	editCity,
	editDescription,
	editGrades,
}: IWilderToEdit) => {
	const [id, setId] = useState(editId)
	const [name, setName] = useState(editName || '')
	const [city, setCity] = useState(editCity || '')
	const [description, setDescription] = useState(editDescription || '')
	const [skills, setSkills] = useState<ISkill[]>([])

	const [wildersGrades, setWildersGrades] = useState<ISkill[]>(
		isEditing ? editGrades : []
	)
	const [addingNewGrade, setAddingNewGrade] = useState(false)
	const [newGradeGrade, setNewGradeGrade] = useState(0)
	const [newGradeId, setNewGradeId] = useState(0)

	const handleAddGrade = () => {
		const newGradeToAdd = skills.filter((el) => el.id === newGradeId)[0]
		if (newGradeToAdd !== null) {
			const newGrade = {
				votes: newGradeGrade,
				title: newGradeToAdd.title,
				id: newGradeToAdd.id,
			}
			console.log(newGrade)

			setWildersGrades([...wildersGrades, newGrade])
			setAddingNewGrade(false)
			setNewGradeGrade(0)
			setNewGradeId(0)
		}
	}

	useEffect(() => {
		const getSkills = async () => {
			const { data } = await axios.get('http://localhost:5000/api/skills')
			setSkills(data)
		}
		getSkills()
	}, [])

	const handleSubmit = async () => {
		const gradesToSend = wildersGrades.map((grade) => {
			return {
				id: grade.id,
				title: grade.title,
				grade: grade.votes,
			}
		})
		if (isEditing) {
			try {
				const { data } = await axios.put(
					'http://localhost:5000/api/wilders',
					{
						id,
						name,
						city,
						description,
						grades: gradesToSend,
					}
				)
				console.log(data)
			} catch (error) {
				console.log(error)
			}
		} else {
			try {
				const { data } = await axios.post(
					'http://localhost:5000/api/wilders',
					{
						name,
						city,
						description,
						grades: gradesToSend,
					}
				)
				console.log(data)
			} catch (error) {
				console.log(error)
			}
		}
		setWilderToEdit({})
		// window.location.reload()
	}

	return (
		<form
			className={`${styles.form} card`}
			onSubmit={(e) => e.preventDefault()}
		>
			<h3>Add a new wilder</h3>
			<fieldset className={styles.fieldset}>
				<label className={styles.labels} htmlFor='name'>
					Name :
				</label>
				<input
					type='text'
					title='name'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</fieldset>
			<fieldset className={styles.fieldset}>
				<label className={styles.labels} htmlFor='city'>
					City :
				</label>

				<input
					type='text'
					title='city'
					value={city}
					onChange={(e) => setCity(e.target.value)}
				/>
			</fieldset>
			<fieldset className={styles.fieldset}>
				<label className={styles.labels} htmlFor='description'>
					Description :{' '}
				</label>
				<textarea
					value={description}
					cols={30}
					rows={10}
					onChange={(e) => setDescription(e.target.value)}
				></textarea>
			</fieldset>
			<h4>Skills</h4>
			<ul className='skills'>
				{wildersGrades.map((grade, index) => {
					return (
						<Skill
							key={`${name}-skill-${grade.id}`}
							title={grade.title}
							votes={grade.votes}
						/>
					)
				})}
			</ul>
			<button
				onClick={() => {
					setAddingNewGrade(!addingNewGrade)
				}}
			>
				Add new skill
			</button>
			{addingNewGrade && (
				<div style={{ display: 'flex', gap: '10px' }}>
					<select
						name='skill'
						value={newGradeId}
						onChange={(e) => {
							setNewGradeId(parseInt(e.target.value))
						}}
					>
						<option value={0} disabled>
							{' '}
							Choose a skill{' '}
						</option>
						{skills.map((skill) => {
							return (
								<option
									key={'option-' + skill.title}
									value={skill.id}
								>
									{skill.title}
								</option>
							)
						})}
					</select>
					<label htmlFor='newGrade'>Grade : </label>
					<input
						type='number'
						name='newGrade'
						value={newGradeGrade}
						min={0}
						max={10}
						onChange={(e) => {
							setNewGradeGrade(parseInt(e.target.value))
						}}
					/>

					<button
						onClick={handleAddGrade}
						disabled={newGradeGrade === 0}
					>
						Addskill
					</button>
				</div>
			)}
			<button onClick={handleSubmit}>Save Wilder</button>
		</form>
	)
}

export default AddWilder
