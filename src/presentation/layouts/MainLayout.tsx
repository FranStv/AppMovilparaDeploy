import {useNavigation} from '@react-navigation/native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Divider,
  Layout,  
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MyIcon} from '../components/ui/MyIcon';
import {useAuthStore} from '../store/auth/useAuthStore';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../navigation/StackNavigator';
import { ShoppingCar } from '../screens/shoppingCar/ShoppingCar';
import { FAB } from '../components/ui/FAB';

interface Props {
  title: string;
  subTitle?: string;

  rightAction?: () => void;
  rightActionIcon?: string;

  children?: React.ReactNode;
}

export const MainLayout = ({
  title,
  subTitle,
  rightAction,
  rightActionIcon = 'log-out-outline',
  children,
}: Props) => {
  const {top} = useSafeAreaInsets();
  const {canGoBack, goBack} = useNavigation();
  const {logout} = useAuthStore();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const handleTabSelect = (index: number) => {
    setSelectedIndex(index);  
  };

  const renderBackAction = () => (
    <TopNavigationAction
      icon={<MyIcon name="arrow-back-outline" />}
      onPress={goBack}
    />
  );

  const RenderRightAction = () => {
    //if(rightAction === undefined || rightActionIcon === undefined ) return null;
    return (
      <TopNavigationAction
        onPress={rightAction === undefined ? logout : rightAction}
        icon={<MyIcon name={(selectedIndex===1) ? 'log-out-outline' : rightActionIcon} />}
      />
    );
  };

  return (
    <Layout style={{flex: 1, paddingTop: top}}>
      <TopNavigation
        title={title}
        subtitle={subTitle}
        alignment="center"
        accessoryLeft={(canGoBack() && selectedIndex===0) ? renderBackAction : undefined}
        accessoryRight={() => <RenderRightAction />}
      />
      <Divider />
      {/* contenido principal */}
      <Layout style={{flex: 1, height: '100%'}}>{(selectedIndex===0) ? children : <ShoppingCar/>}</Layout>
      <Divider />
      <BottomNavigation
        selectedIndex={selectedIndex}
        onSelect={handleTabSelect}>
        <BottomNavigationTab
          title="Productos"
          icon={<MyIcon name="shopping-bag-outline" />}
        />
        <BottomNavigationTab
          title="Carrito"
          icon={<MyIcon name="shopping-cart-outline" />}
        />
      </BottomNavigation>
      {
        (selectedIndex === 0 && !canGoBack())
        ?
        <FAB
          iconName='plus-outline'
          onPress={()=>navigation.navigate('AddProductScreen', {productId: 'new'})}
          style={{
            position: 'absolute',
            bottom: 70,
            right: 20,
          }}
        />      
        : undefined
      }
    </Layout>    
  );
};
