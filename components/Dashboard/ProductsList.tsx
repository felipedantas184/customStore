import { Product } from "@/types/productType";
import ProductsCard from "./ProductsCard";
import styled from "styled-components";
import { useState } from "react";
import ProductUpdate from "./ProductUpdate";
import Link from "next/link";
import storeData from "@/utils/storeData";

const ProductsList = ({ products }: { products: Product[] }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(10); // começa mostrando 10

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <Wrapper>
      <Title>Produtos</Title>
      {products.slice(0, visibleCount).map((product: Product) => (
        <div key={product.id} style={{ width: '100%' }}>
          <ProductsCard
            product={product}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
          {product.id === selectedProduct && (
            <ProductUpdate product={product} setSelectedProduct={setSelectedProduct} />
          )}
        </div>
      ))}

      {/* Só mostra o botão se ainda houver mais produtos */}
      {visibleCount < products.length && (
        <LoadMoreButton onClick={handleShowMore}>
          Ver mais
        </LoadMoreButton>
      )}

      <AddButton href={'/auth/register'}>Adicionar Produto</AddButton>
    </Wrapper>
  );
};

export default ProductsList;

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  background-color: #FFF;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  @media screen and (max-width: 768px) {
    padding: 8px;
  }
`;

const Title = styled.h1`
  color: #13131A;
  font-size: 20px;
  font-weight: 700;
`;

const AddButton = styled(Link)`
  width: 100%;
  margin: 0;
  padding: 12px;
  margin-top: 8px;

  background-color: ${storeData.secondaryColor};
  background-clip: padding-box;

  border: none;
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;

  color: #fff;
  font-family: "Montserrat";
  font-size: 14px;
  font-weight: 500;
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
`;

const LoadMoreButton = styled.button`
  width: 100%;
  margin: 0;
  padding: 12px;
  margin-top: 8px;

  background-color: #e0e0e0;
  border: none;
  border-radius: .25rem;
  cursor: pointer;

  font-family: "Montserrat";
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: #d5d5d5;
  }
`;