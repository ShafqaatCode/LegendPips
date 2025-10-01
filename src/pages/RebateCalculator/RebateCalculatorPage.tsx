import InstructionsSection from '../../components/Calculators/InstructionSet'

import RebateCalculator from '../../components/Calculators/RebateCalculator/RebateCalculator'
import TradingSlider from '../../components/TradingCard/TradingSlider'

function RebateCalculatorPage() {
  return (
    <div>
      <RebateCalculator />
      <TradingSlider />
      <InstructionsSection
        calculatorName="Position Size"
        steps={[
          "Select your preferred trading pair.",
          "Deposit Currency Choose your account’s base currency (e.g., USD, EUR, GBP, AUD, CAD, CHF, JPY, NZD).",
          "Rebate per Lot Enter the rebate amount you earn per traded lot.",
          "Lots Input the total number of lots you expect to trade within your desired timeframe. For example, to calculate your monthly rebate, enter your total monthly lots; for weekly rebate, enter your total weekly lots, and so on.",
         
        ]}
        footer="That’s it! Our system will instantly calculate how much cashback you can earn—making it easier to trade smarter, not harder."
      />

    </div>
  )
}

export default RebateCalculatorPage
