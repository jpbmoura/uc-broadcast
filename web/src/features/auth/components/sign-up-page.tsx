import { Alert, Button, Link } from "@mui/material";
import { AuthCard } from "./auth-card";
import { useAuth } from "../hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpValues } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { authErrorMessage, signUp } from "../api";
import { FormTextField } from "../../../components/form-text-field";
import { Link as RouterLink } from "react-router";

export const SignUpPage = () => {
  const { refreshUser } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setSubmitError(null);
    try {
      await signUp({ name, email, password });
      await refreshUser();
    } catch (error) {
      setSubmitError(authErrorMessage(error));
    }
  });

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Cada conta é um cliente da plataforma"
      footer={
        <>
          Já tem conta?{" "}
          <Link component={RouterLink} to="/login">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {submitError && <Alert severity="error">{submitError}</Alert>}
        <FormTextField
          name="email"
          control={control}
          label="E-mail"
          type="email"
          autoComplete="email"
          autoFocus
        />

        <FormTextField
          name="name"
          control={control}
          label="Nome"
          type="text"
          autoComplete="name"
        />

        <FormTextField
          name="password"
          control={control}
          label="Senha"
          type="password"
          autoComplete="new-password"
        />

        <FormTextField
          name="confirmPassword"
          control={control}
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </AuthCard>
  );
};
