import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// ---

// Importing the modules for Google-Sign in
import auth from '@react-native-firebase/auth';
// import statusCodes along with GoogleSignin
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
  User,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

// Importing Apple authentication
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';


const { width, height } = Dimensions.get('window');

export default function AuthWelcome() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // Google sign in function
  const GoogleSignIn = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token\
      const response = await GoogleSignin.signIn();

      // console.log('response', response);

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(response.data?.idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  // Apple sign in function
  const onAppleButtonPress = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
        // See: https://github.com/invertase/react-native-apple-authentication#faqs
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

      // Sign the user in with the credential
      return auth().signInWithCredential(appleCredential);
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/adaptive-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={[styles.appTitle, { color: colors.text }]}>DevWell</Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Wellness breaks for productive developers
        </Text>
      </View>


      <View style={styles.authSection}>
        {/* OAuth Buttons 
        <TouchableOpacity 
          style={[styles.oauthButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <FontAwesome name="google" size={20} color="#4285F4" />
          <Text style={[styles.oauthText, { color: colors.text }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
        */}

      {/* OAuth Buttons */}
      <TouchableOpacity 
        style={[styles.oauthButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        activeOpacity={0.8}
        onPress={async () => {
          setIsLoading(true);
          try {
          await GoogleSignIn();
                  router.push('/(tabs)');
                } catch (error) {
                  console.error('Google Sign-In Error:', error);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <FontAwesome name="google" size={20} color="#4285F4"/>
              <Text style={[styles.oauthText, { color: colors.text }]}>
                Continue with Google
              </Text>
          </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.oauthButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.8}
          onPress={async () => {
            setIsLoading(true);
            try {
              await onAppleButtonPress();
              router.push('/(tabs)');
            } catch (error) {
              console.error('Apple Sign-In Error:', error);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <FontAwesome name="apple" size={20} color={colors.text} />
          <Text style={[styles.oauthText, { color: colors.text }]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.placeholder }]}>or</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        {/* Email/Password Buttons */}
        <Link href="./login" asChild>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            {/* Currently in white-mode the text is white, I want it to be black in white-mode 
            So let's make it black in white-mode
            */}
            <Text style={[styles.primaryButtonText, { color: colors.text }]}>
              Sign in with Email
            </Text>
            {/*
            <Text style={styles.primaryButtonText}>Sign in with Email</Text>*/}
          </TouchableOpacity>
        </Link>

        {/*
        <Link href="./signup" asChild>
          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: colors.secondary }]}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </Link>
        */}

        {/* Let's add some spacing between ToS/Privacy Policy and the sign in with email button */}
        <View style={{ height: 20 }} />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.placeholder }]}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 60,
    height: 60,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },

  authSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  oauthText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    paddingHorizontal: 16,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

}); 