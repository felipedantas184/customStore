import { addToCart } from "@/redux/cart.slice";
import { DetailProduct } from "@/types/productType";
import storeData from "@/utils/storeData";
import { FaShoppingCart } from "react-icons/fa";
import { FaShare, FaCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const DetailButton = ({ product }: { product: DetailProduct }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);
  const cartItem = cart.find(
    (item: any) =>
      item.id === product.id &&
      item.selectedVariant.id === product.selectedVariant.id
  );

  const handleAdd = () => {
    dispatch(addToCart(product));
  };

  return (
    <ButtonGroup>
      <AddToCart
        disabled={cartItem && product.selectedVariant.stock <= cartItem.quantity}
        onClick={handleAdd}
      >
        {cartItem ? (
          <>
            <FaCheck size={16} style={{ marginRight: "8px" }} />
            Adicionado ({cartItem.quantity})
          </>
        ) : (
          <>
            <FaShoppingCart size={16} style={{ marginRight: "8px" }} />
            Adicionar ao Carrinho
          </>
        )}
      </AddToCart>

      <Favorite
        onClick={() =>
          navigator.share({
            title: product.title,
            text: `Encontrei ${product.title} no site da ${storeData.title}! Confere clicando nesse link"`,
            url: `${product.id}`,
          })
        }
      >
        <FaShare size={16} color={storeData.secondaryColor} />
        <Tooltip>Compartilhar</Tooltip>
      </Favorite>
    </ButtonGroup>
  );
};

export default DetailButton;

// ---------- Styled ----------

const ButtonGroup = styled.div`
  width: 100%;
  padding: 0 8px;
  margin-top: 12px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const AddToCart = styled.button`
  flex: 1;
  min-height: 3rem;
  padding: 8px 16px;

  background-color: ${storeData.secondaryColor};
  border: 1px solid transparent;
  border-radius: 0.5rem;

  color: #fff;
  font-family: "Montserrat";
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 200ms ease-in-out;

  &:hover,
  &:focus {
    background-color: #13131a;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    transform: translateY(-1px);
  }

  &:active {
    background-color: ${storeData.primaryColor};
    transform: translateY(0);
  }

  &:disabled {
    background-color: #545454;
    cursor: not-allowed;
  }

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const Favorite = styled.button`
  position: relative;
  min-width: 3rem;
  min-height: 3rem;
  border-radius: 0.5rem;
  border: 1px solid #d4d4d4;
  background-color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 200ms ease-in-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;

    & span {
      opacity: 1;
      visibility: visible;
      transform: translateY(-4px);
    }
  }
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: -28px;
  background: #13131a;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;

  opacity: 0;
  visibility: hidden;
  transition: all 200ms ease-in-out;
`;