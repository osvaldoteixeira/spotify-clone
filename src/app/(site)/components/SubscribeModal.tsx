"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { useUser } from "@/hooks/useUser";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import { Price, ProductWithPrice } from "@/types";
import Modal from "./Modal";
import Button from "./Button";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({
  products
}) => {
  const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();
  const router = useRouter();

  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  }

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error('Você precisa estar logado');
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast('Você já possui uma assinatura ativa');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  let content = (
    <div className="text-center">
      Nenhum produto disponível.
    </div>
  );

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return (
              <div key={product.id}>
                Nenhum preço disponível
              </div>
            );
          }

          return product.prices.map((price) => (
            <Button 
              key={price.id} 
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className="mb-4"
            >
              {`Assinar por ${formatPrice(price)} por ${price.interval}`}
            </Button>
          ))
        })}
      </div>
    )
  }

  if (subscription) {
    content = (
      <div className="text-center">
        Você já possui uma assinatura ativa.
      </div>
    )
  }

  return (
    <Modal
      title="Apenas para usuários premium"
      description="Ouça música com o Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
}

export default SubscribeModal;
