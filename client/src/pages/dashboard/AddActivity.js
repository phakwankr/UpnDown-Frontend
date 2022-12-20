import { FormRow, FormRowSelect, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddActivity = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    ActivityName,
    Description,
    activityTypeOptions,
    activityType,
    activityOptions,
    handleChange,
    clearValues,
    createActivity,
    editActivity,
  } = useAppContext()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!ActivityName || !Description || !activityOptions) {
      displayAlert()
      return
    }
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
        <h3>{isEditing ? 'edit activity' : 'add activity'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          {/* Activity Name */}
          <FormRow
            type='text'
            name='Activity Name'
            value={ActivityName}
            handleChange={handleActivityInput}
          />
          {/* activity description */}
          <FormRow
            type='text'
            name='Activity description'
            value={Description}
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
          {/* btn container */}
          <div className='btn-container'>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
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
