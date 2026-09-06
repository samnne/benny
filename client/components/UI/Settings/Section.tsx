import { Text, View } from "moti";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};
export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="mb-6">
    <Text className="font-nunito-extrabold text-xs text-primary uppercase tracking-widest mb-2 px-1">
      {title}
    </Text>
    <View className="bg-white rounded-3xl overflow-hidden border border-primary/5">
      {children}
    </View>
  </View>
);