import { Platform, SafeAreaView, StyleSheet, Text, View, ScrollView, Image, useWindowDimensions } from 'react-native'
import React, {useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, {useSharedValue, useAnimatedStyle, useAnimatedScrollHandler, interpolate}  from 'react-native-reanimated'

export default function MenuCarousel() {
  const data = [
      {
          name: 'image1',
          img: require('../../assets/images/1.png')
      },
      {
          name: 'image2',
          img: require('../../assets/images/2.png')
      },
      {
          name: 'image3',
          img: require('../../assets/images/3.png')
      },
  ];
	const { width } = useWindowDimensions();
	const SIZE = width * 0.7;
	const SPACER = (width - SIZE) / 2;
	const [newData] = useState([{key: 'spacer-left'}, ...data, {key: 'spacer-right'},]);
	const x = useSharedValue(0);
	const onScroll = useAnimatedScrollHandler({
		onScroll: event => {
			x.value = event.contentOffset.x;
		}
	});
  return (
    <SafeAreaView styles={styles.container}>
			<Animated.ScrollView 
			horizontal 
			showsHorizontalScrollIndicator={false} 
			bounces={false} 
			scrollEventThrottle={16}
			snapToInterval={SIZE}
			decelerationRate="fast"
			onScroll={onScroll}
			>
				{newData.map((item, index) => {
					// eslint-disable-next-line react-hooks/rules-of-hooks
					const style = useAnimatedStyle(() => {
						const scale = interpolate(
							x.value,
							[(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
							[0.8, 1, 0.8]
						)
						return {
							transform: [{scale}]
						}
					})
					if(!item.img) {
						return <View style={{width: SPACER}} key={index}/>
					}
					return (
						<View style={{width: SIZE}} key={index}>
							<Animated.View style={[styles.imageContainer, style]}>
								<Image source={item.img} style={styles.image}/>
							</Animated.View>
						</View>
					)
				})}
			</Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
		imageContainer: {
			borderRadius: 34,
			overflow: 'hidden',
		},
		image: {
			width: '100%',
			height: undefined,
			aspectRatio: 1,
		}
})