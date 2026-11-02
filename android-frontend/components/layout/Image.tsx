import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image as RNImage,
    TouchableOpacity,
    ImageSourcePropType,
    ImageResizeMode,
    StyleProp,
    ViewStyle,
    ImageStyle,
    DimensionValue,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Icon from './Icon';

export interface ImageProps {
    uri?: string | null;
    source?: ImageSourcePropType | null;
    fallbackIcon?: LucideIcon | any;
    icon?: LucideIcon | any;
    fallbackText?: string | null;
    size?: number;
    width?: DimensionValue;
    height?: DimensionValue;
    rounded?: string;
    resizeMode?: ImageResizeMode;
    className?: string;
    style?: StyleProp<ViewStyle | ImageStyle>;
    fallbackBg?: string;
    iconColorClass?: string;
    onPress?: () => void;
    onError?: () => void;
    alt?: string;
}

export default function Image({
    uri,
    source,
    fallbackIcon,
    icon,
    fallbackText,
    size = 52,
    width,
    height,
    rounded = 'rounded-2xl',
    resizeMode = 'cover',
    className = '',
    style = {},
    fallbackBg = 'bg-secondary',
    iconColorClass = 'secondary-foreground',
    onPress,
    onError,
    alt,
}: ImageProps) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [uri, source]);

    const imageSource: ImageSourcePropType | null = source || (uri ? { uri } : null);
    const itemWidth = width ?? size;
    const itemHeight = height ?? size;
    const IconComponent = fallbackIcon || icon;
    const iconSize = Math.round(Number(size) * 0.44) || 24;

    const handleImageError = () => {
        setHasError(true);
        onError?.();
    };

    const renderContent = () => {
        if (imageSource && !hasError) {
            return (
                <RNImage
                    source={imageSource}
                    style={[{ width: itemWidth, height: itemHeight }, style as ImageStyle]}
                    className={`${rounded} bg-muted ${className}`}
                    resizeMode={resizeMode}
                    onError={handleImageError}
                    accessibilityLabel={alt}
                />
            );
        }

        return (
            <View
                style={[{ width: itemWidth, height: itemHeight }, style as ViewStyle]}
                className={`${rounded} ${fallbackBg} items-center justify-center overflow-hidden ${className}`}
                accessibilityLabel={alt}
            >
                {IconComponent ? (
                    <>
                        <Icon name={IconComponent} size={iconSize} colorClass={iconColorClass} />
                        {fallbackText ? (
                            <Text className="text-xs text-secondary-foreground mt-2 text-center px-2" numberOfLines={2}>
                                {fallbackText}
                            </Text>
                        ) : null}
                    </>
                ) : fallbackText ? (
                    <Text className="text-xs text-secondary-foreground text-center px-2" numberOfLines={2}>
                        {fallbackText}
                    </Text>
                ) : null}
            </View>
        );
    };

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                {renderContent()}
            </TouchableOpacity>
        );
    }

    return renderContent();
}
