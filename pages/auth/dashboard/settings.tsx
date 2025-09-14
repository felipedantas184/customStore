import { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import styled from "styled-components";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import fireDB from "@/firebase/initFirebase";
import DashboardLayout from "@/layout/DashLayout";
import Head from "next/head";

// props da loja
export async function getServerSideProps() {
  const storeInfo = await getDocs(collection(fireDB, "store"));
  let storeData: any = {};
  storeInfo.forEach((doc) => (storeData = doc.data()));

  return {
    props: {
      storeData,
    },
  };
}

export default function DashboardPage({ storeData }: any) {
  const [editing, setEditing] = useState<{ [key: string]: boolean }>({});
  const [name, setName] = useState(storeData.title || "");
  const [description, setDescription] = useState(storeData.description || "");
  const [email, setEmail] = useState(storeData.email || "");
  const [socialLinks, setSocialLinks] = useState({
    instagram: storeData.instagram || "",
    facebook: "",
    whatsapp: storeData.whatsApp || "",
  });

  // === CUPONS ===
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCoupon, setNewCoupon] = useState({ code: "", percent: 0 });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const query = await getDocs(collection(fireDB, "store", "info", "coupons"));
    const list: any[] = [];
    query.forEach((docu) => list.push({ id: docu.id, ...docu.data() }));
    setCoupons(list);
  };

  const addCoupon = async () => {
    if (!newCoupon.code || newCoupon.percent <= 0) {
      alert("Preencha um código e uma porcentagem válida!");
      return;
    }
    await addDoc(collection(fireDB, "store", "info", "coupons"), {
      code: newCoupon.code.toUpperCase(),
      percent: Number(newCoupon.percent),
      active: true,
    });
    setNewCoupon({ code: "", percent: 0 });
    fetchCoupons();
  };

  const removeCoupon = async (id: string) => {
    await deleteDoc(doc(fireDB, "store", "info", "coupons", id));
    fetchCoupons();
  };

  // === REDES SOCIAIS INPUTS ===
  const renderSocialInputs = () => {
    const fields = ["instagram", "facebook", "whatsapp"] as const;
    return fields.map((field) => (
      <InputWrapper key={field}>
        <Input
          placeholder={field}
          value={socialLinks[field]}
          disabled={!editing["socialLinks"]}
          onChange={(e) =>
            setSocialLinks({ ...socialLinks, [field]: e.target.value })
          }
        />
      </InputWrapper>
    ));
  };

  return (
    <>
      <Head>
        <title>Dashboard {storeData.title}</title>
      </Head>

      <DashboardLayout>
        <Section>
          <Title>⚙️ Configurações da Loja</Title>

          {/* Nome */}
          <Field>
            <Label>Nome da Loja</Label>
            <InputWrapper>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing["name"]}
              />
              {!editing["name"] ? (
                <IconButton onClick={() => setEditing({ ...editing, name: true })}>
                  <AiOutlineEdit size={18} />
                </IconButton>
              ) : (
                <>
                  <IconButton>
                    <AiOutlineCheck size={18} color="green" />
                  </IconButton>
                  <IconButton>
                    <AiOutlineClose size={18} color="red" />
                  </IconButton>
                </>
              )}
            </InputWrapper>
          </Field>

          {/* Descrição */}
          <Field>
            <Label>Descrição</Label>
            <InputWrapper>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!editing["description"]}
              />
              {!editing["description"] ? (
                <IconButton
                  onClick={() => setEditing({ ...editing, description: true })}
                >
                  <AiOutlineEdit size={18} />
                </IconButton>
              ) : (
                <>
                  <IconButton>
                    <AiOutlineCheck size={18} color="green" />
                  </IconButton>
                  <IconButton>
                    <AiOutlineClose size={18} color="red" />
                  </IconButton>
                </>
              )}
            </InputWrapper>
          </Field>

          {/* Email */}
          <Field>
            <Label>Email da Loja</Label>
            <InputWrapper>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editing["email"]}
              />
              {!editing["email"] ? (
                <IconButton onClick={() => setEditing({ ...editing, email: true })}>
                  <AiOutlineEdit size={18} />
                </IconButton>
              ) : (
                <>
                  <IconButton>
                    <AiOutlineCheck size={18} color="green" />
                  </IconButton>
                  <IconButton>
                    <AiOutlineClose size={18} color="red" />
                  </IconButton>
                </>
              )}
            </InputWrapper>
          </Field>

          {/* Redes Sociais */}
          <Field>
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: "8px",
                justifyContent: "space-between",
                marginTop: "4px",
              }}
            >
              <Label>Redes Sociais</Label>
              {!editing["socialLinks"] ? (
                <IconButton
                  onClick={() => setEditing({ ...editing, socialLinks: true })}
                >
                  <AiOutlineEdit size={18} />
                </IconButton>
              ) : (
                <>
                  <IconButton>
                    <AiOutlineCheck size={18} color="green" />
                  </IconButton>
                  <IconButton>
                    <AiOutlineClose size={18} color="red" />
                  </IconButton>
                </>
              )}
            </div>
            <InputWrapper
              style={{ flexDirection: "column", gap: "8px", width: "100%" }}
            >
              {renderSocialInputs()}
            </InputWrapper>
          </Field>

          {/* CUPONS */}
          <SectionDivider />
          <Title>🎟️ Cupons de Desconto</Title>

          <CouponForm>
            <Input
              placeholder="Código do cupom"
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, code: e.target.value })
              }
            />
            <Input
              type="tel"
              placeholder="%"
              value={newCoupon.percent}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, percent: Number(e.target.value) })
              }
            />
            <AddButton type="button" onClick={addCoupon}>
              Adicionar
            </AddButton>
          </CouponForm>

          <CouponList>
            {coupons.map((c) => (
              <CouponItem key={c.id}>
                <span>
                  <b>{c.code}</b> - {c.percent}%
                </span>
                <IconButton onClick={() => removeCoupon(c.id)}>
                  <AiOutlineDelete size={18} color="red" />
                </IconButton>
              </CouponItem>
            ))}
          </CouponList>
        </Section>
      </DashboardLayout>
    </>
  );
}

/* ====== ESTILOS ====== */
const Section = styled.section`
  min-height: 100%;
  width: 100%;
  background-color: #f6f6f6;
  padding: 25px;
  margin: 0 auto;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 12px;
`;

const Field = styled.div`
  width: 50%;
`;

const Label = styled.label`
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input<{ disabled?: boolean }>`
  flex: 1;
  padding: 8px 10px;
  border: ${(props) =>
    props.disabled ? "1px solid #ddd" : "1px solid #0070f3"};
  border-radius: 6px;
  background-color: ${(props) => (props.disabled ? "#f9f9f9" : "white")};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #555;
  display: flex;
  align-items: center;
  &:hover {
    color: #0070f3;
  }
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 20px 0;
`;

const CouponForm = styled.div`
  display: flex;
  gap: 10px;
  width: 50%;
`;

const AddButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background-color: #0070f3;
  color: white;
  cursor: pointer;
`;

const CouponList = styled.ul`
  list-style: none;
  padding: 0;
  width: 50%;
`;

const CouponItem = styled.li`
  background: white;
  padding: 10px 12px;
  margin-top: 8px;
  border-radius: 6px;
  border: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;