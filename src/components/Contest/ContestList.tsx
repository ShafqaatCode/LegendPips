import styled from 'styled-components';
import { contests } from '../../data/global_data';
import { FaGreaterThan } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const ContestList = () => {
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1200);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <Container>
      <Heading>Elite Skills Contest on the Web We Never Ask for Real Money!</Heading>

      {isMobile ? (
        <CardWrapper>
          {contests.map((contest, idx) => (
            <Card key={idx} ended={contest.ended}>
              <TopSection>
                <Logo src={contest.logo} />
                <TitleGroup>
                  <Title>{contest.title}</Title>
                  <Sponsor>{contest.sponsor}</Sponsor>
                </TitleGroup>
                <StatusBadge started={!contest.ended}>{contest.status}</StatusBadge>
              </TopSection>

              <Details>
                <Row><Label>Requirements:</Label><Value>{contest.requirements}</Value></Row>
                <Row><Label>Prize:</Label><Value>{contest.prize}</Value></Row>
                <Row><Label>Contestants:</Label><Value>{contest.contestants}</Value></Row>
                <Row><Label>Start Date:</Label><Value>{contest.startDate}</Value></Row>
                <Row><Label>End Date:</Label><Value>{contest.endDate}</Value></Row>
                <Row><Label>Registration Ends:</Label><Value>{contest.registrationEnds}</Value></Row>
                <Row><Label>Post:</Label><Value>{contest.post}</Value></Row>
              </Details>

              <ActionRow>
                <JoinButton disabled={contest.ended}>{contest.registration}</JoinButton>
              </ActionRow>
            </Card>
          ))}
        </CardWrapper>
      ) : (
        <Table>
          <thead>
            <TrHeader>
              <Th>Contest Description</Th>
              <Th>Requirements</Th>
              <Th>Prize</Th>
              <Th>Contestants</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Post</Th>
              <Th>Registration Ends</Th>
              <Th>Status</Th>
              <Th>Registration</Th>
            </TrHeader>
          </thead>
          <tbody>
            {contests.map((contest, idx) => (
              <Tr key={idx} ended={contest.ended}>
                <Td>
                  <Flex>
                    <Logo src={contest.logo} />
                    <div>
                      <Bold>{contest.title}</Bold>
                      <Small>{contest.sponsor}</Small>
                    </div>
                  </Flex>
                </Td>
                <Td>{contest.requirements}</Td>
                <Td>{contest.prize}</Td>
                <Td>{contest.contestants}</Td>
                <Td>{contest.startDate}</Td>
                <Td>{contest.endDate}</Td>
                <Td>{contest.post}</Td>
                <Td>{contest.registrationEnds}</Td>
                <Td>
                  <Status started={!contest.ended}>{contest.status}</Status>
                </Td>
                <Td>
                  <JoinButton disabled={contest.ended}>{contest.registration}</JoinButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Pagination>
        <PageBtn active>1</PageBtn>
        <PageBtn>2</PageBtn>
        <PageBtn>3</PageBtn>
        <PageBtn>4</PageBtn>
        <PageBtn>5</PageBtn>
        <PageBtn>6</PageBtn>
        <PageBtn><FaGreaterThan size="10px" /></PageBtn>
      </Pagination>
    </Container>
  );
};

export default ContestList;

const Container = styled.div`
  padding: 2rem;
  background-color: #f3f4f7;
  font-family: 'Segoe UI', sans-serif;
  
`;

const Heading = styled.h2`
  text-align: center;
  font-weight: 400;
  margin-bottom: 3rem;
  color: #132e58;
  margin: 2rem auto;
  max-width: 80%;
  letter-spacing: 0%;
  font-size: 2.8rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1rem;
`;

const TrHeader = styled.tr`
  background: #1e3557;
  color: white;
  text-align: left;
`;

const Th = styled.th`
  padding: 1rem 0.5rem;
  font-size: 0.9rem;
`;

const Tr = styled.tr<{ ended: boolean }>`
  background: ${({ ended }) => (ended ? '#f9f9f9' : 'white')};
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 0.5rem 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  min-width: 100px;
`;

const Flex = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const Bold = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #de992f;
`;

const Small = styled.div`
  font-size: 14px;
  color: #de992f;
`;

const Status = styled.div<{ started: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ started }) => (started ? '#132E58' : '#ccc')};
  color: white;
  text-align: center;
  border-radius: 4px;
  font-size: 1rem;
  width: fit-content;
`;

const JoinButton = styled.button<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? '#ccc' : '#de992f')};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 1rem;
  white-space: nowrap;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 0.5rem;
`;

const PageBtn = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${({ active }) => (active ? '#1e3557' : '#eee')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  font-weight: 600;
  cursor: pointer;
`;

// Card View for Mobile

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const Card = styled.div<{ ended: boolean }>`
  background: ${({ ended }) => (ended ? '#f9f9f9' : 'white')};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  width: 450px;
  margin: auto;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
  

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: start;
    justify-content: center;
  }
`;

const TitleGroup = styled.div`

  flex: 1;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #de992f;
`;

const Sponsor = styled.div`
  font-size: 0.9rem;
  color: #de992f;
`;

const StatusBadge = styled(Status)`
  font-size: 0.8rem;
`;

const Details = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Row = styled.div`
  display: flex;
  
  justify-content: space-between;
  font-size: 0.9rem;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Label = styled.div`
  font-weight: 600;
  color: #333;
  min-width: 120px;
`;

const Value = styled.div`
  color: #555;
  text-align: right;

  @media (max-width: 480px) {
    text-align: left;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

