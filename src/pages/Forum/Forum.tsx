import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";



const Forum: React.FC = () => {
  return (



    <Banner
      backgroundImage={bannerImg}
      title="Forum"
      breadcrumb="Home > Pages > Forum"
    />

  )
}

export default Forum;