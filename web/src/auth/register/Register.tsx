import { useState } from 'react'
import './Register.css'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

interface IRegisterAluno {
  nome: string;
  email: string;
  senha: string;
  periodo: string;
  faculdade: string;
}

const schema = yup.object({
    nome: yup.string().matches(/^[A-Za-zÀ-ÿ\s]+$/, 'Não pode conter números').required('Nome é obrigatório'),
    email: yup.string().email('Email Inválido').required('Email é obrigatório'),
    senha: yup.string().min(6, 'Senha deve ter no minímo 6 caracteres').required('Senha é obrigatório'),
    periodo: yup.string().matches(/^[0-9]+$/, 'Apenas números são permitidos').required('O periodo é obrigatorio'),
    faculdade: yup.string().matches(/^[A-Za-zÀ-ÿ\s]+$/, 'Não pode conter números').required('Faculdade é obrigatório')
}).required();


function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<IRegisterAluno>({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: IRegisterAluno) => {
    console.log(`nome: ${data.nome}`);
    console.log(`email: ${data.email}`);
    console.log(`senha: ${data.senha}`);
    console.log(`periodo: ${data.periodo}`);
    console.log(`faculdade: ${data.faculdade}`);
  };

  return (
    <div className='Telaregister'>
      <div className='register'>
        <h1>REALIZE SEU CADASTRO!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='form-register'>
          <label htmlFor="nome">nome</label>
          <input id="nome" {...register('nome')} />
          {errors.nome && <span className="erro-login">{errors.nome.message}</span>}

          <label htmlFor="faculdade">faculdade</label>
          <input type="text" id='faculdade' {...register('faculdade')}/>
          {errors.faculdade && <span className='erro-login'> {errors.faculdade.message} </span>}

          <label htmlFor="periodo">periodo</label>
          <input type="number" id="periodo" {...register('periodo')} />
          {errors.periodo && <span className='erro-login'> {errors.periodo.message} </span>}

          <label htmlFor="email">email</label>
          <input type="email" id="email" {...register('email')} />
          {errors.email && <span className='erro-login'> {errors.email.message} </span>}


          <label htmlFor="senha">senha</label>
          <input type="password" id="senha" {...register('senha')} />
          {errors.senha && <span className="erro-login">{errors.senha.message}</span>}


          <button type='submit'>Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login
