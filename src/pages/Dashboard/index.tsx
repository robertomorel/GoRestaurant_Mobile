import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Alert } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/logo-header.png';
import SearchInput from '../../components/SearchInput';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  FilterContainer,
  Title,
  CategoryContainer,
  CategorySlider,
  CategoryItem,
  CategoryItemTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  category: number;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

interface Category {
  id: number;
  title: string;
  image_url: string;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [searchValue, setSearchValue] = useState('');

  const navigation = useNavigation();

  async function handleNavigate(id: number): Promise<void> {
    navigation.navigate('FoodDetails', { id });
  }

  /*
  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');
      const foundFoods = response.data;
      const filteredAndFormattedFoods: Food[] = foundFoods
        .filter(
          ({ name, category }: Food) =>
            (searchValue && searchValue !== ''
              ? name.includes(searchValue)
              : true) &&
            (selectedCategory ? selectedCategory === category : true),
        )
        .map((food: Food) => {
          const { id, name, description, price, thumbnail_url } = food;
          return {
            id,
            name,
            description,
            price,
            thumbnail_url,
            formattedPrice: formatValue(price),
          };
        });
      setFoods(filteredAndFormattedFoods);
    }
    */

  /*
  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // http://localhost:3000/foods?category_like=1
      // http://localhost:3000/foods?name_like=Veggie
      let endpoint = '';
      if (selectedCategory && (!searchValue || searchValue === '')) {
        endpoint = `/foods?category_like=${selectedCategory}`;
      } else if (!selectedCategory && searchValue && searchValue !== '') {
        endpoint = `/foods?name_like=${searchValue}`;
      } else if (selectedCategory && searchValue && searchValue !== '') {
        endpoint = `/foods?name_like=${searchValue}&category_like=${selectedCategory}`;
      } else {
        endpoint = '/foods';
      }
      const response = await api.get(endpoint);
      setFoods(response.data);
    }

    loadFoods();
  }, [selectedCategory, searchValue]);
  */

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods', {
        params: {
          category_like: selectedCategory || null,
          name_like: searchValue,
        },
      });
      setFoods(response.data);
    }

    loadFoods();
  }, [selectedCategory, searchValue]);

  useEffect(() => {
    async function loadCategories(): Promise<void> {
      api
        .get('/categories')
        .then(response => {
          setCategories(response.data);
        })
        .catch(err => {
          Alert.alert('Falha ao carregar as categorias', `Detalhe: ${err}`);
        });
    }

    loadCategories();
  }, []);

  function handleSelectCategory(id: number): void {
    // setSelectedCategory(id);
    setSelectedCategory(selectedCategory === id ? undefined : id);
  }

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Icon
          name="log-out"
          size={24}
          color="#FFB84D"
          onPress={() => navigation.navigate('Home')}
        />
      </Header>
      <FilterContainer>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Qual comida você procura?"
        />
      </FilterContainer>
      <ScrollView>
        <CategoryContainer>
          <Title>Categorias</Title>
          <CategorySlider
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.map(category => (
              <CategoryItem
                key={category.id}
                isSelected={category.id === selectedCategory}
                onPress={() => handleSelectCategory(category.id)}
                activeOpacity={0.6}
                testID={`category-${category.id}`}
              >
                <Image
                  style={{ width: 56, height: 56 }}
                  source={{ uri: category.image_url }}
                />
                <CategoryItemTitle>{category.title}</CategoryItemTitle>
              </CategoryItem>
            ))}
          </CategorySlider>
        </CategoryContainer>
        <FoodsContainer>
          <Title>Pratos</Title>
          <FoodList>
            {foods.map(food => (
              <Food
                key={food.id}
                onPress={() => handleNavigate(food.id)}
                activeOpacity={0.6}
                testID={`food-${food.id}`}
              >
                <FoodImageContainer>
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: food.thumbnail_url }}
                  />
                </FoodImageContainer>
                <FoodContent>
                  <FoodTitle>{food.name}</FoodTitle>
                  <FoodDescription>{food.description}</FoodDescription>
                  <FoodPricing>{food.formattedPrice}</FoodPricing>
                </FoodContent>
              </Food>
            ))}
          </FoodList>
        </FoodsContainer>
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
