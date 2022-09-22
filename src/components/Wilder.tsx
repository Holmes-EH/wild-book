import blank_profile from '../assets/blank_profile.png'
import Skill from './Skill'
import { IWilderProps } from '../interfaces/interfaces'
import axios from 'axios'

const Wilder = ({
	id,
	name,
	city,
	description,
	grades,
	setAddNewWilder,
	setWilderToEdit,
	wilders,
	setWilders,
}: IWilderProps) => {
	const handleDelete = async () => {
		await axios.delete('http://localhost:5000/api/wilders', {
			data: { id: id },
		})
		setWilders(wilders.filter((wilder) => wilder.id !== id))
	}
	const handleEdit = () => {
		setWilderToEdit({
			isEditing: true,
			editName: name,
			editCity: city,
			editDescription: description,
			editGrades: grades,
			editId: id,
		})

		setAddNewWilder(true)
	}

	return (
		<article className='card'>
			<img src={blank_profile} alt='Jane Doe Profile' />
			<h3>{name}</h3>
			<h4>{city}</h4>
			<p style={{ flexGrow: '1' }}>{description}</p>
			<h4>Wild Skills</h4>
			<ul className='skills'>
				{grades.map((grade, index) => {
					return (
						<Skill
							key={`${name}-skill-${index}`}
							id={grade.id}
							title={grade.title}
							votes={grade.votes}
						/>
					)
				})}
			</ul>
			<div className='actions'>
				<button onClick={handleEdit}>Edit</button>
				<button onClick={handleDelete}>Delete</button>
			</div>
		</article>
	)
}

export default Wilder
