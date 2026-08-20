import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import NetworkImg from "../../assets/FeaturesIcon/position.png";
import ArrowIcon from "../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg";
import { useLocale } from "../../contexts/LocaleContext";


const MainWrapper = styled.main`
    /* height: 600px; */
    background-color: #fff;
    padding: 3rem 0;
/* border: 2px solid red; */
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
`;

const ViewDetailsLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem 2rem;
  font-size: 16px;
  font-weight: 500;
  border-radius: 30px;
  border: 2px solid transparent;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  font-family: ${({ theme }) => theme.font.family};
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    max-width: 320px;
  }
`;

const ContestSection: React.FC = () => {
    const { t } = useLocale();
    return (
        <MainWrapper>

            <Container>

                <ImgWrapper>
                    <img src={NetworkImg} alt="" />
                </ImgWrapper>
                <SectionHeadingSet subText={t("contests.body")} mainHeading={t("contests.heading")} upperText={t("contests.kicker")} />

                <ViewDetailsLink to="/contests">
                  {t("contests.view")}
                  <img width="24" height="24" src={ArrowIcon} alt="" aria-hidden />
                </ViewDetailsLink>


            </Container>
        </MainWrapper>
    )
}

export default ContestSection;