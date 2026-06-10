import { ValidationError, getCSRFHeaders, getCsrfToken, postJSON } from '@folklore/fetch';
import isObject from 'lodash-es/isObject';
import isString from 'lodash-es/isString';
import { SubmitEvent, useState } from 'react';

type FieldErrors = string | string[] | null;

export interface Field {
    name?: string;
    value?: unknown;
    errors?: FieldErrors;
    onChange?: (value: unknown) => void;
    [key: string]: unknown;
}

type FormValues = Record<string, unknown> | null;
type FormErrors = Record<string, FieldErrors> | null;
type FieldDefinition = string | Field;
type RequestState = {
    success: boolean;
    loading: boolean;
    error: boolean;
};

export type FormPostData = Record<string, unknown>;

export interface UseFormOptions<TResponse = unknown, TData extends FormPostData = FormPostData> {
    fields?: FieldDefinition[];
    action?: string | null;
    postForm?: ((action: string | null, data: TData) => Promise<TResponse>) | null;
    initialErrors?: FormErrors;
    errors?: FormErrors;
    setErrors?: ((errors: FormErrors | ((currentErrors: FormErrors) => FormErrors)) => void) | null;
    initialGeneralError?: string | null;
    generalError?: string | null;
    setGeneralError?: ((error: string | null) => void) | null;
    initialValue?: FormValues;
    value?: FormValues;
    setValue?: ((value: FormValues | ((currentValue: FormValues) => FormValues)) => void) | null;
    getFieldValue?: ((value: unknown) => unknown) | null;
    onComplete: ((response: unknown) => void) | null;
    resetOnComplete?: boolean;
    csrfMetaName?: string | null;
    xsrfCookieName?: string | null;
}

function useForm<TResponse = unknown, TData extends FormPostData = FormPostData>(
    opts: UseFormOptions<TResponse, TData>,
) {
    const {
        fields = [],
        action = null,
        postForm = null,
        initialErrors = null,
        errors: providedErrors = null,
        setErrors: setProvidedErrors = null,
        initialGeneralError = null,
        generalError: providedGeneralError = null,
        setGeneralError: setProvidedGeneralError = null,
        initialValue = null,
        value: providedValue = null,
        setValue: setProvidedValue = null,
        getFieldValue = null,
        onComplete = null,
        resetOnComplete = false,
        csrfMetaName = null,
        xsrfCookieName = null,
    } = opts || {};

    const [stateValue, setStateValue] = useState<FormValues>(initialValue || providedValue);
    const [stateErrors, setStateErrors] = useState<FormErrors>(initialErrors || providedErrors);
    const [stateGeneralError, setStateGeneralError] = useState(
        initialGeneralError || providedGeneralError,
    );
    const [requestState, setRequestState] = useState<RequestState>({
        success: false,
        loading: false,
        error: false,
    });
    const [response, setResponse] = useState<unknown>(null);

    const hasProvidedValue = setProvidedValue !== null;
    const value = hasProvidedValue ? providedValue : stateValue;
    const setValue = hasProvidedValue ? setProvidedValue : setStateValue;

    const hasProvidedErrors = setProvidedErrors !== null;
    const errors = hasProvidedErrors ? providedErrors : stateErrors;
    const setErrors = hasProvidedErrors ? setProvidedErrors : setStateErrors;

    const hasProvidedGeneralError = setProvidedGeneralError !== null;
    const generalError = hasProvidedGeneralError ? providedGeneralError : stateGeneralError;
    const setGeneralError = hasProvidedGeneralError
        ? setProvidedGeneralError
        : setStateGeneralError;

    const onFieldChange = (fieldName: string, fieldValue: unknown) => {
        const hasErrors = (errors !== null ? errors[fieldName] || null : null) !== null;
        if (hasErrors) {
            setErrors((currentErrors) => ({
                ...currentErrors,
                [fieldName]: null,
            }));
        }
        setValue((currentValue) => ({
            ...currentValue,
            [fieldName]: getFieldValue !== null ? getFieldValue(fieldValue) : fieldValue,
        }));
    };
    const fieldsProps = fields.reduce<Record<string, Field>>((allFields, field) => {
        const { name = isString(field) ? field : null } = isObject(field) ? field : {};
        return {
            ...allFields,
            [name]: {
                ...(isObject(field) ? field : null),
                name,
                value: value !== null ? value[name] || null : null,
                errors: errors !== null ? errors[name] || null : null,
                onChange: (fieldValue) => onFieldChange(name, fieldValue),
            },
        };
    }, {});

    const [csrfToken, setCsrfToken] = useState(() => getCsrfToken());

    const reset = () => {
        setValue(initialValue);
        setErrors(initialErrors);
        setGeneralError(initialGeneralError);
        setRequestState({
            success: false,
            loading: false,
            error: false,
        });
        setResponse(null);
        setCsrfToken(getCsrfToken());
    };

    const onSubmitError = (error: unknown) => {
        setRequestState({
            success: false,
            loading: false,
            error: true,
        });
        if (
            error &&
            typeof error === 'object' &&
            'name' in error &&
            error.name === 'ValidationError'
        ) {
            const validationError = error as ValidationError<{ errors?: FormErrors }>;
            const { errors: validationErrors = null } = validationError.getResponseData() || {};
            setErrors(validationErrors);
        } else if (error && typeof error === 'object' && 'message' in error) {
            setGeneralError(String(error.message));
        } else {
            setGeneralError('Unknown error');
        }
    };

    const onSubmitSuccess = (resp: unknown) => {
        setRequestState({
            success: true,
            loading: false,
            error: false,
        });
        setResponse(resp);
        if (onComplete !== null) {
            onComplete(resp);
        }

        if (resetOnComplete) {
            reset();
        } else {
            setCsrfToken(getCsrfToken());
        }
    };

    const finalPostForm = (postAction: string | null, postData: TData) =>
        postForm !== null
            ? postForm(postAction, postData)
            : postJSON<TResponse, TData>(postAction, postData, {
                  credentials: 'include',
                  headers: getCSRFHeaders({
                      csrfMetaName,
                      xsrfCookieName,
                  }),
              });

    const submit = (submitValue = value) => {
        setRequestState({
            success: false,
            loading: true,
            error: false,
        });
        setGeneralError(null);
        setErrors(null);

        finalPostForm(action, {
            ...((submitValue || {}) as TData),
            _token: csrfToken,
        })
            .then(onSubmitSuccess)
            .catch(onSubmitError);
    };

    const onSubmit = (e?: SubmitEvent) => {
        e?.preventDefault();
        submit();
    };

    let status = null;
    if (requestState.loading) {
        status = 'loading';
    } else if (requestState.success) {
        status = 'success';
    } else if (requestState.error) {
        status = 'error';
    }

    return {
        value,
        setValue,
        setErrors,
        setGeneralError,
        csrfToken,
        submit,
        onSubmit,
        reset,
        ...requestState,
        status,
        response,
        fields: fieldsProps,
        errors,
        generalError,
    };
}

export default useForm;
