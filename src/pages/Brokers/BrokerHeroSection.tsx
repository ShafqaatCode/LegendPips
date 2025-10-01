import styled from "styled-components";
import GirlImage from "../../assets/TranspaentBannerGirl.svg";

const BrokerHeroSection = () => {
    return (
        <Wrapper>
            <Content>
                {/* Left Section */}
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
                    <img src={GirlImage} alt="" />
                </Left>

                {/* Right Section */}
                <Right>

                    <ImageWrapper>
                        <Image src={GirlImage} alt="Girl pointing" />

                    </ImageWrapper>
                    <FeatureBox>
                        Featuring <Highlight>36,828</Highlight> brokers and{" "}
                        <Highlight>48</Highlight> different regulatory bodies
                    </FeatureBox>
                </Right>
            </Content>
           
        </Wrapper>
    );
};

export default BrokerHeroSection;

// ========== Styled Components ==========
const Wrapper = styled.section`
  padding: 4rem 2rem;
  background-color: #ffffff;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  max-width: 1250px;
  margin: auto;
  flex-wrap: wrap;
`;

const Left = styled.div`
 
`;

const Right = styled.div`
  flex: 0.8;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  border: 2px solid red;
  position: relative;
  
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #1f3b8c;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: #1f3b8c;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 1rem;
  color: #334155;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  border: 2px solid #e2e8f0;
  
`;

const Image = styled.img`

`;

const FeatureBox = styled.div`
  background-color: #1f3b8c;
  color: white;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-size: 20px;
  font-weight: 500;
  max-width: 400px;

  position: absolute;
  top: 20px;
  left: -80px;

  @media (max-width: 768px) {
    position: static;
    margin-top: 1rem;
  }
`;

const Highlight = styled.span`
  color: #fcd34d;
  font-weight: 700;
`;
