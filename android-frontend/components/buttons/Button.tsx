import React, { useMemo, useState, useRef } from 'react';
import { Pressable, Text, View, Animated } from 'react-native';
import Icon from '@/components/layout/Icon';

export interface MenuOption {
    id: string | number;
    label?: string;
    icon?: React.ElementType;
}

interface ButtonProps {
    id?: string | number | null;
    label?: string;
    type?: 'button' | 'toggle' | 'submit';
    icon?: React.ElementType;
    disabled?: boolean;
    containerClass?: string;
    modelValue?: boolean;
    iconClass?: string;
    iconSize?: number;
    variant?: 'normal' | 'floating' | 'external' | 'ghost' | 'menu';
    size?: 'sm' | 'md' | 'lg' | 'none';
    options?: MenuOption[];
    onPress?: (data: { id: string | number; type: string }) => void;
    onUpdateModelValue?: (value: boolean) => void;
}

export default function Button({
    id = null,
    label = '',
    type = 'button',
    icon,
    disabled = false,
    containerClass = '',
    modelValue = false,
    iconClass = '',
    iconSize,
    variant = 'normal',
    size = 'md',
    options = [],
    onPress,
    onUpdateModelValue
}: ButtonProps) {
    const idInterna = useMemo(() => id ?? `btn-${Math.floor(Math.random() * 1000000)}`, [id]);

    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            friction: 6,
            tension: 50,
            useNativeDriver: true,
        }).start();
        setIsOpen(!isOpen);
    };

    const rotation = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                }),
            },
        ],
    };

    if (type !== 'button' && type !== 'toggle' && type !== 'submit') return null;

    const isActiveToggle = type === 'toggle' && modelValue;
    const hasLabel = !!label;
    const hasIcon = !!icon;

    const sizeConfig = {
        sm: { container: 'px-2 py-1 rounded-md min-h-[28px]', text: 'text-xs', icon: 16 },
        md: { container: 'h-12 px-6 rounded-xl', text: 'text-base', icon: 18 },
        lg: { container: 'h-14 px-8 rounded-2xl', text: 'text-lg', icon: 24 },
        none: { container: '', text: '', icon: 18 }
    };

    const currentSize = sizeConfig[size];

    const textClassesArray: string[] = [];
    const containerClassesArray: string[] = [];
    const layoutClassesArray: string[] = [];

    let hasBorderWidth = false;
    let hasBorderProperty = false;

    if (containerClass) {
        containerClass.split(' ').forEach(cls => {
            if (cls.startsWith('text-')) {
                textClassesArray.push(cls);
            } else if (
                variant === 'menu' &&
                (cls === 'absolute' || cls.startsWith('bottom-') || cls.startsWith('top-') || cls.startsWith('left-') || cls.startsWith('right-') || cls.startsWith('z-'))
            ) {
                layoutClassesArray.push(cls);
            } else {
                containerClassesArray.push(cls);
                if (cls.startsWith('border-') || cls === 'border') {
                    hasBorderProperty = true;
                }
                if (['border', 'border-0', 'border-2', 'border-4', 'border-8'].includes(cls)) {
                    hasBorderWidth = true;
                }
            }
        });
    }

    if (hasBorderProperty && !hasBorderWidth) {
        containerClassesArray.push('border-2');
    }

    const customTextClasses = textClassesArray.join(' ');
    const customContainerClasses = containerClassesArray.join(' ');

    const hasCustomBg = customContainerClasses.includes('bg-') || variant === 'ghost';
    const activeViewClasses = isActiveToggle ? 'bg-accent' : (hasCustomBg ? '' : 'bg-secondary');
    const activeTextClasses = customTextClasses ? customTextClasses : (isActiveToggle ? 'text-accent-foreground' : 'text-primary-foreground');

    const handlePress = () => {
        if (disabled) return;

        if (variant === 'menu' && options.length > 0) {
            toggleMenu();
            return;
        }

        onPress?.({ id: idInterna, type });
        if (type === 'toggle') onUpdateModelValue?.(!modelValue);
    };

    const renderIcon = () => {
        if (!hasIcon) return null;

        const resolvedIconSize = iconSize || currentSize.icon;
        const marginClass = hasLabel && (!isOpen || variant !== 'menu') ? (size === 'sm' ? "mr-1" : "mr-2") : "";

        if (variant === 'floating') {
            return (
                <View
                    style={{ elevation: 4 }}
                    className="absolute -top-3 -right-3 bg-card rounded-full w-7 h-7 flex items-center justify-center shadow-md z-50"
                >
                    <Icon name={icon} colorClass={iconClass || 'chart-1'} size={iconSize || 30} />
                </View>
            );
        }

        const baseIcon = <Icon name={icon} colorClass={iconClass || 'primary-foreground'} size={resolvedIconSize} />;

        if (variant === 'menu') {
            return (
                <View className={marginClass}>
                    <Animated.View style={rotation}>
                        {baseIcon}
                    </Animated.View>
                </View>
            );
        }

        if (variant === 'normal') {
            return <View className={marginClass}>{baseIcon}</View>;
        }

        return <Icon name={icon} colorClass={iconClass} size={resolvedIconSize} />;
    };

    const renderMenuOptions = () => {
        if (variant !== 'menu' || !options) return null;

        return options.map((option, index) => {
            const distance = -65 * (index + 1);
            const optionStyle = {
                transform: [
                    { scale: animation },
                    {
                        translateY: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, distance],
                        }),
                    },
                ],
                opacity: animation,
            };

            return (
                <Animated.View
                    key={option.id}
                    style={[optionStyle, { position: 'absolute', right: 0, bottom: 0, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', width: 250 }]}
                    pointerEvents={isOpen ? 'auto' : 'none'}
                >
                    {option.label && (
                        <View className="bg-secondary shadow-sm px-3 py-1.5 rounded-lg mr-3">
                            <Text className="text-sm font-medium text-foreground">
                                {option.label}
                            </Text>
                        </View>
                    )}
                    <Pressable
                        onPress={() => {
                            onPress?.({ id: option.id, type: 'option' });
                            toggleMenu();
                        }}
                        className={`bg-secondary shadow-lg rounded-full w-12 h-12 flex items-center justify-center ${disabled ? 'opacity-40' : 'active:opacity-70'}`}
                    >
                        {option.icon && <Icon name={option.icon} size={20} colorClass="text-foreground" />}
                    </Pressable>
                </Animated.View>
            );
        });
    };

    const isExternal = variant === 'external' && hasIcon;

    const ButtonBody = (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            accessibilityLabel={label}
            className={`flex-row items-center justify-center ${currentSize.container} ${disabled ? 'opacity-40' : 'active:opacity-70'} ${variant !== 'external' ? 'relative' : ''} ${activeViewClasses} ${customContainerClasses}`}
        >
            {variant !== 'external' && renderIcon()}

            {hasLabel && (variant !== 'menu' || !isOpen) && (
                <Text className={`font-semibold ${currentSize.text} ${activeTextClasses}`}>
                    {label}
                </Text>
            )}
        </Pressable>
    );

    if (isExternal) {
        return (
            <View className="flex-row items-center gap-3">
                <View className="bg-green-100 p-2.5 rounded-full border border-green-200">
                    {renderIcon()}
                </View>
                {ButtonBody}
            </View>
        );
    }

    if (variant === 'menu') {
        const layoutClasses = layoutClassesArray.join(' ');
        return (
            <View className={`${layoutClasses} flex items-end justify-end`} pointerEvents="box-none">
                <View className="relative items-center flex-col-reverse" pointerEvents="box-none">
                    {renderMenuOptions()}
                    {ButtonBody}
                </View>
            </View>
        );
    }

    return ButtonBody;
}