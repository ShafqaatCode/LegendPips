import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import ContestTable from '../../components/ContestTable/ContestsTable';
import AddImg from '../../assets/Advertisement/image 4.png';
import ContestList from '../../components/ContestTable/ContestList';
import AdBanner from '../../components/Ads/AdBanner';
import Contest from '../../components/ContestTable/Contest';


const MainContainer = styled.main`

  margin-top: 135px;
  
  
  margin:135px auto;
@media (max-width: ${({ theme }) => theme.breakpoints.laptop})
{
  margin-top: 80px;
} 
  
`

const ToplinksBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  padding: 10px;

`

const FeedbackLinks = styled.div`
  

`
const BroadCrumbRow = styled.div`
  

`

const Contests: React.FC = () => {
  return (
    <MainContainer>
      <ToplinksBar>
        <BroadCrumbRow>
          <Link to="/home">
            Home
          </Link>
          <span> / </span>

          Contests

        </BroadCrumbRow>
        <FeedbackLinks>
          <Link to="/Feedback">
            Feedback
          </Link>
          <span> | </span>
          <Link to="/Feedback">
            Help Improve this page
          </Link>
          <span> | </span>

          <Link to="/share">
            Share <FaUpload />
          </Link>


        </FeedbackLinks>
      </ToplinksBar>
     

      <AdBanner />


      <ContestList />
      <Contest />

    </MainContainer>
  )
}

export default Contests;