import React from 'react';
import { View, ViewProps } from 'react-native';

interface LineProps extends ViewProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export default function Line({
    orientation = 'horizontal',
    className = '',
    ...rest
}: LineProps) {
    const isHorizontal = orientation === 'horizontal';

    const baseClasses = isHorizontal
        ? 'h-[1px] w-full bg-neutro'
        : 'w-[1px] h-full bg-neutro';

    return (
        <View
            className={`${baseClasses} ${className}`}
            {...rest}
        />
    );
}