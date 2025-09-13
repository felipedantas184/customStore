import { addToCart } from "@/redux/cart.slice";
import { DetailProduct } from "@/types/productType";
import storeData from "@/utils/storeData";
import { FaShare } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const DetailButton = ({ product }: { product: DetailProduct }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);
  const cartItem = cart.find((item: any) => item.id === product.id && item.selectedVariant.id === product.selectedVariant.id)

  return (
    <ButtonGroup>
      {(!cartItem) ? (
        <>
          <AddToCart onClick={() => dispatch(addToCart(product))}>Adicionar ao Carrinho</AddToCart>
          <Favorite onClick={() => (navigator.share({ title: product.title, text: `Encontrei esse ${product.title} no site da ${storeData.title}! Confere clicando nesse link"`, url: `window.location.href/${product.id}` }))} ><FaShare size={16} color={storeData.secondaryColor} /></Favorite>
        </>
      ) : (
        <>
          <AddToCart disabled={product.selectedVariant.stock <= cartItem.quantity} onClick={() => dispatch(addToCart(product))}>Adicionar ao Carrinho ({cartItem?.quantity})</AddToCart>
          <Favorite onClick={() => (navigator.share({ title: product.title, text: `Encontrei esse ${product.title} no site da ${storeData.title}! Confere clicando nesse link"`, url: `window.location.href/${product.id}` }))} ><FaShare size={16} color={storeData.secondaryColor} /></Favorite>
        </>
      )}
    </ButtonGroup>
  );
}

export default DetailButton;





const ButtonGroup = styled.div`
  width: 100%;
  padding: 0 8px;
  margin-top: 12px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
`
const AddToCart = styled.button`
  width: 100%;
  min-height: 3rem;
  margin: 0;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);

  background-color: ${storeData.secondaryColor};
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

  &:disabled {
    background-color: #545454;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`
const Favorite = styled.button`
  align-items: center;
  background-clip: padding-box;
  background-color: #FFF;
  border: 1px solid #D4D4D4;
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: #13131A;
  cursor: pointer;
  display: inline-flex;
  font-family: "Montserrat";
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
  -webkit-tap-highlight-color: transparent;

  &:hover, &:focus {
    background-color: #FFF;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    background-color: #FFF;
    box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
    transform: translateY(0);
  }
  
  @media screen and (max-width: 768px) {
    padding: 12px;
  }
`