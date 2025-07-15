import styled from 'styled-components';
import Brandimg1 from '../../assets/Contest_Images/wmug5dukcys 1-1.png';
import Brandimg2 from '../../assets/Contest_Images/wmug5dukcys 1.png';

const contests = [
  {
    title: 'Q2 Special The Major’s Mix II',
    sponsor: 'ATC Trading',
    prize: '$9,000–100 Winners',
    startDate: 'Jul 7, 2025, 01:00 PM',
    endDate: 'Jul 19, 2025, 12:00 AM',
    registrationEnds: 'Jul 18, 2025, 01:00 PM',
    status: 'Started',
    registration: 'Join Now',
    contestants: 1391,
    post: 0,
    requirements: 'Live account (no funding required)',
    ended: false,
    logo: Brandimg1 // Replace with actual logos
  },
  {
    title: 'Stars, Strips & Pips: The Forex Showdown',
    sponsor: 'FDMX',
    prize: '$2,000–20 Winners',
    startDate: 'Jun 30, 2025, 01:00 PM',
    endDate: 'Jul 12, 2025, 12:00 AM',
    registrationEnds: 'Jul 11, 2025, 01:00 PM',
    status: 'Started',
    registration: 'Join Now',
    contestants: 3820,
    post: 0,
    requirements: 'Live account (no funding required)',
    ended: false,
    logo: Brandimg2
  },
  {
    title: 'The Index Ninjas I',
    sponsor: 'ATC Trading',
    prize: '$3,000–50 Winners',
    startDate: 'Jun 23, 2025, 01:00 PM',
    endDate: 'Jul 2, 2025, 12:00 AM',
    registrationEnds: 'Jul 1, 2025, 01:00 PM',
    status: 'Ended',
    registration: 'Closed',
    contestants: 1544,
    post: 71,
    requirements: 'Live account (no funding required)',
    ended: true,
    logo: Brandimg1
  },
  {
    title: 'The Index Ninjas I',
    sponsor: 'ATC Trading',
    prize: '$3,000–50 Winners',
    startDate: 'Jun 23, 2025, 01:00 PM',
    endDate: 'Jul 2, 2025, 12:00 AM',
    registrationEnds: 'Jul 1, 2025, 01:00 PM',
    status: 'Ended',
    registration: 'Closed',
    contestants: 1544,
    post: 71,
    requirements: 'Live account (no funding required)',
    ended: true,
    logo: Brandimg1
  },
  
  {
    title: 'The Index Ninjas I',
    sponsor: 'ATC Trading',
    prize: '$3,000–50 Winners',
    startDate: 'Jun 23, 2025, 01:00 PM',
    endDate: 'Jul 2, 2025, 12:00 AM',
    registrationEnds: 'Jul 1, 2025, 01:00 PM',
    status: 'Ended',
    registration: 'Closed',
    contestants: 1544,
    post: 71,
    requirements: 'Live account (no funding required)',
    ended: true,
    logo: Brandimg2
  },
  {
    title: 'The Index Ninjas I',
    sponsor: 'ATC Trading',
    prize: '$3,000–50 Winners',
    startDate: 'Jun 23, 2025, 01:00 PM',
    endDate: 'Jul 2, 2025, 12:00 AM',
    registrationEnds: 'Jul 1, 2025, 01:00 PM',
    status: 'Ended',
    registration: 'Closed',
    contestants: 1544,
    post: 71,
    requirements: 'Live account (no funding required)',
    ended: true,
    logo: Brandimg2
  },
  {
    title: 'The Index Ninjas I',
    sponsor: 'ATC Trading',
    prize: '$3,000–50 Winners',
    startDate: 'Jun 23, 2025, 01:00 PM',
    endDate: 'Jul 2, 2025, 12:00 AM',
    registrationEnds: 'Jul 1, 2025, 01:00 PM',
    status: 'Ended',
    registration: 'Closed',
    contestants: 1544,
    post: 71,
    requirements: 'Live account (no funding required)',
    ended: true,
    logo: Brandimg2
  },
  {
    title: 'The Index Ninjas I',
    sponsor: 'ATC Trading',
    prize: '$3,000–50 Winners',
    startDate: 'Jun 23, 2025, 01:00 PM',
    endDate: 'Jul 2, 2025, 12:00 AM',
    registrationEnds: 'Jul 1, 2025, 01:00 PM',
    status: 'Ended',
    registration: 'Closed',
    contestants: 1544,
    post: 71,
    requirements: 'Live account (no funding required)',
    ended: true,
    logo: Brandimg2
  },
  {
    title: 'The Index Ninjas I',
    sponsor: 'ATC Trading',
    prize: '$3,000–50 Winners',
    startDate: 'Jun 23, 2025, 01:00 PM',
    endDate: 'Jul 2, 2025, 12:00 AM',
    registrationEnds: 'Jul 1, 2025, 01:00 PM',
    status: 'Ended',
    registration: 'Closed',
    contestants: 1544,
    post: 71,
    requirements: 'Live account (no funding required)',
    ended: true,
    logo: Brandimg2
  },
  // Add more rows if needed...
];

const ContestTable = () => {
  return (
    <Container>
      <Heading>Elite Skills Contest on the Web We Never Ask for Real Money!</Heading>
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
                <Button disabled={contest.ended}>{contest.registration}</Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <PageBtn active>1</PageBtn>
        <PageBtn>2</PageBtn>
        <PageBtn>3</PageBtn>
        <PageBtn>4</PageBtn>
        <PageBtn>5</PageBtn>
        <PageBtn>6</PageBtn>
      </Pagination>
    </Container>
  );
};

export default ContestTable;


const Container = styled.div`
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9f9f9;
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  /* border-radius: 10px; */
  overflow: hidden;
`;

const TrHeader = styled.tr`
  background: #1e3557;
  color: white;
  text-align: left;
`;

const Th = styled.th`
  padding: 1rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Tr = styled.tr<{ ended: boolean }>`
  background: ${({ ended }) => (ended ? '#f2f2f2' : 'white')};
  border-bottom: 1px solid #ddd;
 
`;

const Td = styled.td`
  padding: 1rem;
  vertical-align: middle;
min-width: 100px;
  font-size: 1rem;
  font-weight: 500;
  
`;

const Flex = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
`;

const Bold = styled.div`
  font-weight: 600;
  font-size: 16px;
   color: #DE992F;
`;

const Small = styled.div`
  font-size: 14px;
  
   color: #DE992F;
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

const Button = styled.button<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? '#ccc' : '#DE992F')};
  color: ${({ disabled }) => (disabled ? '#666' : '#000')};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: 500;
  color: white;
  font-size: 1rem;
  white-space: nowrap;
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

