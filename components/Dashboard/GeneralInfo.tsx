import { Order } from "@/types/productType";
import styled from "styled-components";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartLine,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaWallet,
  FaUserFriends,
  FaStar,
} from "react-icons/fa";
import storeData from "@/utils/storeData";

const GeneralInfo = ({ orders }: { orders: Order[] }) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.amount, 0);
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const monthlyRevenue = orders
    .filter(order => order.timeStamp.slice(4, 6) === currentMonth)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingOrders = orders.filter(o => o.status === "Pendente").length;
  const paidOrders = orders.filter(o => o.status === "Pago").length;

  const confirmedRevenue = orders
    .filter(o => o.status === "Pago")
    .reduce((acc, o) => acc + o.amount, 0);

  const uniqueCustomers = new Set(orders.map(o => o.personal.name)).size;

  const revenueByDay: { [date: string]: number } = {};
  orders.forEach(order => {
    const date = order.timeStamp.slice(0, 8); // YYYYMMDD
    revenueByDay[date] = (revenueByDay[date] || 0) + order.amount;
  });
  const bestDay = Object.entries(revenueByDay).sort((a, b) => b[1] - a[1])[0];

  const metrics = [
    { label: "Total de Pedidos", value: totalOrders, icon: <FaShoppingCart /> },
    { label: "Receita Total", value: formatBRL(totalRevenue), icon: <FaMoneyBillWave /> },
    { label: "Ticket Médio", value: formatBRL(averageTicket), icon: <FaChartLine /> },
    { label: "Total no Mês", value: formatBRL(monthlyRevenue), icon: <FaCalendarAlt /> },
    { label: "Pedidos Pendentes", value: pendingOrders, icon: <FaClock /> },
    { label: "Pedidos Pagos", value: paidOrders, icon: <FaCheckCircle /> },
    { label: "Receita Confirmada", value: formatBRL(confirmedRevenue), icon: <FaWallet /> },
    { label: "Clientes Únicos", value: uniqueCustomers, icon: <FaUserFriends /> },
    {
      label: "Melhor Dia",
      value: bestDay
        ? `${bestDay[0].slice(6, 8)}/${bestDay[0].slice(4, 6)}/${bestDay[0].slice(0, 4)} - ${formatBRL(bestDay[1])}`
        : "N/A",
      icon: <FaStar />,
    },
  ];

  return (
    <Wrapper>
      <Title>Visão Geral</Title>
      <Menu>
        {metrics.map((metric, i) => (
          <Card key={i}>
            <Icon>{metric.icon}</Icon>
            <CardContent>
              <CardTitle>{metric.label}</CardTitle>
              <CardNumber>{metric.value}</CardNumber>
            </CardContent>
          </Card>
        ))}
      </Menu>
    </Wrapper>
  );
};

const formatBRL = (value: number) =>
  Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default GeneralInfo;

// ---------- Styled Components ----------

const Wrapper = styled.div`
  width: 100%;
  padding: 0 8px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h1`
  color: #13131A;
  font-size: 20px;
  font-weight: 700;
`;

const Menu = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #FFF;
  padding: 16px 12px;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.12) 0px 2px 8px;
`;

const Icon = styled.div`
  font-size: 22px;
  color: ${storeData.terciaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h5`
  color: #13131A;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const CardNumber = styled.span`
  color: #444;
  font-size: 13px;
  font-weight: 500;
`;
