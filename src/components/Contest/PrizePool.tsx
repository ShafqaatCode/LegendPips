import React from "react";
import styled from "styled-components";
import { FaInfoCircle, FaClock, FaFlagCheckered } from "react-icons/fa";

interface PrizePoolProps {
    description: string;
    prizes: string[];
    startDate: string;
    closeDate: string;
    totalPrize: string;
}

const PrizePoolCard: React.FC<PrizePoolProps> = ({
    description,
    prizes,
    startDate,
    closeDate,
    totalPrize,
}) => {
    return (
        <Card>
            <Header>
                <FaInfoCircle size={28} />
                <h3>Prize pool for this competition</h3>
            </Header>
            <Wrapper>



                <Description>{description}</Description>

                <PrizeList>
                    {prizes.map((prize, idx) => (
                        <li key={idx}>{prize}</li>
                    ))}
                </PrizeList>

                <Footer>
                    <FooterItem>
                        <FaClock color="#f59e0b" />
                        <span>
                            Start Date:<strong>{startDate}</strong>
                        </span>
                    </FooterItem>
                    <FooterItem>
                        <FaClock color="#f59e0b" />
                        <span>
                            Close Date:<strong>{closeDate}</strong>
                        </span>
                    </FooterItem>
                    <FooterItem>
                        <FaFlagCheckered color="#374151" />
                        <span>
                            Total Prize Pool:<strong>{totalPrize}</strong>
                        </span>
                    </FooterItem>
                </Footer>
            </Wrapper>
        </Card>
    );
};

export default PrizePoolCard;

// ---------------- Styled Components ----------------

const Wrapper = styled.div`
    padding: 0 1rem;

    @media (max-width: 768px)
    {
      padding: 0 0.5rem;
      border: 2px solid red;
    }
`

const Card = styled.div`
  background-color: #fff;

  padding: 1.5rem;
  color: #0f172a;
  /* max-width: 900px; */
  margin: 0.5rem ;
  

  @media (max-width: 768px)
  {
    padding: 1rem;
    
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #132e58;
  margin-bottom: 0.5rem;

  h3 {
    font-size:24px;
    font-weight: 500;
  }
`;

const Description = styled.p`
  font-size: 20px;
  color: #132e58;
  margin-bottom: 1rem;
  font-weight: 400;

   @media (max-width: 768px)
  {
    font-size: 1rem;
    
  }
`;

const PrizeList = styled.ul`
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;

  li {
    margin-bottom: 0.3rem;
    font-size: 1rem;
    font-weight: 400;
  }

   @media (max-width: 768px)
  {
    li{
      font-size: 14px;
    }
    
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 1rem;
  color: #000000;

  span {
    
    
    font-weight: 300;
    
  }

  strong{
    margin-left: 7px;
  }
  

   @media (max-width: 768px)
  {
    font-size: 14px;
    
  }
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

