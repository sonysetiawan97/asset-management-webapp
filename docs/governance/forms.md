# Forms

Forms use **React Hook Form** with a **centralized input component library**.

## Core Pattern

1. Wrap the page with `<FormProvider {...methods}>` in the Wrapper component
2. Use `useFormContext<T>()` inside the FormPage or FormFields to access form methods
3. All inputs are **controlled** via the `control` prop from `useFormContext`
4. All inputs are **validated** via `react-hook-form` rules (passed as props like `required`, `min`, etc.)

## FormProvider Setup

```tsx
// CreateWrapper.tsx
import { FormProvider, useForm } from "react-hook-form";
import { type CreateModel } from "../../types/Model";

const CreateWrapper: FC = () => {
  const methods = useForm<CreateModel>({ mode: "onBlur" });

  return (
    <FormProvider {...methods}>
      <TitleBarWithIcon title="Create Example">
        {/* icon */}
      </TitleBarWithIcon>
      <CreatePage />
    </FormProvider>
  );
};
```

## Form Submission

```tsx
// CreatePage.tsx
import { useFormContext } from "react-hook-form";
import { useCreate } from "@hooks/request/useCreate";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const CreatePage = () => {
  const { handleSubmit, reset } = useFormContext<CreateModel>();
  const { createAsync, isLoading } = useCreate<CreateModel>(moduleName);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (data: CreateModel) => {
    try {
      await createAsync({ url: moduleName, body: data });
      enqueueSnackbar("Success", { variant: "success" });
      reset();
      navigate(`/${moduleName}`);
    } catch (error: unknown) {
      const { message } = error as AxiosError;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <FormFields />
      <div className="col-12 d-flex gap-2">
        <CancelButton to={`/${moduleName}`} />
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
};
```

## FormFields Component

`FormFields` is a module-specific component that renders all form inputs. It always:
1. Takes a `readOnly?: boolean` prop (used for detail/read pages)
2. Calls `useFormContext()` internally
3. Passes `control={control}` to inputs that need it

```tsx
// components/FormFields.tsx
interface FormFieldsProps {
  readOnly?: boolean;
}

export const FormFields = ({ readOnly = false }: FormFieldsProps) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <>
      <Text
        name="name"
        label={t("modules.examples.form.name")}
        readOnly={readOnly}
        required
      />
      <SelectReferenceInput
        control={control}
        name="role"
        label="Role"
        readOnly={readOnly}
        loadOptions={roleOptions}
        required
      />
    </>
  );
};
```

## Update / Edit Forms

Update forms are nearly identical to create forms, with two differences:

1. **Pre-populate the form** by calling `methods.reset(existingData)` in `useEffect`:

```tsx
// UpdateWrapper.tsx
const { data: existing } = useFindOneById<UpdateModel>("examples", id);

useEffect(() => {
  if (existing) {
    methods.reset(existing);
  }
}, [existing, methods]);
```

2. **Use `updateAsync`** instead of `createAsync`:

```tsx
const { updateAsync, isLoading } = useUpdate<UpdateModel>(moduleName);
await updateAsync({ url: `${moduleName}/${id}`, body: data });
```

## Read-Only / Detail Forms

Used in `ReadPage.tsx` (detail view). Pass `readOnly={true}` to all form fields:

```tsx
<FormFields readOnly />
```

This disables all inputs (they render as display text styled as form fields).

## All Form Input Components

### Simple Inputs (no `control` needed)

```tsx
<Text name="name" label="Name" required readOnly />
<Email name="email" label="Email" required />
<Password name="password" label="Password" required />
<TextAreaInput name="address" label="Address" readOnly />
<NumberInput name="age" label="Age" min={0} max={120} required />
<IdentityNumberInput name="nik" label="NIK" required />
<PhoneNumberInput name="phone" label="Phone" required />
<InputTaxpayer name="taxpayer_number" label="NPWP" required />
<DateInput name="dob" label="Date of Birth" required />
<MonthYearInput name="input_date_year" label="Month / Year" required />
<TimeInput name="input_time" label="Time" required />
<MonthSelect name="birth_month" label="Month" required />
<YearSelect name="birth_year" label="Year" required />
```

### Controlled Inputs (require `control={control}`)

```tsx
<Switch
  name="married_status"
  label="Married Status"
  leftLabel="unmarried"
  rightLabel="married"
  defaultChecked={false}
  readOnly={readOnly}
/>

<RadioInput<number, string>
  name="gender"
  label="Gender"
  data={genderOptions}  // ListOption<number, string>[]
  readOnly={readOnly}
  required
/>

<CheckBoxInput<number, string>
  name="checkbox"
  label="Options"
  data={checkboxOptions}
  readOnly={readOnly}
/>

<SingleSelectInput
  control={control}
  name="role"
  label="Role"
  loadOptions={roleOptions}  // SelectOption[] or async function
  readOnly={readOnly}
  required
/>

<MultipleSelectInput
  control={control}
  name="hobbies"
  label="Hobbies"
  loadOptions={hobbyOptions}
  readOnly={readOnly}
  required
/>
```

### File Upload Inputs

```tsx
<SingleUploadImage
  name="profile_picture"
  label="Profile Picture"
  bucket="single"
  path="app"
  fileSizeAllowed={2}
  fileTypeAllowed="image/jpeg,image/png,image/webp"
  fieldInfo="Max size: 2MB"
  readOnly={readOnly}
  required
/>

<MultipleUploadImage
  name="gallery"
  label="Gallery"
  bucket="multiple"
  path="app"
  fileSizeAllowed={5}
  fileTypeAllowed={["image/jpeg", "image/png"]}
  readOnly={readOnly}
/>

<SingleSelectInput
  name="document"
  label="Document"
  bucket="single"
  path="docs"
  fileSizeAllowed={10}
  fileTypeAllowed="application/pdf"
  readOnly={readOnly}
/>

<MultipleUploadFile
  name="attachments"
  label="Attachments"
  bucket="multiple"
  path="docs"
  fileSizeAllowed={10}
  fileTypeAllowed="application/pdf"
  readOnly={readOnly}
/>
```

## Validation

Validation rules are passed as props to each input. Common rules:

| Rule | Input | Prop |
|---|---|---|
| Required | Any | `required={true}` |
| Min/Max | NumberInput | `min={0}`, `max={100}` |
| Disabled | Any | `readOnly={true}` |

For complex validation rules, use `register` from `useFormContext` with a `rules` object:

```tsx
const { register } = useFormContext();

<input
  {...register("email", {
    required: "Email is required",
    pattern: { value: /.../, message: "Invalid email" },
  })}
/>
```

## Snackbar Notifications

Always show a snackbar on form submit success or failure:

```tsx
import { useSnackbar } from "notistack";

const { enqueueSnackbar } = useSnackbar();

enqueueSnackbar("Saved successfully", { variant: "success" });
enqueueSnackbar(errorMessage, { variant: "error" });
```
