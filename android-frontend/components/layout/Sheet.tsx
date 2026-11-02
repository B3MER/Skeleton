import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, Dimensions, TouchableOpacity,
    Animated, Easing, ScrollView, Modal, PanResponder
} from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../buttons/Button';
import ListSkeleton from '../skeletons/ListSkeleton';
import CardSkeleton from '../skeletons/CardSkeleton';

interface SheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    onSend?: () => void;
    textSend?: string;
    iconSend?: any;
    onCancel?: () => void;
    textCancel?: string;
    iconCancel?: any;
    loading?: boolean;
    loadingSkeleton?: boolean | React.ReactNode;
    scrollable?: boolean;
    size?: 1 | 2 | 3 | 4;
}

const Sheet: React.FC<SheetProps> = ({
    visible,
    onClose,
    title,
    children,
    onSend,
    textSend = 'Guardar',
    iconSend,
    onCancel,
    textCancel = 'Cancelar',
    iconCancel,
    loading = false,
    loadingSkeleton = false,
    scrollable = true,
    size = 2,
}) => {
    const { height: screenHeight } = Dimensions.get('window');
    const insets = useSafeAreaInsets();

    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const sheetHeightAnim = useRef(new Animated.Value(0)).current;
    const heightAtStart = useRef(0);
    const [showModal, setShowModal] = useState(visible);

    const getInitialHeight = () => {
        switch (size) {
            case 1: return 100;
            case 2: return 75;
            case 3: return 50;
            case 4: return 25;
            default: return 75;
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 2,
            onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dy) > 2,

            onPanResponderGrant: () => {
                sheetHeightAnim.stopAnimation();
                heightAtStart.current = (sheetHeightAnim as any).__getValue();
            },
            onPanResponderMove: (_, gestureState) => {
                const dyPct = (gestureState.dy / screenHeight) * 100;
                let newPct = heightAtStart.current - dyPct;
                if (newPct > 100) {
                    newPct = 100 + (newPct - 100) * 0.15;
                }

                sheetHeightAnim.setValue(Math.max(0, newPct));
            },
            onPanResponderRelease: (_, gestureState) => {
                const finalPct = (sheetHeightAnim as any).__getValue();
                const posiciones = [0, 25, 50, 75, 100];

                let closestPoint = posiciones[0];
                let minDiff = Math.abs(finalPct - posiciones[0]);

                for (let i = 1; i < posiciones.length; i++) {
                    const diff = Math.abs(finalPct - posiciones[i]);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestPoint = posiciones[i];
                    }
                }

                if (gestureState.vy > 0.8) {
                    const currentIndex = posiciones.indexOf(closestPoint);
                    closestPoint = posiciones[Math.max(0, currentIndex - 1)];
                    if (gestureState.vy > 1.8) closestPoint = 0;
                } else if (gestureState.vy < -0.8) {
                    const currentIndex = posiciones.indexOf(closestPoint);
                    closestPoint = posiciones[Math.min(posiciones.length - 1, currentIndex + 1)];
                }

                if (closestPoint === 0) {
                    Animated.timing(sheetHeightAnim, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: false,
                    }).start(() => {
                        setShowModal(false);
                        onCloseRef.current();
                    });
                } else {
                    Animated.spring(sheetHeightAnim, {
                        toValue: closestPoint,
                        useNativeDriver: false,
                        bounciness: 4,
                        speed: 12
                    }).start();
                }
            }
        })
    ).current;

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.timing(sheetHeightAnim, {
                toValue: getInitialHeight(),
                duration: 350,
                easing: Easing.out(Easing.exp),
                useNativeDriver: false,
            }).start();
        } else if (showModal) {
            Animated.timing(sheetHeightAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start(() => {
                setShowModal(false);
            });
        }
    }, [visible]);

    if (!showModal) return null;
    const heightInterpolated = sheetHeightAnim.interpolate({
        inputRange: [0, 25, 50, 75, 100],
        outputRange: ['0%', '25%', '50%', '75%', '100%']
    });

    const isCustomSkeleton = typeof loadingSkeleton !== 'boolean' && React.isValidElement(loadingSkeleton);
    const showSkeleton = loadingSkeleton === true || isCustomSkeleton;
    const isActionDisabled = loading || showSkeleton;

    const defaultSkeleton = (
        <View className="flex-1 w-full">
            <CardSkeleton
                count={1}
                lines={2}
                hasAvatar={true}
                hasHeader={true}
                hasFooter={false}
                className="mb-4"
            />
            <ListSkeleton count={4} hasIcon={true} />
        </View>
    );

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <TouchableOpacity
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <Animated.View
                    style={{
                        height: heightInterpolated,
                        marginTop: size === 1 ? insets.top : 0
                    }}
                    className="bg-popover rounded-t-3xl border-t border-border shadow-2xl relative overflow-hidden w-full flex-col"
                >
                    <View className="bg-background/50 pb-5 rounded-t-3xl shadow-sm">
                        <View
                            {...panResponder.panHandlers}
                            className="w-full items-center pt-5 pb-3"
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <View className="w-14 h-1.5 bg-muted rounded-full" />
                        </View>

                        <View className="flex-row justify-between items-center px-8">
                            <Text className="text-xl font-extrabold tracking-tight text-foreground">
                                {title || 'Opciones'}
                            </Text>
                            <TouchableOpacity onPress={onClose} className="bg-muted p-2 rounded-full active:opacity-70">
                                <X size={20} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showSkeleton ? (
                        <ScrollView
                            className="flex-1 px-6 pt-5"
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {isCustomSkeleton ? (loadingSkeleton as React.ReactNode) : defaultSkeleton}
                        </ScrollView>
                    ) : scrollable ? (
                        <ScrollView
                            className="flex-1 px-6 pt-5"
                            contentContainerStyle={{ paddingBottom: 20 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {children}
                        </ScrollView>
                    ) : (
                        <View className="flex-1 px-6 pt-5 pb-5">
                            {children}
                        </View>
                    )}

                    {(onCancel || onSend) && (
                        <View
                            className="w-full p-4 bg-background/50 rounded-t-3xl border-t border-border/50 flex-row gap-x-3"
                        >
                            {onCancel && (
                                <View className="flex-1">
                                    <Button
                                        label={textCancel}
                                        icon={iconCancel}
                                        variant="normal"
                                        containerClass="bg-secondary text-secondary-foreground border-0 w-full h-14 rounded-xl"
                                        onPress={onCancel}
                                        disabled={isActionDisabled}
                                    />
                                </View>
                            )}

                            {onSend && (
                                <View className="flex-1">
                                    <Button
                                        label={textSend}
                                        icon={iconSend}
                                        variant="normal"
                                        containerClass="bg-primary text-primary-foreground border-0 w-full h-14 rounded-xl shadow-sm"
                                        iconClass="primary-foreground"
                                        onPress={onSend}
                                        disabled={isActionDisabled}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

export default Sheet;