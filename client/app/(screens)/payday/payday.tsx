import { useMemo, useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { SafeAreaView as RNSAV } from "react-native-safe-area-context";

import Navbar from "@/components/Navigation/Navbar";
import { usePreferences } from "@/store/zustand";
import { Paycheck, usePaychecks } from "@/store/paychecks";

const SafeAreaView = styled(RNSAV);

type Freq = "weekly" | "biweekly" | "semimonthly" | "monthly";

const money = (n: number) =>
    `$${n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const toISODate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
    ).padStart(2, "0")}`;

const fromISODate = (s: string) => new Date(`${s}T00:00:00`);

const prettyDate = (s: string) =>
    fromISODate(s).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

// Approximate: semi-monthly is treated as +15 days
function computeNextPayday(from: Date, freq: Freq): string {
    const d = new Date(from);
    if (freq === "weekly") d.setDate(d.getDate() + 7);
    else if (freq === "biweekly") d.setDate(d.getDate() + 14);
    else if (freq === "semimonthly") d.setDate(d.getDate() + 15);
    else {
        const day = d.getDate();
        d.setDate(1);
        d.setMonth(d.getMonth() + 1);
        const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        d.setDate(Math.min(day, last));
    }
    return toISODate(d);
}

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <View className="bg-white  rounded-2xl p-4 mb-4">
            <Text className="text-base font-fredoka-semibold text-text  mb-3">
                {title}
            </Text>
            {children}
        </View>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-1 bg-white  rounded-2xl p-4">
            <Text className="text-xs font-nunito text-text/60 ">
                {label}
            </Text>
            <Text className="text-xl font-fredoka-bold text-primary  mt-1">
                {value}
            </Text>
        </View>
    );
}

const payday = () => {
    const dark = useColorScheme() === "dark";
    const placeholder = dark ? "#fef1f499" : "#0e010499";
    const iconColor = dark ? "#e1193a" : "#e61e3f";

    const scrollRef = useRef<ScrollView>(null);
    const { paychecks, addPaycheck, updatePaycheck, removePaycheck } =
        usePaychecks();
    const { payFrequency, nextPayday, setNextPayday } = usePreferences();

    const [amount, setAmount] = useState("");
    const [source, setSource] = useState("");
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { sorted, yearTotal, average } = useMemo(() => {
        const sorted = [...paychecks].sort((a, b) => b.date.localeCompare(a.date));
        const year = String(new Date().getFullYear());
        const yearTotal = sorted
            .filter((p) => p.date.startsWith(year))
            .reduce((s, p) => s + p.amount, 0);
        const average = sorted.length
            ? sorted.reduce((s, p) => s + p.amount, 0) / sorted.length
            : 0;
        return { sorted, yearTotal, average };
    }, [paychecks]);

    const resetForm = () => {
        setAmount("");
        setSource("");
        setDate(new Date());
        setEditingId(null);
        setShowPicker(false);
    };

    const onDateChange = (_: DateTimePickerEvent, selected?: Date) => {
        if (Platform.OS === "android") setShowPicker(false);
        if (selected) setDate(selected);
    };

    const handleSave = () => {
        const value = parseFloat(amount.replace(/[^0-9.]/g, ""));
        if (!isFinite(value) || value <= 0) {
            Alert.alert("Enter an amount", "Add the amount of your paycheck.");
            return;
        }
        const payload = {
            amount: +value.toFixed(2),
            date: toISODate(date),
            source: source.trim(),
        };

        if (editingId) {
            updatePaycheck(editingId, payload);
        } else {
            addPaycheck(payload);
            // Keep the next payday moving forward once a paycheck is logged
            if (!nextPayday || nextPayday <= payload.date) {
                setNextPayday(computeNextPayday(date, payFrequency as Freq));
            }
        }
        resetForm();
    };

    const startEdit = (p: Paycheck) => {
        setEditingId(p.id);
        setAmount(String(p.amount));
        setSource(p.source);
        setDate(fromISODate(p.date));
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    const confirmDelete = (p: Paycheck) => {
        Alert.alert(
            "Delete paycheck",
            `Remove ${money(p.amount)} from ${prettyDate(p.date)}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        removePaycheck(p.id);
                        if (editingId === p.id) resetForm();
                    },
                },
            ],
        );
    };

    const inputClass =
        "bg-pill  rounded-xl px-4 py-3 font-nunito text-text ";

    return (
        <SafeAreaView
            className="flex-1 bg-white "
            style={{ paddingTop: 16 }}
        >
            <Navbar />
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View className="px-5 pt-2 pb-4">
                    <Text className="font-fredoka-semibold text-6xl text-text ">
                        Payday
                    </Text>
                    <Text className="font-nunito text-sm text-text/40 /40 mt-0.5">
                        {nextPayday
                            ? `Next payday: ${fromISODate(nextPayday).toDateString()}`
                            : "Next payday not set"}
                    </Text>
                </View>

                <ScrollView
                    ref={scrollRef}
                    className="flex-1 px-4"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 48 }}
                >
                    {/* Stats */}
                    <View className="flex-row gap-3 mb-4">
                        <Stat label="Earned this year" value={money(yearTotal)} />
                        <Stat label="Average paycheck" value={money(average)} />
                    </View>

                    {/* Form */}
                    <Card title={editingId ? "Edit paycheck" : "Log a paycheck"}>
                        <Text className="text-xs font-nunito-semibold text-text/60  mb-1">
                            Amount
                        </Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            placeholderTextColor={placeholder}
                            keyboardType="decimal-pad"
                            className={`${inputClass} mb-3`}
                            accessibilityLabel="Paycheck amount"
                        />

                        <Text className="text-xs font-nunito-semibold text-text/60  mb-1">
                            Source (optional)
                        </Text>
                        <TextInput
                            value={source}
                            onChangeText={setSource}
                            placeholder="Employer or note"
                            placeholderTextColor={placeholder}
                            className={`${inputClass} mb-3`}
                            accessibilityLabel="Paycheck source"
                        />

                        <View className="mb-4">
                            <Text className="text-xs font-nunito-semibold text-text/60  mb-1">
                                Date
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowPicker((v) => !v)}
                                accessibilityRole="button"
                                accessibilityLabel="Choose paycheck date"
                                className="bg-pill  rounded-xl px-4 py-3 flex-row items-center justify-between"
                            >
                                <Text className="font-nunito-semibold text-text ">
                                    {prettyDate(toISODate(date))}
                                </Text>
                                <Ionicons name="calendar-outline" size={20} color={iconColor} />
                            </TouchableOpacity>

                            {showPicker && (
                                <View className="mt-2">
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        maximumDate={new Date()}
                                        onChange={onDateChange}
                                        themeVariant="light"
                                        textColor="#0e0104"
                                        style={Platform.OS === "ios" ? { height: 216, width: "100%" } : undefined}
                                    />
                                    {Platform.OS === "ios" && (
                                        <TouchableOpacity
                                            onPress={() => setShowPicker(false)}
                                            accessibilityRole="button"
                                            className="px-6 py-2 self-center"
                                        >
                                            <Text className="font-fredoka-semibold text-primary ">
                                                Done
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                        {Platform.OS === "android" && showPicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                maximumDate={new Date()}
                                onChange={onDateChange}
                            />
                        )}

                        <TouchableOpacity
                            onPress={handleSave}
                            accessibilityRole="button"
                            className="bg-primary  rounded-full py-4 items-center"
                        >
                            <Text className="font-fredoka-semibold text-white text-base">
                                {editingId ? "Save changes" : "Log paycheck"}
                            </Text>
                        </TouchableOpacity>

                        {editingId && (
                            <TouchableOpacity
                                onPress={resetForm}
                                accessibilityRole="button"
                                className="items-center pt-3"
                            >
                                <Text className="font-nunito-semibold text-text/60 ">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        )}
                    </Card>

                    {/* History */}
                    <Card title="History">
                        {sorted.length === 0 && (
                            <Text className="text-sm font-nunito text-text/60 ">
                                No paychecks logged yet.
                            </Text>
                        )}
                        {sorted.map((p) => (
                            <View
                                key={p.id}
                                className="flex-row items-center py-2.5 border-b border-pill "
                            >
                                <TouchableOpacity
                                    className="flex-1"
                                    onPress={() => startEdit(p)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Edit paycheck of ${money(p.amount)} on ${prettyDate(p.date)}`}
                                >
                                    <Text className="font-fredoka-semibold text-lg text-text ">
                                        {money(p.amount)}
                                    </Text>
                                    <Text className="font-nunito text-xs text-text/60 ">
                                        {prettyDate(p.date)}
                                        {p.source ? `  ·  ${p.source}` : ""}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => confirmDelete(p)}
                                    hitSlop={12}
                                    accessibilityRole="button"
                                    accessibilityLabel="Delete paycheck"
                                >
                                    <Ionicons name="trash-outline" size={20} color={iconColor} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default payday;