import styled from "styled-components";
import ProductCard from "./ProductCard";
import { Product } from "@/types/productType";
import { useState } from "react";
import Banner from "./Banner";
import { FaSortAmountDown } from "react-icons/fa";

const ProductList = ({ products }: { products: Product[] }) => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortType, setSortType] = useState<"alpha-asc" | "alpha-desc" | "price-asc" | "price-desc">("alpha-asc");
  const [openSort, setOpenSort] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Função utilitária: menor preço entre promo e normal
  const getLowestPrice = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return Infinity;
    return Math.min(...product.variants.map(v => v.promotional || v.price));
  };

  // Ordenações
  const sortFunctions = {
    "alpha-asc": (a: Product, b: Product) => a.title.localeCompare(b.title),
    "alpha-desc": (a: Product, b: Product) => b.title.localeCompare(a.title),
    "price-asc": (a: Product, b: Product) => getLowestPrice(a) - getLowestPrice(b),
    "price-desc": (a: Product, b: Product) => getLowestPrice(b) - getLowestPrice(a),
  };

  const getSortedProducts = (list: Product[]) => {
    return [...list].sort(sortFunctions[sortType]);
  };

  // Filtro por categoria
  const categoryFiltered = categoryFilter
    ? products.filter((product) => product.category === categoryFilter)
    : products;

  // Filtro por pesquisa (título)
  const searchFiltered = categoryFiltered.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lista final (ordenada)
  const sortedProducts = getSortedProducts(searchFiltered);

  return (
    <Wrapper>
      <Banner />

      <GroupWrapper>
        <TextWrapper>
          <Title>Nossos Produtos</Title>
          <Subtitle>{sortedProducts.length} produtos encontrados</Subtitle>
        </TextWrapper>

        {/* Botão de ordenação */}
        <SortWrapper>
          <SortButton onClick={() => setOpenSort(!openSort)}>
            <FaSortAmountDown />
          </SortButton>
          {openSort && (
            <SortMenu>
              <SortOption onClick={() => { setSortType("alpha-asc"); setOpenSort(false); }}>A → Z</SortOption>
              <SortOption onClick={() => { setSortType("alpha-desc"); setOpenSort(false); }}>Z → A</SortOption>
              <SortOption onClick={() => { setSortType("price-asc"); setOpenSort(false); }}>Preço: menor → maior</SortOption>
              <SortOption onClick={() => { setSortType("price-desc"); setOpenSort(false); }}>Preço: maior → menor</SortOption>
            </SortMenu>
          )}
        </SortWrapper>
      </GroupWrapper>

      {/* Filtros por categoria */}
      <BrandWrapper>
        <RadioInput type="radio" name="category" id="todos" defaultChecked />
        <RadioLabel onClick={() => setCategoryFilter("")} htmlFor="todos">Todos</RadioLabel>
        {products
          .map((product: Product) => product.category)
          .filter((category, index, arr) => arr.indexOf(category) === index)
          .sort((a, b) => a.localeCompare(b))
          .map((category: string) => (
            <div key={category}>
              <RadioInput type="radio" name="category" id={category} />
              <RadioLabel onClick={() => setCategoryFilter(category)} htmlFor={category}>
                {category}
              </RadioLabel>
            </div>
          ))}
      </BrandWrapper>

      {/* Barra de pesquisa */}
      <SearchInput
        type="text"
        placeholder="Buscar produtos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Lista de produtos */}
      <GridList>
        {sortedProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </GridList>
    </Wrapper>
  );
};

export default ProductList;

// -------------------- Styled --------------------

const Wrapper = styled.div`
  width: 100%;
  max-width: 1080px;
  padding: 8px;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;
const Title = styled.h1`
  color: #13131a;
  font-size: 20px;
  font-weight: 600;
`;
const Subtitle = styled.span`
  color: #c4c4c4;
  font-size: 14px;
`;

const BrandWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
`;
const RadioInput = styled.input`
  display: none;

  &:checked + label {
    background-color: #13131a;
    color: #ffffff;
    border: 1px solid #c4c4c4;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;
const RadioLabel = styled.label`
  position: relative;
  color: #13131a;
  font-family: "Montserrat";
  font-size: 16px;
  border: 2px solid #c4c4c4;
  border-radius: 5px;
  padding: 8px 16px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const GridList = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
`;

const SortButton = styled.button`
  border: none;
  background: #c4c4c4;
  color: #fff;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #000;
  }
`;

const SortMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  z-index: 10;
  min-width: 200px;
`;

const SortOption = styled.button`
  background: none;
  border: none;
  padding: 10px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const GroupWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #13131a;
    box-shadow: 0 0 0 2px rgba(19, 19, 26, 0.2);
  }
`;