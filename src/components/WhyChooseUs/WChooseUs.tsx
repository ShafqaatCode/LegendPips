import styled from "styled-components";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";
import ThumsUpIcon from "../../assets/icons/Image-1.svg";
import GrothImg from "../../assets/icons/GrothImg.svg";
import ButtonBase from "../SharedComponents/Button";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion"

const WorkSectionWrapper = styled.section`
  padding: 0rem 2rem;
  width: 100%;
  background-color: white;
  padding-top: 3rem;
  overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin: auto;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    align-items: center;
    text-align: center;
    padding: 0 1rem;
  }
`;

const PointBox = styled(motion.div)`
  display: flex;
  color: #303030;
  gap: 10px;

  h2 {
    font-family: Inter;
    font-weight: 500;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0%;
  }

  p {
    font-family: Inter;
    font-weight: 300;
    font-size: 12px;
    max-width: 420px;
    padding: 0.5rem 0;
  }

  img {
   height: 48px;
    min-width: 48px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    text-align: center;

    p {
      max-width: 100%;
    }

    
  }
`;

const ImageContainer = styled.div`
  img {
    height: 450px;
    width: 450px;
    object-fit: contain;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    img {
      height: 250px;
      width: auto;
    }
  }
`;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  }),
}

const ChoosUs: React.FC = () => {
  return (
    <WorkSectionWrapper>
      <SectionHeadingSet
        upperText="All in one trading Platform"
        mainHeading="Why Choose Us"
        subText="Discover why traders worldwide trust us as their top choice. With a focus on delivering
        consistent profits, exceptional service, cuttng-edge technology."
      />

      <Wrapper>
        <ContentContainer>
          <PointBox custom={0} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} >
            <img src={ThumsUpIcon} alt="Icon" />
            <div>
              <h2>Excellent customer service</h2>
              <p>
                We prioritize your satisfaction and profit. Our professional
                customer service team is always here to help you.
              </p>
            </div>
          </PointBox>
          <PointBox custom={1} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} >
            <img src={ThumsUpIcon} alt="Icon" />
            <div>
              <h2>Fast Withdrawal Process</h2>
              <p>
                Enjoy quick and secure withdrawals with no hassle — your money,
                when you need it.
              </p>
            </div>
          </PointBox>
          <PointBox custom={2} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <img src={ThumsUpIcon} alt="Icon" />
            <div>
              <h2>Trusted by Traders</h2>
              <p>
                Join thousands of satisfied traders who benefit from our tools,
                services, and support.
              </p>
            </div>
          </PointBox>
          <ButtonBase width="200px" fontSize="16px">
            Read More <FaArrowAltCircleUp />
          </ButtonBase>
        </ContentContainer>

        <ImageContainer>
          <img src={GrothImg} alt="Growth" />
        </ImageContainer>
      </Wrapper>
    </WorkSectionWrapper>
  );
};

export default ChoosUs;
