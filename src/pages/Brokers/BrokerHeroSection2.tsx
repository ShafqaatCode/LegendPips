import styled from "styled-components";
import GirlImage from "../../assets/brokerbannergirl.jpg";
const Wrapper = styled.section`
    height: 500px;
    
    position: relative;
    background-color: #f9f8f8;
    /* width: 98%; */
    max-width: 1400px;
    overflow: hidden;
    margin: 100px auto 0 auto;
    /* padding: 10px; */
    
    
    
`

const MainContainer = styled.div`
position: relative;
    height: 100%;
    img{
        width: 650px;
        
        height: auto;
        position: absolute;
        right: -40px;
        bottom: 0;
        z-index: 1;

    }

    @media (max-width: 768px) {
        img{
            display: none;
        }   
    }
`

const FeatureBox = styled.div`
  background-color: #132e58;
  color: white;
  padding: 1rem 2rem;
  border-radius: 26px 26px 0px 26px;
  font-size: 24px;
  font-weight: 500;
  max-width: 450px;
  z-index: 3;
  line-height: 54px;

  position: absolute;
  top: 0px;
  right: 20%;

  @media (max-width: 768px) {
    position: static;
    margin-top: 1rem;
  }
`;


const Highlight = styled.span`
  color: #fcd34d;
  font-weight: 700;
`;
const Left = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 z-index: 2;
 max-width: 950px;
 display: flex;
 flex-direction: column;
 justify-content: center;
 padding: 1rem;
    height: 100%;
`;

const Subtitle = styled.h3`
  font-size: 28px;
  font-weight: 400;
  margin: 1.5rem 0 1rem;
  color: #132e58;
`;

const Description = styled.p`
  font-size: 20px;
  font-weight: 300;
  line-height: 30px;
  margin-bottom: 1rem;
  
  color: ${({ theme }) => theme.colors.primary};
  
`;



const Title = styled.h2`
  font-size: 48px;
  font-weight: 600;
  color: #132e58;
  margin-bottom: 5rem;
`;


const BrokerHeroSection2 = () => {
    return (
        <Wrapper>
            <MainContainer>
                <img src={GirlImage} alt="" />
            </MainContainer>
            <Left>
                <Title>Trusted Brokers</Title>

                <Description>
                    We partner only with regulated and reputable brokers who adhere to the
                    highest industry standards. Our listed brokers are carefully vetted to
                    ensure transparency, security, and fair trading conditions — giving you
                    the confidence to trade in a safe and reliable environment.
                </Description>

                <Subtitle>
                    Facing any issue with our recommended broker? Submit a report.
                </Subtitle>

                <Description>
                    If you experience any problems or have concerns regarding a broker, we
                    encourage you to submit a detailed report. Our dedicated support team will
                    thoroughly review your submission, investigate the matter, and take the
                    necessary steps to ensure your trading experience remains secure and fair.
                </Description>
            </Left>
            <FeatureBox>
                Featuring <Highlight>36,828</Highlight> brokers and{" "}
                <Highlight>48</Highlight> different regulatory bodies
            </FeatureBox>
        </Wrapper>
    );
}

export default BrokerHeroSection2