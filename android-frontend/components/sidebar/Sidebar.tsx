import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Modal, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Menu, Briefcase } from 'lucide-react-native';
import Icon from '../layout/Icon'; 

export default function Sidebar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const slideAnims = useRef([...Array(10)].map(() => new Animated.Value(40))).current;
    const fadeAnims = useRef([...Array(10)].map(() => new Animated.Value(0))).current;

    const extraRoutes = state.routes.filter((route: any) => route.name !== 'home');
    const activeRouteName = state.routes[state.index].name;
    
    let leftItems: any[] = [];
    let rightItems: any[] = [];
    let bottomSheetItems: any[] = [];

    if (extraRoutes.length <= 4) {
        const mid = Math.ceil(extraRoutes.length / 2);
        leftItems = extraRoutes.slice(0, mid);
        rightItems = extraRoutes.slice(mid);
    } else {
        leftItems = extraRoutes.slice(0, 2);
        rightItems = [extraRoutes[2], { type: 'hamburger' }];
        bottomSheetItems = extraRoutes.slice(3);
    }

    useEffect(() => {
        if (isMenuOpen) {
            const animations = bottomSheetItems.map((_, i) => 
                Animated.parallel([
                    Animated.spring(slideAnims[i], {
                        toValue: 0,
                        tension: 50,
                        friction: 6,
                        useNativeDriver: true
                    }),
                    Animated.timing(fadeAnims[i], {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true
                    })
                ])
            );
            Animated.stagger(80, animations).start();
        } else {
            bottomSheetItems.forEach((_, i) => {
                slideAnims[i].setValue(40);
                fadeAnims[i].setValue(0);
            });
        }
    }, [isMenuOpen, bottomSheetItems.length]);

    const getOptionDetails = (item: any) => {
        if (item.type === 'hamburger') {
            return { label: 'Más', icon: Menu, onPress: () => setIsMenuOpen(true), isFocused: false };
        }
        
        const isFocused = activeRouteName === item.name;
        const { options } = descriptors[item.key];
        const label = options.title !== undefined ? options.title : item.name;
        const IconComponent = options.tabBarIcon ? options.tabBarIcon() : Briefcase;
        
        return { 
            label, 
            icon: IconComponent, 
            onPress: () => {
                setIsMenuOpen(false);
                navigation.navigate(item.name);
            }, 
            isFocused 
        };
    };

    const renderNavButton = (item: any, key: string) => {
        const { label, icon: IconComponent, onPress, isFocused } = getOptionDetails(item);

        return (
            <Pressable key={key} onPress={onPress} className="flex-1 items-center justify-start pt-1 px-1">
                <View className="h-7 items-center justify-center">
                    <Icon 
                        name={IconComponent} 
                        size={24} 
                        colorClass={isFocused ? 'secondary' : 'muted-foreground'} 
                    />
                </View>
                
                <View className="h-8 items-center justify-start mt-1">
                    <Text 
                        className={`text-[10px] text-center leading-tight ${isFocused ? 'text-secondary font-semibold' : 'text-muted-foreground'}`} 
                        numberOfLines={2}
                    >
                        {label}
                    </Text>
                </View>
            </Pressable>
        );
    };

    return (
        <>
            {isMenuOpen && (
                <Modal transparent visible={isMenuOpen} animationType="fade">
                    <TouchableOpacity 
                        className="flex-1 bg-black/40 justify-end" 
                        activeOpacity={1} 
                        onPress={() => setIsMenuOpen(false)}
                    >
                        <View 
                            className="flex-row flex-wrap justify-center gap-4 px-6 absolute w-full"
                            style={{ bottom: Math.max(insets.bottom, 10) + 90 }}
                        >
                            {bottomSheetItems.map((item, index) => {
                                const { label, icon: IconComponent, onPress, isFocused } = getOptionDetails(item);
                                return (
                                    <Animated.View 
                                        key={`float-${index}`}
                                        style={{
                                            transform: [{ translateY: slideAnims[index] }],
                                            opacity: fadeAnims[index]
                                        }}
                                    >
                                        <Pressable 
                                            onPress={onPress}
                                            className="bg-sidebar-background pt-3 pb-2 px-2 rounded-2xl shadow-xl border border-sidebar-border items-center justify-start w-[76px] h-[80px]"
                                        >
                                            <View className="h-7 items-center justify-center">
                                                <Icon 
                                                    name={IconComponent} 
                                                    size={28} 
                                                    colorClass={isFocused ? 'secondary' : 'muted-foreground'} 
                                                />
                                            </View>
                                            <View className="h-8 items-center justify-start mt-1.5">
                                                <Text 
                                                    className={`text-[10px] text-center leading-tight ${isFocused ? 'text-secondary font-bold' : 'text-foreground'}`} 
                                                    numberOfLines={2}
                                                >
                                                    {label}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

            <View 
                className="flex-row items-center justify-between bg-sidebar-background border-t border-sidebar-border relative shadow-lg"
                style={{ paddingBottom: Math.max(insets.bottom, 10), paddingTop: 10, height: 70 + insets.bottom }}
            >
                <View className="flex-1 flex-row justify-around pr-8 items-center h-full">
                    {leftItems.map((item, index) => renderNavButton(item, `left-${index}`))}
                </View>

                <View className="absolute left-1/2 -ml-[32px] -top-6 z-10">
                    <Pressable 
                        onPress={() => {
                            setIsMenuOpen(false);
                            navigation.navigate('home');
                        }}
                        className={`w-16 h-16 rounded-full items-center justify-center shadow-md border-4 border-sidebar-background ${
                            activeRouteName === 'home' ? 'bg-secondary' : 'bg-secondary/70'
                        }`}
                    >
                        <Home size={28} color="#ffffff" />
                    </Pressable>
                </View>

                <View className="flex-1 flex-row justify-around pl-8 items-center h-full">
                    {rightItems.map((item, index) => renderNavButton(item, `right-${index}`))}
                </View>
            </View>
        </>
    );
}