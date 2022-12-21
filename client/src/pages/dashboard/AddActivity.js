import { FormRow, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
  
const AddActivity = () => {
  const {
    isLoading,
    isEditing,
    activityName,
    description,
    activityType,
    activityTypeOptions,
    activityDuration,
    createAt,
    handleChange,
    clearValues,
    createActivity,
    editActivity,
  } = useAppContext()

  const handleCreate = (e) => {
    e.preventDefault()


    if (isEditing) {
      editActivity()
      return
    }
    createActivity()
  }
  const handleActivityInput = (e) => {
    const name = e.target.name
    const value = e.target.value
    handleChange({ name, value })
  }

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit activity' : 'Create Your Activity'}</h3>
        <div className='form-center'>
          
          {/* Activity's Name */}
          <FormRow
            type='text'
            name='Activity Name'
            value={activityName}
            handleChange={handleActivityInput}
          />
          {/* activity type */}
          <FormRowSelect
            name='activityType'
            labelText='activity type'
            value={activityType}
            handleChange={handleActivityInput}
            list={activityTypeOptions}
          />
          {/* description */}
          <FormRow
            type='text'
            name='description'
            value={description}
            handleChange={handleActivityInput}
          />
          {/* Duration */}
          <FormRow
            type='number'
            labelText='activity duration'
            name='activityDuration'
            value={activityDuration}
            handleChange={handleActivityInput}
          />
          {/* Date */}
          <FormRow
            type='date'
            labelText='date'
            name='date'
            value={createAt}
            handleChange={handleActivityInput}
          />
          {/* btn container */}
          <div className='btn-container'>
            <button
              type='Create'
              className='btn btn-block submit-btn'
              onClick={handleCreate}
              disabled={isLoading}
            >
              create
            </button>
            <button
              className='btn btn-block clear-btn'
              onClick={(e) => {
                e.preventDefault()
                clearValues()
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddActivity