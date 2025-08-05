
import adImage from '../../assets/Advertisement/image 4.png'; // Replace with your actual ad image
import styled from 'styled-components';

interface AdBannerProps {
    ImgAddress?: string;
}


const AdBanner: React.FC<AdBannerProps> = ({ImgAddress}) => (
    <AdBannerWrapper>
        <img
            src={ImgAddress || adImage} 
            alt="Ad Banner"
        />
    </AdBannerWrapper>
);

export default AdBanner;


const AdBannerWrapper = styled.div`
 

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
    @media (max-width: 768px) {
        margin: 0 auto;;
    }
`;
