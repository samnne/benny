import { View as RNSAV, Text } from "moti";
import { styled } from "nativewind";

const View = styled(RNSAV);
const ReceiptPage = () => {
  return (
    <View className="flex-1 bg-primary p-4   justify-center items-center ">
      <Text>ReceiptCaPage</Text>
    </View>
  );
};

export default ReceiptPage;
