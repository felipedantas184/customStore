import styled from "styled-components";
import OrderCard from "./OrderCard";
import { Order } from "@/types/productType";

const OrderList = ({ order }: { order: Order }) => {

  return (
    <Wrapper>
      <Summary>
        <SummaryTitle>Resumo do Pedido</SummaryTitle>
        {order.cart.map((item : any) => (
          <OrderCard key={item.variantId} item={item} />
        ))}
        <Divider />
        <TopicWrapper>
          <Topic>Valor Frete</Topic>
          <Span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(order.delivery ? order.delivery.freight : 0)}</Span>
        </TopicWrapper>
        <TopicWrapper>
          <Topic>Valor Itens</Topic>
          <Span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(order.amount)}</Span>
        </TopicWrapper>
        <TopicWrapper>
          <TopicBold>Valor Total</TopicBold>
          <SpanBold>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(order.delivery ? order.amount + order.delivery.freight : order.amount)}</SpanBold>
        </TopicWrapper>
      </Summary>
    </Wrapper>
  );
}

export default OrderList;


const Wrapper = styled.div`
  width: 100%;
  max-width: 1080px;
  padding: 0 16px;
  margin-bottom: 8px;
	margin-left: auto;
	margin-right: auto;

	display: flex;
	flex-direction: column;
	align-items: center;
  gap: 8px;

  @media screen and (max-width: 768px) {
    padding: 0 8px;
  }
`
const Summary = styled.div`
  width: 100%;
  padding: 16px 12px;
  background-color: #FFF;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

	display: flex;
	flex-direction: column;
	align-items: center;
  gap: 8px;
`
const SummaryTitle = styled.h5`
  color: #13131A;
  font-size: 18px;
  font-weight: 600;
  align-self: flex-start;
  margin-bottom: 8px;
`
const Divider = styled.div`
  width: 100%;
  margin-top: 8px;
  border-top: 1px solid #BBB;
`
const TopicWrapper = styled.div`
  width: 100%;
  padding: 8px 8px 0 8px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Topic = styled.span`
  color: #13131A;
  font-size: 14px;
  font-weight: 500;
`
const TopicBold = styled.span`
  color: #13131A;
  font-size: 16px;
  font-weight: 600;
`
const Span = styled.span`
  color: #13131A;
  font-size: 14px;
  font-weight: 500;
`
const SpanBold = styled.span`
  color: #13131A;
  font-size: 16px;
  font-weight: 600;
`