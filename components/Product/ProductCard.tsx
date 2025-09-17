import { Product } from "@/types/productType";
import storeData from "@/utils/storeData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import ProductQuickViewModal from "./ProductQuickViewModal";
import { FaCartShopping } from "react-icons/fa6";

const ProductCard = ({ product }: { product: Product }) => {
  const cart = useSelector((state: any) => state.cart);
  const [openModal, setOpenModal] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    localStorage.setItem("easy-phone-cart", JSON.stringify(cart));
  }, [cart]);

  const isOutOfStock = product.variants.every(
    (variant) => variant.stock === 0
  );

  const price = product.variants[0].price;
  const promotional = product.variants[0].promotional || null;

  return (
    <CardLi>
      <ImageContainer>
        <ImageWrapper href={`/${product.id}`}>
          {loadingImage && <Skeleton />}
          <Image
            src={
              product.imageUrl
                ? product.imageUrl[0]
                : "https://agprata.vercel.app/assets/icons/logo-og.jpg"
            }
            alt={product.title}
            fill
            sizes="(max-width: 384px)"
            className="image"
            onLoadingComplete={() => setLoadingImage(false)}
          />
        </ImageWrapper>
        {isOutOfStock && <SoldOutBadge>Esgotado</SoldOutBadge>}
        {!isOutOfStock && promotional && <PromoBadge>Promoção</PromoBadge>}
      </ImageContainer>

      <TextWrapper href={`/${product.id}`}>
        <Brand>{product.category}</Brand>
        <Title>{product.title}</Title>

        <PriceWrapper>
          {promotional ? (
            <>
              <OldPrice>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(price)}
              </OldPrice>
              <Price>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(promotional)}
              </Price>
            </>
          ) : (
            <Price>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(price)}
            </Price>
          )}
        </PriceWrapper>
      </TextWrapper>

      <ButtonGroup>
        <ViewProductButton
          href={`/${product.id}`}
          style={isOutOfStock ? { pointerEvents: "none", opacity: 0.5 } : {}}
        >
          {isOutOfStock ? "Indisponível" : "Ver Detalhes"}
        </ViewProductButton>

        <CartButton
          disabled={isOutOfStock}
          onClick={() => !isOutOfStock && setOpenModal(true)}
        >
          <FaCartShopping size={16} />
          <span>Adicionar</span>
        </CartButton>
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

/* -------- Estilos -------- */

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { background-color: #f0f0f0; }
  50% { background-color: #e0e0e0; }
  100% { background-color: #f0f0f0; }
`;

const CardLi = styled.li`
  background-color: #fff;
  padding: 0 0 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.15) 0px 2px 6px;
`;

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

const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 8px;
  animation: ${pulse} 1.5s infinite;
`;

const TextWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  -webkit-tap-highlight-color: transparent;
`;

const Brand = styled.h3`
  color: #44444a;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
`;

const Title = styled.h2`
  color: #13131a;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Price = styled.h4`
  color: #13131a;
  font-size: 14px;
  font-weight: 500;
`;

const OldPrice = styled.h4`
  color: #9a9a9a;
  font-size: 13px;
  font-weight: 400;
  text-decoration: line-through;
`;

const ViewProductButton = styled(Link)`
  flex: 1;
  padding: 8px 12px;
  background-color: ${storeData.secondaryColor};
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    background-color: #13131a;
  }
`;

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
  text-transform: uppercase;
`;

const PromoBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ff5a5a;
  color: #fff;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 4px;
  z-index: 5;
  text-transform: uppercase;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  padding: 4px;
  width: 100%;
  justify-content: space-between;
`;

const CartButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: ${({ disabled }) =>
    disabled ? "#d4d4d4" : storeData.primaryColor};
  color: #13131A;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${storeData.primaryColor};
    background: ${({ disabled }) =>
      disabled ? "#d4d4d4" : '#13131A'};
  }

  span {
    display: none;
  }

  @media (min-width: 480px) {
    flex: 1;
    span {
      display: inline;
    }
  }
`;
