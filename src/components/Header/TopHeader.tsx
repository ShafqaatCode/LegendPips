import React from 'react'
import styled from 'styled-components';
import LogoImg from '../../assets/icons/Logo.svg'
import { NavLink } from 'react-router-dom';



const TopContainer = styled.section`
    height: 4rem;
    background-color: ${({theme}) => theme.colors.primary};
    border-bottom: 1px solid ${({theme}) => theme.colors.secondary};
    
`

const HeaderLinkButton =  styled(NavLink)`

`

const Logo = styled.img`
    min-width:7rem;
`

const TopHeader: React.FC = () => {

    ;
    return (
        <TopContainer>
            <HeaderLinkButton to='/'>
                <Logo src={LogoImg} alt='LegendPips' />
            </HeaderLinkButton>
        </TopContainer>
    )
}

export default TopHeader;