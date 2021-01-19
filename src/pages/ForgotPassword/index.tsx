import React, { useRef, useCallback } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles';

interface ForgotPasswordFormData {
  name: string;
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleForgotPassword = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors([]);

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um email válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', data);

        Alert.alert(
          'E-mail de recuperação enviado',
          'Enviamos um e-mail para confirmar a recuperação de senha. Cheque sua caixa de entrada',
          [],{
            cancelable: true
          }
        );

        navigation.navigate('SignIn');
      } catch (err) {
        // If it's a yup error
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }
        Alert.alert(
          'Erro na recuperação de senha',
          'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.'
        );
      }
    },
    [navigation]
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Recuperar senha</Title>
            </View>
            <Form
              ref={formRef}
              onSubmit={handleForgotPassword}
              style={{ width: '100%' }}
            >
             
              <Input
                ref={emailInputRef}
                name='email'
                keyboardType='email-address'
                autoCorrect={false}
                autoCapitalize='none'
                icon='mail'
                placeholder='E-mail'
                returnKeyType='next'
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
              

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Recuperar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignInButton onPress={() => navigation.goBack()}>
        <Icon name='arrow-left' size={20} color='#fff' />
        <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
      </BackToSignInButton>
    </>
  );
};

export default ForgotPassword;
