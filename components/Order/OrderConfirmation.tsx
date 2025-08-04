import { Order } from "@/types/productType";
import { QrCodePix } from "@/utils/GenerateQRCode";
import storeData from "@/utils/storeData";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { FaClipboard, FaClipboardCheck, FaHourglassHalf } from "react-icons/fa6";
import styled from "styled-components";

const OrderConfirmation = ({ order }: { order: Order }) => {
  {/**
  const personalMessageComposure = "```" + order.personal.name + '%0A' + order.personal.email + '%0A' + order.personal.phone + "```"
  const deliveryMessageComposure = (order.deliveryType === "pickup") ? '```Reirada na loja```' : "```" + order.delivery.address + ', ' + order.delivery.number + ' - ' + order.delivery.complement + '%0A' + order.delivery.zipCode + '%0A' + order.delivery.city + ', ' + order.delivery.state + "```"
  const paymentMessageComposure = "```" + order.paymentMethod + "```"
  const cartMessageComposure = order.cart.reduce(function (prevVal: any, currVal: any, idx: any) {
    return idx == 0 ? Number(idx + 1) + '. ' + "```" + currVal.title + ` (x${currVal.quantity})` + "```" + `%0A${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(currVal.price * currVal.quantity)}` : prevVal + '%0A%0A' + Number(idx + 1) + '. ' + "```" + currVal.title + ` (x${currVal.quantity})` + "```" + `%0A${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(currVal.price * currVal.quantity)}`;
  }, '')

  const message = `📄 *RESUMO DA COMPRA*%0A_${order?.lastOrder.id}_%0A%0A----------------------------------------------%0A👤 *Informações do Cliente:*%0A${personalMessageComposure}%0A%0A----------------------------------------------%0A🚛 *Informações da Entrega:*%0A${deliveryMessageComposure}%0A%0A----------------------------------------------%0A📃 *Informações do Pedido:*%0A${cartMessageComposure}%0A%0A----------------------------------------------%0A💳 *Forma do Pagamento:*%0A${paymentMessageComposure}%0A%0A----------------------------------------------%0A%0A💵 *Total a Pagar:*%0A${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(order.cart.reduce((acc: any, curr: any) => acc + curr.price * curr.quantity, 0))}`
  */}

  const [isCopied, setIsCopied] = useState(false);
  
  const qrCodePix = QrCodePix({
     version: '01',
    key: 'fac7a341aeac442285fd9fe2865ba9ea', //or any PIX key
    name: 'Felipe Augusto Oliveira Dantas',
    city: 'Teresina',
    transactionId: order.id,
    message: `Compra na loja Tecdata. Código do pedido: ${order.id}`,
    cep: '64091250',
    value: order.amount,
  });

  return (
    <Wrapper>
      <TextWrapper>
        <FaHourglassHalf size={48} color="#a07c08" />
        <Title>Falta Pouco!<br /> Efetue o pagamento para confirmar o pedido!</Title>
        <Subtitle style={{textAlign: 'center'}} >Leia o QR Code para efetuar o pagamento.<br/>A confirmação do seu pedido pode levar algum tempo.</Subtitle>
        <QRCodeSVG
          value={qrCodePix.payload()}
          size={210}
          bgColor={'#ffffff'}
          fgColor={'#000000'}
          level={'L'}
        />
        <QrCodeString>
          <Subtitle>{qrCodePix.payload()}</Subtitle>
          {(!isCopied) ? (
          <Subtitle onClick={() => {navigator.clipboard.writeText(qrCodePix.payload()); setIsCopied(true)}} style={{alignSelf: 'flex-end' , color: '#13131A', cursor: 'pointer'}}>Clique aqui para copiar o código! <FaClipboard style={{cursor: 'pointer'}} size={16}/></Subtitle>  
          ) : (
            <Subtitle onClick={() => {navigator.clipboard.writeText(qrCodePix.payload()); setIsCopied(false)}} style={{alignSelf: 'flex-end' , color: '#13131A'}}>Código copiado! <FaClipboardCheck size={16}/></Subtitle>  
          )}
        </QrCodeString>
        {/**<CheckoutButton href={`https://wa.me//5586995185757?text=${message}`}>Enviar Pedido</CheckoutButton>*/}
      </TextWrapper>
    </Wrapper>
  );
}

export default OrderConfirmation;




export const Wrapper = styled.div`
  width: 100%;
  max-width: 1080px;
  padding: 0 16px;
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
export const TextWrapper = styled.div`
  width: 100%;
  padding: 16px 12px;
  margin-bottom: 8px;
  background-color: #FFF;
  border-radius: 10px;

	display: flex;
	flex-direction: column;
	align-items: center;
  gap: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`
export const Title = styled.h1`
  color: #13131A;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`
export const Subtitle = styled.span`
  color: #5A5A5A;
  font-size: 14px;
  font-weight: 500;
`
export const QrCodeString = styled.div`
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  background-color: lightgray;
  word-break: break-all;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-overflow: ellipsis;
`
export const CheckoutButton = styled.a`
  width: 100%;
  min-height: 3rem;
  margin: 0;
  margin-top: 8px;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);

  background-color: ${storeData.primaryColor};
  background-clip: padding-box;

  border: 1px solid transparent;
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;

  color: #fff;
  font-family: "Montserrat";
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  text-decoration: none;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;

  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  -webkit-tap-highlight-color: transparent;

  &:hover, &:focus {
    background-color: #13131A;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    background-color: ${storeData.primaryColor};
    box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
    transform: translateY(0);
  }
`