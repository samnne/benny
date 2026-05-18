import { View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { SafeAreaView as RNSAV} from 'react-native-safe-area-context'
import {styled} from "nativewind"

const SafeAreaView = styled(RNSAV)

const Settings = () => {
  return (
    <SafeAreaView className='flex-1 '>
      <Link href={"/"}>Settings</Link>
    </SafeAreaView>
  )
}

export default Settings