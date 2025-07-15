import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';


const MainContainer = styled.main`

margin-top: 135px;
  height: 700px;
  border: 2px solid red;
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

const AdvertisementBar = styled.div`
  width: 80%;
  margin: auto;
  height: 100px;
  border: 2px solid red;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContestsSection = styled.section`
background-color: ${({ theme }) => theme.colors.primary};
display: grid;
grid-template-columns: repeat(10, 1fr);
color: white;
align-items: center;
font-size: 16px;
  
  div{
    border: 2px solid green;
    text-align: center;
  }
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
      <AdvertisementBar>
        Advertisement
      </AdvertisementBar>

      <ContestsSection>
        <div>Contest Description</div>
        <div>Requirements</div>
        <div>Prize</div>
        <div>Contestents</div>
        <div>Start Date</div>
        <div>End Date</div>
        <div>Post</div>
        <div>Registration Ends</div>
        <div>Status</div>
        <div>Registration</div>
        

      </ContestsSection>

    </MainContainer>
  )
}

export default Contests;