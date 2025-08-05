import React from "react";
import styled from "styled-components";

const ContestRules: React.FC = () => {
  return (
    <Wrapper>
      <CardRow>
        <Card>
          <Title>Eligibility Criteria</Title>
          <Text>
            A “new live account” must be opened by the Contestant with IC Trading Mauritius after 28-Feb-2025. No funding is required.
            This new live account must also be linked and verified in the Contestant’s Everly profile.
            <br /><br />
            Each person is allowed only one entry, which must be registered using a valid mobile number (capable of receiving international calls) and a non-temporary email address.
            A maximum of two entries from the same IP address is permitted, provided they are from different individuals at the same location.
            <br /><br />
            <Note>Please note: <a href="#">Regional restrictions</a> set by IC Trading Mauritius apply.</Note>
          </Text>
        </Card>

        <Card>
          <Title>Competition Guidelines</Title>
          <Text>
            Starting Balance: $1,000<br />
            Maximum Leverage: 200:1<br />
            Winning Criteria: Participant with the highest equity at the end of the contest<br />
            Trading Server: ICTrading-Demo<br />
            <br />
            EA Trading: Not allowed — use of Expert Advisors (EAs) is strictly prohibited. EA trading will be automatically disabled on all contest accounts.
          </Text>
        </Card>

        <Card>
          <Title>Tradable Instruments</Title>
          <Text>
            Only trades on the following symbols will count toward your performance. All other instruments are excluded from evaluation.<br />
            <br />
            Please note that losing trades on the allowed symbols will still be included in your performance results.<br />
            <br />
            <strong>Eligible Symbols:</strong><br />
            HK50, JP225, UK100, US30, EURUSD, GBPUSD, AUDUSD, USDJPY, BTCUSD, BCHUSD, ETHUSD, LTCUSD
          </Text>
        </Card>
      </CardRow>

      <CardRow>
        <Card>
          <Title>Equity Drawdown Limit: 99.00%</Title>
          <Text>
            Any account exceeding a 99.00% equity drawdown from peak to valley will not be eligible to continue in the competition.
          </Text>
        </Card>

        <Card>
          <Title>Trade Limit: 500</Title>
          <Text>
            Only your first 500 eligible trades will be counted toward your performance calculation.
            Losing trades within these 500 trades will still be included.
          </Text>
        </Card>

        <Card>
          <Title>Holding Period Limit: 10 minutes</Title>
          <Text>
            Winning trades that are open for less than 10 minutes will be excluded from your performance calculation.
            However, losing trades — regardless of duration — will still be included.
          </Text>
        </Card>

        <Card>
          <Title>Traders Cup Final – Qualification Rules</Title>
          <Text>
            Any account exceeding a 99.00% equity drawdown from peak to valley will not be eligible to continue in the competition.
          </Text>
        </Card>
      </CardRow>

      <FooterNote>
        <strong>We will remove any contestant found violating the spirit of fair competition:</strong> in general, any trading activity that would not succeed in a real-world trading environment will be considered unfair. This includes, for example, opening multiple accounts and placing similar but opposing trades as an individual or coordinated group.
        <br />
        <a href="#">Additional Conditions</a>
      </FooterNote>

      <FAQSection>
        <strong>FAQs</strong>
        <ul>
          <li><a href="#">Contest Login Credentials</a></li>
          <li><a href="#">Permitted Trading Conditions</a></li>
          <li><a href="#">Drawdown Policy</a></li>
          <li><a href="#">Excluded Trade Conditions</a></li>
          <li><a href="#">Getting Your Prize</a></li>
        </ul>
      </FAQSection>
    </Wrapper>
  );
};

export default ContestRules;

// Styled Components
const Wrapper = styled.div`
  padding: 2rem;
  background: #f7f9fb;
  font-family: 'Segoe UI', sans-serif;
  color: #1a1a1a;
`;

const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  flex: 1;
  min-width: 300px;
  border: 2px dashed #2980b9;
  border-radius: 8px;
  background: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const Title = styled.h3`
  color: #1a1a1a;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
`;

const Note = styled.div`
  font-size: 0.9rem;
  margin-top: 0.8rem;
  color: #d35400;

  a {
    color: #2980b9;
    text-decoration: underline;
  }
`;

const FooterNote = styled.div`
  margin-top: 2rem;
  font-size: 0.95rem;
  background: #fff;
  padding: 1rem 1.5rem;
  border-left: 5px solid #2c3e50;
  border-radius: 4px;

  a {
    display: block;
    margin-top: 0.5rem;
    color: #2980b9;
  }
`;

const FAQSection = styled.div`
  margin-top: 2rem;
  font-size: 0.95rem;

  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 0.5rem;
  }

  li {
    margin-bottom: 0.3rem;

    a {
      color: #2980b9;
      text-decoration: underline;
    }
  }
`;
