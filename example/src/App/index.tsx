import React from 'react'
import { View, Text } from 'react-native'
import { sayHello } from 'test'

import styles from './styles'

const App = () => {
    return (
        <View style={styles.container}>
            <Text>{sayHello('there')}</Text>
        </View>
    )
}

export default App
