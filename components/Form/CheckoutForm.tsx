import { useEffect, useState } from "react";
import Delivery from "./Delivery";
import Payment from "./Payment";
import Personal from "./Personal";
import { useDispatch, useSelector } from "react-redux";
import { addDoc, collection } from "firebase/firestore";
import fireDB from "@/firebase/initFirebase";
import { removeFromCart } from "@/redux/cart.slice";
import { useRouter } from "next/router";
import { addOrder } from "@/redux/order.slice";
import { IoLocationSharp } from "react-icons/io5";
import { FaTruck, FaUser, FaWallet } from "react-icons/fa6";
import styled from "styled-components";
import { sendOrderEmail } from "@/lib/api";
import { CartItem } from "@/types/productType";
import { updateStockAfterPurchase } from "@/utils/functions";
import storeData from "@/utils/storeData";

const CheckoutForm = () => {
  const cart = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
  });
  const [pickUp, setPickUp] = useState(true);
  const [onLoad, setOnLoad] = useState(false);
  const [delivery, setDelivery] = useState({
    zipCode: '',
    address: '',
    complement: '',
    district: '',
    number: '',
    city: '',
    state: '',
    freight: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [mesage, setMesage] = useState('');

  // estados para cupom
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);


  const subtotal = cart.reduce((acc: any, curr: any) => acc + curr.price * curr.quantity, 0);
  const discount = subtotal * discountPercent;
  const total = subtotal + delivery.freight - discount;
  
  const applyCoupon = () => {
    if (coupon.toUpperCase() === "DESCONTO10") {
      setDiscountPercent(0.1); // 10%
      alert("Cupom aplicado com sucesso!");
      setIsCouponApplied(true);
    } else {
      setDiscountPercent(0);
      alert("Cupom inválido.");
    }
  };

  useEffect(() => {
    const deliveryMesageComposure = '*_Informações da Entrega:_*%0A' + delivery.address + ', ' + delivery.number + ' - ' + delivery.complement + '%0A' + delivery.zipCode + '%0A' + delivery.city + ', ' + delivery.state;
    const PersonalMesageComposure = '*_Informações da Cliente:_*%0A' + "```" + personal.name + '%0A' + personal.email + '%0A' + personal.phone + "```";
    const cartMesageComposure = cart.reduce(function (prevVal: any, currVal: any, idx: any) {
      return idx == 0 ? Number(idx + 1) + '. ' + "```" + currVal.title + ` (x${currVal.quantity})` + "```" + `%0A${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(currVal.price * currVal.quantity)}` : prevVal + '%0A%0A' + Number(idx + 1) + '. ' + "```" + currVal.title + ` (x${currVal.quantity})` + "```" + `%0A${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(currVal.price * currVal.quantity)}`;
    }, '');
    setMesage("*RESUMO DA COMPRA*%0A%0A" + PersonalMesageComposure + '%0A%0A_______________________%0A%0A' + deliveryMesageComposure + '%0A%0A_______________________%0A%0A' + '*_Informações do Pedido:_*%0A%0A' + cartMesageComposure + '%0A%0A_______________________%0A%0A' + `*Total: ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(total)}*`);
  }, [cart, delivery, personal, total]);

  function pad2(n: number) { return n < 10 ? '0' + n : n }
  const date = new Date();
  const currentDate = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());

  const handleOrder = async (e: any) => {
    e.preventDefault();
    const cartOrder = cart.map((item: CartItem) => ({
      productId: item.id,
      variantId: item.selectedVariant.id,
      variantName: item.selectedVariant.name,
      quantity: item.quantity,
      price: item.price,
    }));
    setOnLoad(true);

    try {
      const docRef = await addDoc(collection(fireDB, "orders"), {
        personal,
        cart: cartOrder,
        delivery: pickUp ? null : delivery,
        deliveryType: pickUp ? "pickup" : "delivery",
        paymentMethod,
        amount: total,
        discount,
        coupon,
        timeStamp: currentDate,
        status: 'Pendente'
      });

      const orderData = {
        id: docRef.id,
        personal,
        cart,
        delivery: pickUp ? null : delivery,
        deliveryType: pickUp ? "pickup" : "delivery",
        paymentMethod,
        amount: total,
        discount,
        coupon,
        date: currentDate,
        status: 'Pendente'
      };

      dispatch(addOrder(orderData));

      try {
        await sendOrderEmail(orderData);
      } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        alert("Não foi possível enviar o e-mail de confirmação.");
      }

      localStorage.setItem("easy-phone-order", JSON.stringify(orderData));
      localStorage.removeItem("easy-phone-cart");

      await updateStockAfterPurchase(cart);

      cart.forEach((item: any) => dispatch(removeFromCart(item)));

      router.push(`/orders/${docRef.id}`);
      alert("Pedido enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao processar o pedido:", error);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
    }
  };

  return (
    <Wrapper onSubmit={handleOrder}>
      <Title><FaUser />Comprador</Title>
      <Personal personal={personal} setPersonal={setPersonal} />
      <Divider />
      <Title><FaTruck />Entrega</Title>
      <RadioButtons>
        <RadioInput type="radio" name="size" id="small" checked={pickUp} />
        <RadioLabel htmlFor="small" onClick={() => setPickUp(true)}><IoLocationSharp />Retirar na Loja</RadioLabel>

        <RadioInput type="radio" name="size" id="big" checked={!pickUp} />
        <RadioLabel htmlFor="big" onClick={() => setPickUp(false)} ><FaTruck />Entrega em Casa</RadioLabel>
      </RadioButtons>
      {(!pickUp) ? (
        <Delivery delivery={delivery} setDelivery={setDelivery} />
      ) : (<></>)}
      <Divider />
      <Title><FaWallet />Pagamento</Title>
      <Payment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
      <Divider />

      {/* Cupom */}
      <TopicWrapper>
        <CouponInput
          type="text"
          placeholder="Digite o cupom"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          disabled={isCouponApplied}
        />
        <CouponButton
          type="button"
          onClick={applyCoupon}
          disabled={isCouponApplied}
        >
          {isCouponApplied ? "Aplicado" : "Aplicar"}
        </CouponButton>
      </TopicWrapper>


      <TopicWrapper>
        <TopicFreight>Frete</TopicFreight>
        <Span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(delivery.freight)}</Span>
      </TopicWrapper>
      <TopicWrapper>
        <TopicFreight>Valor Itens</TopicFreight>
        <Span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(subtotal)}</Span>
      </TopicWrapper>
      {discount > 0 && (
        <TopicWrapper>
          <TopicFreight>Desconto</TopicFreight>
          <Span>-{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(discount)}</Span>
        </TopicWrapper>
      )}
      <TopicWrapper>
        <Topic>Total</Topic>
        <Price>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(total)}</Price>
      </TopicWrapper>

      <CheckoutButton disabled={onLoad} type="submit">{(onLoad) ? 'Processando Pedido...' : 'Finalizar Pedido'}</CheckoutButton>
    </Wrapper>
  );
};

export default CheckoutForm;



const Wrapper = styled.form`
  width: 100%;
  max-width: 1080px;
  padding: 8px;
	margin-left: auto;
	margin-right: auto;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
  gap: 12px;
`
const Title = styled.h1`
  color: #13131A;
  font-size: 16px;
  font-weight: 600;
  align-self: flex-start;

  display: flex;
  align-items: center;
  gap: 4px;
`
const Divider = styled.div`
  width: 100%;
  margin-top: 8px;
  border-top: 1px dotted #BBB;
`
const TopicWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const Topic = styled.span`
  color: #13131A;
  font-size: 18px;
  font-weight: 600;
`
const TopicFreight = styled.span`
  color: #13131A;
  font-size: 14px;
  font-weight: 500;
`
const Span = styled.span`
  color: #13131A;
  font-size: 14px;
  font-weight: 400;
`
const Price = styled.span`
  color: #13131A;
  font-size: 16px;
  font-weight: 600;
`
const CheckoutButton = styled.button`
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

  &:disabled {
    background-color: #545454;
  }
`
const RadioButtons = styled.div`
  align-self: flex-start;
  padding: 4px; 
   
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`
const RadioInput = styled.input`
  display: none;

  &:checked + label {
    background-color: ${storeData.terciaryColor};
    color: #FFFFFF;
  }
`
const RadioLabel = styled.label`
  position: relative;
  color: ${storeData.terciaryColor};
  font-family: "Montserrat";
  font-size: 16px;
  border: 2px solid ${storeData.terciaryColor};
  border-radius: 5px;
  padding: 8px 16px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`
const CouponInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${storeData.secondaryColor};
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }
`;

const CouponButton = styled.button`
  padding: 10px 16px;
  margin-left: 8px;
  background-color: ${storeData.secondaryColor};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #13131A;
  }

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
`;