import React from 'react'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";

const Analysis: React.FC = () => {
  return (
    <>
      <Banner
        backgroundImage={bannerImg}
        bannerHeading="Earning from every trade has never been this simple."
        upperText="all in one Trading platform"
        subText="Legend Pips gives you cashback for your trades without changing your broker. Plus, you get tools, signals, and protection—built to help you grow."
      />
      {/* Additional content for Analysis page can be added here */}
    </>

  )
}

export default Analysis;