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
  padding: clamp(2.5rem, 6vw, 3.5rem) ${({ theme }) => theme.typography.pageGutter};
  background-color: #ffffff;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(1.25rem, 3vw, 2rem);
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  flex-wrap: wrap;
`;

const Left = styled.div`
 
`;

const Right = styled.div`
  flex: 0.8;
  display: flex;
  justify-content: center;
  position: relative;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sectionTitle};
  line-height: ${({ theme }) => theme.typography.sectionTitleLh};
  font-weight: 700;
  color: #1f3b8c;
  margin: 0 0 0.75rem;
`;

const Subtitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.panelSectionTitle};
  font-weight: 600;
  margin: 1rem 0 0.65rem;
  color: #1f3b8c;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body};
  line-height: 1.65;
  margin: 0 0 0.75rem;
  color: #334155;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const Image = styled.img``;

const FeatureBox = styled.div`
  background-color: #1f3b8c;
  color: white;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 500;
  max-width: min(22rem, 100%);

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
