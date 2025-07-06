import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

// ---

// Importing the modules for Google-Sign in
import auth, { createUserWithEmailAndPassword } from '@react-native-firebase/auth';
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

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // Google sign in configuration
  GoogleSignin.configure({
    webClientId: '192201958422-4diei81elsnq4edspsbncjkjtcd8pt6t.apps.googleusercontent.com',
  });

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

  const handleSignup = async () => {
    // Validate form
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      console.error('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      console.error('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth(), email, password);
      console.log('User account created & signed in!');
      router.push('/(tabs)');
    } catch (error: any) {
      console.error('Signup Error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'An error occurred during sign up';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'That email address is already in use!';
          break;
        case 'auth/invalid-email':
          errorMessage = 'That email address is invalid!';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password';
          break;
        default:
          errorMessage = error.message || 'An error occurred during sign up';
      }
      
      // You can display this error to the user using an alert or toast
      console.error('Signup Error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = firstName && lastName && email && password && confirmPassword && 
                     password === confirmPassword && agreedToTerms;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome name="chevron-left" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/adaptive-icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.placeholder }]}>
              Join DevWell and start your wellness journey
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Fields */}
            <View style={styles.nameContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <FontAwesome name="user" size={16} color={colors.placeholder} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="First name"
                    placeholderTextColor={colors.placeholder}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <FontAwesome name="user" size={16} color={colors.placeholder} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Last name"
                    placeholderTextColor={colors.placeholder}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoComplete="family-name"
                  />
                </View>
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <FontAwesome name="envelope" size={16} color={colors.placeholder} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <FontAwesome name="lock" size={16} color={colors.placeholder} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Create a password"
                  placeholderTextColor={colors.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome 
                    name={showPassword ? 'eye' : 'eye-slash'} 
                    size={16} 
                    color={colors.placeholder} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
              <View style={[
                styles.inputWrapper, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: confirmPassword && password !== confirmPassword ? colors.error : colors.border 
                }
              ]}>
                <FontAwesome name="lock" size={16} color={colors.placeholder} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesome 
                    name={showConfirmPassword ? 'eye' : 'eye-slash'} 
                    size={16} 
                    color={colors.placeholder} 
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword && password !== confirmPassword && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  Passwords don't match
                </Text>
              )}
            </View>

            {/* Terms Agreement */}
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[
                styles.checkbox,
                { borderColor: colors.border, backgroundColor: colors.surface },
                agreedToTerms && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}>
                {agreedToTerms && (
                  <FontAwesome name="check" size={12} color="white" />
                )}
              </View>
              <Text style={[styles.checkboxText, { color: colors.text }]}>
                I agree to the{' '}
                <Text style={[styles.linkText, { color: colors.primary }]}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Signup Button */}
            <TouchableOpacity
              style={[
                styles.signupButton,
                { backgroundColor: colors.secondary },
                (!isFormValid || isLoading) && { opacity: 0.5 }
              ]}
              onPress={handleSignup}
              disabled={!isFormValid || isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.placeholder }]}>or</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>

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
              <FontAwesome name="google" size={20} color="#4285F4" />
              <Text style={[styles.oauthText, { color: colors.text }]}>
                Sign up with Google
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
                Sign up with Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.placeholder }]}>
              Already have an account?{' '}
              <Link href="./login" asChild>
                <Text style={[styles.linkText, { color: colors.primary }]}>
                  Sign in
                </Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  passwordToggle: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  signupButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    paddingHorizontal: 16,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
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
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  linkText: {
    fontWeight: '600',
  },
}); 