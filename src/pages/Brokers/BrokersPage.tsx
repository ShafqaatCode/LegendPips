import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";




const Brokers: React.FC = () => {
  return (
    <>

      <Banner
        backgroundImage={bannerImg}
        bannerHeading="Earning from every trade has never been this simple." upperText="all in one Trading plateform" subText="Legend Pips gives you cashback for your trades without changing your broker. Plus, you get tools, signals, and protection—built to help you grow."
      />
      
    </>
  )
}

export default Brokers;