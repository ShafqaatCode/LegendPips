import React from "react";
import styled from "styled-components";

interface TradingCardProps {
  logo: string;
  title: string;
  features: string[];
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

const Card = styled.div`
  background: #fff;
  border-radius: 33px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px 10px;
  text-align: center;
  width: 100%;
  max-width: 452px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 500px;
  border: 1px solid #0000004D;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: auto;
    padding: 16px 8px;
  }
`;

const Outerbox = styled.div`
  
  padding: 08px 20px;
`

const Logo = styled.img`
  width: 150px;
  height: auto;
  margin: 0 auto 16px;
`;

const Title = styled.h3`
  color: #d69e2e;
  font-weight: 700;
  font-size: clamp(1.25rem, 1.2vw + 0.8rem, 1.6rem);
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const Features = styled.ul`
  list-style: disc;
  padding-left: 20px;
  text-align: left;
  
  color: #132e58;
  font-size: 16px;
  line-height: 30px;
  font-weight: 400;

  li {
    /* margin-bottom: 6px; */
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: #132e58;
  line-height: 30px;

  margin: 15px 0;
  
  

`;

const Button = styled.a`
  display: inline-block;
  padding: 10px 18px;
  background-color: #132e58;
  color: #fff;
  font-weight: 500;
  border-radius: 30px;
  text-decoration: none;
  transition: background 0.3s ease;
  width: 222px;
  margin:10px auto;

  &:hover {
    background-color: #2a4365;
  }
`;

const TradingCard: React.FC<TradingCardProps> = ({
  logo,
  title,
  features,
  description,
  buttonText = "Open Account",
  buttonLink = "#",
}) => {
  return (
    <Card>
      <div>
        <Outerbox>

          <Logo src={logo} alt={title} />
          <Title>{title}</Title>
          <Features>
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </Features>
        </Outerbox>
        <Description>{description}</Description>
      </div>
      <Button href={buttonLink}>{buttonText}</Button>
    </Card>
  );
};

export default TradingCard;
