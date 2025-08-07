import { InputWrapper, Label, Option, Select } from "./styles";

const Payment = ({paymentMethod, setPaymentMethod}: any) => {
  return (
    <InputWrapper>
      <Label>Forma de Pagamento</Label>
      <Select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} required>
        <Option value={''} hidden >Escolha um método</Option>
        <Option value={'Pix'} >Pagar com Pix</Option>
        <Option value={'Cartão'} >Cartão - A Combinar</Option>
        <Option value={'Espécie'} >Espécie - A Combinar</Option>
      </Select>
      <span style={{fontSize: 12}}>Pagamentos via cartão / espécie serão combinados pelo WhatsApp oficial da loja</span>
    </InputWrapper>
  );
}

export default Payment;