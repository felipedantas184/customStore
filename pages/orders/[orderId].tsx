import OrderConfirmation from "@/components/Order/OrderConfirmation";
import OrderInfo from "@/components/Order/OrderInfo";
import OrderList from "@/components/Order/OrderList";
import fireDB from "@/firebase/initFirebase";
import Layout from "@/layout/CustomLayout";
import { Order } from "@/types/productType";
import storeData from "@/utils/storeData";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import styled from "styled-components";

export const getServerSideProps = async (context: any) => {
  const id = context.params.orderId;
  const data = await getDoc(doc(fireDB, "orders", id));
  const order = data.data()
  if (!order) {
    return {
      notFound: true, // Retorna 404 se o pedido não for encontrado
    };
  }
  order.id = id

  if (order.cart) {
    const productPromises = order.cart.map(async (item: any) => {
      const productDoc = await getDoc(doc(fireDB, "products", item.productId));
      const productData = productDoc.data();
      return {
        ...item,
        product: productData ? { ...productData, id: item.productId } : null, // Inclui os dados do produto
      };
    })

    const enrichedCart = await Promise.all(productPromises);

    order.cart = enrichedCart;
  }

  return {
    props: {
      order: order,
    }
  }
}

export default function OrderConfirmationPage({ order }: { order: Order }) {
  const handleCheckout = async () => {
    const response = await fetch("/api/mercadoPago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: order.cart, delivery: order.delivery }),
    });
    const data = await response.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    }
  };

  return (
    <>
      <Head>
        <title>Seu Pedido Foi Registrado! | {storeData.title}</title>
        <meta name="description" content="Falta pouco para receber seu pedido! Efetue o pagamento para confirmar o pedido." />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />

        <meta property="og:title" content={`Seu Pedido Foi Registrado! | ${storeData.title}`} />
        <meta property="og:description" content="Falta pouco para receber seu pedido! Efetue o pagamento para confirmar o pedido." />
        <meta property="og:image" content="/assets/icons/apple-touch-icon.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:site_name" content={`Seu Pedido Foi Registrado! | ${storeData.title}`} />

        <meta property="twitter:title" content={`Seu Pedido Foi Registrado! | ${storeData.title}`} />
        <meta property="twitter:description" content="Falta pouco para receber seu pedido! Efetue o pagamento para confirmar o pedido." />
        <meta property="twitter:image" content="/assets/icons/apple-touch-icon.png" />
      </Head>

      <Layout>
        <Section>
          <BackWrapper href={'/'} >
            <FaArrowLeft size={16} color="#13131A" />
            <Span>Página inicial</Span>
          </BackWrapper>
          <Wrapper>
            <ColumnWrapper>
              <OrderConfirmation order={order} />
              {/**<button onClick={handleCheckout}>Pagar com Mercado Pago</button> */}
              <OrderInfo order={order} />
            </ColumnWrapper>
            <OrderList order={order} />
          </Wrapper>
        </Section>
      </Layout>
    </>
  );
}



const Section = styled.section`
  background-color: #F6F6F6;
  padding: 25px 0;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
`
const BackWrapper = styled(Link)`
  width: 1080px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 16px;

  align-self: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
`
const Span = styled.span`
  color: #5A5A5A;
  font-size: 14px;
  text-align: center;
  font-weight: 500;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  max-width: 1080px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`
const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`