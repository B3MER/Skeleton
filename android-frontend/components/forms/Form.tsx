import React from 'react';
import { View } from 'react-native';

import Input from './TextInput';
import RangeInput from './RangeInput';
import SelectInput from './SelectInput';
import TextArea from './TextArea';
import Comboboxes from './Comboboxes';
import CheckBoxes from './CheckBoxes';

export type FieldType =
    | 'text' | 'password' | 'file' | 'num' | 'number' | 'math'
    | 'mayusc' | 'minusc' | 'date' | 'time' | 'time-date' | 'date-time'
    | 'textarea' | 'select' | 'comboboxes' | 'checkbox'
    | 'time-range' | 'date-range';

export interface FieldConfig {
    id: string;
    bkey?: string;
    label?: string;
    type: FieldType;
    placeholder?: string;
    icon?: React.ElementType;
    required?: boolean;
    disabled?: boolean;
    maxLength?: number;
    containerClass?: string;
    size?: 1 | 2 | 3 | 4;
    optionsKey?: string;
    accept?: string;
    visibleWhen?: (formValue: Record<string, any>) => boolean;
}

interface DynamicFormProps {
    data: FieldConfig[];
    value?: Record<string, any>;
    options?: Record<string, any[]>;
    error?: Record<string, any>;
    edit?: Record<string, any> | null;
    loading?: Record<string, boolean> | boolean;
    onChange?: (newValue: Record<string, any>) => void;
    onFocus?: (id: string, data?: any) => void;
    fetchData?: (id: string, query: string) => Promise<any> | void;
}

type RendererProps = {
    field: FieldConfig;
    value: any;
    error?: string;
    edit?: any;
    options: any[];
    isLoading?: boolean;
    onChange: (id: string, value: any, item?: any) => void;
    onFocus?: (id: string, data?: any) => void;
    fetchData?: (id: string, text: string) => Promise<any> | void;
};

const textLikeTypes: FieldType[] = [
    'text', 'password', 'file', 'num', 'number', 'math', 'mayusc', 'minusc', 'date', 'time', 'time-date', 'date-time'
];

const fieldRegistry: Record<string, (p: RendererProps) => React.ReactElement> = {
    ...Object.fromEntries(
        textLikeTypes.map((t) => [
            t,
            (p: RendererProps) => (
                <Input
                    id={p.field.id}
                    label={p.field.label}
                    type={p.field.type as any}
                    value={p.value}
                    edit={p.edit}
                    placeholder={p.field.placeholder}
                    icon={p.field.icon}
                    maxLength={p.field.maxLength}
                    disabled={p.field.disabled}
                    required={p.field.required}
                    error={p.error}
                    containerClass={p.field.containerClass}
                    accept={p.field.accept}
                    onChange={(val: any, item: any) => p.onChange(p.field.id, val, item)}
                />
            ),
        ])
    ),

    textarea: (p) => (
        <TextArea
            id={p.field.id}
            label={p.field.label}
            value={p.value}
            edit={p.edit}
            placeholder={p.field.placeholder}
            maxLength={p.field.maxLength}
            disabled={p.field.disabled}
            required={p.field.required}
            error={p.error}
            icon={p.field.icon}
            containerClass={p.field.containerClass}
            onChange={(val) => p.onChange(p.field.id, val)}
        />
    ),

    select: (p) => (
        <SelectInput
            id={p.field.id}
            label={p.field.label}
            value={p.value}
            edit={p.edit}
            placeholder={p.field.placeholder}
            options={{ [p.field.id]: p.options }}
            disabled={p.field.disabled}
            required={p.field.required}
            error={p.error}
            icon={p.field.icon}
            size={p.field.size}
            isLoading={p.isLoading}
            containerClass={p.field.containerClass}
            onChange={(val, item) => p.onChange(p.field.id, val, item)}
            onFocus={(data) => p.onFocus?.(p.field.id, data)}
        />
    ),

    comboboxes: (p) => (
        <Comboboxes
            id={p.field.id}
            label={p.field.label}
            value={p.value}
            edit={p.edit}
            placeholder={p.field.placeholder}
            options={{ [p.field.id]: p.options }}
            disabled={p.field.disabled}
            required={p.field.required}
            error={p.error}
            icon={p.field.icon}
            isLoading={p.isLoading}
            containerClass={p.field.containerClass}
            onChange={(item) => p.onChange(p.field.id, item?.id, item)}
            fetchData={(text) => p.fetchData ? p.fetchData(p.field.id, text) : undefined}
        />
    ),

    checkbox: (p) => (
        <CheckBoxes
            id={p.field.id}
            label={p.field.label}
            value={!!p.value}
            placeholder={p.field.placeholder}
            disabled={p.field.disabled}
            required={p.field.required}
            error={p.error}
            icon={p.field.icon}
            containerClass={p.field.containerClass}
            onChange={(val) => p.onChange(p.field.id, val)}
            onFocus={() => p.onFocus?.(p.field.id)}
        />
    ),

    'time-range': (p) => (
        <RangeInput
            id={p.field.id}
            label={p.field.label}
            value={p.value || {}}
            type="time-range"
            disabled={p.field.disabled}
            error={p.error}
            icon={p.field.icon}
            containerClass={p.field.containerClass}
            onChange={(val: any) => p.onChange(p.field.id, val)}
        />
    ),

    'date-range': (p) => (
        <RangeInput
            id={p.field.id}
            label={p.field.label}
            value={p.value || {}}
            type="date-range"
            disabled={p.field.disabled}
            error={p.error}
            icon={p.field.icon}
            containerClass={p.field.containerClass}
            onChange={(val: any) => p.onChange(p.field.id, val)}
        />
    ),
};

export default function DynamicForm({
    data,
    value = {},
    options = {},
    error = {},
    edit = {},
    loading = false,
    onChange,
    onFocus,
    fetchData,
}: DynamicFormProps) {

    const handleFieldChange = (id: string, val: any, _item?: any) => {
        onChange?.({ ...value, [id]: val });
    };

    return (
        <View className="w-full">
            {data.map((field) => {
                if (field.visibleWhen && !field.visibleWhen(value)) return null;

                const renderer = fieldRegistry[field.type];
                if (!renderer) {
                    if (__DEV__) {
                        console.warn(`[DynamicForm] Tipo de campo no soportado: "${field.type}" (id: ${field.id})`);
                    }
                    return null;
                }

                return (
                    <View key={field.id}>
                        {renderer({
                            field,
                            value: value[field.id],
                            error: error[field.bkey ?? field.id],
                            edit: !!edit ? edit[field.bkey ?? field.id] : null,
                            options: options[field.optionsKey ?? field.id] || [],
                            isLoading: typeof loading === 'boolean' ? loading : !!loading[field.id],
                            onChange: handleFieldChange,
                            onFocus,
                            fetchData,
                        })}
                    </View>
                );
            })}
        </View>
    );
}