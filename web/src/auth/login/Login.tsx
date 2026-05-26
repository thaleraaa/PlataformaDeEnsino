import { useState } from 'react'
import './Login.css'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

interface ILogin {
  email: string;
  senha: string
}

const schema = yup.object({
  email: yup.string().email('Email Inválido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'Senha deve ter no minímo 6 caracteres').required('Senha é obrigatório')
}).required();


function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<ILogin>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: ILogin) => {
    console.log(`email: ${data.email}`);
    console.log(`senha: ${data.senha}`);
  };

  return (
    <div className='Telalogin'>
      <div className='login'>
        <h1>BEM VINDO DE VOLTA!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='form-login'>
          <label htmlFor="email">email</label>
          <input type="email" id="email" {...register('email')} />
          {errors.email && <span style={{color: 'red'}} className="erro-login">{errors.email.message}</span>}
          <label htmlFor="senha">senha</label>
          <input type="password" id="senha" {...register('senha')} />
          {errors.senha && <span style={{color: 'red'}} className="erro-login">{errors.senha.message}</span>}
          <button type='submit'>Entrar</button>
        </form>
      </div>
      <div className='cadastro'>
        <h2>AINDA NÃO TEM CONTA?</h2>
        <button>CADASTRE-SE</button>
      </div>
    </div>
  );
}

export default Login
