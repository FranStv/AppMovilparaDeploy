import { createStackNavigator, StackCardStyleInterpolator } from '@react-navigation/stack';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProductScreen } from '../screens/product/ProductScreen';
import { ShoppingCar } from '../screens/shoppingCar/ShoppingCar';
import { AddProductScreen } from '../screens/product/AddProductScreen';

export type RootStackParams = {
    LoadingScreen: undefined,
    LoginScreen: undefined,
    RegisterScreen: undefined,
    HomeScreen: undefined,
    ShoppingCar: undefined,
    ProductScreen: { productId: string },
    AddProductScreen: { productId: string },
}

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle:{
      opacity: current.progress,
    }
  }
}

export const StackNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName='LoadingScreen'
      screenOptions={{
        headerShown: false,
        // cardStyleInterpolator: fadeAnimation
      }}>
      <Stack.Screen 
        options={{ cardStyleInterpolator: fadeAnimation }} 
        name="LoadingScreen" 
        component={LoadingScreen} />
      <Stack.Screen 
        options={{ cardStyleInterpolator: fadeAnimation }} 
        name="LoginScreen" 
        component={LoginScreen} />
      <Stack.Screen 
        options={{ cardStyleInterpolator: fadeAnimation }} 
        name="RegisterScreen" 
        component={RegisterScreen} />
      <Stack.Screen 
        options={{ cardStyleInterpolator: fadeAnimation }} 
        name="HomeScreen" 
        component={HomeScreen} />
      <Stack.Screen 
        options={{ cardStyleInterpolator: fadeAnimation }} 
        name="ShoppingCar" 
        component={ShoppingCar} />
      <Stack.Screen 
      name="ProductScreen" 
      component={ProductScreen} />
      <Stack.Screen 
        options={{ cardStyleInterpolator: fadeAnimation }} 
        name="AddProductScreen" 
        component={AddProductScreen} />
    </Stack.Navigator>
  );
}