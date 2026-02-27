export interface BaseField {
    name: string;
    type: string;
    component?: string;
    label?: string;
    description?: string;
    image?: Image | null;
}

export interface FieldOption {
    value: string;
    label: string;
}

export interface OptionsField extends BaseField {
    type: 'options';
    options: FieldOption[];
    multiple?: boolean;
}

export interface ButtonsField extends OptionsField {
    type: 'buttons';
}

export interface SelectField extends OptionsField {
    type: 'select';
}

export interface TextField extends BaseField {
    type: 'text';
}

export type FormBaseField = OptionsField | TextField | BaseField;

export interface GroupField extends BaseField {
    type: 'group';
    fields: FormBaseField[];
}

export type FormField = FormBaseField | GroupField;

export interface Form {
    id: string;
    title?: string;
    fields: FormField[];
}

export interface FormErrors {
    [fieldName: string]: string[] | null;
}

export interface FormSnippet {
    id: string;
    title?: string;
}
