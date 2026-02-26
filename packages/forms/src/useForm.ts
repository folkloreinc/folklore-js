import { ValidationError, getCSRFHeaders, getCsrfToken, postJSON } from '@folklore/fetch';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import { useCallback, useMemo, useState } from 'react';

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

export interface FormPostData {
    _token?: string;
    [key: string]: unknown;
}

// prettier-ignore
function getFieldsPropsFromFields(fields: FieldDefinition[], {
    value, errors, onChange, ...props
}) {
    return fields.reduce<Record<string, Field>>(
        (allFields, field) => {
            const {
                name = isString(field) ? field : null,
            } = isObject(field) ? field : {};
            return {
                ...allFields,
                [name]: {
                    ...(isObject(field) ? field : null),
                    name,
                    value: value !== null ? value[name] || null : null,
                    errors: errors !== null ? errors[name] || null : null,
                    onChange: fieldValue => onChange(name, fieldValue),
                    ...props,
                },
            };
        },
        {},
    );
}

interface UseFormOptions<TResponse = unknown, TData extends FormPostData = FormPostData> {
    fields?: FieldDefinition[];
    action?: string | null;
    postForm?: ((action: string | null, data: TData) => Promise<TResponse>) | null;
    initialErrors?: FormErrors;
    errors?: FormErrors;
    setErrors?: ((errors: FormErrors) => void) | null;
    initialGeneralError?: string | null;
    generalError?: string | null;
    setGeneralError?: ((error: string | null) => void) | null;
    initialValue?: FormValues;
    value?: FormValues;
    setValue?: ((value: FormValues) => void) | null;
    getFieldValue?: ((value: unknown) => unknown) | null;
    onComplete?: ((response: unknown) => void) | null;
    csrfMetaName?: string | null;
    xsrfCookieName?: string | null;
}

function useForm<TResponse = unknown, TData extends FormPostData = FormPostData>(
    opts: UseFormOptions<TResponse, TData> = {},
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

    const fieldsKey = [value, errors, getFieldValue, ...(fields || [])];
    const onFieldChange = useCallback((fieldName: string, fieldValue: unknown) => {
        const fieldErrors = errors !== null ? errors[fieldName] || null : null;
        if (fieldErrors !== null) {
            setErrors({
                ...errors,
                [fieldName]: null,
            });
        }
        setValue({
            ...value,
            [fieldName]: getFieldValue !== null ? getFieldValue(fieldValue) : fieldValue,
        });
    }, fieldsKey);
    const fieldsProps = useMemo(
        () => getFieldsPropsFromFields(fields, { value, errors, onChange: onFieldChange }),
        fieldsKey,
    );

    const csrfToken = useMemo(() => getCsrfToken(), []);

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
        onComplete(resp);
    };

    const finalPostForm = useCallback(
        (postAction: string | null, postData: FormPostData) =>
            postForm !== null
                ? postForm(postAction, postData)
                : postJSON(postAction, postData, {
                      credentials: 'include',
                      headers: getCSRFHeaders({
                          csrfMetaName,
                          xsrfCookieName,
                      }),
                  }),
        [postForm, postJSON, getCSRFHeaders, csrfMetaName, xsrfCookieName],
    );

    const submit = useCallback(
        (submitValue = value) => {
            setRequestState({
                success: false,
                loading: true,
                error: false,
            });
            setGeneralError(null);
            setErrors(null);

            finalPostForm(action, {
                ...(submitValue || {}),
                _token: getCsrfToken(),
            })
                .then(onSubmitSuccess)
                .catch(onSubmitError);
        },
        [finalPostForm, action, value],
    );

    const onSubmit = useCallback(
        (e: { preventDefault: () => void }) => {
            e.preventDefault();
            submit();
        },
        [submit],
    );

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
        ...requestState,
        status,
        response,
        fields: fieldsProps,
        errors,
        generalError,
    };
}

export default useForm;
