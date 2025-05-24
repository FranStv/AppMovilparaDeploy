import { Layout, List } from "@ui-kitten/components";
import { Product } from "../../../domain/entities/product";
import { ProductCard } from "./ProductCard";
import { useState } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";

interface Props{
    products: Product[];
    //todo: fetch nextPage
    fetchNextPage: () => void;
}
export const ProductsList = ({products, fetchNextPage}: Props) => {
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onPullToRefresh = async() => {
        setIsRefreshing(true);        
        await new Promise(resolve => setTimeout(resolve, 200));
        queryClient.invalidateQueries({ queryKey: ['products', 'infinite'] });

        setIsRefreshing(false);
    }

    return (
    <List
        data={ products }
        numColumns={2}
        keyExtractor={(item,index)=>`${item.id}-${index}` }
        renderItem={ ({item}) => (
            <ProductCard product={item}/>
        )}

        ListFooterComponent={ () => <Layout style={{height: 150}}/> }
        onEndReached={ fetchNextPage }
        onEndReachedThreshold={0.8}

        refreshControl={
            <RefreshControl
                refreshing= { isRefreshing }
                onRefresh={ onPullToRefresh }
            />
        }

    />
  )
}
