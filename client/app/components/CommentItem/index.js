import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { formatDateTimeUnit } from "~/utils/helper";

const CommentItem = ({ comment }) => {
    return (
        <View key={comment.id} style={styles.topContent}>
            <Image
                source={{ uri: comment.user.image }}
                width={50}
                height={50}
            />
            <View style={styles.right}>
                <Text style={styles.text}>
                    {comment.user.first_name} {comment.user.last_name}
                </Text>
                <Text style={styles.text} numberOfLines={2}>
                    {comment.content}
                </Text>
                <Text style={styles.text} numberOfLines={2}>
                    {formatDateTimeUnit(comment.created_at)}
                </Text>
            </View>
        </View>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
    topContent: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 10,
        shadowColor: "#333",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    right: {
        gap: 10,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 16,
    },
});
