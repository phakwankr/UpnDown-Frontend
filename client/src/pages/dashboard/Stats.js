import { useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { StatsContainer, ChartsContainer } from '../../components'

const Stats = () => {
  const { showStats, monthlyActivity } = useAppContext()

  useEffect(() => {
    showStats()
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <StatsContainer />
      {monthlyActivity.length > 0 && <ChartsContainer />}
    </>
  )
}

export default Stats
