import styled from "styled-components";
// Styled
export const CountdownBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #1d3250;
  color: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
`;

export const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;

  strong {
    font-size: 1.2rem;
    font-weight: 400;
  }

  span {
    font-size: 14px;
    color: #b0c4de;
    margin-top: 0.5rem;
  }
`;

export const Colon = styled.span`
  /* font-weight: bold; */
  font-size: 1.3rem;
`;
