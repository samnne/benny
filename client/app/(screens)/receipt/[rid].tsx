
import {  SafeAreaView as RNSAV, Text } from "moti";
import { styled } from "nativewind";


const SafeAreaView = styled(RNSAV);
const ReceiptPage = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary p-4   justify-center items-center ">
      <Text>ReceiptCaPage</Text>
    </SafeAreaView>
  )
}

export default ReceiptPage