import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Link } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router";
import { authErrorMessage, signIn } from "../api";
import { signInSchema, type SignInValues } from "../schemas";
import { FormTextField } from "../../../components/form-text-field";
import { AuthCard } from "./auth-card";

export const LoginPage = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await signIn(values);
    } catch (error) {
      setSubmitError(authErrorMessage(error));
    }
  });

  return (
    <AuthCard
      title="Entrar"
      subtitle="Acesse suas conexões e mensagens"
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link component={RouterLink} to="/signup">
            Cadastre-se
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
          name="password"
          control={control}
          label="Senha"
          type="password"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthCard>
  );
};
