import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../components/WelcomeScreen';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import UserHomeScreen from '../components/UserHomeScreen';
import AdminHomeScreen from '../components/AdminHomeScreen';

const Stack = createStackNavigator();

export default function AppNavigator({ user }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'UserHome' : 'Welcome'} // Kullanıcı oturumu varsa UserHome ekranına yönlendirir
        screenOptions={{
          headerShown: false, // Üst başlık çubuğunu gizler
        }}
      >
        {/* Giriş yapmamış kullanıcı için ekranlar */}
        {!user && (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}

        {/* Giriş yapmış kullanıcı için ekranlar */}
        {user && (
          <>
            <Stack.Screen name="UserHome" component={UserHomeScreen} />
            <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
