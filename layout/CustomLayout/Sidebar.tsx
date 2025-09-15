import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { FaRegEnvelope, FaHouse, FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import styled from "styled-components";
import Link from "next/link";
import storeData from "@/utils/storeData";

const Sidebar = ({ isOpen, toggle }: any) => {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <Container $isOpen={isOpen}>
      <Wrapper>
        <BigWrapper>
          <TitleWrapper>
            <Logo href={'/'} ><Image src={'/assets/images/logos/storeTransparentLogo.png'} alt={`Logo ${storeData.title}`} fill /></Logo>
            <Close onClick={toggle}>
              <FaTimes color={storeData.primaryColor} />
            </Close>
          </TitleWrapper>
          <Menu>
            <Item><PageInternalLink href={'/'}><FaHouse size={20} color={storeData.primaryColor} />Página Inicial</PageInternalLink></Item>
            <Item><PageLink target='_blank' href={storeData.instagramUrl} arial-label='Instagram'><FaInstagram size={20} color={storeData.primaryColor} />Instagram</PageLink></Item>
            <Item><PageLink target='_blank' href={storeData.locationUrl} arial-label='Google Maps'><IoLocationOutline size={20} color={storeData.primaryColor} />Localização</PageLink></Item>
            <Item><PageLink target='_blank' href={`mailto:${storeData.email}`} arial-label='Email'><FaRegEnvelope size={20} color={storeData.primaryColor} />Email</PageLink></Item>
          </Menu>
        </BigWrapper>
        {(user) ? (
          <div style={{display: 'flex', flexDirection: 'column', maxWidth: 300, width: '100%', justifyContent: 'center', alignItems: 'center'}} >
            <Span>{user.email}</Span>
            <LogoutButton onClick={() => { logout(); router.push('/') }}>Logout</LogoutButton>
          </div>
        ) : (
          <CheckoutButton href={`https://wa.me//${storeData.whatsAppNumber}?text=Ol%C3%A1!%20Vim%20a%20partir%20do%20site!`}><FaWhatsapp size={18} />Mandar mensagem</CheckoutButton>
        )}
      </Wrapper>
    </Container>
  );
}

export default Sidebar;

interface Props {
  $isOpen: any
}

const Container = styled.nav<Props>`
  background: ${storeData.secondaryColor};
  padding: 25px 0;
  
  top: 0;
  right: 0;
  position: fixed;
  z-index: 999;
  width: 80%;
  height: 100%;

  opacity: ${({ $isOpen }) => ($isOpen ? '100%' : '0')};
  right: ${({ $isOpen }) => ($isOpen ? '20%' : '100%')};
  transition: 0.7s ease-in-out;

  border-radius: 0 10px 10px 0;
  box-shadow: rgba(99, 99, 99, 0.8) 0px 2px 8px 0px;
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`
const BigWrapper = styled.div`
  width: 100%;   
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 48px;
`
const TitleWrapper = styled.div`
  width: 100%;   
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Logo = styled(Link)`
  position: relative;
  width: 150px;
  height: 75px;
  text-decoration: none;
  cursor: pointer;

  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent; 
`
const Close = styled.div`
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
  outline: none;

  -webkit-tap-highlight-color: transparent;
  user-select: none
`
const Menu = styled.ul`
  width: 100%;  
  list-style: none;
  text-align: left;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`
const Item = styled.li`
  color: ${storeData.primaryColor};
  font-size: 16px;
  font-weight: 500;
  width: 80%;
  
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color:  rgba(255, 255, 255, 0); 
  user-select: none;
  transition: 0.2s ease-in-out;

  &:hover {
    color: ${storeData.primaryColor};
    transition: 0.2s ease-in-out;
  }
  &::after {
    display:block;
    content: '';
    border-bottom: solid 2px ${storeData.primaryColor};  
    transform: scaleX(0);  
    transition: transform 250ms ease-in-out;
  }
  &:hover::after {
    transform: scaleX(1);
  }
`
const PageLink = styled.a`
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-family: 'Montserrat', sans-serif;
`
const PageInternalLink = styled(Link)`
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-family: 'Montserrat', sans-serif;
`
const BWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`
const CheckoutButton = styled.a`
  width: 100%;
  min-height: 3rem;
  margin: 0;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);

  background-color: ${storeData.primaryColor};
  background-clip: padding-box;

  border: 1px solid transparent;
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;

  color: ${storeData.secondaryColor};
  font-family: "Montserrat";
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  text-decoration: none;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
    background-color: ${storeData.primaryColor};
    box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
    transform: translateY(0);
  }
`
const Span = styled.span`
  font-family: "Montserrat";
  font-size: 14px;
  font-weight: 500;
`
const LogoutButton = styled.button`
  width: 100%;
  min-height: 3rem;
  margin: 0;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);

  background-color: ${storeData.secondaryColor};
  background-clip: padding-box;

  border: 1px solid transparent;
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;

  color: #fff;
  font-family: "Montserrat";
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  text-decoration: none;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
`