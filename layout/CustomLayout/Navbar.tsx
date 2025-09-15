import { FaBagShopping, FaBars } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";
import storeData from "@/utils/storeData";

const Navbar = ({toggle, toggleCart} : any) => {
  const cart = useSelector((state: any) => state.cart);

  return ( 
    <Container>
      <Wrapper>
        <FaBars style={{cursor: "pointer"}} color={storeData.primaryColor} size={24} onClick={toggle} />
        <Logo href={'/'} ><Image src={'/assets/images/logos/storeTransparentLogo.png'} alt={`Logo ${storeData.title}`} fill /></Logo>
        <Bag>
          <FaBagShopping color={storeData.primaryColor} size={24} onClick={toggleCart}></FaBagShopping>
          <Badge>{cart.reduce((acc:any, curr:any) => acc + curr.quantity, 0)}</Badge>
        </Bag>
      </Wrapper>
    </Container>
   );
}
 
export default Navbar;

const Container = styled.header`
  background-color: ${storeData.secondaryColor};
  height: 60px;

  display: flex;
  align-items: center;
`
const Wrapper = styled.div`
  width: 100%;
  max-width: 1080px;
  height: 60px;
  padding: 0 16px;
	margin-left: auto;
	margin-right: auto;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
  -webkit-tap-highlight-color: transparent;
`
const Logo = styled(Link)`
  position: relative;
  width: 100px;
  height: 50px;
  text-decoration: none;
  cursor: pointer;

  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent; 
`
const Bag = styled.div`
  padding: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
`
const Badge = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;

	color: #F1F2F3;
	font-size: 12px;
	font-weight: 600;
	background-color: #13131A;

	align-self: flex-start;

	display: flex;
	justify-content: center;
	align-items: center;

	width: 16px;
	height: 16px;
	border-radius: 50%;
`