import { Product } from "@/types/productType";
import { deleteProduct } from "@/utils/functions";
import Image from "next/image";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import styled from "styled-components";

const ProductsCard = ({product, selectedProduct, setSelectedProduct} : {product : Product, selectedProduct : string, setSelectedProduct : any}) => {
  return (
    <Card>
      <ImageWrapper href={'/'}>
        <Image src={product.imageUrl ? product.imageUrl[0] : 'https://agprata.vercel.app/assets/icons/logo-og.jpg'} alt={product.title} fill className={'image'} sizes="(max-width: 384px)" />
      </ImageWrapper>
      <TextWrapper>
        <SpaceBetween>
          <Brand>{product.category}</Brand>
          <DoubleIcon>
            <FaEdit style={{cursor: 'pointer'}} size={16} color="#D4D4D4" onClick={() => (selectedProduct === product.id) ? (setSelectedProduct('')) : (setSelectedProduct(product.id))} />
            <FaTrash style={{cursor: 'pointer'}} size={16} color="#F1AAAA" onClick={() => deleteProduct(product.id)} /> 
          </DoubleIcon>
        </SpaceBetween>
        <SpaceBetween>
          <PTitle>{product.title}</PTitle>
          <Quantity>Est.: {product.variants.reduce((acc: any, curr: any) => acc + curr.stock, 0)}</Quantity>
        </SpaceBetween>
        {/**<Price>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(product.price)}</Price>*/}
      </TextWrapper>
    </Card>
  );
}

export default ProductsCard;




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
  aspect-ratio: 3 / 4; // garante proporção quadrada
  width: 100%;
  max-width: 60px; // limite máximo que você pode ajustar
  border-radius: 8px;
  overflow: hidden;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    position: unset !important;
  }

  .image {
    object-fit: cover; // cobre todo o espaço do quadrado
    width: 100% !important;
    height: 100% !important;
    position: relative !important;

    &:hover {
      transform: scale(1.05);
      transition: transform 0.4s ease-in-out;
    }
  }
`;
const TextWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`
const SpaceBetween = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const DoubleIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
const Brand = styled.h3`
  color: #13131A;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`
const PTitle = styled.h2`
  color: #13131A;
  font-size: 12px;
  font-weight: 500;
`
/** const Price = styled.span`
  color: #13131A;
  font-size: 12px;
  font-weight: 600;
` */
const Quantity = styled.span`
  color: #13131A;
  font-size: 12px;
  font-weight: 500;
`