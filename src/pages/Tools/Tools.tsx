import React from 'react'
import styled from 'styled-components'
import ComingSoon from '../ComminSoon/CommingSoon'


const Container = styled.div`
margin-top: 135px;
  height: 600px;
  color : black;
  border: 2px solid red;
`

const Tools: React.FC = () => {
  return (

    <Container>
     <ComingSoon />
      {/* Additional content for Tools page can be added here */}
    </Container>

  )
}

export default Tools;