import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";



const HitWorksPage: React.FC = () => {
  return (



    <Banner
      backgroundImage={bannerImg}
      title="HOW IT WORKS"
      breadcrumb="Home > Pages > How-It-works"
    />

  )
}

export default HitWorksPage;