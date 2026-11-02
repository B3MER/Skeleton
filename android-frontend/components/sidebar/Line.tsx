import React from 'react';
import { View } from 'react-native';
import 'global.css';

export default function Divider() {
    return (
        <View className="flex-row px-2 my-2 justify-between items-center border-t border-gray-300" />
    );
}