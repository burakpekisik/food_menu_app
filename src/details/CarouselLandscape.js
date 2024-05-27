import { Dimensions, StyleSheet, Text, View, Image, ActivityIndicator, ScrollView } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import translations from './translations';  // translations.js dosyasını içe aktarıyoruz

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const images = [
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

const CarouselLandscape = ({ menuData }) => {
    const [index, setIndex] = useState(0);
    const [res, setRes] = useState([]);

    const turkishToEnglish = (turkishWord) => {
        let englishWord = translations[turkishWord.toUpperCase()];
        if (!englishWord) {
            englishWord = turkishWord.toLowerCase().replace(/\s+/g, '-');
        }
        return englishWord;
    };

    const fetchRequest = async (query) => {
        const englishQuery = turkishToEnglish(query);  // yemek ismini İngilizce'ye çeviriyoruz
        
        try {
            const response = await fetch(
                `https://www.googleapis.com/customsearch/v1?key=${api_key}&searchType=image&q=${query}`
            );
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const dataJ = await response.json();
            const result = dataJ.items[0]; // 'results' yerine 'items' kullanıyoruz
            console.log(query);
            // console.log(result);
            return result;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    };

    useEffect(() => {
        if (menuData && menuData.length > 0) {
            const fetchImages = async () => {
                const results = await Promise.all(
                    menuData.flatMap(data => ['soup', 'dish', 'vegetarian', 'extra', 'extra2'].map(key => fetchRequest(data[key])))
                );
                setRes(results.flat());
            };
            fetchImages();
        }
    }, [menuData]);

    const getContent = () => {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {menuData.map((data, dataIndex) => (
                    <View key={dataIndex} style={{ paddingHorizontal: 20, marginBottom: 10, zIndex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {['soup', 'dish', 'vegetarian', 'extra', 'extra2'].map((key, subIndex) => (
                                <View key={subIndex} style={{ paddingHorizontal: 10, borderRadius: 20, backgroundColor: 'lightblue', marginRight: 10 }}>
                                    <Image source={{ uri: res[subIndex]?.link }} style={{ width: 350, height: 100 }} />
                                    <Text style={{ marginVertical: 5, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{data[key]}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    };

    if (!menuData) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View>
            {getContent()}
        </View>
    );
};

export default CarouselLandscape;
