import { TextField, type TextFieldProps } from "@mui/material";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

type Props<T extends FieldValues> = Omit<TextFieldProps, "name"> & {
  name: FieldPath<T>;
  control: Control<T>;
};

export const FormTextField = <T extends FieldValues>({
  name,
  control,
  ...props
}: Props<T>) => {
  const { field, fieldState } = useController({ name, control });
  const { ref, ...fieldProps } = field;

  return (
    <TextField
      {...props}
      {...fieldProps}
      inputRef={ref}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message ?? props.helperText}
    />
  );
};
