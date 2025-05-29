import {
  Button,
  ButtonGroup,
  Icon,
  Input,
  Layout,
  Text,
  useTheme,
} from '@ui-kitten/components';
import {MainLayout} from '../../layouts/MainLayout';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {getProductById, updateCreateProduct} from '../../../actions/products';

import {useRef, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Product} from '../../../domain/entities/product';
import {MyIcon} from '../../components/ui/MyIcon';
import {Formik} from 'formik';
import {ProductsImages} from '../../components/products/ProductsImages';
import {genders, sizes} from '../../../config/constants/constants';
import {CameraAdapter} from '../../../config/adapters/camera-adapter';
import {useCartStore} from '../../store/car/useCartStore';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}

export const ProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [numberItem, setNumberItem] = useState('1');

  const {addItem} = useCartStore();

  const {data: product} = useQuery({
    queryKey: ['product', productIdRef.current],
    queryFn: () => getProductById(productIdRef.current),
  });

  const mutations = useMutation({
    mutationFn: (data: Product) =>
      updateCreateProduct({...data, id: productIdRef.current}),
    onSuccess(data: Product) {
      productIdRef.current = data.id; //creacion
      queryClient.invalidateQueries({queryKey: ['products', 'infinite']});
      queryClient.invalidateQueries({queryKey: ['product', data.id]});
    },
  });

  if (!product) {
    return <MainLayout />;
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: Number(numberItem),
      image: product.images?.[0],
      size: product.sizes[0] ?? undefined,
      gender: product.gender,
    });
  };

  return (
    <Formik
      initialValues={product}
      onSubmit={values => mutations.mutate(values)}>
      {({handleChange, handleSubmit, values, setFieldValue}) => (
        <MainLayout
          rightAction={async () => {
            const photos = await CameraAdapter.getPicturesFromLibrary();
            setFieldValue('images', [...values.images, ...photos]);
          }}
          rightActionIcon="image-outline">
          <ScrollView style={{flex: 1}}>
            <Layout
              style={{
                marginVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ProductsImages images={values.images} />

              <Layout />

              {/* Formulario */}
              <Input
                label="Título"
                readOnly
                style={{marginVertical: 5}}
                value={values.title}
                onChangeText={handleChange('title')}
              />

              {/* <Input
                label="Slug"
                readOnly
                style={{marginVertical: 5}}
                value={values.slug}
                onChangeText={handleChange('slug')}
              /> */}

              <Input
                label="Descripción"
                multiline
                numberOfLines={5}
                readOnly
                style={{marginVertical: 5}}
                value={values.description}
                onChangeText={handleChange('description')}
              />
            </Layout>

            {/* Precio e inventario */}
            <Layout
              style={{
                marginVertical: 5,
                marginHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
              }}>
              <Input
                label="Precio"
                readOnly
                style={{flex: 1}}
                value={values.price.toString()}
                onChangeText={handleChange('price')}
                keyboardType="numeric"
              />

              <Input
                label="Inventario"
                readOnly
                style={{flex: 1}}
                value={product.stock.toString()}
                onChangeText={handleChange('stock')}
                keyboardType="numeric"
              />
            </Layout>

            {/* Selectores */}
            <ButtonGroup
              style={{margin: 2, marginTop: 20, marginHorizontal: 15}}
              size="small"
              appearance="outline">
              {sizes.map(size => (
                <Button
                  onPress={() =>
                    setFieldValue(
                      'sizes',
                      values.sizes.includes(size)
                        ? values.sizes.filter(s => s !== size)
                        : [...values.sizes, size],
                    )
                  }
                  key={size}
                  style={{
                    flex: 1,
                    backgroundColor: values.sizes.includes(size)
                      ? theme['color-primary-200']
                      : undefined,
                  }}>
                  {size}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup
              style={{margin: 2, marginTop: 20, marginHorizontal: 15}}
              size="small"
              appearance="outline">
              {genders.map(gender => (
                <Button
                  onPress={() => setFieldValue('gender', gender)}
                  key={gender}
                  style={{
                    flex: 1,
                    backgroundColor: values.gender.startsWith(gender)
                      ? theme['color-primary-200']
                      : undefined,
                  }}>
                  {gender}
                </Button>
              ))}
            </ButtonGroup>

            {/* <Button
              accessoryLeft={<MyIcon name="save-outline" white />}
              onPress={() => handleSubmit()}
              disabled={mutations.isPending}
              style={{margin: 15}}>
              Guardar
            </Button> */}

            {product.stock === 0 || Number(numberItem) > product.stock ? (
              <Layout
                style={{
                  backgroundColor: theme['color-danger-100'],
                  borderRadius: 12,
                  padding: 15,
                  marginHorizontal: 15,
                  marginTop: 20,
                  marginBottom: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 10,
                }}>
                <Icon
                  name="alert-circle-outline"
                  fill={theme['color-danger-500']}
                  style={{width: 24, height: 24}}
                />
                <Text status="danger" category="s1" numberOfLines={2}>
                  {product.stock === 0
                    ? 'No hay stock disponible de este producto'
                    : 'La cantidad supera el stock disponible'}
                </Text>
              </Layout>
            ) : undefined}

            <Layout
              style={{
                marginVertical: 25,
                marginHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
              }}>
              <Input
                label="Cantidad"
                disabled={product.stock === 0}
                value={numberItem}
                style={{flex: 1, width: '10%'}}
                keyboardType="numeric"
                onChangeText={text => {
                  let value = text.replace(/[^0-9]/g, '');
                  if (parseInt(value, 10) < 0) value = '1';
                  setNumberItem(value);
                  values.stock = product.stock - Number(value);
                }}
              />

              <Button
                accessoryLeft={<MyIcon name="shopping-cart-outline" white />}
                onPress={() => {
                  handleAddToCart(); // Luego agregar al carrito
                  // handleSubmit(); // Si quieres guardar/actualizar el producto primero
                }}
                status="info"
                disabled={
                  product.stock === 0 ||
                  Number(numberItem) < 1 ||
                  Number(numberItem) > product.stock ||
                  mutations.isPending
                }
                style={{flex: 1, width: '100%'}}>
                Agregar al carrito
              </Button>
            </Layout>
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
