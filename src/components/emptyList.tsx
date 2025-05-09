import { StyleSheet, Text, View } from "react-native";

export const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Ma'lumotlar topilmadi</Text>
    </View>
)

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        backgroundColor: "white",
        borderRadius: 12,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#8898aa",
    },
})