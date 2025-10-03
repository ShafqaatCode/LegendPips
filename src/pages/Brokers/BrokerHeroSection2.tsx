import styled from "styled-components";
import GirlImage from "../../assets/brokerbannergirl.jpg";

const Wrapper = styled.section`
  position: relative;
  background-color: #f9f8f8;
  max-width: 1400px;
  margin: 85px auto 0 auto;
  padding: 3rem 1rem;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    margin: 10px auto 0 auto;
    padding: 2rem 1rem;
  }
  
  @media (max-width: 768px) {
    margin: 0 auto 0 auto;
    padding: 0rem 1rem;
  }
`;

const MainContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  
  img {
    width: 100%;
    max-width: 650px;
    height: auto;
    object-fit: contain;
    position: relative;
    right: -40px;
  }

  @media (max-width: 1024px) {
    width: 45%;
    
    img {
      max-width: 500px;
      right: -20px;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const FeatureBox = styled.div`
  background-color: #132e58;
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 26px 26px 0px 26px;
  font-size: 24px;
  font-weight: 500;
  max-width: 450px;
  line-height: 1.5;
  z-index: 3;
  position: absolute;
  top: 0;
  right: 20%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 1200px) {
    right: 15%;
    font-size: 18px;
    padding: 1.25rem 1.5rem;
    max-width: 380px;
  }

  @media (max-width: 1024px) {
    right: 10%;
    font-size: 16px;
    padding: 1rem 1.25rem;
    max-width: 320px;
  }

  @media (max-width: 768px) {
    position: relative;
    right: auto;
    top: auto;
    margin: 2rem auto;
    max-width: 100%;
    font-size: 18px;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    padding: 1rem;
  }
`;

const Highlight = styled.span`
  color: #fcd34d;
  font-weight: 700;
`;

const Left = styled.div`
  position: relative;
  max-width: 950px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 2rem;
  z-index: 2;

  @media (max-width: 1024px) {
    max-width: 600px;
    padding-right: 1rem;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding-right: 0;
  }
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: 600;
  color: #132e58;
  margin-bottom: 2rem;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 40px;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 28px;
    margin-bottom: 1rem;
  }
`;

const Subtitle = styled.h3`
  font-size: 28px;
  font-weight: 400;
  margin: 2rem 0 1rem;
  color: #132e58;
  line-height: 1.3;

  @media (max-width: 1024px) {
    font-size: 24px;
  }

  @media (max-width: 768px) {
    font-size: 22px;
    margin: 1.5rem 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-size: 20px;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 1024px) {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const BrokerHeroSection2 = () => {
    return (
        <Wrapper>
            <FeatureBox>
                Featuring <Highlight>36,828</Highlight> brokers and{" "}
                <Highlight>48</Highlight> different regulatory bodies
            </FeatureBox>
            <MainContainer>
                <img src={GirlImage} alt="Professional broker representative" />
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


        </Wrapper>
    );
};

export default BrokerHeroSection2;