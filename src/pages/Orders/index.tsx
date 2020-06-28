import React, { useEffect, useState } from 'react';
import { Image, Alert } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: number;
  thumbnail_url: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Product[]>([]);

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      api
        .get('/orders')
        .then(response => {
          const foundOrders = response.data;
          const formattedOrders: Product[] = foundOrders.map(
            (food: Product) => {
              const { id, name, description, price, thumbnail_url } = food;
              return {
                id,
                name,
                description,
                price,
                thumbnail_url,
                formattedPrice: formatValue(price),
              };
            },
          );
          setOrders(formattedOrders);
        })
        .catch(err => {
          Alert.alert('Erro ao buscar os pedidos.', `Detalhes: ${err}`);
        });
    }

    loadOrders();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food key={item.id} activeOpacity={0.6}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
