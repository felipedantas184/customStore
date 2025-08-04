import styled from "styled-components";

const CheckoutResume = ({cart}:any) => {
  return ( 
    <>
      <TopicWrapper>
        <TopicBold>Valor Itens</TopicBold>
        <SpanBold>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(cart.reduce((acc:any, curr:any) => acc + curr.price*curr.quantity, 0))}</SpanBold>
      </TopicWrapper>
    </>
   );
}
 
export default CheckoutResume;



const TopicWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 8px 0 8px;
`
const TopicBold = styled.span`
  color: #13131A;
  font-size: 16px;
  font-weight: 600;
`
const SpanBold = styled.span`
  color: #13131A;
  font-size: 16px;
  font-weight: 500;
`