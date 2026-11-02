import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import 'global.css';

type Props = {
  id?: string | number;
  label?: string;
  type?: string;
  icon?: LucideIcon;
  disabled?: boolean;

  modelValue?: boolean | Record<string, any>;
  onChange?: (value: boolean | Record<string, any>) => void;

  inverse?: boolean;
  onClick?: (data: { id: string; type: string }) => void;
};

export default function Toggle({
  id,
  label = '',
  type = 'toggle',
  icon: Icon,
  disabled = false,
  modelValue = false,
  inverse = false,
  onClick,
  onChange
}: Props) {

  const idInterna = useMemo(
    () => id ?? `sw-${Math.floor(Math.random() * 1000000)}`,
    [id]
  );

  const isObjectMode =
    typeof modelValue === 'object' && modelValue !== null && id !== undefined;

  const currentValue = isObjectMode
    ? !!(modelValue as Record<string, any>)[id]
    : !!modelValue;

  const [value, setValue] = useState(currentValue);
  const translateX = useState(new Animated.Value(value ? 20 : 0))[0];

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [value]);

  const handlePress = () => {
    if (disabled) return;

    const newValue = inverse ? value : !value;

    setValue(newValue);
    onClick?.({ id: idInterna, type });

    // 🔥 modo objeto usando SOLO modelValue
    if (isObjectMode) {
      const newObject = {
        ...(modelValue as Record<string, any>),
        [id]: newValue
      };

      onChange?.(newObject);
      return;
    }

    // 🔥 modo normal
    onChange?.(newValue);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className="flex-row items-center px-2 h-10"
    >
      <View
        className={`w-11 h-6 rounded-full justify-center ${
          value ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <Animated.View
          style={{ transform: [{ translateX }] }}
          className="w-5 h-5 rounded-full bg-white absolute left-[2px]"
        />
      </View>

      {label ? (
        <Text className="ml-3 text-sm text-foreground">
          {label}
        </Text>
      ) : null}

      {Icon ? <Icon size={18} className="ml-2" /> : null}
    </Pressable>
  );
}