import styled from "styled-components";

export const SignalBoxContainer = styled.div`
  //   width: 100%;
  min-width: 400px;
  max-width: 400px;
  //   height: 300px;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0px 6px 18px rgba(8, 7, 7, 0.05);
  display: flex;
  flex-direction: column;
`;

export const SignalTopbar = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 18px;
    font-weight: 600;
    text-transform: uppercase;
    margin: 0;
  }

  button {
    background-color: ${({ theme }) => theme.colors.gold};
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 0.4rem 0.9rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
  }

  img {
    height: 18px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

export const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  img {
    height: 13px;
  }

  p {
    margin: 0;
    font-size: 13px;
    font-weight: 400;
  }
`;

export const SignalBottombar = styled.div`
  padding: 0.8rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
`;

export const PipsValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #34c759;
  background-color: #dcfce7;
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
`;

export const SignalContent = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SignalValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SignalLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

export const SignalValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SignalContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 1.2rem 1.25rem;
  gap: 1rem;
`;

export const SignalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
