import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../components/WelcomeScreen';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import UserHomeScreen from '../components/UserHomeScreen';
import AdminHomeScreen from '../components/AdminHomeScreen';
import ForgotPasswordScreen from '../components/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function AppNavigator({ user, userType }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? (userType === 'admin' ? 'AdminHome' : 'UserHome') : 'Welcome'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Giriş yapmamış kullanıcı için ekranlar */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }} // Giriş yapmamışsa göster
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />

        {/* Giriş yapmış kullanıcı için ekranlar */}
        <Stack.Screen
          name="UserHome"
          component={UserHomeScreen}
          options={{ headerShown: user && userType === 'user' }}
        />
        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen}
          options={{ headerShown: user && userType === 'admin' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
