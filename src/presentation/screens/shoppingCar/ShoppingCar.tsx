import React, {useState} from 'react';
import {Layout, List, Text, Button, Input, Card} from '@ui-kitten/components';
import {View, Modal, StyleSheet} from 'react-native';
import {FadeInImage} from '../../components/ui/FadeInImage';
import {useCartStore} from '../../store/auth/useCartStore';
import {CardField} from '@stripe/stripe-react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    padding: 20,
    width: '90%',
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 4,
  },
});

const inputStyle = {
  backgroundColor: '#F5F6FA',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  color: '#222', // Color de texto fijo, legible en modo claro y oscuro
  paddingHorizontal: 10,
};

export const ShoppingCar = () => {
  const {items, removeItem, updateQuantity, clearCart, total} = useCartStore();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'oxxo'>('card');
  const [cardDetails, setCardDetails] = useState<any>(null);

  // Estados nuevos para inputs personalizados
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Validaciones
  const isValidExpiry = (value: string) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [mm, aa] = value.split('/').map(Number);
    return mm >= 1 && mm <= 12;
  };
  const isValid =    
    cardDetails?.complete;

  const renderItem = ({item}: any) => (
    <Card style={{margin: 6}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <FadeInImage
          uri={item.image}
          style={{width: 50, height: 50, marginRight: 5}}
        />
        <View style={{flex: 1}}>
          <Text category="s1">{item.title}</Text>
          <Text category="s2">
            ${item.price} x {item.quantity}
          </Text>
        </View>
        <Input
          style={{width: 60}}
          value={item.quantity.toString()}
          keyboardType="numeric"
          onChangeText={value => {
            const qty = parseInt(value, 10) || 1;
            updateQuantity(item.id, qty);
          }}
        />
        <Button
          status="danger"
          size="tiny"
          onPress={() => removeItem(item.id)}
          style={{marginLeft: 10}}>
          Eliminar
        </Button>
      </View>
    </Card>
  );

  if (items.length === 0) {
    return (
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text appearance="hint">¡El carrito está vacío!</Text>
      </Layout>
    );
  }

  return (
    <Layout style={{flex: 1, padding: 16}}>
      <List
        data={items}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}-${item.size || ''}`}
      />
      <View style={{padding: 16}}>
        <Text category="h6">Total: ${total()}</Text>
        <Button
          style={{marginTop: 8}}
          status="success"
          onPress={() => setShowPaymentModal(true)}>
          Pagar
        </Button>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}>
        <View style={styles.overlay}>
          <Layout style={styles.modal}>
            <Text category="h6" style={{textAlign: 'center', marginBottom: 15}}>
              Selecciona método de pago
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
              <Button
                status={paymentMethod === 'card' ? 'primary' : 'basic'}
                appearance={paymentMethod === 'card' ? 'filled' : 'outline'}
                style={{marginHorizontal: 8}}
                onPress={() => setPaymentMethod('card')}>
                Tarjeta
              </Button>
              <Button
                status={paymentMethod === 'oxxo' ? 'primary' : 'basic'}
                appearance={paymentMethod === 'oxxo' ? 'filled' : 'outline'}
                style={{marginHorizontal: 8}}
                onPress={() => setPaymentMethod('oxxo')}>
                OXXO
              </Button>
            </View>

            {paymentMethod === 'card' && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                  <Text style={{fontSize: 22, marginRight: 6}}>💳</Text>
                  <Text category="s2">Datos de la tarjeta</Text>
                </View>

                {/* Inputs personalizados y uniformes */}
                <Input
                  label="Nombre del titular"
                  placeholder="Nombre como en la tarjeta"
                  style={[inputStyle, {marginBottom: 10}]}
                  textStyle={{color: '#222'}}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                />
                <View style={{flexDirection: 'row', gap: 10}}>
                  <Input
                    label="MM/AA"
                    placeholder="MM/AA"
                    style={[inputStyle, {flex: 1, marginBottom: 10}]}
                    textStyle={{color: '#222'}}
                    value={expiry}
                    onChangeText={text => {
                      // Solo permite formato MM/AA
                      let formatted = text.replace(/[^0-9/]/g, '');
                      if (formatted.length === 2 && expiry.length === 1)
                        formatted += '/';
                      if (formatted.length > 5)
                        formatted = formatted.slice(0, 5);
                      setExpiry(formatted);
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <Input
                    label="CVC"
                    placeholder="123"
                    style={[inputStyle, {flex: 1, marginBottom: 10}]}
                    textStyle={{color: '#222'}}
                    value={cvc}
                    onChangeText={text => {
                      // Solo números y 3 dígitos
                      if (/^\d{0,3}$/.test(text)) setCvc(text);
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>

                {/* CardField de Stripe */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    backgroundColor: '#F5F6FA',
                    padding: 8,
                    marginBottom: 20,
                  }}>
                  <CardField
                    postalCodeEnabled={false}
                    placeholders={{number: '4242 4242 4242 4242'}}
                    cardStyle={{
                      backgroundColor: '#F5F6FA',
                      textColor: '#222222',
                    }}
                    style={{width: '100%', height: 48}}
                    onCardChange={setCardDetails}
                  />
                </View>
              </>
            )}

            <Button
              status="success"
              onPress={() => {
                // Aquí irá la lógica para pagar según método
                setShowPaymentModal(false); // Por ahora solo cierra el modal
              }}
              style={{marginTop: 8}}
              // disabled={paymentMethod === 'card' && !cardDetails?.complete} 
              >
              {paymentMethod === 'card'
                ? 'Pagar con tarjeta'
                : 'Generar voucher OXXO'}
            </Button>

            <Button
              appearance="ghost"
              status="basic"
              onPress={() => setShowPaymentModal(false)}
              style={{marginTop: 10}}>
              Cancelar
            </Button>
          </Layout>
        </View>
      </Modal>
    </Layout>
  );
};
