import { decrementQuantity, incrementQuantity } from "@/redux/cart.slice";
import { CartItem } from "@/types/productType";
import Image from "next/image";
import Link from "next/link";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import styled from "styled-components";

const CheckoutCard = ({product} : {product : CartItem}) => {
  const dispatch = useDispatch();

  return (
    <Card>
      <ImageWrapper href={'/'}>
        <Image src={product.imageUrl ? product.imageUrl[0] : 'https://agprata.vercel.app/assets/icons/logo-og.jpg'} alt={product.title} fill className={'image'} sizes="(max-width: 384px)" />
      </ImageWrapper>
      <TextWrapper>
        <Brand>{product.category}</Brand>
        <Title>{product.title} - {product.selectedVariant.name}</Title>
        <Price>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(product.price)}</Price>
        <Buttons>
          <QntButton onClick={() => dispatch(decrementQuantity(product))}><FaMinusCircle size={16} color='#13131A' /></QntButton>
          <p>{product.quantity}</p>
          <QntButton disabled={product.quantity >= product.selectedVariant.stock} onClick={() => dispatch(incrementQuantity(product))}><FaPlusCircle size={16} color={(product.quantity >= product.selectedVariant.stock) ? '$D4D4D4' : '#13131A'} /></QntButton>
        </Buttons>
      </TextWrapper>
    </Card>
  );
}

export default CheckoutCard;



const Card = styled.div`
 width: 100%;
 padding: 0 8px;
 
 display: flex;
 flex-direction: row;
 align-items: center;
 gap: 16px;
`
const ImageWrapper = styled(Link)`
  position: relative;
  flex: 1;  
  max-height: 125px;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;

  > div {
    position: unset !important;
  }

  .image {
    object-fit: contain;
    width: 100% !important;
    position: relative !important;
    height: unset !important;

    &:hover {
      transform: scale(1.1);
      transition: transform 0.5s ease-in-out;
    }
  }
`
const TextWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`
const Brand = styled.h3`
  color: #13131A;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
`
const Title = styled.h2`
  color: #13131A;
  font-size: 14px;
  font-weight: 400;
  white-space: pre-wrap;
`
const Price = styled.h4`
  color: #13131A;
  font-size: 15px;
  font-weight: 600;
`
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`
const QntButton = styled.button`
  display: flex;
	align-items: center;
	justify-content: center;

  background-color: transparent;
  border-radius: 50%;
  outline: none;
  border: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`