type Variant = {
  id: string,
  name: string,
  price: number,
  promotional: number,
  stock: number
}

type SelectedVariant = {
  id: string,
  name: string,
  stock: number
}

type Product = {
  id: string,
  title: string,
  brand: string,
  category: string,
  description: string,
  imageUrl: string[],
  variants: Variant[],
}

type DetailProduct = {
  id: string,
  title: string,
  brand: string,
  category: string,
  description: string,
  imageUrl: string[],
  selectedVariant: SelectedVariant,
  price: number
}

type CartProduct = {
  id: string,
  title: string,
  brand: string,
  category: string,
  description: string,
  imageUrl: string[],
  selectedVariant: Variant,
  quantity: number
}

type NewProduct = {
  title: string,
  brand: string,
  category: string,
  description: string,
}

type OrderCart = {
  productId: string,
  variantId: string,
  variantName: string,
  variantPrice: number 
  quantity: number,
}

type Order = {
  id: string,
  amount: number,
  cart: OrderCart[],
  timeStamp: string,
  deliveryType: string,
  delivery?: {
    zipCode: string,
    address: string,
    complement: string,
    district: string,
    number: string,
    city: string,
    state: string,
    freight: number
  }
  paymentMethod: string,
  personal: {
    cpf: string,
    email: string,
    name: string,
    phone: string
  },
  status: string,
}

type CartItem = {
  id: string,
  title: string,
  brand: string,
  category: string,
  description: string,
  imageUrl: string[],
  selectedVariant: SelectedVariant,
  quantity: number,
  price: number
}

export type {
  Product,
  DetailProduct,
  NewProduct,
  CartItem,
  Order,
  OrderCart,
  Variant
}