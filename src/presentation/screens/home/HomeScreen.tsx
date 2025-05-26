import React from 'react'
import { getProductsByPage } from '../../../actions/products/get-products-by-page';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MainLayout } from '../../layouts/MainLayout';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { ProductsList } from '../../components/products/ProductsList';
import { FAB } from '../../components/ui/FAB';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { BottomNavigationTab, Text } from '@ui-kitten/components';

export const HomeScreen = () => {
  
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  // const {  isLoading, data: products = [] } = useQuery({
  //   queryKey: ['products', 'infinite'],
  //   staleTime: 1000 * 60 * 60, //1 hour
  //   queryFn: () => getProductsByPage(0),
  // });  

  const {  isLoading, data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 60, //1 hour
    initialPageParam: 0,
    queryFn: async(params) => await getProductsByPage(params.pageParam),    
    getNextPageParam: (lastPage, allPages) => allPages.length,
  });  

  return (
    <>
      <MainLayout
        title='TesloShop - Productos'
        subTitle='Compra en TesloShop'>      
          {
            isLoading 
              ? (<FullScreenLoader/>) 
              : <ProductsList products={data?.pages.flat() ?? []} 
                  fetchNextPage ={ fetchNextPage }
                />
          }        
      </MainLayout>      
    </>
  )
}
