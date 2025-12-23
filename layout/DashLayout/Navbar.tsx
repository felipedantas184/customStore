import { FaBars } from "react-icons/fa6";
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";
import storeData from "@/utils/storeData";
import { FiLogOut } from "react-icons/fi";

const Navbar = ({ toggle }: any) => {
  return (
    <Container>
      <Wrapper>
        <MenuIcon onClick={toggle}>
          <FaBars color="#F6F6F6" size={24} />
        </MenuIcon>
        <Logo href="/">
          <Image
            src="/assets/images/logos/storeTransparentLogo.png"
            alt={`Logo ${storeData.title}`}
            fill
          />
        </Logo>
        <MenuIcon onClick={toggle}>
          <FiLogOut color="#F6F6F6" size={24} />
        </MenuIcon>
      </Wrapper>
    </Container>
  );
};

export default Navbar;

const Container = styled.header`
  background-color: ${storeData.secondaryColor};
  height: 60px;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  position: relative;
  width: 100px;
  height: 50px;
`;

const MenuIcon = styled.div`
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;