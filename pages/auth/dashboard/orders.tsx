import fireDB from "@/firebase/initFirebase";
import DashboardLayout from "@/layout/DashLayout";
import { Order, Product, Variant } from "@/types/productType";
import storeData from "@/utils/storeData";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Head from "next/head";
import { useState } from "react";
import styled from "styled-components";
import { FaUser, FaTruck, FaCheckCircle } from "react-icons/fa";

export async function getServerSideProps() {
  const DBProducts = await getDocs(collection(fireDB, "products"));
  const products: any = [];
  DBProducts.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });

  const DBOrders = await getDocs(collection(fireDB, "orders"));
  const orders: any = [];
  DBOrders.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() });
  });

  return {
    props: {
      products,
      orders,
    },
  };
}

export default function DashboardPage({
  products,
  orders,
}: {
  products: Product[];
  orders: Order[];
}) {
  const [ordersState, setOrdersState] = useState<Order[]>(orders);

  const getProductName = (productId: string) => {
    const product = products.find((product: any) => product.id === productId);
    return product ? product.title : "Produto removido";
  };

  const getVariantName = (productId: string, variantId: string) => {
    const product = products.find((product: any) => product.id === productId);
    if (!product) return "Produto removido";

    const variant = product.variants.find(
      (variant: Variant) => variant.id === variantId
    );
    return variant ? variant.name : "??";
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(fireDB, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrdersState((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Não foi possível atualizar o status.");
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard {storeData.title}</title>
        <meta name="description" content={`Dashboard ${storeData.title}`} />
      </Head>

      <DashboardLayout>
        <Section>
          <h2>📦 Pedidos</h2>

          {ordersState.length === 0 ? (
            <Empty>Nenhum pedido encontrado</Empty>
          ) : (
            <CardsWrapper>
              {ordersState.map((order) => (
                <OrderCard key={order.id}>
                  <OrderHeader>
                    <div>
                      <strong>Pedido #{order.id.slice(0, 6)}</strong>
                      <span>
                        {order.timeStamp
                          ? new Date(
                              String(order.timeStamp)
                            ).toLocaleDateString("pt-BR")
                          : "-"}
                      </span>
                    </div>
                    <StatusSelect
                      value={order.status || "Pendente"}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="Pendente">⏳ Pendente</option>
                      <option value="Pago">💳 Pago</option>
                      <option value="Enviado">🚚 Enviado</option>
                      <option value="Concluído">✅ Concluído</option>
                      <option value="Cancelado">❌ Cancelado</option>
                    </StatusSelect>
                  </OrderHeader>

                  <OrderBody>
                    <InfoLine>
                      <FaUser /> {order.personal?.name || "Cliente"}
                    </InfoLine>
                    <InfoLine>
                      <FaTruck />{" "}
                      {order.deliveryType === "delivery"
                        ? "Entrega"
                        : "Retirada"}
                    </InfoLine>

                    <ItemsList>
                      {order.cart?.map((item: any, idx: number) => (
                        <li key={idx}>
                          {getProductName(item.productId)}{" "}
                          {item.variantId &&
                            `- ${getVariantName(
                              item.productId,
                              item.variantId
                            )}`}{" "}
                          (x{item.quantity})
                        </li>
                      ))}
                    </ItemsList>
                  </OrderBody>

                  <OrderFooter>
                    <span>
                      Total:{" "}
                      <strong>
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(order.amount || 0)}
                      </strong>
                    </span>
                  </OrderFooter>
                </OrderCard>
              ))}
            </CardsWrapper>
          )}
        </Section>
      </DashboardLayout>
    </>
  );
}

/* ---------- Estilos ---------- */

const Section = styled.section`
  min-height: 100%;
  background-color: #f6f6f6;
  padding: 25px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Empty = styled.p`
  color: #555;
  text-align: center;
`;

const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  strong {
    font-size: 16px;
    display: block;
  }

  span {
    font-size: 12px;
    color: #666;
  }
`;

const StatusSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: #fafafa;
`;

const OrderBody = styled.div`
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #444;
  font-size: 14px;
`;

const ItemsList = styled.ul`
  margin: 6px 0 0 12px;
  padding: 0;
  list-style: disc;
  font-size: 13px;
  color: #444;
`;

const OrderFooter = styled.div`
  margin-top: auto;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  justify-content: flex-end;
`;