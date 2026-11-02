import React from 'react';
import { View, Text } from 'react-native';
import Card from './Card';
import Icon from './Icon';

export interface InfoCardProps {
    title: React.ReactNode;
    text: React.ReactNode;
    icon?: any;
    size?: 'sm' | 'md' | 'lg';
    align?: 'left' | 'center' | 'right';
    class?: string;
    className?: string;
    containerClass?: string;
    cardStyle?: string;
    bg_line?: string;
    clean?: boolean;
    interact?: boolean;
    onPress?: () => void;
    iconColor?: string;
    titleColor?: string;
    textColor?: string;
    index?: string | number | null;
}

export default function InfoCard({
    title,
    text,
    icon,
    size = 'md',
    align = 'left',
    class: classProp = '',
    className = '',
    containerClass = '',
    cardStyle = '',
    bg_line = '',
    clean = false,
    interact,
    onPress,
    iconColor,
    titleColor,
    textColor,
    index = null,
}: InfoCardProps) {
    const customClass = [classProp, className, containerClass].filter(Boolean).join(' ');
    const isCustomBg = customClass.includes('bg-') && !customClass.includes('bg-card') && !customClass.includes('bg-background');

    const resolvedIconColor = iconColor || (isCustomBg ? 'primary-foreground' : 'foreground');
    const resolvedTitleColor = titleColor || (isCustomBg ? 'text-primary-foreground/90' : 'text-muted-foreground');
    const resolvedTextColor = textColor || (isCustomBg ? 'text-primary-foreground' : 'text-card-foreground');

    const sizeConfig = {
        sm: {
            padding: 'p-2',
            iconSize: 14,
            titleClass: 'text-[10px] font-bold',
            textClass: 'text-lg font-black',
            marginClass: 'mt-0.5',
        },
        md: {
            padding: 'p-2.5',
            iconSize: 16,
            titleClass: 'text-xs font-bold',
            textClass: 'text-2xl font-black',
            marginClass: 'mt-1',
        },
        lg: {
            padding: 'p-3.5',
            iconSize: 20,
            titleClass: 'text-sm font-bold',
            textClass: 'text-3xl font-black',
            marginClass: 'mt-1.5',
        },
    }[size] || {
        padding: 'p-2.5',
        iconSize: 16,
        titleClass: 'text-xs font-bold',
        textClass: 'text-2xl font-black',
        marginClass: 'mt-1',
    };

    const alignConfig = {
        left: {
            header: 'justify-start',
            text: 'text-left',
            container: 'items-start',
        },
        center: {
            header: 'justify-center',
            text: 'text-center',
            container: 'items-center',
        },
        right: {
            header: 'justify-end',
            text: 'text-right',
            container: 'items-end',
        },
    }[align] || {
        header: 'justify-start',
        text: 'text-left',
        container: 'items-start',
    };

    return (
        <View className="flex-1">
            <Card
                cardStyle={`w-full mb-0 border-0 ${customClass} ${cardStyle}`.trim()}
                padding={sizeConfig.padding}
                bg_line={bg_line}
                clean={clean}
                interact={interact ?? Boolean(onPress)}
                onPress={onPress}
                index={index}
            >
                <View className={`w-full ${alignConfig.container}`}>
                    <View className={`flex-row items-center w-full ${alignConfig.header}`}>
                        {icon && (
                            <View className="mr-1.5">
                                <Icon name={icon} size={sizeConfig.iconSize} colorClass={resolvedIconColor} />
                            </View>
                        )}
                        {typeof title === 'string' || typeof title === 'number' ? (
                            <Text
                                className={`${sizeConfig.titleClass} ${resolvedTitleColor} ${alignConfig.text} flex-1`}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {title}
                            </Text>
                        ) : (
                            title
                        )}
                    </View>

                    {typeof text === 'string' || typeof text === 'number' ? (
                        <Text
                            className={`${sizeConfig.textClass} ${resolvedTextColor} ${alignConfig.text} w-full ${sizeConfig.marginClass}`}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {text}
                        </Text>
                    ) : (
                        <View className={`w-full ${sizeConfig.marginClass}`}>{text}</View>
                    )}
                </View>
            </Card>
        </View>
    );
}
