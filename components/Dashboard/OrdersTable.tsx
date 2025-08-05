import fireDB from "@/firebase/initFirebase";
import { Order } from "@/types/productType";
import storeData from "@/utils/storeData";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import styled from "styled-components";

const OrdersTable = ({
  orders,
  setOrders,
  getProductName,
  getVariantName
}: {
  orders: Order[],
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
  getProductName: (productId: string) => string,
  getVariantName: (productId: string, variantId: string) => string
}) => {
  const [editingOrder, setEditingOrder] = useState<any>()
  const [updateStatus, setUpdateStatus] = useState<string>()
  const [isUpdating, setIsUpdating] = useState(false);

  async function editStatus(order: any) {
    if (order === editingOrder) {
      setEditingOrder(null)
    } else {
      setEditingOrder(order)
    }
  }

  async function updateOrderStatus(orderId: string) {
    if (!updateStatus || isUpdating) return;
    setIsUpdating(true);

    try {
      await updateDoc(doc(fireDB, "orders", orderId), {
        status: updateStatus
      });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: updateStatus } : order
        )
      );
      alert("Status atualizado com sucesso!");
      setEditingOrder(null);
      setUpdateStatus("");
    } catch (error) {
      alert("Erro ao atualizar status: " + error);
    } finally {
      setIsUpdating(false);
    }
  }

  function byDate(a: Order, b: Order) {
    if (a.timeStamp > b.timeStamp) { return -1; }
    if (a.timeStamp < b.timeStamp) { return 1; }
    return 0;
  }

  return (
    <Wrapper>
      <TableHeader>
        <Table cellPadding={4} cellSpacing={0} border={0}>
          <thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Entrega</Th>
              <Th>Produtos</Th>
              <Th>Pagamento</Th>
              <Th>Total</Th>
              <Th>Data</Th>
              <Th>Status</Th>
              <Th style={{ flex: 0.5 }} >Ações</Th>
            </Tr>
          </thead>
        </Table>
      </TableHeader>
      <TableContent>
        <Table cellPadding={0} cellSpacing={0} border={0}>
          <tbody>
            {(orders.sort(byDate).map((order: Order) => (
              <Tr key={order.id}>
                <Td>{order.personal.name}</Td>
                <Td>{(order.deliveryType === 'pickup' ? "Retirada" : `${order.delivery?.address}, ${order.delivery?.number}`)}</Td>
                <Td>{order.cart.reduce((acc: any, curr: any) => `${acc} ${getProductName(curr.productId)} ${getVariantName(curr.productId, curr.variantId)} (x${curr.quantity})`, '')}</Td>
                <Td>{order.paymentMethod}</Td>
                <Td>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', }).format(order.delivery ? order.delivery.freight + order.amount : order.amount)}</Td>
                <Td>{order.timeStamp.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$3/$2/$1 $4:$5:$6')}</Td>
                {(editingOrder === order) ? (
                  <Td>
                    <select
                      defaultValue={order.status}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <option hidden>{order.status}</option>
                      <option value={'Pendente'}>Pendente</option>
                      <option value={'Pago'}>Pago</option>
                    </select>
                  </Td>
                ) : (
                  <Td>{order.status}</Td>
                )}
                <Td style={{ flex: 0.5 }}>
                  {(editingOrder === order) ? (
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <FaSave
                        onClick={() => updateOrderStatus(order.id)}
                        style={{ cursor: 'pointer' }} size={16} color={'#C4C4C4'}
                      />
                      <FaX
                        onClick={() => setEditingOrder(null)}
                        style={{ cursor: 'pointer' }} size={16} color={'#C4C4C4'}
                      />
                    </div>
                  ) : (
                    <FaEdit
                      style={{ cursor: 'pointer' }}
                      size={16}
                      color={'#C4C4C4'}
                      onClick={() => editStatus(order)}
                    />
                  )}
                </Td>
              </Tr>
            )))}
          </tbody>
        </Table>
      </TableContent>
    </Wrapper>
  );
}

export default OrdersTable;


const Wrapper = styled.div`
  width: 100%;

	display: flex;
	flex-direction: column;
	align-items: center;

  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 10px;
`
const TableHeader = styled.div`
  background-color: ${storeData.secondaryColor};
  overflow-x: auto;
`
const TableContent = styled.div`
  height: 500px;
  overflow-x: auto;
  margin-top: 0px;
  border: 1px solid ${storeData.secondaryColor};
  border-radius: 0 0 10px 10px;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`
const Table = styled.table`
  width:100%;
  table-layout: fixed;
`
const Tr = styled.tr`
  display: flex;
  justify-content: space-between;
`
const Th = styled.th`
  padding: 20px 15px;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
  color: #FFF;
  text-transform: uppercase;

  flex: 1;
`
const Td = styled.td`
  padding: 15px;
  text-align: center;
  vertical-align:middle;
  font-weight: 400;
  font-size: 12px;
  color: #13131A;
  border-bottom: solid 1px rgba(255,255,255,0.1);
  flex: 1;
`