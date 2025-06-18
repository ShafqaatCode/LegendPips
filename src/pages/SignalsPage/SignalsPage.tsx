import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";



const SignalsPage: React.FC = () => {
  return (



    <Banner
      backgroundImage={bannerImg}
      title="SIGNALS"
      breadcrumb="Home > Pages > Signals"
    />

  )
}

export default SignalsPage;