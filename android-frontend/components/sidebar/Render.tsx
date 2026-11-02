import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'global.css';

import SidebarItem from './Dropdown';
import Divider from './Line';
import Label from '../list/Label';

type Item = {
    id?: string | number;
    type: 'button' | 'dropdown' | 'line' | 'label';
    label?: string;
    icon?: any;
    options?: any[];
    class?: string;
};

type Props = {
    data: Item[];
    modelValue?: any;
    acordeon?: boolean;
    colapsed?: boolean;
    onChange?: (val: any) => void;
    onClick?: (payload: any) => void;
};

export default function SidebarGroup({
    data = [],
    modelValue,
    acordeon = false,
    colapsed = false,
    onChange,
    onClick
}: Props) {
    const [openItems, setOpenItems] = useState<(string | number)[]>([]);

    useEffect(() => {
        const loadState = async () => {
            try {
                const stored = await AsyncStorage.getItem('@menu_open_items');
                if (stored) setOpenItems(JSON.parse(stored));
            } catch (e) {}
        };
        loadState();
    }, []);

    useEffect(() => {
        const saveState = async () => {
            try {
                await AsyncStorage.setItem('@menu_open_items', JSON.stringify(openItems));
            } catch (e) {}
        };
        saveState();
    }, [openItems]);

    const handleToggle = (id: any) => {
        setOpenItems(prev => {
            if (acordeon) {
                return prev.includes(id) ? [] : [id];
            }
            if (prev.includes(id)) {
                return prev.filter(i => i !== id);
            }
            return [...prev, id];
        });
    };

    const handleClick = (payload: any, item: Item) => {
        if (acordeon && (!item.options || item.options.length === 0)) {
            setOpenItems([]);
        }
        onClick?.(payload);
    };

    const handleUpdate = (val: any) => {
        onChange?.(val);
    };

    const COMPONENT_MAP: Record<string, (item: Item, index: number) => JSX.Element | null> = {
        button: (item, index) => (
            <SidebarItem
                key={item.id ?? index}
                id={item.id ?? index}
                label={item.label || ''}
                icon={item.icon}
                modelValue={modelValue}
                isOpen={openItems.includes(item.id ?? index)}
                options={item.options}
                onChange={handleUpdate}
                onClick={(payload) => handleClick(payload, item)}
                onToggle={handleToggle}
            />
        ),
        dropdown: (item, index) => (
            <SidebarItem
                key={item.id ?? index}
                id={item.id ?? index}
                label={item.label || ''}
                icon={item.icon}
                modelValue={modelValue}
                isOpen={openItems.includes(item.id ?? index)}
                options={item.options}
                onChange={handleUpdate}
                onClick={(payload) => handleClick(payload, item)}
                onToggle={handleToggle}
            />
        ),
        line: () => (
            <Divider />
        ),
        label: (item, index) => (
            colapsed
                ? null
                : (
                    <Label
                        id = {item.id}
                        key={item.id ?? index}
                        label={item.label}
                    />
                )
        )
    };

    return (
        <View>
            {data.map((item, index) => {
                const renderer = COMPONENT_MAP[item.type];
                if (!renderer) return null;

                return (
                    <View key={item.id ?? index} className="my-1.5">
                        {renderer(item, index)}
                    </View>
                );
            })}
        </View>
    );
}