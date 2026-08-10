import InstructionsSection from '../../components/Calculators/InstructionSet'
import FibonacciCalculator from '../../components/Calculators/FibonacciCalculator/FibonacciCalculator'
import TradingSlider from '../../components/TradingCard/TradingSlider'

function FibonacciCalculatorPage() {
  return (
    <div>
      <FibonacciCalculator />
      <TradingSlider />
      <InstructionsSection
        calculatorName="Fibonacci"
        steps={[
          "High Value Enter the highest price of the swing you want to analyse.",
          "Low Value Enter the lowest price of that same swing.",
          "Custom Value (optional) Set a third base price for projection-style extensions. Leave blank to measure extensions from the swing high (uptrend) or swing low (downtrend).",
          "Uptrend / Downtrend Choose the direction of the move so retracements and extensions are plotted correctly.",
        ]}
        footer="Calculate Click to generate Fibonacci retracement levels (0%–138.2%) and extension levels (61.8%–261.8%) for planning entries, exits, and targets."
      />
    </div>
  )
}

export default FibonacciCalculatorPage
