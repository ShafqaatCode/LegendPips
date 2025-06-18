import React from "react";
import { BannerWrapper, Overlay, Title, Breadcrumb } from "./Banner.styles";

interface BannerProps {
  backgroundImage: string;
  title: string;
  breadcrumb: string;
}

const Banner: React.FC<BannerProps> = ({ backgroundImage, title, breadcrumb }) => {
  return (
    <BannerWrapper style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Overlay />
      <div className="content">
        <Title>{title}</Title>
        <Breadcrumb>{breadcrumb}</Breadcrumb>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
