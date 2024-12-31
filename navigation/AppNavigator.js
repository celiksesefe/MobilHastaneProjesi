import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../components/WelcomeScreen';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import UserHomeScreen from '../components/UserHomeScreen';
import AdminHomeScreen from '../components/AdminHomeScreen';
import ForgotPasswordScreen from '../components/ForgotPasswordScreen';
import AddPatientDataScreen from '../components/AddPatientDataScreen';
import ViewPatientDataScreen from '../components/ViewPatientDataScreen';
import EditProfileScreen from '../components/EditProfileScreen';
import ViewOwnDataScreen from '../components/ViewOwnDataScreen';
import CompareResultsScreen from '../components/CompareResultsScreen'; // Yeni ekranı içe aktar

const Stack = createStackNavigator();

export default function AppNavigator({ user, userType }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // Üst başlığı gizle
        }}
      >
        {/* Giriş yapmamış kullanıcı için ekranlar */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
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

        {/* Kullanıcı ve Admin için ekranlar */}
        <Stack.Screen
          name="UserHome"
          component={UserHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPatientData"
          component={AddPatientDataScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewPatientData"
          component={ViewPatientDataScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewOwnResults"
          component={ViewOwnDataScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompareResultsScreen" 
          component={CompareResultsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
