import React from "react";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import NetworkImg from "../../assets/FeaturesIcon/network.png"
import ButtonBase from "../SharedComponents/Button";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg"
import { useLocale } from "../../contexts/LocaleContext";


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

const CommunitySection: React.FC = () => {
    const { t } = useLocale();
    return (
        <MainWrapper>

        <Container>

            <ImgWrapper>
                <img src={NetworkImg} alt="" />
            </ImgWrapper>
            <SectionHeadingSet subText={t("community.body")} mainHeading={t("community.title")} upperText={t("community.kicker")} />

            <ButtonBase fontSize="16px">{t("contests.view")}<img width="24px" src={ArrowIcon} alt="" /></ButtonBase>


        </Container>
        </MainWrapper>
    )
}

export default CommunitySection;