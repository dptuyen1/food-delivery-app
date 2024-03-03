import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CommentItem from "~/components/CommentItem";
import { useUserContext } from "~/hooks";
import { Feather } from "@expo/vector-icons";
import { commentService } from "~/services/comment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Comment = ({ navigation, route }) => {
    const { restaurant } = route.params;

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");

    const [user] = useUserContext();

    useEffect(() => {
        const loadComments = async () => {
            let res = await commentService.getComments(restaurant.id);

            setComments(res.data);
        };

        loadComments();
    }, []);

    const handleAddComment = async (content) => {
        if (content === "") {
            alert("Nhập gì đó...");
            return;
        }

        let accessToken = await AsyncStorage.getItem("accessToken");
        let comment = {
            content: content,
        };
        let res = await commentService.add(accessToken, restaurant.id, comment);

        console.log(res.data);

        setComments((currentState) => {
            return [...currentState, res.data];
        });

        setContent("");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.container}>
                <View style={styles.commentsList}>
                    {comments.map((comment) => {
                        return (
                            <CommentItem key={comment.id} comment={comment} />
                        );
                    })}
                </View>

                {user ? (
                    <View style={styles.commentBox}>
                        <Image
                            source={{ uri: user.image }}
                            width={50}
                            height={50}
                        />
                        <TextInput
                            placeholder="Nhập gì đó..."
                            style={styles.commentInput}
                            value={content}
                            onChangeText={(val) => setContent(val)}
                        />
                        <TouchableOpacity
                            style={styles.commentButton}
                            onPress={() => handleAddComment(content)}
                        >
                            <Feather name="send" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate("login")}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 16,
                            }}
                        >
                            Đăng nhập để bình luận
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

export default Comment;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "white",
        gap: 10,
        position: "relative",
    },
    commentsList: {
        gap: 10,
        marginBottom: 100,
    },
    commentBox: {
        backgroundColor: "white",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        padding: 10,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#bfbfbf",
        padding: 10,
        fontSize: 16,
    },
    loginButton: {
        padding: 10,
        backgroundColor: "coral",
        borderRadius: 6,
        alignSelf: "flex-end",
        marginHorizontal: 10,
    },
});
