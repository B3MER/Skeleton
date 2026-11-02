import React, { useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated, PanResponder } from 'react-native';

interface Props {
    children?: React.ReactNode;
    title?: string;
    titleClass?: string;
    button?: React.ReactNode;
    divider?: boolean;
    visible?: boolean;
    clean?: boolean;
    cardStyle?: string;
    bg_line?: string;
    padding?: string;
    cols?: number;
    index?: string | number | null;
    scroll?: boolean;
    interact?: boolean;
    onPress?: () => void;
    iLeft?: React.ReactNode;
    onLeft?: () => void;
    iRight?: React.ReactNode;
    onRight?: () => void;
    swipeThreshold?: number;
}

const DEFAULT_CARD_STYLE = "bg-card mb-4";

const Card = ({
    children,
    title,
    titleClass,
    button,
    divider = false,
    visible = true,
    clean = false,
    cardStyle = DEFAULT_CARD_STYLE,
    bg_line = "",
    padding = "p-4",
    cols = 1,
    index = null,
    scroll = false,
    interact = false,
    onPress,
    iLeft,
    onLeft,
    iRight,
    onRight,
    swipeThreshold = 80,
}: Props) => {

    const pan = useRef(new Animated.Value(0)).current;
    const hasSwipeAction = Boolean((iLeft || onLeft) || (iRight || onRight));

    const propsRef = useRef({ hasSwipeAction, onLeft, onRight, iLeft, iRight, swipeThreshold });
    propsRef.current = { hasSwipeAction, onLeft, onRight, iLeft, iRight, swipeThreshold };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => propsRef.current.hasSwipeAction,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                const { hasSwipeAction: canSwipe } = propsRef.current;
                if (!canSwipe) return false;
                const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
                return isHorizontal && Math.abs(gestureState.dx) > 3;
            },
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
                const { hasSwipeAction: canSwipe } = propsRef.current;
                if (!canSwipe) return false;
                const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
                return isHorizontal && Math.abs(gestureState.dx) > 3;
            },
            onPanResponderGrant: () => {
                pan.stopAnimation();
            },
            onPanResponderMove: (_, gestureState) => {
                let dx = gestureState.dx;
                const { iLeft: leftIcon, onLeft: leftAction, iRight: rightIcon, onRight: rightAction } = propsRef.current;
                const canLeft = Boolean(leftIcon || leftAction);
                const canRight = Boolean(rightIcon || rightAction);

                if (!canLeft && dx > 0) dx = dx * 0.15;
                if (!canRight && dx < 0) dx = dx * 0.15;

                pan.setValue(dx);
            },
            onPanResponderRelease: (_, gestureState) => {
                const dx = gestureState.dx;
                const { iLeft: leftIcon, onLeft: leftAction, iRight: rightIcon, onRight: rightAction, swipeThreshold: threshold } = propsRef.current;
                const canLeft = Boolean(leftIcon || leftAction);
                const canRight = Boolean(rightIcon || rightAction);

                const isLeftTriggered = canLeft && (dx > threshold || (dx > 35 && gestureState.vx > 0.4));
                const isRightTriggered = canRight && (dx < -threshold || (dx < -35 && gestureState.vx < -0.4));

                if (isLeftTriggered && leftAction) {
                    leftAction();
                } else if (isRightTriggered && rightAction) {
                    rightAction();
                }

                Animated.spring(pan, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 6,
                }).start();
            },
            onPanResponderTerminate: () => {
                Animated.spring(pan, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 6,
                }).start();
            },
            onPanResponderTerminationRequest: () => false,
        })
    ).current;

    if (!visible) return null;

    const indexBgClass = useMemo(() => {
        if (bg_line && bg_line.includes('border-l-')) {
            return bg_line.replace('border-l-', 'bg-');
        }
        return 'bg-primary';
    }, [bg_line]);

    const containerClasses = useMemo(() => {
        if (clean) {
            const styleToUse = cardStyle === DEFAULT_CARD_STYLE ? "bg-card" : cardStyle;
            return `w-full ${styleToUse}`.trim().replace(/\s+/g, ' ');
        }

        const cardBaseClass = "border border-border rounded-xl shadow-sm";
        const lineClass = bg_line ? `border-l-4 ${bg_line}` : "";
        const bgClass = cardStyle.includes('bg-') ? '' : 'bg-card';

        return `relative w-full items-start overflow-hidden ${cardBaseClass} ${bgClass} ${cardStyle} ${lineClass} ${padding}`
            .trim()
            .replace(/\s+/g, ' ');
    }, [clean, cardStyle, bg_line, padding]);

    const renderHeader = () => {
        if (!title && !button) return null;
        return (
            <View className="w-full mb-3">
                <View className="flex-row justify-between items-center w-full">
                    {title && <Text className={`text-md font-bold text-card-foreground flex-1 mr-2 ${titleClass || ""}`}>{title}</Text>}
                    {button && <View>{button}</View>}
                </View>
                {divider && <View className="h-[1px] bg-border w-full mt-3" />}
            </View>
        );
    };

    const renderContent = () => {
        if (cols === 1) return <>{children}</>;

        return (
            <View className="w-full flex-row flex-wrap">
                {React.Children.toArray(children).map((child, i) => {
                    if (!React.isValidElement(child)) return null;
                    return (
                        <View key={i} style={{ width: `${100 / cols}%` }} className="p-1">
                            {child}
                        </View>
                    );
                })}
            </View>
        );
    };

    const renderIndexBadge = () => {
        if (index == null) return null;
        return (
            <View className={`absolute top-0 left-0 px-2.5 py-0.5 rounded-br-lg z-20 ${indexBgClass}`}>
                <Text className="text-white text-[10px] font-extrabold">
                    {index}
                </Text>
            </View>
        );
    };

    const innerContent = (
        <View className="w-full">
            {index != null && <View className="mt-3 w-full" />}

            {renderHeader()}

            {scroll ? (
                <ScrollView
                    className="w-full"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {renderContent()}
                </ScrollView>
            ) : (
                renderContent()
            )}
        </View>
    );

    const leftOpacity = pan.interpolate({
        inputRange: [0, Math.max(1, swipeThreshold * 0.7)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const leftScale = pan.interpolate({
        inputRange: [0, Math.max(1, swipeThreshold)],
        outputRange: [0.5, 1],
        extrapolate: 'clamp',
    });

    const rightOpacity = pan.interpolate({
        inputRange: [-Math.max(1, swipeThreshold * 0.7), 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const rightScale = pan.interpolate({
        inputRange: [-Math.max(1, swipeThreshold), 0],
        outputRange: [1, 0.5],
        extrapolate: 'clamp',
    });

    const renderSwipeBackground = () => {
        if (!hasSwipeAction) return null;
        return (
            <View pointerEvents="none" className="absolute inset-0 flex-row justify-between items-center px-4 rounded-xl z-0 overflow-hidden">
                <Animated.View
                    style={{ opacity: leftOpacity, transform: [{ scale: leftScale }] }}
                    className="flex-row items-center justify-start h-full flex-1"
                >
                    {iLeft}
                </Animated.View>
                <Animated.View
                    style={{ opacity: rightOpacity, transform: [{ scale: rightScale }] }}
                    className="flex-row items-center justify-end h-full flex-1"
                >
                    {iRight}
                </Animated.View>
            </View>
        );
    };

    const cardElement = (interact || hasSwipeAction) ? (
        <Pressable
            className={`${containerClasses} ${interact ? 'active:opacity-50' : ''}`}
            onPress={onPress}
            android_ripple={interact ? { color: 'rgba(0, 0, 0, 0.15)', borderless: false } : undefined}
        >
            {renderIndexBadge()}
            {innerContent}
        </Pressable>
    ) : (
        <View className={containerClasses}>
            {renderIndexBadge()}
            {innerContent}
        </View>
    );

    if (hasSwipeAction) {
        return (
            <View className="relative w-full">
                {renderSwipeBackground()}
                <Animated.View
                    style={{ transform: [{ translateX: pan }] }}
                    {...panResponder.panHandlers}
                >
                    {cardElement}
                </Animated.View>
            </View>
        );
    }

    return cardElement;
};

export default Card;