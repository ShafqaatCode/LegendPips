import styled from "styled-components";
import type { FC } from "react";
import logo_white from "../../assets/icons/Logo_Svg.svg";
import { NavLink } from "react-router-dom";
import { FaChevronUp } from "react-icons/fa";
import { useLocale } from "../../contexts/LocaleContext";

const GotoStart = styled.a`
  display: block;
  /* margin-top: 1.5rem; */
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #102443;
  border: none;
  text-align: center;
  
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #102443ee;
  }
`;

const Section = styled.section`
  padding: 3rem 5rem;
  background-color: ${({ theme }) => theme.colors.primary};
 

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
 
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
//   border: 2px solid red;
  text-align: center;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    text-align: left;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LogoContainer = styled.div`
  // border: 2px solid red;
  width: 350px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LogoImage = styled.img`
  width: 150px;
  height: auto;
`;

const Description = styled.p`
  margin-top: 1.25rem;
  font-size: 1rem;
  color: #ffffff;
  line-height: 1.6;
`;

const LinkContainer = styled.div`
  // border: 2px solid red;
`;

const LinkHeading = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
`;

const LinkList = styled.ul`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 800px) {
    gap: 0.8rem;
  }
`;

const LinkItem = styled.li``;

const Link = styled(NavLink)`
  font-size: 1rem;
  color: #ffffff;
  transition: color 0.2s ease;

  &:hover {
    color: #de992f;
  }
`;

const NewsletterContainer = styled.div``;

const NewsletterHeading = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
`;

const NewsletterForm = styled.form`
  margin-top: 1.5rem;
`;

const NewsletterInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #111827;
  background: #fff;
  border-radius: 0.375rem;
  border: none;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #de992f33;
  }

  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const NewsletterButton = styled.button`
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: #de992f;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: #cc872b;
  }

  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const Divider = styled.hr`
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #334155; // soft divider color
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: #ffffff;
  //   border: 2px solid red;
`;

const Description2 = styled.p`
  margin-top: 1.25rem;
  font-size: 14px;
  color: #ffffff;
  line-height: 30px;
  text-align: center;
`;


const Footer2: FC = () => {
  const { t } = useLocale();
  return (
    <>
      <GotoStart href="#top"><FaChevronUp size="1.3rem" /></GotoStart>
      <Section>

        <Container>
          <Grid>
            <LogoContainer>
              <a href="/">
                <LogoImage src={logo_white} alt="LegendPips" />
              </a>
              <Description>
                {t("footer.blurb")}
              </Description>
            </LogoContainer>

            <LinkContainer>
              <LinkHeading>{t("footer.company")}</LinkHeading>
              <LinkList>
                <LinkItem>
                  <Link to="/about">{t("footer.about")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/features">{t("footer.features")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/brokers">{t("footer.brokers")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/tools">{t("footer.tools")}</Link>
                </LinkItem>
              </LinkList>
            </LinkContainer>

            <LinkContainer>
              <LinkHeading>{t("footer.help")}</LinkHeading>
              <LinkList>
                <LinkItem>
                  <Link to="/complaints">{t("footer.complaintCenter")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/support">{t("footer.support")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/delivery">{t("footer.delivery")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/legal/terms">{t("footer.terms")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/legal/privacy">{t("footer.privacy")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/legal/risk-disclosure">{t("footer.risk")}</Link>
                </LinkItem>
                <LinkItem>
                  <Link to="/legal/cashback-terms">{t("footer.cashback")}</Link>
                </LinkItem>
              </LinkList>
            </LinkContainer>

            <NewsletterContainer>
              <NewsletterHeading>{t("footer.newsletter")}</NewsletterHeading>
              <NewsletterForm>
                <NewsletterInput
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                />
                <NewsletterButton type="submit">{t("footer.subscribe")}</NewsletterButton>
              </NewsletterForm>
            </NewsletterContainer>
          </Grid>

          <Divider />
          <Description2>
            LegendPips does not provide accounts to residents of the United States. The content of this website is not intended for individuals in any country or jurisdiction where such distribution or use would violate local laws or regulations.
          </Description2>
          <Description2>
            Trading foreign exchange involves significant risk and may not be appropriate for all investors. The use of leverage can increase both potential gains and potential losses. Before engaging in forex trading, assess your investment objectives, trading experience, and risk appetite. You should be prepared to lose some or all of your invested capital. Only trade with money you can afford to lose. Make sure you understand the risks involved and, if necessary, seek independent financial or tax advice. All information provided is for educational purposes only and should not be considered investment advice.
          </Description2>


          <Divider />
          <FooterText>
            © Copyright 2022, All Rights Reserved by LegendPips
          </FooterText>
        </Container>
      </Section>
    </>
  );
};

export default Footer2;
