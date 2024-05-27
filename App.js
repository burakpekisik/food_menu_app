import React, { useEffect, useState } from "react";
import useNode from "./src/hooks/useNode";
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import CarouselView from "./src/details/CarouselView";
import Comment from "./src/details/Comment";
import Action from "./src/details/Action.js";
import axios from "axios";

const month = new Date().getMonth() + 1;
const date = new Date().toLocaleDateString("tr-TR");
const formattedMonth = month < 10 ? `0${month}` : `${month}`;
console.log("Current month:", formattedMonth);
console.log("Current Date: ", date);

export default function App() {
  const [input, setInput] = useState("");
  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // Yorumları saklamak için bir state
  const [expand, setExpand] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [replies, setReplies] = useState([]);
  const [isReply, setIsReply] = useState(false);
  const [currentDate, setCurrentDate] = useState(date);

  const handleChangeText = (text) => {
    setInput(text);
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  useEffect(() => {
    console.log("New Date: ", currentDate);
    loadComments(); // currentDate değiştiğinde yorumları yeniden yükle
    loadReplies();
  }, [currentDate]);

  const handleAddComment = async () => {
    try {
      let targetDate = date.split(".").reverse().join("-"); // date formatını ISO formatına dönüştürme

      if (currentDate < date) {
        targetDate = currentDate.split(".").reverse().join("-"); // currentDate formatını ISO formatına dönüştürme
      }

      const requestData = {
        content: input,
        created_at: targetDate + "T" + new Date().toISOString().split("T")[1], // currentDate veya date'ye göre created_at değerini ayarlama
      };
      console.log("Content: " + requestData.content);
      console.log("Created At:" + requestData.created_at);

      await axios.post(
        "http://10.0.2.2:5000/gazi/menu/comments/",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      loadComments();
      loadReplies();
      setExpand(true);
      setShowInput(false);
      setInput("");
    } catch (error) {
      console.error("Error adding comment:", error);
      console.log("Error details:", error.message, error.stack);
    }
  };

  const handleEditComment = async (isReply, comment) => {
    try {
      let targetDate = date.split(".").reverse().join("-"); // date formatını ISO formatına dönüştürme

      if (currentDate < date) {
        targetDate = currentDate.split(".").reverse().join("-"); // currentDate formatını ISO formatına dönüştürme
      }

      let endpoint = `http://10.0.2.2:5000/gazi/menu/comments/${comment.ID}`;

      const requestData = {
        content: comment.content,
        created_at: targetDate + "T" + new Date().toISOString().split("T")[1], // currentDate veya date'ye göre created_at değerini ayarlama
      };
      console.log("Content: " + requestData.content);
      console.log("Created At:" + requestData.created_at);
      console.log("Comment ID: " + comment.ID);

      if (isReply) {
        console.log("Edit Reply Comment");
        endpoint = `http://10.0.2.2:5000/gazi/menu/comment_replies/${comment.ID}`;
      }

      await axios.put(endpoint, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      loadComments();
      loadReplies();
      setExpand(true);
      setShowInput(false);
      setInput("");
    } catch (error) {
      console.error("Error editing comment:", error);
      console.log("Error details:", error.message, error.stack);
    }
  };

  const handleDeleteComment = async (comment) => {
    try {
      let endpoint = `http://10.0.2.2:5000/gazi/menu/comments/${comment.ID}`;

      console.log("Comment ID: " + comment.ID);

      if (isReply) {
        console.log("Delete Reply Comment");
        endpoint = `http://10.0.2.2:5000/gazi/menu/comment_replies/${comment.ID}`;
      }

      await axios.delete(endpoint);

      loadComments(); // Yorumları güncellemek için yüklemeyi çağırın
      loadReplies();
    } catch (error) {
      console.error("Error deleting comment:", error);
      console.log("Error details:", error.message, error.stack);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://130.61.36.184:5050/gazi/menu/month/${formattedMonth}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setMenuData(result);
        setError(null); // Eğer bağlantı başarılıysa hata durumunu sıfırla
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setError(error); // Hata durumunu ayarla
      }
    };

    // Eğer daha önce hata oluştuysa ve tekrar denemek gerekiyorsa fetchData'yı çağır
    if (!menuData && error) {
      fetchData();
    } else if (!menuData) {
      fetchData(); // İlk başta hiç veri yoksa veri çekmeye çalış
    }
    loadComments();
    loadReplies();
  }, [error]); // Bağımlılık listesine error ekleyerek error state'i değiştiğinde useEffect'i çağır

  const loadComments = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/gazi/menu/comments/${currentDate}`
      );
      setComments(response.data); // Yorumları saklamak için state'i güncelleyin
      // console.log(comments)
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const loadReplies = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/gazi/menu/comment_replies/`
      );
      setReplies(response.data);
    } catch (error) {
      console.error("Error loading replies:", error);
    }
  };

  const loadCommentsWithReplies = () => {
    const combinedComments = [];

    comments.forEach((cmnt) => {
      combinedComments.push(
        <View key={cmnt.ID}>
          <Comment
            key={"comment_" + cmnt.ID}
            comment={cmnt}
            loadCommentsWithReplies={loadCommentsWithReplies}
            loadComments={loadComments}
            loadReplies={loadReplies}
            handleEditComment={() => {
              handleEditComment(false, cmnt);
            }}
            isReply={false}
            handleDeleteComment={handleDeleteComment}
          />
          {/* Yanıtları yorumla eşleştir ve eğer varsa ekle */}
          {replies
            .filter((reply) => cmnt.ID === reply.comment_id)
            .map((reply) => (
              <View key={reply.ID} style={{ paddingLeft: 25 }}>
                <Comment
                  key={"reply_" + reply.ID}
                  comment={reply}
                  loadCommentsWithReplies={loadCommentsWithReplies}
                  loadComments={loadComments}
                  loadReplies={loadReplies}
                  handleEditComment={() => {
                    handleEditComment(true, reply);
                  }}
                  isReply={true}
                  handleDeleteComment={handleDeleteComment}
                />
              </View>
            ))}
        </View>
      );
    });

    return combinedComments;
  };

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.container}
    >
      <ScrollView>
        {menuData && (
          <CarouselView
            menuData={menuData}
            onDateChange={handleDateChange}
            loadComments={loadComments}
            loadReplies={loadReplies}
          />
        )}
        <View style={styles.space}></View>
        <View style={{flex: 1, flexDirection: "row", marginHorizontal: 20}}>
          <TextInput
            autoFocus
            value={input}
            onChangeText={handleChangeText}
            placeholder="Yorumunuzu buraya yazın..."
            style={[styles.inputContainerInput, styles.firstInput, { flex: 1 }]}
          />
          <View style={[styles.comment, styles.reply]}>
            <Action type="COMMENT" handleClick={handleAddComment} />
          </View>
        </View>
        <View style={{marginHorizontal: 20}}>
          {loadCommentsWithReplies()}
        </View>
        <View style={styles.space}></View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  space: {
    height: 20, // İstenilen boşluk büyüklüğüne ayarlayabilirsiniz
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
  },
  inputContainerSpan: {
    marginTop: 5,
  },
  inputContainerInput: {
    padding: 5,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    backgroundColor: "#e7e7e7",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  firstInput: {
    margin: 0,
  },
  reply: {
    fontSize: 12,
    height: 45,
    marginLeft: 5,
    borderRadius: 5,
    color: "#4e4e4e",
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
  },
  comment: {
    color: "#ffffff",
    backgroundColor: "#569dff",
    letterSpacing: 0.8,
  },
});
