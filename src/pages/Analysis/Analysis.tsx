import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";

const Analysis: React.FC = () => {
  return (
    <Banner
      backgroundImage={bannerImg}
      title="Analysis"
      breadcrumb="Home > Pages > Analysis"
    />

  )
}

export default Analysis;