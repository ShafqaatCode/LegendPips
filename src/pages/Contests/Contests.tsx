import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";



const Contests: React.FC = () => {
  return (



    <Banner
      backgroundImage={bannerImg}
      title="CONTEST"
      breadcrumb="Home > Pages > Contests"
    />

  )
}

export default Contests;