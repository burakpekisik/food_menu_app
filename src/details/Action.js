import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const Action = ({ handleClick, type, className }) => {
  return (
      <TouchableOpacity onPress={handleClick}>
          <View style={[styles[className]]}>
              <Text>{type}</Text>
          </View>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
      reply: {
        fontSize: 12,
        padding: 5,
        borderRadius: 5,
        color: '#4e4e4e',
        fontWeight: '600',
      },
      comment: {
        color: '#ffffff',
        backgroundColor: '#569dff',
        letterSpacing: 0.8,
      },
});

export default Action;