import React from 'react';
import styled from 'styled-components';
import CountDown from '../CountdownTimer/CountdownTimer';


interface ContestCardProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  eventInfo: string;
  endTime: Date;
  registrationDeadline: string;
  sponsorUrl: string;
  sponsorText: string;
}

const ContestCard: React.FC<ContestCardProps> = ({
  imageSrc,
  title,
  subtitle,
  eventInfo,
  endTime,
  registrationDeadline,
  sponsorUrl,
  sponsorText,
}) => {
  return (
    <CardContainer>
      <LeftSection>
        <BannerImage src={imageSrc} alt="Contest" />
        <TextInfo>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
          <EventInfo>{eventInfo}</EventInfo>
        </TextInfo>
      </LeftSection>

      <RightSection>
        <CountdownLabel>This contest ends in:</CountdownLabel>
        <CountDown endTime={endTime} />
        <RegisterText>
          Registration Ends: <strong>{registrationDeadline}</strong>
        </RegisterText>
        <SponsorText>
          Sponsored by:{' '}
          <a href={sponsorUrl} target="_blank" rel="noopener noreferrer">
            {sponsorText}
          </a>
        </SponsorText>
      </RightSection>
    </CardContainer>
  );
};

export default ContestCard;

// Styled Components
const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: #f7f9fc;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  gap: 1rem;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex: 1;
  min-width: 250px;
`;

const BannerImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
`;

const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  color: #0d1b3d;
  margin: 0;
`;

const Subtitle = styled.h3`
  font-size: 1rem;
  color: #243a73;
  margin: 0.3rem 0;
`;

const EventInfo = styled.p`
  color: #6c7a96;
  font-size: 0.9rem;
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 240px;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const CountdownLabel = styled.span`
  font-size: 0.9rem;
  color: #1b2a47;
  margin-bottom: 0.4rem;
`;

const RegisterText = styled.div`
  font-size: 0.9rem;
  color: #1b2a47;
`;

const SponsorText = styled.div`
  font-size: 0.85rem;
  color: #6c7a96;

  a {
    color: #f5a623;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
