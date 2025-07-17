import styled from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  background-color: #f6f7fa;
  padding: 20px 24px;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`;

export const Image = styled.img`
  width: 130px;
  height: auto;
  border-radius: 4px;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #1e2c52;
`;

export const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e2c52;
`;

export const EventText = styled.p`
  font-size: 14px;
  color: #54607a;
  margin-top: 4px;
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 240px;
`;

export const CountdownTitle = styled.span`
  font-size: 14px;
  color: #1e2c52;
  margin-bottom: 8px;
`;

export const CountdownBox = styled.div`
  display: flex;
  background-color: #1e2c52;
  border-radius: 8px;
  overflow: hidden;
`;

// export const CountdownTimer = styled.div`
//   color: #ffffff;
//   padding: 8px 12px;
//   text-align: center;

//   span {
//     display: block;
//     font-size: 20px;
//     font-weight: 600;
//   }
// `;

export const Label = styled.small`
  font-size: 11px;
  color: #cfd3db;
`;

export const RegistrationInfo = styled.p`
  margin-top: 10px;
  font-size: 13px;
  color: #1e2c52;
`;

export const Highlight = styled.span`
  font-weight: 700;
`;

export const SponsorText = styled.p`
  font-size: 13px;
  color: #1e2c52;

  span {
    color: #f4a521;
    font-weight: 500;
  }
`;
