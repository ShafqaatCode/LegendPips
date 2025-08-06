import React from "react";
import styled from "styled-components";
import MedalImg1 from '../../assets/icons/badge1.svg';
import MedalImg2 from '../../assets/icons/badge2.svg';

interface PodiumProps {
    first: string;
    second: string;
    third: string;
}

const PodiumWrapper = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: flex-end;
  /* border: 2px solid red; */
  margin: 2rem 0 0rem;
  
@media (max-width: 768px) {


}
    
  
`;


const PodiumBlock = styled.div<{ rank: number }>`
  background-color: #132E58F2;
  color: white;
  text-align: center;
  width: 90px;
  padding: 1rem 0.5rem;
  
  position: relative;

  ${({ rank }) =>
        rank === 1 &&
        `
    background-color: #132E58;
    height: 180px;
    z-index: 3;
  `}

  ${({ rank }) =>
        rank === 2 &&
        `
    height: 140px;
    z-index: 2;
  `}

  ${({ rank }) =>
        rank === 3 &&
        `
    height: 120px;
    z-index: 1;
  `}
`;

const Medal = styled.div`
  position: absolute;
  top: -30px;
  left: 35%;
  transform: translateX(-50%);
  img{
  position: absolute;
    top: -5px;
    left: 0px;
  }
`;

const Name = styled.div`
  font-weight: 400;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Rank = styled.div`


  font-size: 3rem;
  font-weight: 800;
`;

const Podium: React.FC<PodiumProps> = ({ first, second, third }) => {
    return (
        <PodiumWrapper>
            <PodiumBlock rank={2}>
                <Medal>
                    <img src={MedalImg2} alt="Medal" />
                </Medal>

                <Name>{second}</Name>
                <Rank>2</Rank>
            </PodiumBlock>

            <PodiumBlock rank={1}>
                <Medal>

                    <img src={MedalImg1} alt="Medal " />
                </Medal>

                <Name>{first}</Name>
                <Rank>1</Rank>
            </PodiumBlock>

            <PodiumBlock rank={3}>
                <Medal>
                    <img src={MedalImg2} alt="Medal " />

                </Medal>

                <Name>{third}</Name>
                <Rank>3</Rank>
            </PodiumBlock>
        </PodiumWrapper>
    );
};

export default Podium;
