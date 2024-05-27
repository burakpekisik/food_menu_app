import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Carousel from "pinar";
import Constants from "expo-constants";
import CarouselLandscape from "./CarouselLandscape";

const images = [
  {
    name: "image1",
    img: require("../../assets/images/1.png"),
  },
];

const height = Dimensions.get("window").height;
const marginTop = Constants.statusBarHeight;
const date = new Date().toLocaleDateString("tr-TR");

export default function CarouselView({ menuData, onDateChange, loadComments, loadReplies }) {
  const [currentMenu, setCurrentMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [response, setResponse] = useState(menuData);
  const [isCreatedRecently, setCreatedRecently] = useState(true);

  const findClosestDateIndex = (date) => {
    let previousDate = null;

    // Sıralı bir şekilde `menuData` içerisinde en yakın önceki tarihi bulma
    for (let i = menuData.length - 1; i >= 0; i--) {
      if (menuData[i].date < date) {
        previousDate = menuData[i].date;
        break;
      }
    }

    return menuData.findIndex((item) => item.date === previousDate);
  };

  useEffect(() => {
    if (menuData) {
      setIsLoading(false);
      setResponse(menuData);
      setCurrentMenu(menuData[0]);
      
      const initialIndex = findClosestDateIndex(date); // findClosestDateIndex'den dönen değeri al
      
      if (initialIndex !== -1) {
        onDateChange(menuData[initialIndex].date); // Eğer geçerli bir index dönerse currentDate'i güncelle
      }

      console.log(date);
    }
  }, [menuData]);

  const getContent = () => {
    if (isLoading) {
      return (
        <View style={styles.carousel}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return <Text>{error}</Text>;
    }

    if (menuData && Array.isArray(menuData)) {
      const initialIndex = isCreatedRecently
        ? menuData.findIndex((item) => item.date === date)
        : 0;

      return (
        <View style={styles.carouselContainer}>
          <Carousel
            style={styles.carousel}
            showsDots={false}
            index={
              initialIndex === -1 ? findClosestDateIndex(date) : initialIndex
            }
            onIndexChanged={(index) => {
              setCurrentMenu(menuData[index["index"]]);
							onDateChange(menuData[index["index"]].date);
							console.log(menuData[index["index"]].date);
              console.log(index);
              console.log(currentMenu);
							loadComments();
							loadReplies();
            }}
          >
            {menuData.map((item, index) => (
              <View key={index} style={styles.carouselItem}>
                <View style={styles.viewTextStyle}>
                  <Text style={styles.textStyle}>{item.date}</Text>
                  <Text style={styles.textStyle}>{item.soup}</Text>
                  <Text style={styles.textStyle}>{item.dish}</Text>
                  <Text style={styles.textStyle}>{item.vegetarian}</Text>
                  <Text style={styles.textStyle}>{item.extra}</Text>
                  <Text style={styles.textStyle}>{item.extra2}</Text>
                  <Text style={styles.textStyle}>Kalori: {item.calorie}</Text>
                </View>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    source={images.find((img) => img.name === "image1").img}
                  />
                </View>
              </View>
            ))}
          </Carousel>
        </View>
      );
    }

    return <Text>No data found</Text>;
  };

  return (
    <View>
      {getContent()}
      <View style={styles.space}></View>
      {currentMenu && <CarouselLandscape menuData={[currentMenu]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
  },
  carousel: {
    height: "100%",
    width: "100%",
  },
  carouselContainer: {
    height: (height - marginTop) / 1.9,
    marginHorizontal: 10,
    marginTop,
  },
  viewTextStyle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  textStyle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginVertical: 10,
  },
  currentDateContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  currentDateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  space: {
    height: 20, // İstenilen boşluk büyüklüğüne ayarlayabilirsiniz
  },
});
