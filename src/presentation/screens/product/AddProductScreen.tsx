import {
  Button,
  ButtonGroup,
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

import {useRef} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Product} from '../../../domain/entities/product';
import {MyIcon} from '../../components/ui/MyIcon';
import {Formik} from 'formik';
import {ProductsImages} from '../../components/products/ProductsImages';
import {genders, sizes} from '../../../config/constants/constants';
import { CameraAdapter } from '../../../config/adapters/camera-adapter';

interface Props extends StackScreenProps<RootStackParams, 'AddProductScreen'> {}

export const AddProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);
  const theme = useTheme();
  const queryClient = useQueryClient();

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
    return <MainLayout/>;
  }

  return (
    <Formik
      initialValues={product}
      onSubmit={values => mutations.mutate(values)}>
      {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
        <MainLayout           
          rightAction={async () => {
            const photos =  await CameraAdapter.getPicturesFromLibrary();
            setFieldValue('images', [...values.images, ...photos])
          }}
          rightActionIcon='image-outline'
        >
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
                style={{marginVertical: 5}}
                value={values.title}
                onChangeText={handleChange('title')}
              />

              <Input
                label="Slug"
                style={{marginVertical: 5}}
                value={values.slug}
                onChangeText={handleChange('slug')}
              />

              <Input
                label="Descripción"
                multiline
                numberOfLines={5}
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
                style={{flex: 1}}
                value={values.price.toString()}
                onChangeText={handleChange('price')}
                keyboardType="numeric"
              />

              <Input
                label="Inventario"
                style={{flex: 1}}
                value={values.stock.toString()}
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

            <Button
              accessoryLeft={<MyIcon name="save-outline" white />}
              onPress={() => handleSubmit()}
              disabled={mutations.isPending}
              style={{margin: 15}}>
              Guardar
            </Button>

            {/* <Text>{ JSON.stringify(values, null, 2) }</Text> */}
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
