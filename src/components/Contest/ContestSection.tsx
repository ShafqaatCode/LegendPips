import React from "react";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import NetworkImg from "../../assets/FeaturesIcon/position.png"
import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg"


const MainWrapper = styled.main`
    /* height: 600px; */
    background-color: #fff;
   
    padding: 3rem 0;

`

const Container = styled.section`
    
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
    width: 95%;
    margin: auto;
    

`
const ImgWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    img{

    }
`

const ContestSection: React.FC = () => {
    return (
        <MainWrapper>

        <Container>

            <ImgWrapper>
                <img src={NetworkImg} alt="" />
            </ImgWrapper>
            <SectionHeadingSet subText="Join our exciting trading contest designed for both new and experienced traders. Make the most profit during the contest period and take home huge cash prizes! Track your rank live and beat the best in the game." mainHeading="Exciting trading Contest " upperText="All in one trading platform" />

            <ButtonBase fontSize="16px">View Details<img width="24px" src={ArrowIcon} alt="Icon" /></ButtonBase>


        </Container>
        </MainWrapper>
    )
}

export default ContestSection;