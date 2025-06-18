import React from 'react'
import styled from 'styled-components'
import Banner from '../../components/Banner/Banner'
import bannerImg from "../../assets/banner/BannerBg.jpg";

const Container = styled.div`
margin-top: 135px;
  height: 600px;
  color : black;
  border: 2px solid red;
`

const Tools: React.FC = () => {
  return (



    <Banner
      backgroundImage={bannerImg}
      title="Tools"
      breadcrumb="Home > Pages > Tools"
    />

  )
}

export default Tools;