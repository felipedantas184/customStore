import type { NextApiRequest, NextApiResponse } from "next";

// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Adicione as credenciais
const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { items, delivery } = req.body || { items: [], delivery: null };

  // Caso items esteja vazio, usar valores de exemplo
  const defaultItems = [
    {
      id: "4ukih3NRntEiVPBMBF06",
      variantName: "128 Gb",
      price: 4399,
      quantity: 1,
      productId: "4ukih3NRntEiVPBMBF06",
      variantId: "1d5c83787201",
      product: {
        variants: [
          { stock: 8, price: 4399, promotional: null, name: "128 Gb", id: "1d5c83787201" },
          { stock: 10, price: 4899, promotional: 4799, id: "b20550f7f871", name: "256 Gb" },
        ],
        description: "Samsung Galaxy S24, 256GB, 8GB RAM, bateria 4000mAh, Câmera Tripla Traseira de 50MP , Exynos 2400, tela infinita 6.2 1-120Hz, Dual Chip, eSIM, Cadeado Galaxy, Galaxy AI, inteligencia artificial, tradução de voz",
        brand: "Samsung",
        category: "Celulares",
        title: "Galaxy S24",
        imageUrl: ["https://firebasestorage.googleapis.com/v0/b/wpp-catalog.appspot.com/o/images%2F4ukih3NRntEiVPBMBF06%2Fgalaxys24.webp849a57da-0c03-49a3-a0ec-fda4dff50491?alt=media&token=7e033793-cf21-4f08-be73-5e3b491a4edf"]
      }
    },
    {
      id: "4ukih3NRntEiVPBMBF06",
      variantName: "128 Gb",
      price: 5000,
      quantity: 2,
      productId: "4ukih3NRntEiVPBMBF06",
      variantId: "1d5c83787201",
      product: {
        variants: [
          { stock: 8, price: 4399, promotional: null, name: "128 Gb", id: "1d5c83787201" },
          { stock: 10, price: 4899, promotional: 4799, id: "b20550f7f871", name: "256 Gb" },
        ],
        description: "Samsung Galaxy S24, 256GB, 8GB RAM, bateria 4000mAh, Câmera Tripla Traseira de 50MP , Exynos 2400, tela infinita 6.2 1-120Hz, Dual Chip, eSIM, Cadeado Galaxy, Galaxy AI, inteligencia artificial, tradução de voz",
        brand: "Samsung",
        category: "Celulares",
        title: "Galaxy S24",
        imageUrl: ["https://firebasestorage.googleapis.com/v0/b/wpp-catalog.appspot.com/o/images%2F4ukih3NRntEiVPBMBF06%2Fgalaxys24.webp849a57da-0c03-49a3-a0ec-fda4dff50491?alt=media&token=7e033793-cf21-4f08-be73-5e3b491a4edf"]
      }
    },
  ];

  try {
    const newPreference = new Preference(mercadopago);

    const products = (items && items.length > 0 ? items : defaultItems).map((item: any) => ({
      title: `${item.product.title} - ${item.variantName}`,
      quantity: Number(item.quantity),
      currency_id: "BRL",
      unit_price: Number(item.price),
    }));

    // Se houver frete, adiciona como item extra
    if (delivery?.freight) {
      products.push({
        title: "Frete",
        quantity: 1,
        currency_id: "BRL",
        unit_price: Number(delivery.freight),
      });
    }

    const preference = await newPreference.create({
      body: {
        items: products,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
        },
        auto_return: "approved",
      }
    });

    res.status(200).json({ init_point: preference.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar a preferência." });
  }
}