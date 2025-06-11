
import './App.css'
import styled from 'styled-components'


const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.family};
  padding: 2rem;
  text-align: center;
`;


function App() {
  

  return (
    <>
      <Wrapper>
       LegendPips
      </Wrapper>
    </>
  )
}

export default App
