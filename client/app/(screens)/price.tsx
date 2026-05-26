import { View, FlatList, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import { randomUUID } from "expo-crypto";
import { AnimatePresence, MotiView, SafeAreaView as RNSAV, Text } from "moti";
import { styled } from "nativewind";
import { MotiPressable } from "moti/interactions";
import { SymbolView } from "expo-symbols";
import { theme } from "@/constants/constants";
import { useRouter } from "expo-router";
import { playHaptic } from "@/constants/functions";
import { useTrip } from "@/store/zustand";

const SafeAreaView = styled(RNSAV);
const numberPad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "x"];
const Price = () => {
  const [price, setPrice] = useState("0");
  const router = useRouter();
  const { addItem } = useTrip();
  const animatePress = useMemo(
    () =>
      ({ hovered, pressed }) => {
        "worklet";

        return {
          opacity: hovered || pressed ? 0.5 : 1,
          scale: hovered || pressed ? 1.5 : 1,
          translateY: hovered || pressed ? -10 : 0,
          rotateY: hovered || pressed ? 5 : 0,
        };
      },
    [],
  );
  const continueAnimation = useMemo(
    () =>
      ({ hovered, pressed }) => {
        "worklet";

        return {
          scale: hovered || pressed ? 1.05 : 1,
          translateY: hovered || pressed ? -5 : 0,
        };
      },
    [],
  );
  function handlePress(value: string) {
    playHaptic();
    const decimal = ".";
    const backspace = "x";

    switch (value) {
      case decimal:
        if (price.includes(decimal)) {
          break;
        }
        setPrice((prev) => prev + decimal);
        break;
      case backspace:
        if (price.length === 1) {
          setPrice("0");
          break;
        }
        setPrice((prev) => prev.slice(0, prev.length - 1));
        break;
      default:
        if (price.includes(decimal) && price.split(decimal)[0].length >= 8) {
          break;
        } else if (
          price.includes(decimal) &&
          price.split(decimal)[1].length >= 2
        ) {
          break;
        }
        if (price.length >= 8) {
          break;
        }
        if (price === "0") {
          setPrice(value);
          break;
        }

        setPrice((prev) => prev + value);
        break;
    }
  }
  function handleAddItem(name?: string, price?: number) {
    const index = useTrip.getState().items.length + 1;

    const newItem: ReceiptItem = {
      id: randomUUID(),
      name: name?.trim() || `Item ${index}`, // ✅ fallback name
      quantity: 1,
      unit_price: price ?? 0,
      total_price: price ?? 0, // ✅ matches schema
    };

    useTrip.getState().addItem(newItem);
  }
  return (
    <SafeAreaView className="flex-1 bg-primary p-4   justify-center items-center ">
      <Pressable
        onPress={() => router.back()}
        className="absolute right-10 top-20"
      >
        <SymbolView name="multiply" tintColor={theme.colors.background} />
      </Pressable>
      <View className="flex-1 flex-row w-full justify-center items-center">
        <Text className="text-3xl font-bold  text-white">$</Text>
        <MotiView className="flex-row transition-all will-change-animation">
          <AnimatePresence>
            {[...price].map((letter, i) => {
              return (
                <Text
                  className="text-7xl  font-bold relative text-white"
                  key={i + 20}
                  from={{
                    opacity: 0,
                    translateY: 15,
                  }}
                  animate={{
                    opacity: 1,
                    translateY: 0,
                  }}
                  exit={{
                    opacity: 0,
                    translateY: -15,
                  }}
                  transition={{
                    type: "spring",
                    damping: 40,
                    stiffness: 800,
                    duration: 400,
                  }}
                >
                  {letter}
                </Text>
              );
            })}
          </AnimatePresence>
        </MotiView>
      </View>
      <FlatList
        data={numberPad}
        keyExtractor={(item) => item}
        numColumns={3}
        renderItem={({ item, index }) => {
          return (
            <MotiPressable
              containerStyle={{
                flex: 1,
                padding: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
              from={{ opacity: 0, translateY: 50 }}
              animate={animatePress}
              transition={{
                type: "spring",
              }}
              onPress={() => handlePress(item)}
              key={item}
            >
              {item !== "x" ? (
                <Text className="text-white text-4xl">{item}</Text>
              ) : (
                <SymbolView
                  name="delete.left"
                  size={40}
                  tintColor={theme.colors.background}
                />
              )}
            </MotiPressable>
          );
        }}
        className="flex-1 w-full "
      />
      <View className="p-4  w-full ">
        <MotiPressable
          style={{
            backgroundColor: theme.colors.secondary,
            padding: 16,
            width: "100%",
            borderRadius: "8%",
          }}
          onPress={() => {
            playHaptic();
            if (router.canGoBack()) {
              handleAddItem("", Number.parseFloat(price))
              router.back();
            }
          }}
          animate={continueAnimation}
        >
          <Text className="text-3xl text-white text-center font-bold">
            Continue
          </Text>
        </MotiPressable>
      </View>
    </SafeAreaView>
  );
};

export default Price;
