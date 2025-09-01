import GeneralInfo from "@/components/Dashboard/GeneralInfo";
import OrdersTable from "@/components/Dashboard/OrdersTable";
import ProductsList from "@/components/Dashboard/ProductsList";
import fireDB from "@/firebase/initFirebase";
import DashboardLayout from "@/layout/DashLayout";
import { Order, Product, Variant } from "@/types/productType";
import storeData from "@/utils/storeData";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import { useState } from "react";
import styled from "styled-components";

export async function getServerSideProps() {
  const DBProducts = await getDocs(collection(fireDB, "products"));
  const products: any = []
  DBProducts.forEach((doc) => {
    const obj = {
      id: doc.id,
      ...doc.data()
    }

    products.push(obj)
  });

  const DBOrders = await getDocs(collection(fireDB, "orders"));
  const orders: any = []
  DBOrders.forEach((doc) => {
    const obj = {
      id: doc.id,
      ...doc.data()
    }

    orders.push(obj)
  });
  return {
    props: {
      products,
      orders
    }
  }
}


export default function DashboardPage({ products, orders }: { products: Product[], orders: Order[] }) {
  const [ordersState, setOrdersState] = useState<Order[]>(orders);

  const getProductName = (productId: string) => {
    const product = products.filter((product: any) => product.id == productId)
    const productName = (product[0].title)

    return productName
  }
  const getVariantName = (productId: string, variantId: string) => {
    const product = products.filter((product: any) => product.id == productId)
    const productVariants = (product[0].variants)

    const variant = productVariants.filter((variant: Variant) => variant.id == variantId)
    if (variant.length > 0) {
      const variantName = variant[0].name
      return variantName
    } else {
      return "??"
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard {storeData.title}</title>
        <meta name="description" content={`Dashboard ${storeData.title}`} />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />

        <meta property="og:title" content={`Dashboard ${storeData.title}`} />
        <meta property="og:description" content={`Dashboard ${storeData.title}`} />
        <meta property="og:image" content="/assets/icons/apple-touch-icon.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:site_name" content={`Dashboard ${storeData.title}`} />

        <meta property="twitter:title" content={`Dashboard ${storeData.title}`} />
        <meta property="twitter:description" content={`Dashboard ${storeData.title}`} />
        <meta property="twitter:image" content="/assets/icons/apple-touch-icon.png" />
      </Head>

      <DashboardLayout>
        <Section>
          <GeneralInfo orders={orders} />
          <OrdersTable
            orders={ordersState}
            setOrders={setOrdersState}
            getProductName={getProductName}
            getVariantName={getVariantName}
          />
          <ProductsList products={products} />
        </Section>
      </DashboardLayout>
    </>
  );
}



const Section = styled.section`
  background-color: #F6F6F6;
  padding: 25px 8px;
  margin-left: auto;
  margin-right: auto;
  
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: flex-start;
  align-items: center;
`
const Double = styled.div`  
  width: 100%;
  
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: space-between;
  align-items: flex-start;

  @media screen and (max-width: 768px) {
  flex-direction: column;
  align-items: center;
}
`