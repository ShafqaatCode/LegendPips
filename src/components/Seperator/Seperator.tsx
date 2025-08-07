import React from 'react'
import styled from 'styled-components'


const Wrapper = styled.div`
    height: 135px;
    @media (max-width: 768px)
    {
        height: 75px;
    }
`

const Seperator: React.FC = () => {
    return (
        <Wrapper>

        </Wrapper>
    )
}

export default Seperator;