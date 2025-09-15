import { Product, Variant } from "@/types/productType";
import { useState } from "react";
import styled from "styled-components";
import DetailButton from "../Buttons/DetailButton";
import storeData from "@/utils/storeData";

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);

  const [selectedProduct, setSelectedProduct] = useState({
    id: product.id,
    title: product.title,
    brand: product.brand,
    category: product.category,
    imageUrl: product.imageUrl,
    description: product.description,
    selectedVariant: {
      id: product.variants[0].id,
      name: product.variants[0].name,
      stock: product.variants[0].stock,
    },
    price: product.variants[0].promotional
      ? product.variants[0].promotional
      : product.variants[0].price,
  });

  const handleSelectVariant = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedProduct({
      ...selectedProduct,
      selectedVariant: {
        id: variant.id,
        name: variant.name,
        stock: variant.stock,
      },
      price: variant.promotional ? variant.promotional : variant.price,
    });
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>{product.title}</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        {/* Imagem principal */}
        <ImageWrapper>
          <img src={product.imageUrl?.[0]} alt={product.title} />
        </ImageWrapper>

        {/* Variações */}
        <VariantWrapper>
          {product.variants.map((variant, i) => (
            <VariantItem key={i}>
              <RadioInput
                type="radio"
                checked={variant === selectedVariant}
                name="variant"
                id={`variant-${variant.id}`}
              />
              <RadioLabel
                htmlFor={`variant-${variant.id}`}
                onClick={() => handleSelectVariant(variant)}
              >
                {variant.name}
                <StockLabel>{variant.stock} restantes</StockLabel>
              </RadioLabel>
            </VariantItem>
          ))}
        </VariantWrapper>

        {/* Preço */}
        <PriceWrapper>
          {selectedVariant.promotional ? (
            <>
              <OldPrice>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedVariant.price)}
              </OldPrice>
              <Promotional>
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedVariant.promotional)}
              </Promotional>
            </>
          ) : (
            <Price>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(selectedVariant.price)}
            </Price>
          )}
        </PriceWrapper>

        {/* Botão reutilizando DetailButton */}
        {selectedVariant.stock > 0 ? (
          <DetailButton product={selectedProduct} />
        ) : (
          <span style={{ color: "#EE4B2B", fontSize: 14 }}>Produto esgotado</span>
        )}
      </Modal>
    </Overlay>
  );
}

// ---------------- Styled ----------------

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;


const RadioInput = styled.input`
  display: none;

  &:checked + label {
    background-color: ${storeData.secondaryColor};
    color: #ffffff;
    border: 1px solid ${storeData.secondaryColor};
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;

const PriceWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const Price = styled.h4`
  color: #13131A;
  font-size: 16px;
  font-weight: 500;
`;

const OldPrice = styled.h4`
  color: #9c2305;
  font-size: 16px;
  font-weight: 500;
  text-decoration: line-through;
`;

const Promotional = styled.h4`
  color: #13131A;
  font-size: 16px;
  font-weight: 600;
`;
const VariantWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch; /* para scroll suave no mobile */
`;

const VariantItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: max-content; /* garante que não quebre linha */
`;

const RadioLabel = styled.label`
  position: relative;
  color: #13131A;
  font-family: "Montserrat";
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${storeData.secondaryColor};
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StockLabel = styled.span`
  font-size: 12px;
  margin-top: 2px;
  font-weight: 400;
`;