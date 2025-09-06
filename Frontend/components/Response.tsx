import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Mark {
  elementText: string;
  text: string;
}

interface ResponseProps {
  mark: Mark[];
}

const Response: React.FC<ResponseProps> = ({ mark }) => {
  const processBoldText = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} style={styles.bold}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const renderContent = (item: Mark) => {
    if (!item.text.trim()) return null;

    const text = item.text;

    if (text.startsWith("###")) {
      return (
        <LinearGradient
          colors={["rgba(30, 41, 59, 0.8)", "rgba(15, 23, 42, 0.8)"]}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionHeaderText}>
            {processBoldText(text.replace("###", "").trim())}
          </Text>
        </LinearGradient>
      );
    }

    if (/^\d+\./.test(text)) {
      const [number, ...content] = text.split(".");
      return (
        <View style={styles.numberedPoint}>
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={styles.numberBadge}
          >
            <Text style={styles.numberText}>{number}</Text>
          </LinearGradient>
          <Text style={styles.contentText}>
            {processBoldText(content.join(".").trim())}
          </Text>
        </View>
      );
    }

    if (text.trim().startsWith("-")) {
      const bulletText = text.replace("-", "").trim();
      return (
        <View style={styles.bulletPoint}>
          <View style={styles.bullet} />
          <Text style={styles.contentText}>{processBoldText(bulletText)}</Text>
        </View>
      );
    }

    return (
      <View style={styles.paragraph}>
        <Text style={styles.contentText}>{processBoldText(text)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {mark.map((item, index) => (
        <React.Fragment key={index}>{renderContent(item)}</React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 2,
  },
  bold: {
    fontWeight: "700",
    color: "#60A5FA",
    letterSpacing: 0.3,
  },
  sectionHeader: {
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  sectionHeaderText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#F8FAFC",
    letterSpacing: 0.4,
    lineHeight: 24,
  },
  numberedPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
    paddingLeft: 2,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  numberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3B82F6",
    marginRight: 12,
  },
  paragraph: {
    marginVertical: 6,
  },
  contentText: {
    color: "#F8FAFC",
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    letterSpacing: 0.3,
  },
});

export default Response;
