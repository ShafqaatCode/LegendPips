import styled from "styled-components";
import logo_white from "../../assets/icons/Logo_Svg.svg";
import { NavLink } from "react-router-dom";

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

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LogoContainer = styled.div`
// border: 2px solid red;
width: 350px;
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

  @media (max-width: 800px)
  {
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

const Footer2: React.FC = () => {
  return (
    <Section>
      <Container>
        <Grid>
          <LogoContainer>
            <a href="/">
              <LogoImage src={logo_white} alt="LegendPips" />
            </a>
            <Description>
              Join Legend Pips and unlock your Forex potential with expert
              guidance, secure trading, and real support.
            </Description>
          </LogoContainer>

          <LinkContainer>
            <LinkHeading>Company</LinkHeading>
            <LinkList>
              <LinkItem>
                <Link to="/about">About</Link>
              </LinkItem>
              <LinkItem>
                <Link to="/features">Features</Link>
              </LinkItem>
              <LinkItem>
                <Link to="/brokers">Brokers</Link>
              </LinkItem>
              <LinkItem>
                <Link to="/tools">Tools</Link>
              </LinkItem>
            </LinkList>
          </LinkContainer>

          <LinkContainer>
            <LinkHeading>Help</LinkHeading>
            <LinkList>
              <LinkItem>
                <Link to="/support">Customer Support</Link>
              </LinkItem>
              <LinkItem>
                <Link to="/delivery">Delivery Details</Link>
              </LinkItem>
              <LinkItem>
                <Link to="/terms">Terms & Conditions</Link>
              </LinkItem>
              <LinkItem>
                <Link to="/privacy">Privacy Policy</Link>
              </LinkItem>
            </LinkList>
          </LinkContainer>

          <NewsletterContainer>
            <NewsletterHeading>Newsletter</NewsletterHeading>
            <NewsletterForm>
              <NewsletterInput
                type="email"
                placeholder="Enter your email address"
              />
              <NewsletterButton type="submit">Subscribe Now</NewsletterButton>
            </NewsletterForm>
          </NewsletterContainer>
        </Grid>

        <Divider />
        <FooterText>
          © Copyright 2022, All Rights Reserved by LegendPips
        </FooterText>
      </Container>
    </Section>
  );
};

export default Footer2;
