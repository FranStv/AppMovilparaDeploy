import {confirmPayment} from '@stripe/stripe-react-native';
import {createStripePaymentIntent} from '../../../actions/payments/stripe';
import {useCartStore} from '../../store/car/useCartStore'; // <-- solo importa el hook
import {Alert, Linking} from 'react-native';
import {decrementStock} from '../../../actions/products/decrement-stock';
import axios from 'axios';

export const handlePay = async (
  paymentMethod: 'card' | 'oxxo',
  name: string,
  total: () => number,
  clearCart: () => void,
) => {
  const {items} = useCartStore.getState();

  // Obtén métodos del store usando el hook
  // console.log('llegamos al handlePay');
  // console.log('---');
  //const clearCart = useCartStore(state => state.clearCart);
  // console.log('----');
  //const total = useCartStore(state => state.total);
  // console.log('----');
  try {
    // console.log('-1');
    const res = await createStripePaymentIntent(
      Math.round(total() * 100),
      paymentMethod,
    );
    // console.log('0');
    // console.log(res);
    if (!res) {
      // console.log('No se pudo iniciar el pago. Intenta de nuevo.');
      Alert.alert('No se pudo iniciar el pago. Intenta de nuevo.');
      return;
    }
    const {clientSecret, voucherUrl} = res;

    if (paymentMethod === 'card') {
      // console.log('1.');
      const {paymentIntent, error} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {name},
        },
      });

      if (error) {
        Alert.alert('Error al pagar: ' + error.message);
      } else {
        clearCart();
        Alert.alert('¡Pago realizado con éxito!');
        await decrementStock(
          items.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
        );
      }
    } else if (paymentMethod === 'oxxo') {
      // console.log('2.');
      if (voucherUrl) {
        // Linking.openURL(voucherUrl);
        Alert.alert('Tu voucher OXXO: ' + voucherUrl);
        Linking.openURL(voucherUrl);
        clearCart();
        await decrementStock(
          items.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
        );
      } else {
        Alert.alert('No se pudo generar el voucher. Intenta de nuevo.');
      }
    }
  } catch (error: any) {
    Alert.alert('Error: ' + error.message);
    if (error instanceof Error) {
      console.log(error.message);
    }

    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    }
  }
};
