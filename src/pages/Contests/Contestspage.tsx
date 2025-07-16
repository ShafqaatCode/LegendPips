import React from 'react'
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';
import ContestTable from '../../components/ContestTable/ContestsTable';
import AddImg from '../../assets/Advertisement/image 4.png';


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

const AdvertisementBar = styled.div`
  width: 80%;
  margin: 2rem auto 0rem;
  height: 100px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 100%;
    height: 100%;
    object-fit: contain;
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
        <img src={AddImg} alt="" />
      </AdvertisementBar>


      <ContestTable />

    </MainContainer>
  )
}

export default Contests;