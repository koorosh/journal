import React from 'react'
import { Link } from 'react-router-dom'

interface HomeProps {

}

export const Home: React.FC<HomeProps> = (props: HomeProps) => {
  return (
    <>
      <Link to={'/attendance'}>Відвідуваність</Link>
    </>
  )
}
