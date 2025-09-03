import React, { useState } from "react";
import styled from "styled-components";
import IconImg from "../../assets/AccordionImgs/11501782 2-1.png";

import PlusIcon from "../../assets/AccordionImgs/Plus.png";
import MinusIcon from "../../assets/AccordionImgs/minus.png";



const AccordionWrapper = styled.div`
  /* margin-top: 2rem; */
  margin: 0 4rem;


    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
        margin: 0;
    }
`;

const Accordion = styled.div`
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
  overflow: hidden;
  background: #fff;

  ul{
    list-style: none;
  }
  
`;

const Header = styled.div`
  background: #f5f5f5;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  cursor: pointer;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const Icon = styled.img`
  width: 100px;
  height: 100px;
  margin-left: 1rem;

  @media (max-width: 768px)
  {
    height: 80px;
    width: 80px;
    
  }
`;

const Toggle = styled.span`
 
  
 
  
  

`;

const Content = styled.div`
display: flex;
    align-items: center;
    justify-content: space-between;
  padding: 1rem;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const RulesButton = styled.button`
  margin: 1rem 0;
  background: #132e58;
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
`;

type RuleItem = {
    title: string;
    content: React.ReactNode;
    icon: string;
};

const ruleItems: RuleItem[] = [
    {
        title: "Eligibility Criteria",
        icon: "/icons/certificate.png",
        content: (
            <>
                A “new live account” must be opened by the Contestant with IC Trading Mauritius after 28-Feb-2025. No funding is required. This new live account must also be linked and verified in the Contestant’s Fxverify profile. <br /><br />
                Each person is allowed only one entry, which must be registered using a valid mobile number (capable of receiving international calls) and a non-temporary email address. A maximum of two entries from the same IP address is permitted, provided they are from different individuals at the same location. <br /><br />
                Please note: <a href='#' style={{ color: 'red' }}>Regional restrictions</a> set by IC Trading Mauritius apply.
            </>
        )
    },
    {
        title: "Competition Guidelines",
        icon: "/icons/rules.png",
        content: (
            <>
                <ul>
                    <li>Starting Balance: $1000</li>
                    <li>Maximum Leverage: 200:1</li>
                    <li>Winning Criteria: Participant with the highest equity at the end of the contest</li>
                    <li>Trading Server: ICTrading-Demo</li>
                    <li><strong>EA Trading:</strong> Not allowed — use of Expert Advisors (EAs) is strictly prohibited. EA trading will be automatically disabled on all contest accounts.</li>
                </ul>
            </>
        )
    },
    {
        title: "Tradable Instruments",
        icon: "/icons/instruments.png",
        content: (
            <>
                Only trades on the following symbols will count toward your performance. All other instruments are excluded from evaluation. Please note that losing trades on the allowed symbols will still be included in your performance results. <br />
                <strong>Eligible Symbols:</strong> HK50, JP225, UK100, US30, EURUSD, GBPUSD, AUDUSD, USDJPY, BTCUSD, BCHUSD, ETHUSD, LTCUSD
            </>
        )
    },
    {
        title: "Equity Drawdown Limit: 99.00%",
        icon: "/icons/drawdown.png",
        content: (
            <>
                Any account exceeding a 99.00% equity drawdown from peak to valley will not be eligible to continue in the competition.
            </>
        )
    },
    {
        title: "Trade Limit: 500",
        icon: "/icons/chart.png",
        content: (
            <>
                Only your first 500 eligible trades will be counted toward your performance calculation. Losing trades within these 500 trades will still be included.
            </>
        )
    },
    {
        title: "Holding Period Limit: 10 minutes",
        icon: "/icons/timer.png",
        content: (
            <>
                Winning trades that are open for less than 10 minutes will be excluded from your performance calculation. However, losing trades — regardless of duration — will still be included.
            </>
        )
    },
    {
        title: "Traders Cup Final – Qualification Rules",
        icon: "/icons/trophy.png",
        content: (
            <>
                Any account exceeding a 99.00% equity drawdown from peak to valley will not be eligible to continue in the competition.
            </>
        )
    }
];

const RulesAccordion: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <AccordionWrapper>
            <RulesButton>Rules</RulesButton>
            {ruleItems.map((item, i) => (
                <Accordion key={i}>
                    <Header onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                        <Title>{item.title}</Title>
                        <Toggle>{openIndex === i ? <img src={MinusIcon} /> : <img src={PlusIcon} />  }</Toggle>
                    </Header>
                    {openIndex === i && (
                        <Content>
                            <div>

                                {item.content}
                            </div>
                            <Icon src={IconImg} alt="icon" />
                        </Content>
                    )}

                </Accordion>
            ))}
        </AccordionWrapper>
    );
};

export default RulesAccordion;
