import { tesloApi } from "../../config/api/tesloApi"
import type { Product } from "../../domain/entities/product"
import type { TesloProduct } from "../../infrastructure/interfaces/teslo-products.response"
import { ProductMapper } from "../../infrastructure/mappers/product.mapper"

export const getProductsByPage = async(page: number, limit: number =  20): Promise<Product[]> => {    
    try {
        const { data } = await tesloApi.get<TesloProduct[]>(`/products?offset=${ page * 10 }&limit=${ limit }`)
        //esto es igual que el de abajo
        //const products = data.map( tesloProduct => ProductMapper.tesloProductToEntity(tesloProduct) )
        return data.map( ProductMapper.tesloProductToEntity ) //retorna productos
    } catch (error) {
        return [];
    }
}