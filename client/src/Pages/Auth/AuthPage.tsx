import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Image,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';

import loginShoese from '@/assets/shoese/logshoes.png';
import logingShoeseBlur0 from '@/assets/shoese/logingShoeseBlur0.png';
import { toaster, Toaster } from '@/components/ui/toaster';
import useAuthStore from '@/auth/authStore';

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      const user = isLogin
        ? await login(username.trim(), password)
        : await register(username.trim(), email.trim(), password);
      toaster.create({
        title: isLogin ? `Welcome back, ${user.username}` : `Account created. Welcome, ${user.username}`,
        type: 'success',
        duration: 3500,
      });
      navigate(user.is_staff ? '/admin/dashboard' : '/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to complete authentication.');
    }
  };

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setError('');
  };

  return (
    <>
      <Toaster />
      <Box maxW="1180px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 8, md: 16 }}>
        <HStack
          align="stretch"
          gap={0}
          overflow="hidden"
          borderRadius="2xl"
          boxShadow="0 24px 60px rgba(112, 8, 231, 0.15)"
          bg="white"
        >
          <Box display={{ base: 'none', lg: 'block' }} w="45%" bg="#f3e9ff" position="relative">
            <Image src={loginShoese} alt="Nike sneaker" h="100%" w="100%" objectFit="cover" />
            <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(112,8,231,.05), rgba(112,8,231,.48))" />
            <Box position="absolute" bottom={10} left={10} right={10} color="white">
              <Text textTransform="uppercase" letterSpacing="widest" fontSize="sm" fontWeight="bold">Nike Store</Text>
              <Heading size="2xl" mt={2}>Move with confidence.</Heading>
            </Box>
          </Box>

          <Box
            flex="1"
            p={{ base: 6, sm: 10, md: 14 }}
            bgImage={`linear-gradient(rgba(255,255,255,.90), rgba(255,255,255,.94)), url(${logingShoeseBlur0})`}
            bgSize="cover"
            backgroundPosition="center"
          >
            <Text color="#a800b7" fontWeight="bold" letterSpacing="wide" textTransform="uppercase" fontSize="sm">
              Nike Store Account
            </Text>
            <Heading size={{ base: 'xl', md: '3xl' }} mt={2} mb={3} color="#242424">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </Heading>
            <Text color="gray.600" mb={8} maxW="lg">
              {isLogin
                ? 'Sign in to view your favorites, manage your cart, and follow your orders.'
                : 'Create an account to save favorites, complete orders, and request returns securely.'}
            </Text>

            <form onSubmit={submit}>
              <Stack gap={4} maxW="xl">
                <Field.Root required invalid={Boolean(error)}>
                  <Field.Label fontWeight="semibold">User name</Field.Label>
                  <Input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    border="1px solid #a800b7"
                    bg="white"
                    autoComplete="username"
                    placeholder="Enter your user name"
                  />
                </Field.Root>

                {!isLogin && (
                  <Field.Root required invalid={Boolean(error)}>
                    <Field.Label fontWeight="semibold">Email address</Field.Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      border="1px solid #a800b7"
                      bg="white"
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </Field.Root>
                )}

                <Field.Root required invalid={Boolean(error)}>
                  <Field.Label fontWeight="semibold">Password</Field.Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    border="1px solid #a800b7"
                    bg="white"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    minLength={8}
                    placeholder="At least 8 characters"
                  />
                  {error && <Field.ErrorText>{error}</Field.ErrorText>}
                </Field.Root>

                <Button
                  type="submit"
                  bg="#7008e7"
                  color="white"
                  _hover={{ bg: '#a800b7' }}
                  loading={isLoading}
                  loadingText={isLogin ? 'Signing in...' : 'Creating account...'}
                  mt={2}
                  size="lg"
                >
                  {isLogin ? 'Log In' : 'Create Account'}
                </Button>
              </Stack>
            </form>

            <Text mt={7} color="gray.600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Button variant="plain" color="#7008e7" fontWeight="bold" p={0} minW="auto" onClick={switchMode}>
                {isLogin ? 'Create one' : 'Log in'}
              </Button>
            </Text>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default AuthPage;
