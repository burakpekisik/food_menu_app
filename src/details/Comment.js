import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Action from "./Action";
import axios from "axios";

export default function Comment({
  comment,
  loadCommentsWithReplies,
  loadReplies,
  loadComments,
  handleEditComment,
  isReply,
  handleDeleteComment,
}) {
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  const handleChangeText = (text) => {
    setInput(text);
  };

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
  };

  const handleAddReply = async () => {
    try {
      const requestData = {
        comment_id: comment.ID,
        content: input,
        created_at: new Date().toISOString(),
      };

      await axios.post(
        "http://10.0.2.2:5000/gazi/menu/comment_replies/",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Yanıtları güncelleyin ve sonra yorumları güncelleyin
      await loadComments();
      await loadReplies();
      await loadCommentsWithReplies();

      setShowInput(false);
      if (!comment?.items?.length) setExpand(false);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  useEffect(() => {
    loadReplies(); // Yorum bileşeni yüklendiğinde reply'ları yükle
  }, []);

  return (
    <View style={styles.commentContainer}>
      <View style={{ marginTop: "15px" }}>
        {editMode ? (
          <TextInput
            defaultValue={comment.content}
            onChangeText={handleChangeText}
            style={{ flexWrap: "wrap" }}
            suppressContentEditableWarning={true}
            ref={inputRef}
          />
        ) : (
          <View>
            <Text style={{ flexWrap: "wrap" }} key={comment.id}>
              {comment.content}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: "row", marginTop: "5px" }}>
          {editMode ? (
            <View style={{ flexDirection: "row" }}>
              <Action
                className="reply"
                handleClick={() => {
                  comment.content = input;
                  handleEditComment(isReply, comment);
                  setEditMode(false);
                }}
                type="SAVE"
              />
              <Action
                className="reply"
                type="CANCEL"
                handleClick={() => {
                  if (inputRef.current) {
                    inputRef.current.innerText = comment.name;
                  }
                  setEditMode(false);
                }}
              />
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Action
                className="reply"
                type={expand ? "▲ REPLY" : "▼ REPLY"}
                handleClick={handleNewComment}
              />
              <Action
                className="reply"
                type="EDIT"
                handleClick={() => {
                  setEditMode(true);
                }}
              />
              <Action
                className="reply"
                type="DELETE"
                handleClick={() => {
                  handleDeleteComment(comment);
                }}
              />
            </View>
          )}
        </View>
      </View>
      <View style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              autoFocus
              value={input}
              onChangeText={handleChangeText}
              placeholder="Yorumunuzu buraya yazın..."
              style={styles.inputContainerInput}
            />
            <Action
              className="reply"
              type="REPLY"
              handleClick={handleAddReply}
            />
            <Action
              className="reply"
              type="CANCEL"
              handleClick={() => {
                setShowInput(false);
                if (!comment?.items?.length) setExpand(false);
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    marginTop: 6,
    backgroundColor: "#d3d3d3e0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 300,
    borderRadius: 5,
  },
  commentContainerHover: {
    backgroundColor: "#d3d3d3bf",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
  },
  inputContainerSpan: {
    marginTop: 5,
  },
  inputContainerInput: {
    marginVertical: 6,
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
  commentContainerSpan: {
    marginHorizontal: 5,
  },
  reply: {
    fontSize: 12,
    padding: 5,
    borderRadius: 5,
    color: "#4e4e4e",
    fontWeight: "600",
  },
  comment: {
    color: "white",
    backgroundColor: "#569dff",
    letterSpacing: 0.8,
  },
  commentButton: {
    backgroundColor: "#569dff",
    height: 39,
    marginLeft: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
