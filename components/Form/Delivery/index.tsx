import { Input, InputDoubleWrapper, InputWrapper, Label } from "./styles";

type Delivery = {
  zipCode: string,
  address: string,
  complement: string,
  district: string,
  number: string,
  city: string,
  state: string,
  freight: number
}

const Delivery = ({ delivery, setDelivery }: { delivery: Delivery, setDelivery: any }) => {
  const checkCEP = async (e: any) => {
    try {
      if (!e.target.value) return; 
      const cep = e.target.value.replace(/\D/g, '');
      await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(res => res.json()).then(data => {
        const { localidade, uf, logradouro, bairro } = data;
        let freight = 25; // valor padrão

        const cidade = localidade?.toLowerCase();
        const estado = uf?.toUpperCase();

        if (cidade === 'teresina') {
          freight = 10;
        } else if (cidade === 'timon') {
          freight = 20;
        } else if (['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'].includes(estado)) {
          freight = 20;
        }

        setDelivery({
          ...delivery,
          address: logradouro,
          district: bairro,
          city: localidade,
          state: uf,
          freight, // novo campo
        });
      })
    } catch(err) {
      console.log(err)
    }
  }


  return (
    <>
      <InputWrapper>
        <Label>CEP</Label>
        <Input type='tel' placeholder="Digite seu CEP (somente números)" required
          value={delivery.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2')} onChange={(e: any) => setDelivery({ ...delivery, zipCode: e.target.value })}
          onBlur={checkCEP}
        />
      </InputWrapper>

      <InputWrapper>
        <Label>Endereço</Label>
        <Input type='text' placeholder="Ex: Avenida Rio Poty" required disabled
          value={delivery.address} onChange={(e: any) => setDelivery({ ...delivery, address: e.target.value })}
        />
      </InputWrapper>

      <InputDoubleWrapper>
        <InputWrapper>
          <Label>Bairro</Label>
          <Input type='text' placeholder="Ex: Horto Florestal" required disabled
            value={delivery.district} onChange={(e: any) => setDelivery({ ...delivery, district: e.target.value })}
          />
        </InputWrapper>
        <InputWrapper>
          <Label>Número</Label>
          <Input type='tel' placeholder="Ex: 1234" required
            value={delivery.number} onChange={(e: any) => setDelivery({ ...delivery, number: e.target.value })}
          />
        </InputWrapper>
      </InputDoubleWrapper>

      <InputWrapper>
        <Label>Complemento</Label>
        <Input type='text' placeholder="Ex: Edifício Van Gogh, Apto 1302"
          value={delivery.complement} onChange={(e: any) => setDelivery({ ...delivery, complement: e.target.value })}
        />
      </InputWrapper>

      <InputDoubleWrapper>
        <InputWrapper>
          <Label>Cidade</Label>
          <Input type='text' placeholder="Digite sua cidade" required disabled
            value={delivery.city} onChange={(e: any) => setDelivery({ ...delivery, city: e.target.value })}
          />
        </InputWrapper>
        <InputWrapper>
          <Label>Estado</Label>
          <Input type='text' placeholder="Digite seu estado" required disabled
            value={delivery.state} onChange={(e: any) => setDelivery({ ...delivery, state: e.target.value })}
          />
        </InputWrapper>
      </InputDoubleWrapper>
    </>
  );
}

export default Delivery;