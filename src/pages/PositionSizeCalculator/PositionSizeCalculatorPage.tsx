import InstructionsSection from '../../components/Calculators/InstructionSet'

import PositionSizeCalculator from '../../components/Calculators/PositionSizeCalculator/PositionsizeCalculator'
import TradingSlider from '../../components/TradingCard/TradingSlider'

function PositionSizeCalculatorPage() {
  return (
    <div>
    <PositionSizeCalculator />
      <TradingSlider />
      <InstructionsSection
        calculatorName="Position Size"
        steps={[
          "Select your preferred trading pair.",
          "Deposit Currency Choose your account’s base currency (e.g., USD, EUR, GBP, AUD, CAD, CHF, JPY, NZD).",
          "Enter your total trading account balance. This helps the calculator determine risk relative to your capital.",
          ".Specify the percentage of your account balance (or a fixed monetary value) you are willing to risk on the trade.",
          "Choose the forex pair you want to trade. Different pairs have different pip values, so this is essential for accuracy.",
          
        ]}
        footer="That’s it! The calculator provides the optimal lot size you should trade."
      />

    </div>
  )
}

export default PositionSizeCalculatorPage
