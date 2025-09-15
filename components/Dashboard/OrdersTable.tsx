import fireDB from "@/firebase/initFirebase";
import { Order } from "@/types/productType";
import storeData from "@/utils/storeData";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";

const OrdersTable = ({
  orders,
  setOrders,
  getProductName,
  getVariantName
}: {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  getProductName: (productId: string) => string;
  getVariantName: (productId: string, variantId: string) => string;
}) => {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  async function updateOrderStatus(orderId: string, newStatus: string) {
    if (!newStatus || updatingOrderId) return;
    setUpdatingOrderId(orderId);

    try {
      await updateDoc(doc(fireDB, "orders", orderId), { status: newStatus });
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert("Erro ao atualizar status: " + error);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  function byDate(a: Order, b: Order) {
    if (a.timeStamp > b.timeStamp) return -1;
    if (a.timeStamp < b.timeStamp) return 1;
    return 0;
  }

  function StatusBadge({
    status,
    onChange,
    loading
  }: {
    status: string;
    onChange: (newStatus: string) => void;
    loading?: boolean;
  }) {
    let bg = "#ccc";
    if (status === "Pago") bg = "#4caf50";
    else if (status === "Pendente") bg = "#ff9800";
    else if (status === "Cancelado") bg = "#f44336";
    else if (status === "Enviado") bg = "#2196f3";
    else if (status === "Concluído") bg = "#9c27b0";

    return (
      <DropdownWrapper>
        <Badge style={{ backgroundColor: bg }}>
          {loading ? "Atualizando..." : status}
        </Badge>
        <Dropdown>
          <li onClick={() => onChange("Pendente")}>Pendente</li>
          <li onClick={() => onChange("Pago")}>Pago</li>
          <li onClick={() => onChange("Enviado")}>Enviado</li>
          <li onClick={() => onChange("Concluído")}>Concluído</li>
          <li onClick={() => onChange("Cancelado")}>Cancelado</li>
        </Dropdown>
      </DropdownWrapper>
    );
  }

  return (
    <Wrapper>
      <TableHeader>
        <Table>
          <thead>
            <Tr>
              <Th>Cliente</Th>
              <Th>Entrega</Th>
              <Th>Produtos</Th>
              <Th>Pagamento</Th>
              <Th>Total</Th>
              <Th>Data</Th>
              <Th>Status</Th>
            </Tr>
          </thead>
        </Table>
      </TableHeader>

      <TableContent>
        <Table>
          <tbody>
            {orders.sort(byDate).map((order: Order) => (
              <Tr key={order.id}>
                <Td>{order.personal.name}</Td>
                <Td>
                  {order.deliveryType === "pickup"
                    ? "📍 Retirada"
                    : `🚚 ${order.delivery?.address}, ${order.delivery?.number}`}
                </Td>
                <Td>
                  {order.cart.map((item, idx) => (
                    <div key={idx}>
                      {getProductName(item.productId)}{" "}
                      {getVariantName(item.productId, item.variantId)} (x
                      {item.quantity})
                    </div>
                  ))}
                </Td>
                <Td>{order.paymentMethod}</Td>
                <Td>
                  <b>
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    }).format(
                      order.delivery
                        ? order.delivery.freight + order.amount
                        : order.amount
                    )}
                  </b>
                </Td>
                <Td>
                  {order.timeStamp.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$3/$2/$1 $4:$5')}
                </Td>
                <Td>
                  <StatusBadge
                    status={order.status}
                    onChange={(s) => updateOrderStatus(order.id, s)}
                    loading={updatingOrderId === order.id}
                  />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContent>
    </Wrapper>
  );
};

export default OrdersTable;

/* ---------- Estilos ---------- */

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 10px;
`;

const TableHeader = styled.div`
  width: 100%;
  background-color: ${storeData.secondaryColor};
`;

const TableContent = styled.div`
  width: 100%;
  height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Tr = styled.tr`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:nth-child(even) {
    background: #f9f9f9;
  }
`;

const Th = styled.th`
  padding: 16px;
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 14px;
  flex: 1;
  text-align: center;
  font-size: 13px;
  color: #333;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;

  &:hover ul {
    display: block;
  }
`;

const Dropdown = styled.ul`
  display: none;
  position: absolute;
  top: 110%;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 0;
  list-style: none;
  z-index: 10;

  li {
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background: #f2f2f2;
    }
  }
`;

const Actions = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  svg {
    color: #666;
    transition: 0.2s;
  }

  &:hover ul {
    display: block;
  }
`;

const ActionsMenu = styled.ul`
  display: none;
  position: absolute;
  top: 120%;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 0;
  list-style: none;
  z-index: 10;
  min-width: 150px;

  li {
    padding: 6px 12px;
    font-size: 13px;
    cursor: pointer;

    &:hover {
      background: #f2f2f2;
    }
  }
`;