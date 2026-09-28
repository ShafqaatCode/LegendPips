import React from "react";
import styled from "styled-components";

/** Major pairs for the MyFXBook live spreads widget (get-widget/18). */
const DEFAULT_SYMBOLS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USDCHF",
  "AUDUSD",
  "USDCAD",
  "NZDUSD",
  "EURJPY",
  "GBPJPY",
  "EURGBP",
  "EURAUD",
  "XAUUSD",
  "XAGUSD",
].join(",");

type Props = {
  /** Comma-separated MyFXBook symbols, e.g. EURUSD,GBPUSD */
  symbols?: string;
  /** Optional MT4 server IDs from MyFXBook widget configurator */
  mt4Servers?: string;
  height?: number;
  className?: string;
};

/**
 * Live Forex Spreads Comparison Widget from MyFXBook
 * @see https://www.myfxbook.com/get-widget/18/broker_widgets
 */
const MyfxbookSpreadWidget: React.FC<Props> = ({
  symbols = DEFAULT_SYMBOLS,
  mt4Servers,
  height = 620,
  className,
}) => {
  const params = new URLSearchParams({
    symbols,
    includeCommissions: "false",
    promoteBroker: "0",
  });
  if (mt4Servers?.trim()) {
    params.set("mt4Servers", mt4Servers.trim());
  }

  const src = `https://widget.myfxbook.com/widget/broker-spreads.html?${params.toString()}`;

  return (
    <Wrap className={className} style={{ minHeight: height }}>
      <Frame
        src={src}
        title="Live Forex Spreads from Myfxbook"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ height }}
      />
      <Credit>
        Live forex spreads by{" "}
        <a
          href="https://www.myfxbook.com/forex-broker-spreads"
          target="_blank"
          rel="noopener noreferrer"
          title="Live Forex Spreads"
        >
          Myfxbook.com
        </a>
      </Credit>
    </Wrap>
  );
};

export default MyfxbookSpreadWidget;

const Wrap = styled.div`
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: ${({ theme }) => theme.colors.WHITE};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 10px 28px rgba(15, 23, 42, 0.06);
`;

const Frame = styled.iframe`
  display: block;
  width: 100%;
  border: 0;
  background: #fff;
`;

const Credit = styled.p`
  margin: 0;
  padding: 0.55rem 0.85rem;
  font-size: 0.75rem;
  color: #64748b;
  background: #f8fafc;
  border-top: 1px solid #eef2f7;
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
