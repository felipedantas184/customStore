import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { cepDestino } = req.body;
  if (!cepDestino) {
    return res.status(400).json({ error: "CEP de destino é obrigatório" });
  }

  try {
    const response = await fetch("https://api.superfrete.com/api/v0/calculator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": process.env.SUPERFRETE_TOKEN || "",
      },
      body: JSON.stringify({
        from: { postal_code: "64091250" }, // CEP origem fixo (muda depois p/ da tua loja)
        to: { postal_code: cepDestino },   // usa o destino enviado pelo cliente
        services: "1,2,17,3,31", // SEDEX, PAC e Jadlog (ajusta se quiser outros)
        options: {
          own_hand: false,
          receipt: false,
          insurance_value: 0,
          use_insurance_value: false,
        },
        package: {
          height: 2,
          width: 11,
          length: 16,
          weight: 0.3,
        },
      }),
    });

    const text = await response.text();
    console.log("SuperFrete response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Resposta não é JSON", raw: text });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // 🔹 Filtra apenas serviços válidos (sem erro)
    const validServices = Array.isArray(data)
      ? data.filter((s: any) => !s.error && !s.has_error)
      : data;

    return res.status(200).json(validServices);
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    return res.status(500).json({ error: "Erro ao calcular frete" });
  }
}