import styled from "styled-components";
import { Link } from "react-router-dom";
import GirlImage from "../../assets/brokerbannergirl.jpg";
import { useLocale } from "../../contexts/LocaleContext";

const Wrapper = styled.section`
  background: #f8fafc;
  border-bottom: 1px solid #e8eaef;
`;

const Inner = styled.div`
  position: relative;
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: clamp(1.25rem, 3vw, 2rem) ${({ theme }) => theme.typography.pageGutter}
    clamp(1.75rem, 4vw, 2.75rem);
  box-sizing: border-box;
`;

const StatsBar = styled.div`
  background-color: #132e58;
  color: #ffffff;
  padding: 0.75rem 1.1rem;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.typography.caption};
  font-weight: 500;
  line-height: 1.45;
  max-width: min(22rem, 100%);
  box-shadow: 0 2px 12px rgba(19, 46, 88, 0.18);
  margin-left: auto;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    max-width: 100%;
  }
`;

const Highlight = styled.span`
  color: #fcd34d;
  font-weight: 700;
`;

const ContentRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(140px, 38%);
  gap: 1.25rem 1.75rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`;

const Copy = styled.div`
  position: relative;
  z-index: 2;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.heroTitle};
  font-weight: 600;
  color: #132e58;
  margin: 0 0 1rem;
  line-height: ${({ theme }) => theme.typography.heroTitleLh};
`;

const Subtitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.panelSectionTitle};
  font-weight: 500;
  margin: 1.25rem 0 0.65rem;
  color: #132e58;
  line-height: 1.35;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.lead};
  font-weight: 400;
  line-height: 1.6;
  margin: 0 0 0.75rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body};
  }
`;

const ReportLink = styled(Link)`
  display: inline-flex;
  margin-top: 0.35rem;
  background: #132e58;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  &:hover {
    background: #1a3d6e;
  }
`;

const Figure = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  min-height: 0;

  img {
    width: 100%;
    max-width: min(420px, 100%);
    height: auto;
    object-fit: contain;
    display: block;
    margin-bottom: -0.25rem;
  }

  @media (max-width: 768px) {
    justify-content: center;
    order: -1;

    img {
      max-width: 260px;
      margin: 0 auto 0.5rem;
    }
  }
`;

const BrokerHeroSection2 = () => {
  const { t } = useLocale();
  return (
    <Wrapper>
      <Inner>
        <StatsBar>
          Featuring <Highlight>36,828</Highlight> brokers and <Highlight>48</Highlight> different regulatory
          bodies
        </StatsBar>

        <ContentRow>
          <Copy>
            <Title>{t("brokers.title")}</Title>

            <Description>
              {t("brokers.body1")}
            </Description>

            <Subtitle>{t("brokers.subtitle")}</Subtitle>

            <Description>
              {t("brokers.body2")}
            </Description>
            <ReportLink to="/complaints">{t("brokers.report")}</ReportLink>
          </Copy>

          <Figure>
            <img src={GirlImage} alt="Professional broker representative" />
          </Figure>
        </ContentRow>
      </Inner>
    </Wrapper>
  );
};

export default BrokerHeroSection2;
