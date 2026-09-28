import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { brokerLogoInitials, normalizeBrokerLogoUrl } from "../../utils/brokerLogoUrl";

type BrokerLogoProps = {
  src?: string | null;
  alt?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Extra class for the fallback initials box when image fails */
  fallbackClassName?: string;
};

/**
 * Renders a broker logo with Brandfetch URL normalization, contain-fit friendly
 * loading, and initials fallback when the image fails to load.
 */
const BrokerLogo: React.FC<BrokerLogoProps> = ({
  src,
  alt,
  name,
  className,
  style,
  fallbackClassName,
}) => {
  const normalized = useMemo(() => normalizeBrokerLogoUrl(src), [src]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [normalized]);

  if (!normalized || failed) {
    return (
      <Fallback
        className={fallbackClassName || className}
        style={style}
        aria-label={alt || name || "Broker"}
      >
        {brokerLogoInitials(name || alt)}
      </Fallback>
    );
  }

  return (
    <img
      className={className}
      style={style}
      src={normalized}
      alt={alt || name || "Broker logo"}
      loading="lazy"
      decoding="async"
      referrerPolicy="strict-origin-when-cross-origin"
      onError={() => setFailed(true)}
    />
  );
};

const Fallback = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #132e58 0%, #1a3d6e 100%);
  color: #fff;
  font-weight: 800;
  font-size: 0.72em;
  letter-spacing: 0.02em;
  line-height: 1;
  user-select: none;
`;

export default BrokerLogo;
