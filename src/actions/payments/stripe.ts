import {tesloApi} from '../../config/api/tesloApi';
import axios from 'axios';

export const createStripePaymentIntent = async (
  amount: number,
  method: 'card' | 'oxxo',
) => {
  // console.log('llega al createStripePaymentIntent');
  try {
    // amount en centavos MXN
    const {data} = await tesloApi.post('/api/stripe/create-payment-intent', {
      amount,
      method,
    });
    // data tendrá: clientSecret, paymentIntent, voucherUrl (si es OXXO)
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    }
    return null;
  }
};
