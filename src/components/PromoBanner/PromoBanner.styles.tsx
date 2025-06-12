import styled from 'styled-components';

export const BannerWrapper = styled.section`
  background: #031b49;
  color: white;
  padding: 4rem 2rem;
  text-align: left;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const Highlight = styled.span`
  color: #ffcb05;
`;

export const Description = styled.p`
  font-size: 1rem;
  color: #ccc;
  margin-top: 0.5rem;
`;

export const BrokersRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 2rem 0;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

export const JoinButton = styled.button`
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 40px;
  cursor: pointer;
  font-weight: bold;
`;

export const CompareButton = styled(JoinButton)`
  border-color: #ffcb05;
  color: #ffcb05;
`;
