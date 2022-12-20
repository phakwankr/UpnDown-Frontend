import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Activity from './Activity';
import Alert from './Alert';
import Wrapper from '../assets/wrappers/ActivitiesContainer';
import PageBtnContainer from './PageBtnContainer';

const ActivitiesContainer = () => {
  const {
    getActivities,
    activities,
    page,
    totalActivities,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
    showAlert,
  } = useAppContext();
  useEffect(() => {
    getActivities();
    // eslint-disable-next-line
  }, [page, search, searchStatus, searchType, sort]);

  if (activities.length === 0) {
    return (
      <Wrapper>
        <h2>No activities to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalActivities} activity{activities.length > 1 && 's'} found
      </h5>
      <div className='activities'>
        {activities.map((activity) => {
          return <Activity key={activity._id} {...activity} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default ActivitiesContainer;
