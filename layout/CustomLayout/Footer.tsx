import storeData from "@/utils/storeData";
import Image from "next/image";
import { FaCreditCard, FaEnvelope, FaInstagram, FaMobile, FaTruck, FaWhatsapp } from "react-icons/fa6";
import styled from "styled-components";

const Footer = () => {
  return (
    <Container>
      <Wrapper>
        <LogoWrapper>
          <Image src={'/assets/images/logos/storeTransparentLogo.png'} alt={'Logo'} fill className={'image'} />
        </LogoWrapper>
        <Grid>
          <TextWrapper>
            <Group>
              <FaTruck size={16} color={storeData.primaryColor} />
              <Title>Localização</Title>
            </Group>
            <List>
              <ListItem>Retirada na Loja</ListItem>
              <ListItem>Entrega a Domicílio</ListItem>
            </List>
          </TextWrapper>
          <TextWrapper>
            <Group>
              <FaCreditCard size={16} color={storeData.primaryColor} />
              <Title>Pagamento</Title>
            </Group>
            <List>
              <ListItem>Pagar no Pix</ListItem>
              <ListItem>Cartão de Crédito</ListItem>
              <ListItem>Cartão de Débito</ListItem>
            </List>
          </TextWrapper>
          <TextWrapper>
            <Group>
              <FaMobile size={16} color={storeData.primaryColor} />
              <Title>Redes Sociais</Title>
            </Group>
            <List>
              <SocialItem>
                <a target='_blank' href={storeData.instagramUrl} arial-label='Instagram'><FaInstagram size={18} color={storeData.primaryColor} />Instagram</a>
              </SocialItem>
              <SocialItem>
                <a target='_blank' href={`https://wa.me//${storeData.whatsAppNumber}?text=Ol%C3%A1!%20Vim%20a%20partir%20do%20site!`} arial-label='WhatsApp'><FaWhatsapp size={18} color={storeData.primaryColor} />WhatsApp</a>
              </SocialItem>
              <SocialItem>
                <a target='_blank' href={`mailto:${storeData.email}`} arial-label='Email'><FaEnvelope size={18} color={storeData.primaryColor} />Email</a>
              </SocialItem>
            </List>
          </TextWrapper>
        </Grid>
      </Wrapper>
      <Copyright>
        <CopyrightSpan target='_blank' href='https://easyshopbrasil.vercel.app/' aria-label="Easy Shop Brasil" >Easy Shop Brasil @ 2025</CopyrightSpan>
      </Copyright>
    </Container>
  );
}

export default Footer;

const Container = styled.section`
  background-color: ${storeData.secondaryColor};

  display: flex;
  flex-direction: column;
  align-items: center;
`
const Wrapper = styled.div`
  width: 100%;
  max-width: 1080px;
  padding: 32px 16px 24px 16px;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    padding: 32px 8px;
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`
const LogoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 120px;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  > div {
    position: unset !important;
  }

  .image {
    object-fit: contain;
    width: 100% !important;
    position: relative !important;
    height: unset !important;
  }
`
const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 48px;

  @media screen and (max-width: 768px) {
    margin-top: 8px;
    padding: 4px;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 32px;
    align-items: center;
  }
`
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: flex-start;
`
const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`
const Title = styled.h4`
  color: ${storeData.primaryColor};
  font-size: 18px;
`
const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`
const ListItem = styled.li`
  color: ${storeData.primaryColor};
  font-size: 16px;
  cursor: pointer;

  &::after {
    display:block;
    content: '';
    border-bottom: solid 2px ${storeData.secondaryColor};  
    transform: scaleX(0);  
    transition: transform 250ms ease-in-out;
  }
  &:hover::after {
    transform: scaleX(1);
  }
`
const SocialItem = styled.li`
  font-size: 16px;
  transition: all 0.2s ease-in-out;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent;

  &::after {
    display:block;
    content: '';
    border-bottom: solid 2px ${storeData.secondaryColor};  
    transform: scaleX(0);  
    transition: transform 250ms ease-in-out;
  }
  &:hover::after {
    transform: scaleX(1);
  }

  a {
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    color: ${storeData.primaryColor};
  }
`
const Copyright = styled.div`
  background-color: #13131A;
  width: 100%;
  padding: 12px 0;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const CopyrightSpan = styled.a`
  color: #E5E5E5;
  font-size: 14px;
  text-align: center;
`