interface Field {
    name: string;
    type: string;
    component?: string;
    label?: string;
    description?: string;
    image?: Image | null;
}

interface FieldOption {
    value: string;
    label: string;
}

interface OptionsField extends Field {
    type: 'options';
    options: FieldOption[];
    multiple?: boolean;
}

interface ButtonsField extends OptionsField {
    type: 'buttons';
}

interface SelectField extends OptionsField {
    type: 'select';
}

interface TextField extends Field {
    type: 'text';
}

type FormBaseField = OptionsField | TextField | Field;

interface GroupField extends Field {
    type: 'group';
    fields: FormBaseField[];
}

type FormField = FormBaseField | GroupField;

interface Form {
    id: string;
    title?: string;
    fields: FormField[];
}

interface FormErrors {
    [fieldName: string]: string[] | null;
}
