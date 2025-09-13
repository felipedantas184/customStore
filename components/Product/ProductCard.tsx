import { Product } from "@/types/productType";
import storeData from "@/utils/storeData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ProductQuickViewModal from "./ProductQuickViewModal";
import { FaCartShopping, FaEye } from "react-icons/fa6";

const ProductCard = ({ product }: { product: Product }) => {
  const cart = useSelector((state: any) => state.cart);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("easy-phone-cart", JSON.stringify(cart));
  }, [cart]);

  const isOutOfStock = product.variants.every(variant => variant.stock === 0);

  return (
    <CardLi>
      <ImageContainer>
        <ImageWrapper href={`/${product.id}`}>
          <Image
            src={product.imageUrl ? product.imageUrl[0] : 'https://agprata.vercel.app/assets/icons/logo-og.jpg'}
            alt={product.title}
            fill
            sizes="(max-width: 384px)"
            className={'image'}
          />
        </ImageWrapper>
        {isOutOfStock && <SoldOutBadge>Esgotado</SoldOutBadge>}
      </ImageContainer>

      <TextWrapper href={`/${product.id}`}>
        <Brand>{product.category}</Brand>
        <Title>{product.title}</Title>
        <Price>
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(
            product.variants[0].promotional || product.variants[0].price
          )}
        </Price>
      </TextWrapper>
      <ButtonGroup>
        <ViewProductButton
          href={`/${product.id}`}
          style={isOutOfStock ? { pointerEvents: "none", opacity: 0.5 } : {}}
        >
          {isOutOfStock ? "Indisponível" : "Ver Detalhes"}
        </ViewProductButton>

        <EyeButton
          disabled={isOutOfStock}
          onClick={() => !isOutOfStock && setOpenModal(true)}
        >
          <FaCartShopping size={18} />
        </EyeButton>
      </ButtonGroup>

      {openModal && (
        <ProductQuickViewModal
          product={product}
          onClose={() => setOpenModal(false)}
        />
      )}
    </CardLi>
  );
};

export default ProductCard;


const CardLi = styled.li`
  background-color: #FFFFFF;
  padding: 0 4px 8px 4px;
	display: flex;
	flex-direction: column;
	align-items: center;
  gap: 4px;
  border-radius: 8px;

  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`
const ImageWrapper = styled(Link)`
  position: relative;
  width: 100%;
  padding-top: 100%; /* isso garante a proporção 1:1 */
  border-radius: 8px;
  overflow: hidden;
  display: block;
  background-color: #f5f5f5;

  > div {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .image {
    object-fit: cover;
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    top: 0;
    left: 0;
    transition: transform 0.5s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }
`;
const TextWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  -webkit-tap-highlight-color: transparent;
`
const Brand = styled.h3`
  color: #44444A;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
`
const Title = styled.h2`
  color: #13131A;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  text-transform: capitalize;

  display: -webkit-box;
  -webkit-line-clamp: 1; /* máximo de 2 linhas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Price = styled.h4`
  color: #13131A;
  font-size: 14px;
  font-weight: 500;
`
const ViewProductButton = styled(Link)`
  margin: 0;
  padding: 8px 12px;

  background-color: ${storeData.secondaryColor};
  background-clip: padding-box;

  border: none;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;

  color: #fff;
  font-family: "Montserrat";
  font-size: 13px;
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
    background-color: ${storeData.secondaryColor};
    box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
    transform: translateY(0);
  }

  &:disabled {
    background-color: #545454;
  }
`
const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 250px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
`;
const SoldOutBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: ${storeData.terciaryColor};
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 4px;
  z-index: 5;
  pointer-events: none;
  text-transform: uppercase;
`;
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
const EyeButton = styled.button<{ disabled?: boolean }>`
height: 100%;
padding-left: 4px;
padding-right: 4px;
  border-radius: 6px;
  border: 1px solid #d4d4d4;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: 0.2s ease-in-out;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#fff" : "#f6f6f6")};
  }
`;
