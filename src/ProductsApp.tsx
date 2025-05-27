import 'react-native-gesture-handler';

import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';


import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { StackNavigator } from './presentation/navigation/StackNavigator';
import { useColorScheme } from 'react-native';
import { AuthProvider } from './presentation/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY, API_URL_ANDROID, API_URL } from '@env';

const queryClient = new QueryClient();

export const ProductsApp = () => {

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? eva.dark : eva.light;
  const backgroundColor = (colorScheme === 'dark')
    ? theme['color-basic-800']
    : theme['color-basic-100'];

  const MyTheme = {
  ...DarkTheme, // O DefaultTheme si quieres base clara
  colors: {
    ...DarkTheme.colors,
    primary: theme['color-primary-500'],
    background: backgroundColor,
    card: theme['color-basic-100'],
    text: theme['text-basic-color'],
    border: theme['color-basic-800'],
    notification: theme['color-primary-500'],
  },
};

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider 
        {...eva} theme={theme}>
        <NavigationContainer
          theme={colorScheme === 'dark' ? MyTheme : DefaultTheme}
      >
        <AuthProvider>
          <StackNavigator/>  
          {/* <Text>{API_URL}</Text>
          <Text>y luegoo {API_URL_ANDROID}</Text> */}
        </AuthProvider>          
        </NavigationContainer>
      </ApplicationProvider>
    </QueryClientProvider>
    </StripeProvider>
  )
}
