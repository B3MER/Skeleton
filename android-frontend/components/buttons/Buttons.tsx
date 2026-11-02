import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import 'global.css';

import Button from '@/components/buttons/Button';
import Toggle from '@/components/buttons/Switch';
import Dropdown from '@/components/buttons/Dropdown';

type Item = {
    id: string | number;
    type: 'button' | 'submit' | 'toggle' | 'switch' | 'dropdown' | string | number;
    label?: string;
    icon?: any;
    disabled?: boolean;
    placeholder?: string;
    class?: string;
    multiple?: boolean;
    inverse?: boolean;
    colSpan?: number; // Por eliminar
    variant?: 'normal' | 'floating' | 'external';
};

type Props = {
    data: Item[];
    options?: Record<string, any>;
    modelValue?: Record<string, any>;
    onChange?: (val: Record<string, any>) => void;
    cols?: number;
    containerClass?: string;
    onClick?: (item: Item) => void;
};

export default function ButtonGrouper({
    data,
    options = {},
    modelValue = {},
    onChange,
    cols = 0,
    containerClass = '',
    onClick
}: Props) {

    const { width } = useWindowDimensions();

    // --- responsive como en tu DynamicForm ---
    const isTablet = width >= 768;
    const maxCols = isTablet ? 4 : 2;
    const activeCols = cols > 0 ? Math.min(cols, maxCols) : 0;

    const layoutClass = useMemo(() => {
        return 'flex flex-row flex-wrap ';
    }, []);

    const handleUpdate = (item: Item, value: any) => {
        const newState = {
            ...modelValue,
            [item.id]: value
        };
        onChange(newState);
    };

    const COMPONENT_MAP: Record<string, (item: Item, index: number) => JSX.Element | null> = {
        switch: (item, index) => (
            <Toggle
                key={item.id ?? index}
                id={item.id}
                label={item.label}
                modelValue={modelValue[item.id]}
                inverse={item.inverse}
                disabled={item.disabled}
                onClick={() => onClick?.(item)}
                onChange={(val) => handleUpdate(item, val)}
            />
        ),

        toggle: (item, index) => (
            <Toggle
                key={item.id ?? index}
                id={item.id}
                label={item.label}
                modelValue={modelValue[item.id]}
                inverse={item.inverse}
                disabled={item.disabled}
                onClick={() => onClick?.(item)}
                onChange={(val) => handleUpdate(item, val)}
            />
        ),

        dropdown: (item, index) => (
            <Dropdown
                key={item.id ?? index}
                id={String(item.id)}
                label={item.label}
                modelValue={modelValue}
                options={options[item.id] || []}
                multiple={item.multiple}
                inverse={item.inverse}
                disabled={item.disabled}
                onPress={() => onClick?.(item)}
                onUpdateModelValue={(val) => onChange(val)}
            />
        ),

        button: (item, index) => (
            <Button
                key={item.id ?? index}
                id={item.id}
                label={item.label}
                type="button"
                containerClass={item.class}
                modelValue={modelValue[item.id]}
                disabled={item.disabled}
                icon={item.icon}
                variant={item.variant}
                onPress={() => onClick?.(item)}
                onUpdateModelValue={(val) => handleUpdate(item, val)}
            />
        ),

        submit: (item, index) => (
            <Button
                key={item.id ?? index}
                id={item.id}
                label={item.label}
                type="submit"
                modelValue={modelValue[item.id]}
                disabled={item.disabled}
                icon={item.icon}
                onPress={() => onClick?.(item)}
                onUpdateModelValue={(val) => handleUpdate(item, val)}
            />
        )
    };

    return (
        <View className={`${layoutClass} ${containerClass}`}>
            {data.map((item, index) => {
                const renderer = COMPONENT_MAP[item.type];
                if (!renderer) return null;

                let itemWidth = '100%';

                if (activeCols > 0) {
                    const span = item.colSpan || 1;
                    const widthPercent = (span / activeCols) * 100;
                    itemWidth = `${widthPercent}%`;
                }

                return (
                    <View
                        key={index}
                        style={{ width: itemWidth, overflow: 'visible' }}
                        className="px-4 py-2"
                    >
                        {renderer(item, index)}
                    </View>
                );
            })}
        </View>
    );
}