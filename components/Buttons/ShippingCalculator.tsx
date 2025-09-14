import { useState } from "react";

const ShippingCalculator = () => {
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calcularFrete = async () => {
    if (!cep) return alert("Digite o CEP");
    setLoading(true);

    try {
      const res = await fetch("/api/frete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cepDestino: cep }),
      });

      const data = await res.json();
      setFrete(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao calcular frete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <input
        type="text"
        placeholder="Digite seu CEP"
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
      />
      <button
        onClick={calcularFrete}
        style={{ marginLeft: 8, padding: "8px 12px", cursor: "pointer" }}
      >
        Calcular Frete
      </button>

      {loading && <p>Calculando...</p>}

      {frete && frete.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {frete.map((opcao: any, i: number) => (
            <p key={i}>
              {opcao.company.name} - {opcao.name} <br />
              Prazo: {opcao.delivery_time} dias úteis <br />
              Preço: {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(opcao.price)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;