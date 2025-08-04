import { CartItem } from "@/types/productType";
import styled from "styled-components";
import CheckoutCard from "./CheckoutCard";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import CheckoutResume from "./CheckoutResume";

const CheckoutList = () => {
  const cart = useSelector((state: any) => state.cart);
  
  useEffect(() => {
    localStorage.setItem("easy-phone-cart", JSON.stringify(cart))
  }, [cart])

  return (
    <Wrapper>
      {cart.map((product : CartItem) => (
        <CheckoutCard key={product.id} product={product} />
      ))}
      <CheckoutResume cart={cart} />
      <Divider />
    </Wrapper>
  );
}

export default CheckoutList;



const Wrapper = styled.div`
  width: 100%;
  max-width: 1080px;
  padding: 8px;
	margin-left: auto;
	margin-right: auto;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
  gap: 8px;
`
const Divider = styled.div`
  width: 100%;
  margin-top: 8px;
  border-top: 1px solid #BBB;
`