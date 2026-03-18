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
          "Instrument Select your preferred trading pair from our available options.",
          "Deposit Currency Choose your account's base currency (e.g., USD, EUR, GBP, AUD, CAD, CHF, JPY, NZD).",
          "Enter your total trading account balance. This helps the calculator determine risk relative to your capital.",
          "Specify the percentage of your account balance (or a fixed monetary value) you are willing to risk on the trade.",
          "Choose the forex pair you want to trade. Different pairs have different pip values, so this is essential for accuracy.",
          "Input the stop-loss distance in pips for the trade. This defines how much you're willing to risk before the position closes.",
        ]}
        footer="That's it! The calculator instantly provides the optimal lot size you should trade, ensuring your risk stays within the chosen limits."
      />

    </div>
  )
}

export default PositionSizeCalculatorPage
