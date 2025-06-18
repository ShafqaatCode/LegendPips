import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";



const Brokers: React.FC = () => {
  return (



    <Banner
      backgroundImage={bannerImg}
      title="BROKERS"
      breadcrumb="Home > Pages > Brokers"
    />

  )
}

export default Brokers;